import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { BaseService } from "@scrum/api/core/services/base.service";
import { Verify } from "@scrum/shared/schemas/verify.schema";
import { Model } from "mongoose";

@Injectable()
export class VerifyService extends BaseService<Verify> {

  public constructor(@InjectModel(Verify.name) private readonly verifyModel: Model<Verify>) {
    super(verifyModel);
  }

  public async findByEmail(email: string): Promise<Verify | null> {
    return await this.verifyModel.findOne({ email: email }).exec();
  }

  public async findByPath(path: string): Promise<Verify | null> {
    return await this.verifyModel.findOne({ path: path }).exec();
  }

}
