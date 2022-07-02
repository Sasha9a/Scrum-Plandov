import { forwardRef, Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { BoardModule } from "@scrum/api/modules/board/board.module";
import { SprintController } from "@scrum/api/modules/sprint/sprint.controller";
import { SprintService } from "@scrum/api/modules/sprint/sprint.service";
import { TaskModule } from "@scrum/api/modules/task/task.module";
import { SprintSchema } from "@scrum/shared/schemas/sprint.schema";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: "Sprint", schema: SprintSchema }]),
    forwardRef(() => BoardModule),
    TaskModule
  ],
  controllers: [SprintController],
  providers: [SprintService],
  exports: [SprintService]
})
export class SprintModule {}
