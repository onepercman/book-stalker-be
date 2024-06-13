import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { HydratedDocument } from "mongoose"

export type TrackerDocument = HydratedDocument<Tracker>

@Schema()
export class Tracker {
  @Prop({ required: true })
  userId: string

  @Prop({ required: true })
  bookId: string

  @Prop({ default: Date.now() })
  lastVisit: number

  @Prop({ default: 0 })
  currentPage: number

  @Prop({ default: "" })
  currentCfi: string

  @Prop({ default: 0 })
  totalPage: number

  @Prop({ default: 1 })
  readTime: number
}

export const TrackerSchema = SchemaFactory.createForClass(Tracker)
