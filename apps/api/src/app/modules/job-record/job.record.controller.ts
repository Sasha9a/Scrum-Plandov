import { Body, Controller, HttpStatus, NotFoundException, Post, Req, Res, UseGuards } from '@nestjs/common';
import { BaseController } from '@scrum/api/core/controllers/base.controller';
import { JwtAuthGuard } from '@scrum/api/core/guards/jwt-auth.guard';
import { JobRecordService } from '@scrum/api/modules/job-record/job.record.service';
import { JobRecordFormDto } from '@scrum/shared/dtos/job-record/job.record.form.dto';
import { UserDto } from '@scrum/shared/dtos/user/user.dto';
import { Request, Response } from 'express';

@Controller('job-record')
export class JobRecordController extends BaseController {
  public constructor(private readonly jobRecordService: JobRecordService) {
    super();
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  public async create(@Res() res: Response, @Body() body: JobRecordFormDto, @Req() req: Request) {
    const result = await this.jobRecordService.createJobRecord(body, req.user as UserDto);
    if (result?.error) {
      throw new NotFoundException(result.error);
    }
    if (result?.entity) {
      return res.status(HttpStatus.CREATED).json(result.entity).end();
    }
  }
}
