import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common"
import { FileInterceptor } from "@nestjs/platform-express"
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from "@nestjs/swagger"
import { imageParseFilePipeBuilder } from "src/helpers/image.parser"
import { JwtGuard } from "./guards/jwt.guard"
import { RoleGuard } from "./role/role.guard"
import { Roles } from "./roles/roles.decorator"
import { AssignAdminDto, GetUserDto, Login, Register } from "./user.dto"
import { UserService } from "./user.service"

@ApiTags("User")
@Controller("user")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post("register")
  register(@Body() dto: Register) {
    return this.userService.register(dto)
  }

  @Post("login")
  async login(@Body() dto: Login) {
    const { email, password } = dto
    if (!email) throw new BadRequestException("Hãy nhập email của bạn")
    if (!password) throw new BadRequestException("Hãy nhập mật khẩu")
    const user = await this.userService.login(dto)
    return user
  }

  @Post("login/admin")
  async loginAdmin(@Body() dto: Login) {
    const { email, password } = dto
    if (!email) throw new BadRequestException("Hãy nhập email của bạn")
    if (!password) throw new BadRequestException("Hãy nhập mật khẩu")
    const user = await this.userService.loginAdmin(dto)
    return user
  }

  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  @UseInterceptors(FileInterceptor("file"))
  @ApiConsumes("multipart/form-data")
  @ApiBody({
    schema: {
      type: "object",
      properties: { file: { type: "string", format: "binary" } },
    },
  })
  @Post("update-avatar")
  async changeAvatar(
    @UploadedFile(imageParseFilePipeBuilder)
    file: any
  ) {
    const user = await this.userService.updateAvatar(file)
    return user
  }

  @Get()
  @Roles("admin")
  @ApiBearerAuth()
  @UseGuards(JwtGuard, RoleGuard)
  async list(@Query() query: GetUserDto) {
    return this.userService.list(query)
  }

  @Post("assign-admin")
  @Roles("admin")
  @ApiBearerAuth()
  @UseGuards(JwtGuard, RoleGuard)
  async assignAdmin(@Body() dto: AssignAdminDto) {
    if (!dto.id) throw new BadRequestException("Không tìm thấy người dùng")
    return this.userService.assignAdmin(dto)
  }

  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  @Get("test-auth")
  async testAuth() {}

  @Roles("admin")
  @UseGuards(JwtGuard, RoleGuard)
  @ApiBearerAuth()
  @Get("test-auth-admin")
  async testAuthAdmin() {}

  @Delete(":id")
  @Roles("admin")
  @UseGuards(JwtGuard, RoleGuard)
  @ApiBearerAuth()
  async deleteBook(@Param("id") id: string) {
    return this.userService.delete(id)
  }
}
