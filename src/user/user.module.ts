import databases from "@/database/database.map"
import { Module } from "@nestjs/common"
import { MongooseModule } from "@nestjs/mongoose"
import { ImageGateway } from "src/services/image.gateway.service"
import { JwtStrategy } from "./guards/jwt.strategy"
import { UserController } from "./user.controller"
import { UserService } from "./user.service"

@Module({
  imports: [MongooseModule.forFeature(databases)],
  controllers: [UserController],
  providers: [UserService, JwtStrategy, ImageGateway],
  exports: [UserService, JwtStrategy, ImageGateway],
})
export class UserModule {}
