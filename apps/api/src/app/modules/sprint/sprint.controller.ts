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
import { SprintService } from "@scrum/api/modules/sprint/sprint.service";
import { TaskService } from "@scrum/api/modules/task/task.service";
import { SprintFormDto } from "@scrum/shared/dtos/sprint/sprint.form.dto";
import { SprintTasksInfoDto } from "@scrum/shared/dtos/sprint/sprint.tasks.info.dto";
import { SprintWorkUserInfoDto } from "@scrum/shared/dtos/sprint/sprint.work.user.info.dto";
import { UserDto } from "@scrum/shared/dtos/user/user.dto";
import { Request, Response } from "express";
import { SprintDto } from "@scrum/shared/dtos/sprint/sprint.dto";

@Controller('sprint')
export class SprintController extends BaseController {

  public constructor(private readonly sprintService: SprintService,
                     @Inject(forwardRef(() => BoardService)) private readonly boardService: BoardService,
                     private readonly taskService: TaskService) {
    super();
  }

  @UseGuards(JwtAuthGuard)
  @Get('board/:id/dropdown')
  public async findAllByBoardDropdown(@Res() res: Response, @Param('id') id: string, @Req() req: Request) {
    const user: UserDto = req.user as UserDto;

    const board = await this.boardService.findById(id);
    if (!board) {
      throw new NotFoundException("Нет такого объекта!");
    }

    if (board.createdUser?.id !== user._id && board.users.findIndex((_user) => _user.id === user._id) === -1) {
      throw new NotFoundException("Нет доступа!");
    }

    const entities = await this.sprintService.findAll({ board: board, isCompleted: false });
    return res.status(HttpStatus.OK).json(entities).end();
  }

  @UseGuards(JwtAuthGuard)
  @Get('board/:id')
  public async findAllByBoard(@Res() res: Response, @Param('id') id: string, @Req() req: Request) {
    const user: UserDto = req.user as UserDto;
    const results: SprintTasksInfoDto[] = [];

    const board = await this.boardService.findById(id);
    if (!board) {
      throw new NotFoundException("Нет такого объекта!");
    }

    if (board.createdUser?.id !== user._id && board.users.findIndex((_user) => _user.id === user._id) === -1) {
      throw new NotFoundException("Нет доступа!");
    }

    const sprints = await this.sprintService.findAll({ board: board, isCompleted: false });
    for (const sprint of sprints) {
      const tasks = await this.taskService.findAll({ board: board, sprint: sprint });
      const usersInfo: SprintWorkUserInfoDto[] = [];
      for (const task of tasks) {
        if (task.executor) {
          let userInfo = usersInfo.find((userInfo) => userInfo.user?._id === task.executor?._id);
          if (!userInfo) {
            userInfo = {
              user: task.executor,
              count: 1,
              grade: task.grade,
              left: task.left || 0
            };
            usersInfo.push(userInfo);
          } else {
            userInfo.count++;
            userInfo.grade += task.grade;
            userInfo.left += (task.left || 0);
          }
        }
      }
      results.push({
        sprint: sprint,
        tasks: tasks,
        notAssignedInfo: {
          count: tasks.reduce((sum, task) => !task.executor ? sum + 1 : sum, 0),
          grade: tasks.reduce((sum, task) => !task.executor ? sum + task.grade : sum, 0),
          left: tasks.reduce((sum, task) => !task.executor ? sum + (task.left || 0) : sum, 0)
        },
        usersInfo: usersInfo,
        sumInfo: {
          count: tasks.length,
          grade: tasks.reduce((sum, task) => sum + task.grade, 0),
          left: tasks.reduce((sum, task) => sum + (task.left || 0), 0)
        }
      });
    }

    const tasks = await this.taskService.findAll({ board: board, sprint: null });
    results.push({
      tasks: tasks
    });

    return res.status(HttpStatus.OK).json(results).end();
  }

  @UseGuards(JwtAuthGuard)
  @Get('start/:id')
  public async startSprint(@Res() res: Response, @Param('id') id: string, @Req() req: Request) {
    const user: UserDto = req.user as UserDto;

    const sprint = await this.sprintService.findById(id);
    if (!sprint) {
      throw new NotFoundException("Нет такого объекта!");
    }

    const board = await this.boardService.findById(sprint.board._id);
    if (!board) {
      throw new NotFoundException("Нет такого объекта!");
    }

    if (board.createdUser?.id !== user._id && board.users.findIndex((_user) => _user.id === user._id) === -1) {
      throw new NotFoundException("Нет доступа!");
    }

    if (board.activeSprints.findIndex((activeSprint) => activeSprint.id === sprint.id) !== -1) {
      throw new NotFoundException("Спринт активный!");
    }

    if (!board.activeSprints) {
      board.activeSprints = [];
    }
    board.activeSprints.push(sprint);
    await board.save();
    return res.status(HttpStatus.OK).end();
  }

  @UseGuards(JwtAuthGuard)
  @Get('completed/:id')
  public async completedSprint(@Res() res: Response, @Param('id') id: string, @Req() req: Request) {
    const user: UserDto = req.user as UserDto;

    const sprint = await this.sprintService.findById(id);
    if (!sprint) {
      throw new NotFoundException("Нет такого объекта!");
    }

    const board = await this.boardService.findById(sprint.board._id);
    if (!board) {
      throw new NotFoundException("Нет такого объекта!");
    }

    if (board.createdUser?.id !== user._id && board.users.findIndex((_user) => _user.id === user._id) === -1) {
      throw new NotFoundException("Нет доступа!");
    }

    board.activeSprints = board.activeSprints.filter((_sprint) => _sprint.id !== sprint.id);
    await board.save();
    await this.sprintService.update<SprintDto>(sprint._id, { isCompleted: true });
    return res.status(HttpStatus.OK).end();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id/tasks')
  public async findByIdAllTasks(@Res() res: Response, @Param('id') id: string, @Req() req: Request) {
    const user: UserDto = req.user as UserDto;

    const sprint = await this.sprintService.findById(id);
    if (!sprint) {
      throw new NotFoundException("Нет такого объекта!");
    }

    const board = await this.boardService.findById(sprint.board._id);
    if (!board) {
      throw new NotFoundException("Нет такого объекта!");
    }

    if (board.createdUser?.id !== user._id && board.users.findIndex((_user) => _user.id === user._id) === -1) {
      throw new NotFoundException("Нет доступа!");
    }

    const entities = await this.taskService.findAll({ board: board, sprint: sprint });
    return res.status(HttpStatus.OK).json(entities).end();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  public async findById(@Res() res: Response, @Param('id') id: string, @Req() req: Request) {
    const user: UserDto = req.user as UserDto;

    const entity = await this.sprintService.findById(id);
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
  public async create(@Res() res: Response, @Body() body: SprintFormDto, @Req() req: Request) {
    const bodyParams = this.validate<SprintFormDto>(body, SprintFormDto);
    const user: UserDto = req.user as UserDto;

    const board = await this.boardService.findById(bodyParams.board._id);
    if (!board) {
      throw new NotFoundException("Нет такого объекта!");
    }

    if (board.createdUser?.id !== user._id && board.users.findIndex((_user) => _user.id === user._id) === -1) {
      throw new NotFoundException("Нет доступа!");
    }

    const entity = await this.sprintService.create<SprintFormDto>(bodyParams);
    return res.status(HttpStatus.CREATED).json(entity).end();
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  public async edit(@Res() res: Response, @Param('id') id: string, @Body() body: SprintFormDto, @Req() req: Request) {
    const bodyParams = this.validate<SprintFormDto>(body, SprintFormDto);
    const user: UserDto = req.user as UserDto;

    const board = await this.boardService.findById(bodyParams.board._id);
    if (!board) {
      throw new NotFoundException("Нет такого объекта!");
    }

    if (board.createdUser?.id !== user._id && board.users.findIndex((_user) => _user.id === user._id) === -1) {
      throw new NotFoundException("Нет доступа!");
    }

    const entity = await this.sprintService.update<SprintFormDto>(id, bodyParams);
    if (!entity) {
      throw new NotFoundException("Произошла ошибка!");
    }
    return res.status(HttpStatus.OK).json(entity).end();
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  public async delete(@Res() res: Response, @Param('id') id: string, @Req() req: Request) {
    const user: UserDto = req.user as UserDto;

    const sprint = await this.sprintService.findById(id);
    if (!sprint) {
      throw new NotFoundException("Нет такого объекта!");
    }

    if (sprint.board.createdUser?.id !== user._id && sprint.board.users.findIndex((_user) => _user.id === user._id) === -1) {
      throw new NotFoundException("Нет доступа!");
    }

    const tasks = await this.taskService.findAll({ sprint: sprint, board: sprint.board });
    for (const task of tasks) {
      task.sprint = null;
      await task.save();
    }

    await this.sprintService.delete(id);
    return res.status(HttpStatus.OK).end();
  }

}
