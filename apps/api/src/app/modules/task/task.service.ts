import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { BaseService } from '@scrum/api/core/services/base.service';
import { validateForm } from '@scrum/api/core/services/validate.service';
import { BoardService } from '@scrum/api/modules/board/board.service';
import { FileService } from '@scrum/api/modules/file/file.service';
import { TaskDto } from '@scrum/shared/dtos/task/task.dto';
import { TaskFormDto } from '@scrum/shared/dtos/task/task.form.dto';
import { UserDto } from '@scrum/shared/dtos/user/user.dto';
import { Task } from '@scrum/shared/schemas/task.schema';
import fs from 'fs';
import moment from 'moment-timezone';
import { Model } from 'mongoose';

@Injectable()
export class TaskService extends BaseService<Task> {
  public constructor(
    @InjectModel(Task.name) private readonly taskModel: Model<Task>,
    @Inject(forwardRef(() => BoardService)) private readonly boardService: BoardService,
    private readonly fileService: FileService
  ) {
    super(taskModel);
  }

  public async createTask(body: TaskFormDto, user: UserDto): Promise<{ entity?: TaskDto; error?: string }> {
    const bodyParams = validateForm<TaskFormDto>(body, TaskFormDto);

    const board = await this.boardService.findById(bodyParams.board._id);
    if (!board) {
      return { error: 'Нет такого объекта!' };
    }

    if (board.createdUser?.id !== user._id.toString() && board.users.findIndex((_user) => _user.id === user._id.toString()) === -1) {
      return { error: 'Нет доступа!' };
    }
    bodyParams.number = board.indexTaskNumber;
    await this.boardService.incrementTaskNumber(board._id);

    bodyParams.createdUser = user;
    bodyParams.status = board.columns.sort((a, b) => (a.order < b.order ? -1 : 1))?.[0];
    if (bodyParams.grade) {
      bodyParams.left = bodyParams.grade;
    }
    const entity = await this.create<TaskFormDto>(bodyParams);
    return { entity };
  }

  public async updateTask(id: string, body: TaskFormDto, user: UserDto): Promise<{ entity?: TaskDto; error?: string }> {
    const bodyParams = validateForm<TaskFormDto>(body, TaskFormDto);

    const board = await this.boardService.findById(bodyParams.board._id);
    if (!board) {
      return { error: 'Нет такого объекта!' };
    }

    if (board.createdUser?.id !== user._id.toString() && board.users.findIndex((_user) => _user.id === user._id.toString()) === -1) {
      return { error: 'Нет доступа!' };
    }

    const oldTask = await this.findById(id);
    for (const file of oldTask.files) {
      if (bodyParams.files?.findIndex((_file) => _file._id === file.id) === -1) {
        await this.fileService.deleteFile(file?.path);
        if (fs.existsSync('./public/' + file?.path)) {
          fs.unlinkSync('./public/' + file?.path);
        }
      }
    }

    if (oldTask.grade !== bodyParams.grade) {
      bodyParams.left = bodyParams.grade - oldTask.spent;
      if (bodyParams.left < 0) {
        bodyParams.left = 0;
      }
    }

    bodyParams.updateDate = moment().toDate();
    const entity = await this.update<TaskFormDto>(id, bodyParams);
    return { entity };
  }

  public async deleteTask(id: string, user: UserDto): Promise<{ error?: string }> {
    const task = await this.findById(id);
    if (!task) {
      return { error: 'Нет такого объекта!' };
    }

    if (
      task.board.createdUser?.id !== user._id.toString() &&
      task.board.users.findIndex((_user) => _user.id === user._id.toString()) === -1
    ) {
      return { error: 'Нет доступа!' };
    }

    for (const file of task.files) {
      await this.fileService.deleteFile(file?.path);
      if (fs.existsSync('./public/' + file?.path)) {
        fs.unlinkSync('./public/' + file?.path);
      }
    }

    await this.delete(id);
    return { error: null };
  }
}
