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
import { FileService } from "@scrum/api/modules/file/file.service";
import { TaskService } from "@scrum/api/modules/task/task.service";
import { TaskFormDto } from "@scrum/shared/dtos/task/task.form.dto";
import { UserDto } from "@scrum/shared/dtos/user/user.dto";
import { Request, Response } from "express";
import fs from "fs";
import moment from "moment-timezone";

@Controller('task')
export class TaskController extends BaseController {

  public constructor(private readonly taskService: TaskService,
                     @Inject(forwardRef(() => BoardService)) private readonly boardService: BoardService,
                     private readonly fileService: FileService) {
    super();
  }

  @UseGuards(JwtAuthGuard)
  @Get('board/:id')
  public async findAllByBoard(@Res() res: Response, @Param('id') id: string, @Req() req: Request) {
    const user: UserDto = req.user as UserDto;

    const board = await this.boardService.findById(id);
    if (!board) {
      throw new NotFoundException("Нет такого объекта!");
    }

    if (board.createdUser?.id !== user._id && board.users.findIndex((_user) => _user.id === user._id) === -1) {
      throw new NotFoundException("Нет доступа!");
    }

    const entities = await this.taskService.findAll({ board: board });
    return res.status(HttpStatus.OK).json(entities).end();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  public async findById(@Res() res: Response, @Param('id') id: string, @Req() req: Request) {
    const user: UserDto = req.user as UserDto;

    const entity = await this.taskService.findById(id);
    if (!entity) {
      throw new NotFoundException("Нет такого объекта!");
    }

    const board = await this.boardService.findById(entity.board._id);
    if (!board) {
      throw new NotFoundException("Нет такого объекта!");
    }

    if (board.createdUser?.id !== user._id && board.users.findIndex((_user) => _user.id === user._id) === -1) {
      throw new NotFoundException("Нет доступа!");
    }

    return res.status(HttpStatus.OK).json(entity).end();
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  public async create(@Res() res: Response, @Body() body: TaskFormDto, @Req() req: Request) {
    const bodyParams = this.validate<TaskFormDto>(body, TaskFormDto);
    const user: UserDto = req.user as UserDto;

    const board = await this.boardService.findById(bodyParams.board._id);
    if (!board) {
      throw new NotFoundException("Нет такого объекта!");
    }

    if (board.createdUser?.id !== user._id && board.users.findIndex((_user) => _user.id === user._id) === -1) {
      throw new NotFoundException("Нет доступа!");
    }
    bodyParams.number = board.indexTaskNumber;
    await this.boardService.incrementTaskNumber(board._id);

    bodyParams.createdUser = user;
    bodyParams.status = board.columns.sort((a, b) => a.order < b.order ? -1 : 1)?.[0];
    if (bodyParams.grade) {
      bodyParams.left = bodyParams.grade;
    }
    const entity = await this.taskService.create<TaskFormDto>(bodyParams);
    return res.status(HttpStatus.CREATED).json(entity).end();
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  public async edit(@Res() res: Response, @Param('id') id: string, @Body() body: TaskFormDto, @Req() req: Request) {
    const bodyParams = this.validate<TaskFormDto>(body, TaskFormDto);
    const user: UserDto = req.user as UserDto;

    const board = await this.boardService.findById(bodyParams.board._id);
    if (!board) {
      throw new NotFoundException("Нет такого объекта!");
    }

    if (board.createdUser?.id !== user._id && board.users.findIndex((_user) => _user.id === user._id) === -1) {
      throw new NotFoundException("Нет доступа!");
    }

    const oldTask = await this.taskService.findById(id);
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
    const entity = await this.taskService.update<TaskFormDto>(id, bodyParams);
    return res.status(HttpStatus.OK).json(entity).end();
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  public async delete(@Res() res: Response, @Param('id') id: string, @Req() req: Request) {
    const user: UserDto = req.user as UserDto;

    const task = await this.taskService.findById(id);
    if (!task) {
      throw new NotFoundException("Нет такого объекта!");
    }

    if (task.board.createdUser?.id !== user._id && task.board.users.findIndex((_user) => _user.id === user._id) === -1) {
      throw new NotFoundException("Нет доступа!");
    }

    for (const file of task.files) {
      await this.fileService.deleteFile(file?.path);
      if (fs.existsSync('./public/' + file?.path)) {
        fs.unlinkSync('./public/' + file?.path);
      }
    }

    await this.taskService.delete(id);
    return res.status(HttpStatus.OK).end();
  }

}
