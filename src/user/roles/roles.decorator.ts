import { SetMetadata } from "@nestjs/common"
import { UserDocument } from "../user.schema"

export const Roles = (...args: UserDocument["role"][]) => SetMetadata("roles", args)
