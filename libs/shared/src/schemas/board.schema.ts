import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ColumnBoard } from "@scrum/shared/schemas/column.board.schema";
import { Sprint } from "@scrum/shared/schemas/sprint.schema";
import { User } from "@scrum/shared/schemas/user.schema";
import * as mongoose from "mongoose";
import { Document } from "mongoose";

@Schema({ versionKey: false })
export class Board extends Document {

  @Prop({ required: true })
  public name: string;

  @Prop({ required: true })
  public code: string;

  @Prop({ default: 1 })
  public indexTaskNumber: number;

  @Prop({ type: [mongoose.Schema.Types.ObjectId], ref: "Sprint", autopopulate: true })
  public activeSprints: Sprint[];

  @Prop({ default: new Date() })
  public createDate: Date;

  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: User.name, autopopulate: { select: '_id login name avatar' } })
  public createdUser: User;

  @Prop({ type: [mongoose.Schema.Types.ObjectId], ref: User.name, autopopulate: { select: '_id login name avatar' } })
  public users: User[];

  @Prop({ type: [mongoose.Schema.Types.ObjectId], ref: ColumnBoard.name, autopopulate: true })
  public columns: ColumnBoard[];

}

export const BoardSchema = SchemaFactory.createForClass(Board);
