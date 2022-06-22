import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { BaseService } from "@scrum/api/core/services/base.service";
import { Board } from "@scrum/shared/schemas/board.schema";
import { Model } from "mongoose";

@Injectable()
export class BoardService extends BaseService<Board> {

  public constructor(@InjectModel(Board.name) private readonly boardModel: Model<Board>) {
    super(boardModel);
  }

  public async incrementTaskNumber(boardId: string): Promise<null> {
    return await this.boardModel.updateOne({ _id: boardId }, { $inc: { indexTaskNumber: 1 } }).exec() as null;
  }

  public async findByMy(userId: string): Promise<Board[]> {
    return await this.boardModel.find({ $or: [ { createdUser: userId as any }, { users: { $in: [userId as any] } } ] }).exec();
  }

}
