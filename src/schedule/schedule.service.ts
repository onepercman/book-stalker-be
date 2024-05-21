import { UserDocument } from "@/user/user.schema"
import { BadRequestException, Inject, Injectable } from "@nestjs/common"
import { REQUEST } from "@nestjs/core"
import { InjectModel } from "@nestjs/mongoose"
import { Model } from "mongoose"
import { Schedule, ScheduleDocument } from "./schedule.schema"

@Injectable()
export class ScheduleService {
  constructor(
    @Inject(REQUEST) private readonly request: { user: UserDocument },
    @InjectModel(Schedule.name) private scheduleModel: Model<ScheduleDocument>
  ) {}

  list() {
    return this.scheduleModel.find()
  }

  async create({ title, time }: Pick<ScheduleDocument, "time" | "title">) {
    const shadow = await this.scheduleModel.find({ userId: this.request.user._id, time: { $eq: new Date(time) } })
    if (shadow) return new BadRequestException("Trùng với lịch đã tồn tại")
    const schedule = new this.scheduleModel({ userId: this.request.user._id, title, time })
    return await schedule.save()
  }
}
