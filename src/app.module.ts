import { Module } from "@nestjs/common"
import { JwtModule } from "@nestjs/jwt"
import { MongooseModule } from "@nestjs/mongoose"
import { PassportModule } from "@nestjs/passport"
import { BookModule } from "./book/book.module"
import { CategoryModule } from "./category/category.module"
import environments from "./helpers/environments"
import { ReactionsModule } from "./reactions/reactions.module"
import { ReadTimeModule } from "./read-time/read-time.module"
import { ScheduleModule } from "./schedule/schedule.module"
import { TrackerModule } from "./tracker/tracker.module"
import { UserModule } from "./user/user.module"

@Module({
  imports: [
    MongooseModule.forRoot(environments.MONGO_DB_URL, {
      dbName: environments.MONGO_DB,
    }),
    JwtModule.register({
      global: true,
      secret: environments.JWT_SECRET,
      signOptions: { expiresIn: environments.JWT_EXPIRE },
    }),
    PassportModule.register({ defaultStrategy: "jwt" }),
    UserModule,
    BookModule,
    TrackerModule,
    CategoryModule,
    ReadTimeModule,
    ReactionsModule,
    ScheduleModule,
  ],
  controllers: [],
})
export class AppModule {}
