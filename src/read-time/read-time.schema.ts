import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { HydratedDocument } from "mongoose"

export type ReadTimeDocument = HydratedDocument<ReadTime>

@Schema()
export class ReadTime {
  @Prop({ required: true })
  ownerId: string

  @Prop({ required: true })
  bookId: string

  @Prop({ required: true, default: Date.now() })
  createdAt: Date

  @Prop({ required: true, default: Date.now() })
  updateAp: Date
}

export const ReadTimeSchema = SchemaFactory.createForClass(ReadTime)
