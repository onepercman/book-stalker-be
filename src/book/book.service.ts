import { CreateBookDto, GetBookDto } from "@/book/book.dto"
import { Category, CategoryDocument } from "@/category/category.schema"
import { ESortType } from "@/dtos/paginate.dto"
import { ETypeReaction } from "@/reactions/dto/create-reaction.dto"
import { Reactions, ReactionsDocument } from "@/reactions/reactions.schema"
import { Tracker, TrackerDocument } from "@/tracker/tracker.schema"
import { UserDocument } from "@/user/user.schema"
import { BadRequestException, Inject, Injectable } from "@nestjs/common"
import { REQUEST } from "@nestjs/core"
import { InjectModel } from "@nestjs/mongoose"
import { FilterQuery, Model } from "mongoose"
import { ImageGateway } from "src/services/image.gateway.service"
import { Book, BookDocument } from "./book.schema"
@Injectable()
export class BookService {
  constructor(
    @Inject(REQUEST) private readonly request: { user: UserDocument },
    @InjectModel(Book.name) private bookModel: Model<BookDocument>,
    @InjectModel(Tracker.name) private trackerModel: Model<TrackerDocument>,
    @InjectModel(Category.name) private categoryModel: Model<CategoryDocument>,
    @InjectModel(Reactions.name) private reactionModel: Model<ReactionsDocument>,
    private readonly imageKitService: ImageGateway
  ) {}

  // async onApplicationBootstrap() {
  //   const categories = await this.categoryModel.find()
  //   const randomCategory = categories[Math.floor(Math.random() * categories.length)]
  //   console.log("randomCategory", randomCategory)
  // }

  async create(books: CreateBookDto) {
    const book = await this.bookModel.findOne({ name: books.name })
    if (book) {
      throw new BadRequestException("Book with this name already exists")
    }

    const category = await this.categoryModel.findOne({ id: books.categoryId })
    if (!category) {
      const categories = await this.categoryModel.find()
      const randomCategory = categories[Math.floor(Math.random() * categories.length)]
      // throw new BadRequestException("Category not found")
      books.categoryId = randomCategory.id
    }

    const newBook = new this.bookModel({
      ...books,
    })

    await newBook.save()
    return newBook
  }

  async list(query: GetBookDto) {
    const { take = 10, page = 1, categoryId, search = "", sortType } = query

    const filter: FilterQuery<BookDocument> = {}

    if (categoryId) {
      filter.categoryId = categoryId
    }

    if (search) {
      filter.name = { $regex: search, $options: "i" }
    }

    const queryBuilder = this.bookModel
      .find(filter)
      .sort({ createdAt: sortType === ESortType.ASC ? -1 : 1 })
      .skip((page - 1) * take)
      .limit(take)

    const list = await queryBuilder.exec()

    const bookIds = list.map((book) => book._id.toString())

    const reactions = await this.reactionModel.aggregate([
      { $match: { bookId: { $in: bookIds } } },
      { $group: { _id: "$bookId", reactions: { $push: "$type" } } },
    ])

    const reactionCounts = reactions.reduce((acc, { _id, reactions }) => {
      acc[_id] = {
        likeTotal: reactions.filter((type) => type === ETypeReaction.LIKE).length,
        dislikeTotal: reactions.filter((type) => type === ETypeReaction.DISLIKE).length,
      }
      return acc
    }, {})

    const newList = list.map((book) => {
      const bookId = book._id.toString()
      const { likeTotal = 0, dislikeTotal = 0 } = reactionCounts[bookId] || {}
      return {
        ...book.toJSON(),
        likeTotal,
        dislikeTotal,
      }
    })

    const count = await this.bookModel.count(queryBuilder)
    return {
      data: newList,
      count,
    }
  }

  async liked() {
    const reactions = await this.reactionModel.find({ ownerId: this.request.user.id })
    return this.bookModel.find({ _id: { $in: reactions.map((e) => e.bookId) } })
  }

  async continous() {
    const latest = await this.trackerModel.find({ userId: this.request.user._id }).sort({ lastVisit: -1 }).limit(6)
    return this.bookModel.find({ _id: { $in: latest.map((el) => el.bookId) } })
  }

  async get(_id: string) {
    const book = await this.bookModel.findOne({ _id })
    const tracker = await this.trackerModel.findOne({ bookId: _id, userId: this.request.user.id })
    const category = await this.categoryModel.findById(book.categoryId)
    const reaction = await this.reactionModel.findOne({ ownerId: this.request.user._id, bookId: _id })
    const isLiked = !!reaction
    return {
      ...book.toObject(),
      tracker,
      category,
      isLiked,
    }
  }

  async upload(name: string, file: any) {
    const { url } = await this.imageKitService.upload(file)
    const book = new this.bookModel({
      name,
      uri: url,
    })
    await book.save()
    return book
  }
}
