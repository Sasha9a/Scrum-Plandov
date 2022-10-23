import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { BaseService } from '@scrum/api/core/services/base.service';
import { validateForm } from '@scrum/api/core/services/validate.service';
import { BoardService } from '@scrum/api/modules/board/board.service';
import { TaskService } from '@scrum/api/modules/task/task.service';
import { JobRecordDto } from '@scrum/shared/dtos/job-record/job.record.dto';
import { JobRecordFormDto } from '@scrum/shared/dtos/job-record/job.record.form.dto';
import { UserDto } from '@scrum/shared/dtos/user/user.dto';
import { JobRecord } from '@scrum/shared/schemas/job.record.schema';
import { Model } from 'mongoose';

@Injectable()
export class JobRecordService extends BaseService<JobRecord> {
  public constructor(
    @InjectModel(JobRecord.name) private readonly jobRecordModel: Model<JobRecord>,
    @Inject(forwardRef(() => TaskService)) private readonly taskService: TaskService,
    @Inject(forwardRef(() => BoardService)) private readonly boardService: BoardService
  ) {
    super(jobRecordModel);
  }

  public async createJobRecord(body: JobRecordFormDto, user: UserDto): Promise<{ entity?: JobRecordDto; error?: string }> {
    const bodyParams = validateForm<JobRecordFormDto>(body, JobRecordFormDto);

    const task = await this.taskService.findById(bodyParams.task?._id);
    if (!task) {
      return { error: 'Нет такой задачи!' };
    }

    const board = await this.boardService.findById(task.board?._id);
    if (!board) {
      return { error: 'Нет такой доски!' };
    }

    if (board.createdUser?.id !== user._id.toString() && board.users.findIndex((_user) => _user.id === user._id.toString()) === -1) {
      return { error: 'Нет доступа!' };
    }

    task.spent += bodyParams.timeWork;
    if (task.left) {
      task.left -= bodyParams.timeWork;
      if (task.left < 0) {
        task.left = 0;
      }
    }
    await task.save();

    bodyParams.user = user;
    const entity = await this.create<JobRecordFormDto>(bodyParams);
    return { entity };
  }
}
