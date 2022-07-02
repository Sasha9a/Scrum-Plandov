import { forwardRef, Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { BoardModule } from "@scrum/api/modules/board/board.module";
import { FileModule } from "@scrum/api/modules/file/file.module";
import { TaskController } from "@scrum/api/modules/task/task.controller";
import { TaskService } from "@scrum/api/modules/task/task.service";
import { TaskSchema } from "@scrum/shared/schemas/task.schema";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: "Task", schema: TaskSchema }]),
    forwardRef(() => BoardModule),
    FileModule
  ],
  controllers: [TaskController],
  providers: [TaskService],
  exports: [TaskService]
})
export class TaskModule {}
