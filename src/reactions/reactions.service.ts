import { Book, BookDocument } from "@/book/book.schema"
import { Reactions, ReactionsDocument } from "@/reactions/reactions.schema"
import { UserDocument } from "@/user/user.schema"
import { BadRequestException, Inject, Injectable } from "@nestjs/common"
import { REQUEST } from "@nestjs/core"
import { InjectModel } from "@nestjs/mongoose"
import { Model } from "mongoose"
import { CreateReactionDto, ETypeReaction } from "./dto/create-reaction.dto"
import { UpdateReactionDto } from "./dto/update-reaction.dto"

@Injectable()
export class ReactionsService {
  constructor(
    @Inject(REQUEST) private readonly request: { user: UserDocument },
    @InjectModel(Book.name) private bookModel: Model<BookDocument>,
    @InjectModel(Reactions.name) private reactionModel: Model<ReactionsDocument>
  ) {}

  async create(createReactionDto: CreateReactionDto) {
    const { bookId, type } = createReactionDto
    if (!bookId || !type) {
      throw new BadRequestException("bookId and type are required")
    }
    if (!Object.values(ETypeReaction).includes(type)) {
      throw new BadRequestException("Invalid type")
    }

    const books = this.bookModel.findOne({ _id: bookId })
    if (!books) {
      throw new BadRequestException("Book not found")
    }
    let reaction = await this.reactionModel.findOne({ bookId: bookId, ownerId: this.request.user._id })
    if (!!reaction) {
      if (reaction.type === type) {
        reaction.remove()
        return {
          message: "Reaction removed",
        }
      }
      reaction.type = type
      return reaction.save()
    }

    reaction = new this.reactionModel({
      ...createReactionDto,
      ownerId: this.request.user._id,
    })

    return reaction.save()
  }

  findAll() {
    return `This action returns all reactions`
  }

  findOne(id: number) {
    return `This action returns a #${id} reaction`
  }

  update(id: number, updateReactionDto: UpdateReactionDto) {
    return `This action updates a #${id} reaction`
  }

  remove(id: number) {
    return `This action removes a #${id} reaction`
  }
}
