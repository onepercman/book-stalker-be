import { JwtGuard } from "@/user/guards/jwt.guard"
import { Body, Controller, Post, UseGuards } from "@nestjs/common"
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger"
import { CreateReactionDto } from "./dto/create-reaction.dto"
import { ReactionsService } from "./reactions.service"

@ApiTags("reactions")
@Controller("reactions")
export class ReactionsController {
  constructor(private readonly reactionsService: ReactionsService) {}

  @Post()
  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  create(@Body() createReactionDto: CreateReactionDto) {
    return this.reactionsService.create(createReactionDto)
  }
}
