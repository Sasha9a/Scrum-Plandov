import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { BaseService } from '@scrum/api/core/services/base.service';
import { validateForm } from '@scrum/api/core/services/validate.service';
import { BoardService } from '@scrum/api/modules/board/board.service';
import { TaskService } from '@scrum/api/modules/task/task.service';
import { SprintDto } from '@scrum/shared/dtos/sprint/sprint.dto';
import { SprintFormDto } from '@scrum/shared/dtos/sprint/sprint.form.dto';
import { UserDto } from '@scrum/shared/dtos/user/user.dto';
import { Sprint } from '@scrum/shared/schemas/sprint.schema';
import { Model } from 'mongoose';

@Injectable()
export class SprintService extends BaseService<Sprint> {
  public constructor(
    @InjectModel(Sprint.name) private readonly sprintModel: Model<Sprint>,
    @Inject(forwardRef(() => BoardService)) private readonly boardService: BoardService,
    private readonly taskService: TaskService
  ) {
    super(sprintModel);
  }

  public async updateSprint(id: string, body: SprintFormDto, user: UserDto): Promise<{ entity?: SprintDto; error?: string }> {
    const bodyParams = validateForm<SprintFormDto>(body, SprintFormDto);

    const board = await this.boardService.findById(bodyParams.board._id);
    if (!board) {
      return { error: 'Нет такого объекта!' };
    }

    if (board.createdUser?.id !== user._id && board.users.findIndex((_user) => _user.id === user._id) === -1) {
      return { error: 'Нет доступа!' };
    }

    const entity = await this.update<SprintFormDto>(id, bodyParams);
    if (!entity) {
      return { error: 'Произошла ошибка!' };
    }
    return { entity };
  }

  public async deleteSprint(id: string, user: UserDto): Promise<{ error?: string }> {
    const sprint = await this.findById(id);
    if (!sprint) {
      return { error: 'Нет такого объекта!' };
    }

    if (sprint.board.createdUser?.id !== user._id && sprint.board.users.findIndex((_user) => _user.id === user._id) === -1) {
      return { error: 'Нет доступа!' };
    }

    const tasks = await this.taskService.findAll({ sprint: sprint, board: sprint.board });
    for (const task of tasks) {
      task.sprint = null;
      await task.save();
    }

    await this.delete(id);
    return { error: null };
  }
}
