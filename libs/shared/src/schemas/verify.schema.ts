import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { VerifyEmailTypeEnum } from "@scrum/shared/enums/verify.email.type.enum";
import { Document } from "mongoose";

@Schema({ versionKey: false })
export class Verify extends Document {

  @Prop({ required: true })
  public path: string;

  @Prop({ type: String, required: true })
  public type: VerifyEmailTypeEnum;

  @Prop({ required: true })
  public email: string;

  @Prop()
  public oldEmail: string;

}

export const VerifySchema = SchemaFactory.createForClass(Verify);
