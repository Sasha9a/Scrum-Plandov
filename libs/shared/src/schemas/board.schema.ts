import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ColumnBoardDto } from "@scrum/shared/dtos/board/column.board.dto";
import { ColumnBoardSchema } from "@scrum/shared/schemas/column.board.schema";
import { Sprint } from "@scrum/shared/schemas/sprint.schema";
import { User } from "@scrum/shared/schemas/user.schema";
import moment from "moment-timezone";
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

  @Prop({ default: moment().toDate() })
  public createDate: Date;

  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: User.name, autopopulate: true })
  public createdUser: User;

  @Prop({ type: [mongoose.Schema.Types.ObjectId], ref: User.name, autopopulate: true })
  public users: User[];

  @Prop({ type: [ColumnBoardSchema], autopopulate: true })
  public columns: ColumnBoardDto[];

}

export const BoardSchema = SchemaFactory.createForClass(Board);
