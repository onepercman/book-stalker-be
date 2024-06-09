import { Injectable, UnauthorizedException } from "@nestjs/common"
import { InjectModel } from "@nestjs/mongoose"
import { PassportStrategy } from "@nestjs/passport"
import { Model } from "mongoose"
import { ExtractJwt, Strategy } from "passport-jwt"
import environments from "src/helpers/environments"
import { IJwtPayload } from "../user.dto"
import { User, UserDocument } from "../user.schema"

@Injectable()
export class AdminStrategy extends PassportStrategy(Strategy) {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: environments.JWT_SECRET,
    })
  }

  async validate(payload: IJwtPayload) {
    const user = await this.userModel.findById(payload.id)

    if (!user || user.email !== payload.email || user.role !== "admin") {
      throw new UnauthorizedException()
    }

    return user
  }
}
