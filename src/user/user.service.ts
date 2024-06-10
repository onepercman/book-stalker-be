import { ESortType } from "@/dtos/paginate.dto"
import environments from "@/helpers/environments"
import { BadRequestException, Inject, Injectable, NotFoundException } from "@nestjs/common"
import { REQUEST } from "@nestjs/core"
import { JwtService } from "@nestjs/jwt"
import { InjectModel } from "@nestjs/mongoose"
import * as bcrypt from "bcrypt"
import { FilterQuery, Model } from "mongoose"
import { ImageGateway } from "src/services/image.gateway.service"
import { AssignAdminDto, GetUserDto, Login, Register } from "./user.dto"
import { User, UserDocument } from "./user.schema"
@Injectable()
export class UserService {
  constructor(
    @Inject(REQUEST) private readonly request: { user: UserDocument },
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
    private readonly imageKitService: ImageGateway
  ) {}

  signUser(user: UserDocument) {
    const { id, email, name } = user
    const payload = { id, email, name }
    const jwt = this.jwtService.sign(payload, { secret: environments.JWT_SECRET })
    return { jwt, user }
  }

  async register({ email, password }: Register) {
    const user = await this.userModel.findOne({ email })
    if (user) throw new BadRequestException("Tài khoản đã tồn tại")
    const newUser = new this.userModel({
      email,
      name: email.split("@")[0],
      passwordHash: bcrypt.hashSync(password, 10),
    })
    newUser.save()
    return this.signUser(newUser)
  }

  async login({ email, password }: Login) {
    const user = await this.userModel.findOne({ email })
    if (!user) throw new BadRequestException("Tài khoản không tồn tại")
    const isValidPassword = bcrypt.compareSync(password, user.passwordHash)
    if (!isValidPassword) throw new BadRequestException("Mật khẩu chưa đúng")
    return this.signUser(user)
  }

  async loginAdmin({ email, password }: Login) {
    const user = await this.userModel.findOne({ email })
    if (!user) throw new BadRequestException("Tài khoản không tồn tại")
    if (user.role !== "admin") throw new BadRequestException("Tài khoản không có quyền quản trị")
    const isValidPassword = bcrypt.compareSync(password, user.passwordHash)
    if (!isValidPassword) throw new BadRequestException("Mật khẩu chưa đúng")
    return this.signUser(user)
  }

  async updateAvatar(file: any) {
    const user = this.request.user
    const { thumbnailUrl } = await this.imageKitService.upload(file)
    user.avatar = thumbnailUrl
    await user.save()
    return user
  }

  async list(query: GetUserDto) {
    const { take = 10, page = 1, search = "", sortType } = query

    const skip = (page - 1) * take

    const filter: FilterQuery<UserDocument> = {}

    if (search) {
      filter.email = { $regex: search, $options: "i" }
    }

    const [data, count] = await Promise.all([
      this.userModel
        .find(filter)
        .sort({ createdAt: sortType === ESortType.ASC ? -1 : 1 })
        .limit(take)
        .skip(skip)
        .exec(),
      this.userModel.countDocuments(filter).exec(),
    ])

    return {
      data,
      count,
    }
  }

  async assignAdmin({ id, isAdmin }: AssignAdminDto) {
    const count = await this.userModel.find({ role: "admin" }).count()
    if (!isAdmin && count <= 1) throw new BadRequestException("Không thể xoá quản trị viên")
    return this.userModel.findByIdAndUpdate(id, { role: isAdmin ? "admin" : "user" })
  }

  async delete(id: string) {
    const user = await this.userModel.findById(id)
    if (!user) throw new NotFoundException("Không tìm thấy người dùng")
    return user.delete()
  }
}
