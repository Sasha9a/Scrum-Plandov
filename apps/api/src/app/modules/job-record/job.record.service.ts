import { Injectable } from "@nestjs/common";
import { BaseService } from "@scrum/api/core/services/base.service";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { JobRecord } from "@scrum/shared/schemas/job.record.schema";

@Injectable()
export class JobRecordService extends BaseService<JobRecord> {

  public constructor(@InjectModel(JobRecord.name) private readonly jobRecordModel: Model<JobRecord>) {
    super(jobRecordModel);
  }

}
