import { Login } from "@/user/user.dto"
import { BadRequestException, Body, Controller, Post } from "@nestjs/common"
import { ApiTags } from "@nestjs/swagger"
import { AdminService } from "./admin.service"

@ApiTags("Admin")
@Controller("admin")
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post("login")
  async login(@Body() dto: Login) {
    const { email, password } = dto
    if (!email) throw new BadRequestException("Hãy nhập email của bạn")
    if (!password) throw new BadRequestException("Hãy nhập mật khẩu")
    return this.adminService.login(dto)
  }
}
