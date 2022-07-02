import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import mongoose from "mongoose";
import { Task } from "@scrum/shared/schemas/task.schema";
import { User } from "@scrum/shared/schemas/user.schema";
import { Board } from "@scrum/shared/schemas/board.schema";
import { Sprint } from "@scrum/shared/schemas/sprint.schema";

@Schema({ versionKey: false })
export class JobRecord extends Document {

  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: "User", autopopulate: { select: '_id login name avatar' }  })
  public user: User;

  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: "Task", autopopulate: { select: '_id name number' } })
  public task: Task;

  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: "Board", autopopulate: { select: '_id name code' } })
  public board: Board;

  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: "Sprint", autopopulate: { select: '_id name' } })
  public sprint: Sprint;

  @Prop({ default: new Date() })
  public date: Date;

  @Prop({ required: true })
  public timeWork: number;

}

export const JobRecordSchema = SchemaFactory.createForClass(JobRecord);
