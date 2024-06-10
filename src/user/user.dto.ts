import { PaginateDto } from "@/dtos/paginate.dto"
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger"

export class Register {
  @ApiProperty({ default: "onepercman@gmail.com" })
  email: string
  @ApiProperty({ default: "123456" })
  password: string
}

export class Login {
  @ApiProperty({ default: "onepercman@gmail.com" })
  email: string
  @ApiProperty({ default: "123456" })
  password: string
}

export interface ICreateUserDto {
  name?: string
  email: string
  legalName?: string
  persona?: string
  secondaryEmail?: string
  emailVerifiedAt?: Date
  phone?: string
  secondaryPhone?: string
  passwordHash?: string
  role?: string
  otpHash?: string
}

export interface IJwtPayload {
  id: string
  name: string
  email: string
  phone: string
  role: string
}

export interface IUserResponse {
  avatar: string
  name: string
  legalName: string
  email: string
  phone: string
  role: string
  emailVerified: boolean
  passwordSetup: boolean
}

export interface IUserResponse extends Document {
  avatar: string
  name: string
  email: string
  legalName: string
  phone: string
  role: string
  emailVerified: boolean
  passwordSetup: boolean
}

export class AssignAdminDto {
  id: string
  isAdmin: boolean
}

export class GetUserDto extends PaginateDto {
  @ApiPropertyOptional()
  search: string
}
