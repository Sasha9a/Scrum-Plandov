import {
  Body,
  Controller,
  Delete,
  forwardRef,
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
} from '@nestjs/common';
import { BaseController } from '@scrum/api/core/controllers/base.controller';
import { JwtAuthGuard } from '@scrum/api/core/guards/jwt-auth.guard';
import { BoardService } from '@scrum/api/modules/board/board.service';
import { SprintGateway } from '@scrum/api/modules/sprint/sprint.gateway';
import { TaskService } from '@scrum/api/modules/task/task.service';
import { TaskFormDto } from '@scrum/shared/dtos/task/task.form.dto';
import { UserDto } from '@scrum/shared/dtos/user/user.dto';
import { Request, Response } from 'express';

@Controller('task')
export class TaskController extends BaseController {
  public constructor(
    private readonly taskService: TaskService,
    @Inject(forwardRef(() => BoardService)) private readonly boardService: BoardService,
    @Inject(forwardRef(() => SprintGateway)) private readonly sprintGateway: SprintGateway
  ) {
    super();
  }

  @UseGuards(JwtAuthGuard)
  @Get('board/:id')
  public async findAllByBoard(@Res() res: Response, @Param('id') id: string, @Req() req: Request) {
    const user: UserDto = req.user as UserDto;

    const board = await this.boardService.findById(id);
    if (!board) {
      throw new NotFoundException('Нет такого объекта!');
    }

    if (board.createdUser?.id !== user._id && board.users.findIndex((_user) => _user.id === user._id) === -1) {
      throw new NotFoundException('Нет доступа!');
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
      throw new NotFoundException('Нет такого объекта!');
    }

    const board = await this.boardService.findById(entity.board._id);
    if (!board) {
      throw new NotFoundException('Нет такого объекта!');
    }

    if (board.createdUser?.id !== user._id && board.users.findIndex((_user) => _user.id === user._id) === -1) {
      throw new NotFoundException('Нет доступа!');
    }

    return res.status(HttpStatus.OK).json(entity).end();
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  public async create(@Res() res: Response, @Body() body: TaskFormDto, @Req() req: Request) {
    const result = await this.taskService.createTask(body, req.user as UserDto);
    if (result?.error) {
      throw new NotFoundException(result.error);
    }
    if (result?.entity) {
      return res.status(HttpStatus.CREATED).json(result.entity).end();
    }
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  public async edit(@Res() res: Response, @Param('id') id: string, @Body() body: TaskFormDto, @Req() req: Request) {
    const result = await this.taskService.updateTask(id, body, req.user as UserDto);
    if (result?.error) {
      throw new NotFoundException(result.error);
    }
    if (result?.entity) {
      return res.status(HttpStatus.OK).json(result.entity).end();
    }
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  public async delete(@Res() res: Response, @Param('id') id: string, @Req() req: Request) {
    const result = await this.taskService.deleteTask(id, req.user as UserDto);
    if (result?.error) {
      throw new NotFoundException(result.error);
    }
    return res.status(HttpStatus.OK).end();
  }
}
