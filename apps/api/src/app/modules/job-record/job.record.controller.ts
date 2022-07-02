import {
  Body,
  Controller,
  forwardRef,
  HttpStatus,
  Inject,
  NotFoundException,
  Post,
  Req,
  Res,
  UseGuards
} from "@nestjs/common";
import { BaseController } from "@scrum/api/core/controllers/base.controller";
import { JobRecordService } from "@scrum/api/modules/job-record/job.record.service";
import { JwtAuthGuard } from "@scrum/api/core/guards/jwt-auth.guard";
import { Request, Response } from "express";
import { JobRecordFormDto } from "@scrum/shared/dtos/job-record/job.record.form.dto";
import { UserDto } from "@scrum/shared/dtos/user/user.dto";
import { TaskService } from "@scrum/api/modules/task/task.service";
import { BoardService } from "@scrum/api/modules/board/board.service";

@Controller('job-record')
export class JobRecordController extends BaseController {

  public constructor(private readonly jobRecordService: JobRecordService,
                     private readonly taskService: TaskService,
                     @Inject(forwardRef(() => BoardService)) private readonly boardService: BoardService) {
    super();
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  public async create(@Res() res: Response, @Body() body: JobRecordFormDto, @Req() req: Request) {
    const bodyParams = this.validate<JobRecordFormDto>(body, JobRecordFormDto);
    const user: UserDto = req.user as UserDto;

    const task = await this.taskService.findById(bodyParams.task?._id);
    if (!task) {
      throw new NotFoundException("Нет такой задачи!");
    }

    const board = await this.boardService.findById(task.board?._id);
    if (!board) {
      throw new NotFoundException("Нет такой доски!");
    }

    if (board.createdUser?.id !== user._id && board.users.findIndex((_user) => _user.id === user._id) === -1) {
      throw new NotFoundException("Нет доступа!");
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
    const entity = await this.jobRecordService.create<JobRecordFormDto>(bodyParams);
    return res.status(HttpStatus.CREATED).json(entity).end();
  }

}
