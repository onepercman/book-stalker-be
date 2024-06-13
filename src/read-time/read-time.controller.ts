import { GetReadTimeDto } from "@/read-time/dto/read-time.dto"
import { JwtGuard } from "@/user/guards/jwt.guard"
import { Body, Controller, Get, Post, Query, UseGuards } from "@nestjs/common"
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger"
import { CreateReadTimeDto } from "./dto/create-read-time.dto"
import { ReadTimeService } from "./read-time.service"

@ApiTags("read-time")
@Controller("read-time")
export class ReadTimeController {
  constructor(private readonly readTimeService: ReadTimeService) {}

  @Post()
  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  create(@Body() createReadTimeDto: CreateReadTimeDto) {
    return this.readTimeService.create(createReadTimeDto)
  }

  @Get()
  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  async findAll(@Query() query: GetReadTimeDto) {
    return this.readTimeService.findAll(query)
  }
}
