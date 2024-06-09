import { Book, BookDocument } from "@/book/book.schema"
import { Category, CategoryDocument } from "@/category/category.schema"
import environments from "@/helpers/environments"
import { Reactions, ReactionsDocument } from "@/reactions/reactions.schema"
import { Tracker, TrackerDocument } from "@/tracker/tracker.schema"
import { Login } from "@/user/user.dto"
import { User, UserDocument } from "@/user/user.schema"
import { BadRequestException, Inject, Injectable } from "@nestjs/common"
import { REQUEST } from "@nestjs/core"
import { JwtService } from "@nestjs/jwt"
import { InjectModel } from "@nestjs/mongoose"
import * as bcrypt from "bcrypt"
import { Model } from "mongoose"
import { ImageGateway } from "src/services/image.gateway.service"

@Injectable()
export class AdminService {
  constructor(
    @Inject(REQUEST) private readonly request: { user: UserDocument },
    @InjectModel(Book.name) private bookModel: Model<BookDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Tracker.name) private trackerModel: Model<TrackerDocument>,
    @InjectModel(Category.name) private categoryModel: Model<CategoryDocument>,
    @InjectModel(Reactions.name) private reactionModel: Model<ReactionsDocument>,
    private jwtService: JwtService,
    private readonly imageKitService: ImageGateway
  ) {}

  signUser(user: UserDocument) {
    const { id, email, name } = user
    const payload = { id, email, name }
    const jwt = this.jwtService.sign(payload, { secret: environments.JWT_SECRET })
    return { jwt, user }
  }

  async login({ email, password }: Login) {
    const user = await this.userModel.findOne({ email })
    if (!user) throw new BadRequestException("Tài khoản không tồn tại")
    if (user.role !== "admin") throw new BadRequestException("Tài khoản không có quyền quản trị")
    const isValidPassword = bcrypt.compareSync(password, user.passwordHash)
    if (!isValidPassword) throw new BadRequestException("Mật khẩu chưa đúng")
    return this.signUser(user)
  }
}
