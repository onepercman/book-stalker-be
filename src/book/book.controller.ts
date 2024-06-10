import { CreateBookDto, GetBookDto, UpdateBookDto } from "@/book/book.dto"
import { JwtGuard } from "@/user/guards/jwt.guard"
import { RoleGuard } from "@/user/role/role.guard"
import { Roles } from "@/user/roles/roles.decorator"
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common"
import { FileInterceptor } from "@nestjs/platform-express"
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from "@nestjs/swagger"
import { BookService } from "./book.service"

@ApiTags("Book")
@Controller("book")
export class BookController {
  constructor(private readonly bookService: BookService) {}

  @Post()
  @Roles("admin")
  @UseGuards(JwtGuard, RoleGuard)
  @ApiBearerAuth()
  async createBook(@Body() dto: CreateBookDto) {
    return this.bookService.create(dto)
  }

  @Delete(":id")
  @Roles("admin")
  @UseGuards(JwtGuard, RoleGuard)
  @ApiBearerAuth()
  async deleteBook(@Param("id") id: string) {
    return this.bookService.delete(id)
  }

  @Delete("/delete-many")
  @Roles("admin")
  @UseGuards(JwtGuard, RoleGuard)
  @ApiBearerAuth()
  async deleteMany(@Body() ids: string[]) {
    return this.bookService.deleteMany(ids)
  }

  @Patch(":id")
  @Roles("admin")
  @UseGuards(JwtGuard, RoleGuard)
  @ApiBearerAuth()
  async updateBook(@Param("id") id: string, @Body() dto: UpdateBookDto) {
    return this.bookService.update(id, dto)
  }

  @Get()
  async list(@Query() query: GetBookDto) {
    return this.bookService.list(query)
  }

  @Get("liked")
  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  async liked() {
    return this.bookService.liked()
  }

  @Get("continous")
  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  async continous() {
    return this.bookService.continous()
  }

  @Get(":id")
  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  async book(@Param("id") id: string) {
    return this.bookService.get(id)
  }

  @Post("upload")
  @Roles("admin")
  @UseGuards(JwtGuard, RoleGuard)
  @ApiBearerAuth()
  @UseInterceptors(FileInterceptor("file"))
  @ApiConsumes("multipart/form-data")
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        file: { type: "string", format: "binary" },
      },
    },
  })
  async uploadEbook(@UploadedFile() file: any) {
    return this.bookService.upload(file)
  }
}
