import { PaginateDto } from "@/dtos/paginate.dto"
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger"

export class CreateBookDto {
  @ApiProperty()
  name: string

  @ApiProperty({ default: "66479582114a6d9d9e6678d2" })
  categoryId: string

  @ApiPropertyOptional({
    default: "https://filesamples.com/samples/ebook/epub/Around%20the%20World%20in%2028%20Languages.epub",
  })
  uri: string

  @ApiPropertyOptional({
    default: "http://www.gravatar.com/avatar/?d=identicon",
  })
  thumbnail: string
}

export class UpdateBookDto {
  @ApiPropertyOptional()
  name: string

  @ApiPropertyOptional()
  categoryId: string

  @ApiPropertyOptional()
  uri: string

  @ApiPropertyOptional()
  thumbnail: string
}

export class GetBookDto extends PaginateDto {
  @ApiPropertyOptional()
  categoryId: string

  @ApiPropertyOptional()
  search: string
}
