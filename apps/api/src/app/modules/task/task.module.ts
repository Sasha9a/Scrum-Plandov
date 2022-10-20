import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BoardModule } from '@scrum/api/modules/board/board.module';
import { FileModule } from '@scrum/api/modules/file/file.module';
import { JobRecordModule } from '@scrum/api/modules/job-record/job.record.module';
import { SprintModule } from '@scrum/api/modules/sprint/sprint.module';
import { TaskController } from '@scrum/api/modules/task/task.controller';
import { TaskGateway } from '@scrum/api/modules/task/task.gateway';
import { TaskService } from '@scrum/api/modules/task/task.service';
import { UserModule } from '@scrum/api/modules/user/user.module';
import { TaskSchema } from '@scrum/shared/schemas/task.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Task', schema: TaskSchema }]),
    forwardRef(() => BoardModule),
    forwardRef(() => SprintModule),
    forwardRef(() => JobRecordModule),
    FileModule,
    UserModule
  ],
  controllers: [TaskController],
  providers: [TaskService, TaskGateway],
  exports: [TaskService, TaskGateway]
})
export class TaskModule {}
