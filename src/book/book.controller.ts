import { JwtGuard } from "@/user/guards/jwt.guard";
import {
	Body,
	Controller,
	Get,
	Param,
	Post,
	UploadedFile,
	UseGuards,
	UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from "@nestjs/swagger";
import { BookService } from "./book.service";

@ApiTags("Book")
@Controller("book")
export class BookController {
	constructor(private readonly bookService: BookService) {}

	@Get()
	async userBooks() {
		return await this.bookService.list();
	}

	@Get(":id")
	async book(@Param("id") id: string) {
		return await this.bookService.get(id);
	}

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
	@Post("upload")
	async uploadEbook(@Body() dto: { name: string }, @UploadedFile() file: any) {
		const ebook = await this.bookService.upload(dto.name, file);
		return ebook;
	}
}
