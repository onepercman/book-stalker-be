import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { HydratedDocument } from "mongoose"

export type TrackerDocument = HydratedDocument<Tracker>

@Schema()
export class Tracker {
  @Prop({ required: true })
  userId: string

  @Prop({ required: true })
  bookId: string

  @Prop({ required: true, default: Date.now() })
  lastVisit: number

  @Prop({ required: true, default: 0 })
  currentPage: number

  @Prop({ required: true, default: "" })
  currentCfi: string

  @Prop({ required: true, default: 0 })
  totalPage: number

  @Prop({ default: 1 })
  readTime: number
}

export const TrackerSchema = SchemaFactory.createForClass(Tracker)
