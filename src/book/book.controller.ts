import { CreateBookDto, GetBookDto } from "@/book/book.dto"
import { JwtGuard } from "@/user/guards/jwt.guard"
import { Body, Controller, Get, Param, Post, Query, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common"
import { FileInterceptor } from "@nestjs/platform-express"
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from "@nestjs/swagger"
import { BookService } from "./book.service"

@ApiTags("Book")
@Controller("book")
export class BookController {
  constructor(private readonly bookService: BookService) {}

  @Post()
  async createBook(@Body() dto: CreateBookDto) {
    return this.bookService.create(dto)
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
  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  @UseInterceptors(FileInterceptor("file"))
  @ApiConsumes("multipart/form-data")
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        name: { type: "string" },
        file: { type: "string", format: "binary" },
      },
    },
  })
  async uploadEbook(@Body() dto: { name: string }, @UploadedFile() file: any) {
    return this.bookService.upload(dto.name, file)
  }
}
