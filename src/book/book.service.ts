import { CreateBookDto, GetBookDto, UpdateBookDto } from "@/book/book.dto"
import { Category, CategoryDocument } from "@/category/category.schema"
import { ESortType } from "@/dtos/paginate.dto"
import { Reactions, ReactionsDocument } from "@/reactions/reactions.schema"
import { Tracker, TrackerDocument } from "@/tracker/tracker.schema"
import { UserDocument } from "@/user/user.schema"
import { Inject, Injectable, NotFoundException } from "@nestjs/common"
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

  create(dto: CreateBookDto) {
    const newBook = new this.bookModel(dto)
    return newBook.save()
  }

  async update(id: string, dto: UpdateBookDto) {
    const book = await this.bookModel.findById(id)
    if (!book) throw new NotFoundException("Không tìm thấy sách")
    return book.update(dto)
  }

  async list(query: GetBookDto) {
    const { take = 10, page = 1, categoryId, search = "", sortType } = query

    const skip = (page - 1) * take

    const filter: FilterQuery<BookDocument> = {}

    if (categoryId) {
      filter.categoryId = categoryId
    }

    if (search) {
      filter.name = { $regex: search, $options: "i" }
    }

    const [data, count] = await Promise.all([
      this.bookModel
        .find(filter)
        .sort({ createdAt: sortType === ESortType.ASC ? -1 : 1 })
        .limit(take)
        .skip(skip)
        .exec(),
      this.bookModel.countDocuments(filter).exec(),
    ])

    return {
      data,
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

  async upload(file: any) {
    const { url } = await this.imageKitService.upload(file)
    return url
  }

  async delete(id: string) {
    const book = await this.bookModel.findById(id)
    if (!book) throw new NotFoundException("Không tìm thấy sách")
    return book.delete()
  }

  async deleteMany(ids: string[]) {
    const res = await this.bookModel.deleteMany({ id: { $in: ids } })
    return res.deletedCount
  }
}
