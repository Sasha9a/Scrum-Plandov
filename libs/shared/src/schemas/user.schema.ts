import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { RoleEnum } from "@scrum/shared/enums/role.enum";
import { File } from "@scrum/shared/schemas/file.schema";
import * as mongoose from "mongoose";
import { Document } from "mongoose";

@Schema({ versionKey: false })
export class User extends Document {

  @Prop({ required: true })
  public email: string;

  @Prop({ default: new Date() })
  public registerDate: Date;

  @Prop()
  public lastEntranceDate: Date;

  @Prop({ required: true })
  public login: string;

  @Prop()
  public name: string;

  @Prop({ required: true })
  public password: string;

  @Prop({ type: String, default: RoleEnum.USER })
  public roles: RoleEnum[];

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: File.name, autopopulate: true })
  public avatar: File;

  @Prop({ default: false })
  public isValidatedEmail: boolean;

  @Prop()
  public token: string;

}

export const UserSchema = SchemaFactory.createForClass(User);
