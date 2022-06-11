import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { BaseService } from "@scrum/api/core/services/base.service";
import { User } from "@scrum/shared/schemas/user.schema";
import { Model } from "mongoose";

@Injectable()
export class UserService extends BaseService<User> {

  public constructor(@InjectModel(User.name) private readonly userModel: Model<User>) {
    super(userModel);
  }

  public async findByEmail(email: string): Promise<User> {
    return await this.userModel.findOne({ email: email }).exec();
  }

  public async findByLogin(login: string): Promise<User> {
    return await this.userModel.findOne({ login: login }).exec();
  }

  public async findByToken(token: string): Promise<User> {
    return await this.userModel.findOne({ token: token }).exec();
  }

  public async setToken(id: string, token: string): Promise<any> {
    return await this.userModel.updateOne({ _id: id }, { $set: { token: token } }).exec();
  }

  public async logout(id: string): Promise<any> {
    return await this.userModel.updateOne({ _id: id }, { $unset: { token: '' } }).exec();
  }

}
