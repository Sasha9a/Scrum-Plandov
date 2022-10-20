import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BoardModule } from '@scrum/api/modules/board/board.module';
import { JobRecordController } from '@scrum/api/modules/job-record/job.record.controller';
import { JobRecordService } from '@scrum/api/modules/job-record/job.record.service';
import { SprintModule } from '@scrum/api/modules/sprint/sprint.module';
import { TaskModule } from '@scrum/api/modules/task/task.module';
import { JobRecordSchema } from '@scrum/shared/schemas/job.record.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'JobRecord', schema: JobRecordSchema }]),
    forwardRef(() => BoardModule),
    forwardRef(() => TaskModule),
    SprintModule
  ],
  controllers: [JobRecordController],
  providers: [JobRecordService],
  exports: [JobRecordService]
})
export class JobRecordModule {}
