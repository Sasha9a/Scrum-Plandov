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
import { ReportBoardSpentItemDto } from "@scrum/shared/dtos/report/report.board.spent.item.dto";

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
        usersInfo: []
      }
    };
    const filter = {
      date: {
        $gte: moment(params.from, 'YYYY-MM-DD').startOf('day').toDate(),
        $lte: moment(params.to, 'YYYY-MM-DD').endOf('day').toDate()
      },
      board: params.board
    };
    if (String(params.userIds) !== 'undefined') {
      filter['user'] = {
        $in: params.userIds
      };
    }
    if (String(params.sprintIds) !== 'undefined') {
      filter['sprint'] = {
        $in: params.sprintIds
      };
    }
    if (String(params.taskIds) !== 'undefined') {
      filter['task'] = {
        $in: params.taskIds
      };
    }

    const board = await this.boardService.findById(params.board);
    if (!board) {
      throw new NotFoundException("Нет такого объекта!");
    }

    if (board.createdUser?.id !== user._id && board.users.findIndex((_user) => _user.id === user._id) === -1) {
      throw new NotFoundException("Нет доступа!");
    }

    const jobRecords = await this.jobRecordService.findAll(filter);
    result.items = jobRecords.map((job) => {
      return <ReportBoardSpentItemDto>{
        date: job.date,
        user: job.user,
        task: job.task,
        sprint: job.sprint,
        spent: job.timeWork
      };
    });

    jobRecords.forEach((job) => {
      const userInfo = result.sums.usersInfo.find((userInfo) => userInfo.user?._id === job.user?._id);
      if (!userInfo) {
        result.sums.usersInfo.push({ user: job.user, spent: job.timeWork });
      } else {
        userInfo.spent += job.timeWork;
      }
    });

    return res.status(HttpStatus.OK).json(result).end();
  }

}
