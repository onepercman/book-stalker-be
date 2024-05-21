import databases from "@/database/database.map"
import { JwtStrategy } from "@/user/guards/jwt.strategy"
import { Module } from "@nestjs/common"
import { MongooseModule } from "@nestjs/mongoose"
import { ScheduleController } from "./schedule.controller"
import { ScheduleService } from "./schedule.service"

@Module({
  imports: [MongooseModule.forFeature(databases)],
  controllers: [ScheduleController],
  providers: [ScheduleService, JwtStrategy],
  exports: [ScheduleService, JwtStrategy],
})
export class ScheduleModule {}
