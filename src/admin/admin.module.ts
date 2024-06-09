import databases from "@/database/database.map"
import { ImageGateway } from "@/services/image.gateway.service"
import { AdminStrategy } from "@/user/guards/admin.strategy"
import { Module } from "@nestjs/common"
import { MongooseModule } from "@nestjs/mongoose"
import { AdminController } from "./admin.controller"
import { AdminService } from "./admin.service"

@Module({
  imports: [MongooseModule.forFeature(databases)],
  controllers: [AdminController],
  providers: [AdminService, AdminStrategy, ImageGateway],
  exports: [AdminService, AdminStrategy, ImageGateway],
})
export class AdminModule {}
