import databases from "@/database/database.map"
import { ImageGateway } from "@/services/image.gateway.service"
import { JwtStrategy } from "@/user/guards/jwt.strategy"
import { UserService } from "@/user/user.service"
import { Module } from "@nestjs/common"
import { MongooseModule } from "@nestjs/mongoose"
import { BookController } from "./book.controller"
import { BookService } from "./book.service"

@Module({
  imports: [MongooseModule.forFeature(databases)],
  controllers: [BookController],
  providers: [UserService, BookService, JwtStrategy, ImageGateway],
  exports: [UserService, BookService, ImageGateway],
})
export class BookModule {}
