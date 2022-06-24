import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { BaseService } from "@scrum/api/core/services/base.service";
import { ColumnBoard } from "@scrum/shared/schemas/column.board.schema";
import { Model } from "mongoose";

@Injectable()
export class ColumnBoardService extends BaseService<ColumnBoard> {

  public constructor(@InjectModel(ColumnBoard.name) private readonly columnBoardModel: Model<ColumnBoard>) {
    super(columnBoardModel);
  }

}
