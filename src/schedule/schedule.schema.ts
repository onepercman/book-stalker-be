import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { HydratedDocument } from "mongoose"

export type ScheduleDocument = HydratedDocument<Schedule>

@Schema()
export class Schedule {
  @Prop({ required: true })
  userId: string

  @Prop({ required: true })
  time: number

  @Prop()
  title: string
}

export const ScheduleSchema = SchemaFactory.createForClass(Schedule)
