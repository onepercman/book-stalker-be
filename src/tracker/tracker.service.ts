import { UserDocument } from "@/user/user.schema"
import { Inject, Injectable } from "@nestjs/common"
import { REQUEST } from "@nestjs/core"
import { InjectModel } from "@nestjs/mongoose"
import { Model } from "mongoose"
import { Tracker, TrackerDocument } from "./tracker.schema"
@Injectable()
export class TrackerService {
  constructor(
    @Inject(REQUEST) private readonly request: { user: UserDocument },
    @InjectModel(Tracker.name) private trackerModel: Model<TrackerDocument>
  ) {}

  get(id: string) {
    return this.trackerModel.findById(id)
  }

  async update({ bookId, currentPage, currentCfi, totalPage, lastVisit }: TrackerDocument) {
    const { user } = this.request

    const tracker = await this.trackerModel.findOne({ userId: user._id.toString(), bookId })
    if (!tracker) {
      const newTracker = new this.trackerModel({
        userId: user._id.toString(),
        bookId,
        currentPage,
        currentCfi,
        totalPage,
        lastVisit,
      })
      await newTracker.save()
      return newTracker
    }
    tracker.currentPage = currentPage
    tracker.lastVisit = lastVisit
    await tracker.save()
    return tracker
  }
}
