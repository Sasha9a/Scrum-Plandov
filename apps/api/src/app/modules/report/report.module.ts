import { Module } from "@nestjs/common";
import { BoardModule } from "@scrum/api/modules/board/board.module";
import { JobRecordModule } from "@scrum/api/modules/job-record/job.record.module";
import { ReportController } from "@scrum/api/modules/report/report.controller";

@Module({
  imports: [
    BoardModule,
    JobRecordModule
  ],
  controllers: [ReportController]
})
export class ReportModule {}
