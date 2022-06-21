import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Board } from "@scrum/shared/schemas/board.schema";
import * as mongoose from "mongoose";
import { Document } from "mongoose";

@Schema({ versionKey: false })
export class Sprint extends Document {

  @Prop({ required: true })
  public name: string;

  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: Board.name, autopopulate: true })
  public board: Board;

  @Prop()
  public startDate: Date;

  @Prop()
  public endDate: Date;

}

export const SprintSchema = SchemaFactory.createForClass(Sprint);
