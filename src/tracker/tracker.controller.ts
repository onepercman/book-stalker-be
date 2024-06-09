import { JwtGuard } from "@/user/guards/jwt.guard"
import { Body, Controller, Get, Param, Put, UseGuards } from "@nestjs/common"
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger"
import { TrackerDocument } from "./tracker.schema"
import { TrackerService } from "./tracker.service"

@ApiTags("Tracker")
@Controller("tracker")
export class TrackerController {
  constructor(private readonly trackerService: TrackerService) {}

  @Get(":id")
  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  get(@Param() id: string) {
    return this.trackerService.get(id)
  }

  @Get("list")
  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  list() {
    return this.trackerService.list()
  }

  // @Put(":trackerId/read-time/:bookId")
  // @Put(":trackerId/read-time/:bookId")
  // @UseGuards(JwtGuard)
  // @ApiBearerAuth()
  // updateReadTime(@Param("trackerId") trackerId: string, @Param("bookId") bookId: string) {
  //   return this.trackerService.updateReadTime(trackerId, bookId)
  // }

  @Put("")
  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  update(@Body() dto: TrackerDocument) {
    return this.trackerService.update(dto)
  }
}
