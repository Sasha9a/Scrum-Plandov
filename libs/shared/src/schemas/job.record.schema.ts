import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import mongoose from "mongoose";
import { Task } from "@scrum/shared/schemas/task.schema";
import { User } from "@scrum/shared/schemas/user.schema";
import moment from "moment-timezone";

@Schema({ versionKey: false })
export class JobRecord extends Document {

  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: "User", autopopulate: { select: '_id login name avatar' }  })
  public user: User;

  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: "Task", autopopulate: true })
  public task: Task;

  @Prop({ default: moment().toDate() })
  public date: Date;

  @Prop({ required: true })
  public timeWork: number;

}

export const JobRecordSchema = SchemaFactory.createForClass(JobRecord);
