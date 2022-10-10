import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { BaseService } from '@scrum/api/core/services/base.service';
import { validateForm } from '@scrum/api/core/services/validate.service';
import { ColumnBoardService } from '@scrum/api/modules/column-board/column-board.service';
import { TaskService } from '@scrum/api/modules/task/task.service';
import { UserService } from '@scrum/api/modules/user/user.service';
import { BoardDto } from '@scrum/shared/dtos/board/board.dto';
import { BoardFormDto } from '@scrum/shared/dtos/board/board.form.dto';
import { ColumnBoardFormDto } from '@scrum/shared/dtos/board/column.board.form.dto';
import { UserDto } from '@scrum/shared/dtos/user/user.dto';
import { Board } from '@scrum/shared/schemas/board.schema';
import { Model } from 'mongoose';

@Injectable()
export class BoardService extends BaseService<Board> {
  public constructor(
    @InjectModel(Board.name) private readonly boardModel: Model<Board>,
    private readonly boardService: BoardService,
    private readonly userService: UserService,
    private readonly boardColumnService: ColumnBoardService,
    @Inject(forwardRef(() => TaskService)) private readonly taskService: TaskService
  ) {
    super(boardModel);
  }

  public async incrementTaskNumber(boardId: string): Promise<null> {
    return (await this.boardModel.updateOne({ _id: boardId }, { $inc: { indexTaskNumber: 1 } }).exec()) as null;
  }

  public async findByMy(userId: string): Promise<Board[]> {
    return await this.boardModel.find({ $or: [{ createdUser: userId as any }, { users: { $in: [userId as any] } }] }).exec();
  }

  public async updateBoard(id: string, body: BoardFormDto, user: UserDto): Promise<{ entity?: BoardDto; error?: string }> {
    const bodyParams = validateForm<BoardFormDto>(body, BoardFormDto);

    const userEntity = await this.userService.findById(user._id);
    if (!userEntity) {
      return { error: 'Нет такого аккаунта' };
    }

    let board = await this.boardService.findById(id);
    if (!board) {
      return { error: 'Нет такого объекта!' };
    }

    if (board.createdUser?.id !== user._id) {
      return { error: 'Нет прав' };
    }

    for (const column of board.columns) {
      if (bodyParams.columns.findIndex((_column) => _column['_id'] === column.id) === -1) {
        await this.boardColumnService.delete(column._id);
      }
    }

    for (const column of bodyParams.columns) {
      if (column['_id']) {
        await this.boardColumnService.update<ColumnBoardFormDto>(column['_id'], column);
      } else {
        const entityColumn = await this.boardColumnService.create<ColumnBoardFormDto>(column);
        column['_id'] = entityColumn._id;
      }
    }

    board = await this.boardService.findById(id);
    let tasks = await this.taskService.findAll({ board: board, status: { $nin: board.columns.map((_column) => _column._id) } });
    for (const task of tasks) {
      task.status = board.columns[0];
      await task.save();
    }

    tasks = await this.taskService.findAll({
      board: board,
      executor: { $nin: [...bodyParams.users.map((_user) => _user._id), board.createdUser?._id], $exists: true, $ne: null }
    });
    for (const task of tasks) {
      task.executor = null;
      await task.save();
    }

    const entity = await this.boardService.update<BoardFormDto>(id, bodyParams);
    return { entity };
  }
}
