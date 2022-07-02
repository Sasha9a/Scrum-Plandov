import {
  Body,
  Controller,
  Delete, forwardRef,
  Get,
  HttpStatus,
  Inject,
  NotFoundException,
  Param,
  Post,
  Put,
  Req,
  Res,
  UseGuards
} from "@nestjs/common";
import { BaseController } from "@scrum/api/core/controllers/base.controller";
import { JwtAuthGuard } from "@scrum/api/core/guards/jwt-auth.guard";
import { BoardService } from "@scrum/api/modules/board/board.service";
import { ColumnBoardService } from "@scrum/api/modules/column-board/column-board.service";
import { UserService } from "@scrum/api/modules/user/user.service";
import { BoardFormDto } from "@scrum/shared/dtos/board/board.form.dto";
import { ColumnBoardFormDto } from "@scrum/shared/dtos/board/column.board.form.dto";
import { UserDto } from "@scrum/shared/dtos/user/user.dto";
import { Request, Response } from "express";
import { TaskService } from "@scrum/api/modules/task/task.service";
import { SprintService } from "@scrum/api/modules/sprint/sprint.service";
import fs from "fs";
import { FileService } from "@scrum/api/modules/file/file.service";
import { JobRecordService } from "@scrum/api/modules/job-record/job.record.service";

@Controller('board')
export class BoardController extends BaseController {

  public constructor(private readonly boardService: BoardService,
                     private readonly userService: UserService,
                     private readonly boardColumnService: ColumnBoardService,
                     @Inject(forwardRef(() => TaskService)) private readonly taskService: TaskService,
                     @Inject(forwardRef(() => SprintService)) private readonly sprintService: SprintService,
                     @Inject(forwardRef(() => JobRecordService)) private readonly jobRecordService: JobRecordService,
                     private readonly fileService: FileService) {
    super();
  }

  @UseGuards(JwtAuthGuard)
  @Get('my')
  public async findByMy(@Res() res: Response, @Req() req: Request) {
    const user: UserDto = req.user as UserDto;

    const entities = await this.boardService.findByMy(user?._id);
    return res.status(HttpStatus.OK).json(entities).end();
  }

  @UseGuards(JwtAuthGuard)
  @Get('users/:id')
  public async findAllUsersByBoard(@Res() res: Response, @Param('id') id: string, @Req() req: Request) {
    const user: UserDto = req.user as UserDto;

    const board = await this.boardService.findById(id);
    if (!board) {
      throw new NotFoundException("Нет такого объекта!");
    }

    if (board.createdUser?.id !== user._id && board.users.findIndex((_user) => _user.id === user._id) === -1) {
      throw new NotFoundException("Нет доступа!");
    }

    const usersIds = [board.createdUser._id, ...board.users.map((user) => user._id)];
    const entities = await this.userService.findAll({ _id: { $in: usersIds } });
    return res.status(HttpStatus.OK).json(entities).end();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  public async findById(@Res() res: Response, @Param('id') id: string, @Req() req: Request) {
    const user: UserDto = req.user as UserDto;

    const entity = await this.boardService.findById(id);
    if (!entity) {
      throw new NotFoundException("Нет такого объекта!");
    }

    if (entity.createdUser?.id !== user._id && entity.users.findIndex((_user) => _user.id === user._id) === -1) {
      throw new NotFoundException("Нет доступа!");
    }

    return res.status(HttpStatus.OK).json(entity).end();
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  public async create(@Res() res: Response, @Body() body: BoardFormDto, @Req() req: Request) {
    const bodyParams = this.validate<BoardFormDto>(body, BoardFormDto);
    const user: UserDto = req.user as UserDto;

    const userEntity = await this.userService.findById(user._id);
    if (!userEntity) {
      throw new NotFoundException("Нет такого аккаунта");
    }
    bodyParams.createdUser = user;

    for (const column of bodyParams.columns) {
      const entityColumn = await this.boardColumnService.create<ColumnBoardFormDto>(column);
      column['_id'] = entityColumn._id;
    }
    const entity = await this.boardService.create<BoardFormDto>(bodyParams);
    return res.status(HttpStatus.CREATED).json(entity).end();
  }

  @UseGuards(JwtAuthGuard)
  @Post('leave/:id')
  public async leave(@Res() res: Response, @Param('id') id: string, @Body() body: { user?: UserDto }, @Req() req: Request) {
    const user: UserDto = req.user as UserDto;

    const board = await this.boardService.findById(id);
    if (!board) {
      throw new NotFoundException("Нет такого объекта!");
    }

    if (user?._id === board.createdUser?.id) {
      if (!body.user) {
        throw new NotFoundException("Не передан пользователь");
      }
      const bodyUser = await this.userService.findById(body.user._id);
      if (!bodyUser) {
        throw new NotFoundException("Нет такого аккаунта");
      }
      if (board.users.findIndex((_user) => _user?.id === bodyUser?.id) === -1) {
        throw new NotFoundException("Нет такого пользователя в доске");
      }
      board.createdUser = bodyUser;
      board.users = board.users.filter((_user) => _user?.id !== bodyUser.id);
      await board.save();
    } else {
      board.users = board.users.filter((_user) => _user?.id !== user._id);
      await board.save();
    }
    return res.status(HttpStatus.OK).end();
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  public async edit(@Res() res: Response, @Param('id') id: string, @Body() body: BoardFormDto, @Req() req: Request) {
    const bodyParams = this.validate<BoardFormDto>(body, BoardFormDto);
    const user: UserDto = req.user as UserDto;

    const userEntity = await this.userService.findById(user._id);
    if (!userEntity) {
      throw new NotFoundException("Нет такого аккаунта");
    }

    let board = await this.boardService.findById(id);
    if (!board) {
      throw new NotFoundException("Нет такого объекта!");
    }

    if (board.createdUser?.id !== user._id) {
      throw new NotFoundException("Нет прав");
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

    tasks = await this.taskService.findAll({ board: board, executor: { $nin: [...bodyParams.users.map((_user) => _user._id), board.createdUser?._id], $exists: true, $ne: null } });
    for (const task of tasks) {
      task.executor = null;
      await task.save();
    }

    const entity = await this.boardService.update<BoardFormDto>(id, bodyParams);
    return res.status(HttpStatus.OK).json(entity).end();
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  public async delete(@Res() res: Response, @Param('id') id: string, @Req() req: Request) {
    const user: UserDto = req.user as UserDto;

    const userEntity = await this.userService.findById(user._id);
    if (!userEntity) {
      throw new NotFoundException("Нет такого аккаунта");
    }

    const board = await this.boardService.findById(id);
    if (!board) {
      throw new NotFoundException("Нет такого объекта!");
    }

    if (board.createdUser?.id !== user._id) {
      throw new NotFoundException("Нет прав");
    }

    for (const column of board.columns) {
      await this.boardColumnService.delete(column._id);
    }

    const jobInfos = await this.jobRecordService.findAll({ board: board });
    for (const jobInfo of jobInfos) {
      await this.jobRecordService.delete(jobInfo._id);
    }

    const tasks = await this.taskService.findAll({ board: board });
    for (const task of tasks) {
      for (const file of task.files) {
        await this.fileService.deleteFile(file?.path);
        if (fs.existsSync('./public/' + file?.path)) {
          fs.unlinkSync('./public/' + file?.path);
        }
      }
      await this.taskService.delete(task._id);
    }

    const sprints = await this.sprintService.findAll({ board: board });
    for (const sprint of sprints) {
      await this.sprintService.delete(sprint._id);
    }

    await this.boardService.delete(id);
    return res.status(HttpStatus.OK).end();
  }

}
