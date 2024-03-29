import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { BaseService } from "@scrum/api/core/services/base.service";
import { RoleEnum } from "@scrum/shared/enums/role.enum";
import { User } from "@scrum/shared/schemas/user.schema";
import jwt from "jsonwebtoken";
import { Model } from "mongoose";
import { environment } from "../../../environments/environment";

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

  public async getUserByAuthorization(authorization: string): Promise<User> {
    const decoded = jwt.verify(authorization, environment.secret) as { user: { _id: string, email: string, roles: RoleEnum[] } };
    return await this.findByEmail(decoded.user.email);
  }

}
