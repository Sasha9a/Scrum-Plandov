import { forwardRef, Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { BoardModule } from "@scrum/api/modules/board/board.module";
import { TaskModule } from "@scrum/api/modules/task/task.module";
import { JobRecordSchema } from "@scrum/shared/schemas/job.record.schema";
import { JobRecordController } from "@scrum/api/modules/job-record/job.record.controller";
import { JobRecordService } from "@scrum/api/modules/job-record/job.record.service";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: "JobRecord", schema: JobRecordSchema }]),
    forwardRef(() => BoardModule),
    TaskModule
  ],
  controllers: [JobRecordController],
  providers: [JobRecordService],
  exports: [JobRecordService]
})
export class JobRecordModule {}
