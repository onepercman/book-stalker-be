import { JwtGuard } from "@/user/guards/jwt.guard"
import { Body, Controller, Delete, Get, Param, Post, UseGuards } from "@nestjs/common"
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger"
import { ScheduleDocument } from "./schedule.schema"
import { ScheduleService } from "./schedule.service"

@Controller("schedule")
@ApiTags("Schedule")
export class ScheduleController {
  constructor(private readonly scheduleService: ScheduleService) {}

  @Get()
  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  list() {
    return this.scheduleService.list()
  }

  @Post()
  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  post(@Body() dto: Pick<ScheduleDocument, "time" | "title">) {
    return this.scheduleService.create(dto)
  }

  @Delete(":id")
  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  del(@Param("id") id: string) {
    return this.scheduleService.delete(id)
  }
}
