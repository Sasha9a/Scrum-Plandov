import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

@Schema({ versionKey: false })
export class ColumnBoard extends Document {

  @Prop({ required: true })
  public name: string;

  @Prop({ required: true })
  public order: number;

  @Prop()
  public color: string;

  @Prop()
  public backgroundColor: string;

}

export const ColumnBoardSchema = SchemaFactory.createForClass(ColumnBoard);
