import { Body, Controller, Delete, Get, HttpStatus, NotFoundException, Param, Post, Put, Req, Res, UseGuards } from "@nestjs/common";
import { BaseController } from "@scrum/api/core/controllers/base.controller";
import { JwtAuthGuard } from "@scrum/api/core/guards/jwt-auth.guard";
import { BoardService } from "@scrum/api/modules/board/board.service";
import { SprintService } from "@scrum/api/modules/sprint/sprint.service";
import { SprintFormDto } from "@scrum/shared/dtos/sprint/sprint.form.dto";
import { UserDto } from "@scrum/shared/dtos/user/user.dto";
import { Request, Response } from "express";

@Controller('sprint')
export class SprintController extends BaseController {

  public constructor(private readonly sprintService: SprintService,
                     private readonly boardService: BoardService) {
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

    const entities = await this.sprintService.findAll({ board: board });
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

    const entity = await this.boardService.update<SprintFormDto>(id, bodyParams);
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

    await this.sprintService.delete(id);
    return res.status(HttpStatus.OK).end();
  }

}
