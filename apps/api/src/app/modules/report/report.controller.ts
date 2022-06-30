import { Controller, Get, HttpStatus, NotFoundException, Query, Req, Res, UseGuards } from "@nestjs/common";
import { BaseController } from "@scrum/api/core/controllers/base.controller";
import { JwtAuthGuard } from "@scrum/api/core/guards/jwt-auth.guard";
import { BoardService } from "@scrum/api/modules/board/board.service";
import { JobRecordService } from "@scrum/api/modules/job-record/job.record.service";
import { ReportBoardQueryParamsDto } from "@scrum/shared/dtos/report/report.board.query.params.dto";
import { ReportBoardSpentDto } from "@scrum/shared/dtos/report/report.board.spent.dto";
import { UserDto } from "@scrum/shared/dtos/user/user.dto";
import { Request, Response } from "express";
import moment from "moment-timezone";

@Controller('report')
export class ReportController extends BaseController {

  public constructor(private readonly boardService: BoardService,
                     private readonly jobRecordService: JobRecordService) {
    super();
  }

  @UseGuards(JwtAuthGuard)
  @Get('spent')
  public async spent(@Res() res: Response, @Query() queryParams: ReportBoardQueryParamsDto, @Req() req: Request) {
    const params = this.validate<ReportBoardQueryParamsDto>(queryParams, ReportBoardQueryParamsDto);
    const user: UserDto = req.user as UserDto;
    const result: ReportBoardSpentDto = {
      items: [],
      sums: {
        days: {},
        weeks: {},
        months: {}
      }
    };
    const filter = {
      date: {
        $gte: moment(params.from, 'YYYY-MM-DD').subtract(3, 'hour').toISOString(),
        $lte: moment(params.to, 'YYYY-MM-DD').toISOString()
      },
      'task.board._id': params.board
    };
    if (!params.users || !params.users?.length) {

    }

    const board = await this.boardService.findById(params.board);
    if (!board) {
      throw new NotFoundException("Нет такого объекта!");
    }

    if (board.createdUser?.id !== user._id && board.users.findIndex((_user) => _user.id === user._id) === -1) {
      throw new NotFoundException("Нет доступа!");
    }

    return res.status(HttpStatus.OK).json(result).end();
  }

}
