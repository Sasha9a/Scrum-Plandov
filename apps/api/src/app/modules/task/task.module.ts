import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { BoardModule } from "@scrum/api/modules/board/board.module";
import { TaskController } from "@scrum/api/modules/task/task.controller";
import { TaskService } from "@scrum/api/modules/task/task.service";
import { TaskSchema } from "@scrum/shared/schemas/task.schema";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: "Task", schema: TaskSchema }]),
    BoardModule
  ],
  controllers: [TaskController],
  providers: [TaskService],
  exports: [TaskService]
})
export class TaskModule {}
