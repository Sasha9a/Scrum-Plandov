import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { TaskPriorityEnum } from "@scrum/shared/enums/task.priority.enum";
import { Board } from "@scrum/shared/schemas/board.schema";
import { ColumnBoard } from "@scrum/shared/schemas/column.board.schema";
import { File } from "@scrum/shared/schemas/file.schema";
import { Sprint } from "@scrum/shared/schemas/sprint.schema";
import { User } from "@scrum/shared/schemas/user.schema";
import mongoose from "mongoose";
import { Document } from "mongoose";

@Schema({ versionKey: false })
export class Task extends Document {

  @Prop({ required: true })
  public number: number;

  @Prop({ required: true })
  public name: string;

  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: Board.name, autopopulate: true })
  public board: Board;

  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: ColumnBoard.name, autopopulate: true })
  public status: ColumnBoard;

  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: User.name, autopopulate: { select: '_id login name avatar' } })
  public createdUser: User;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: User.name, autopopulate: { select: '_id login name avatar' } })
  public executor: User;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Sprint.name, autopopulate: true })
  public sprint: Sprint;

  @Prop({ default: new Date() })
  public createDate: Date;

  @Prop({ default: new Date() })
  public updateDate: Date;

  @Prop({ required: true, type: String })
  public priority: TaskPriorityEnum;

  @Prop({ type: [mongoose.Schema.Types.ObjectId], ref: File.name, autopopulate: true })
  public files: File[];

  @Prop()
  public grade: number;

  @Prop()
  public left: number;

  @Prop({ default: 0 })
  public spent: number;

  @Prop()
  public description: string;

}

export const TaskSchema = SchemaFactory.createForClass(Task);
