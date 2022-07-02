import { forwardRef, Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { BoardController } from "@scrum/api/modules/board/board.controller";
import { BoardService } from "@scrum/api/modules/board/board.service";
import { ColumnBoardModule } from "@scrum/api/modules/column-board/column-board.module";
import { UserModule } from "@scrum/api/modules/user/user.module";
import { BoardSchema } from "@scrum/shared/schemas/board.schema";
import { TaskModule } from "@scrum/api/modules/task/task.module";
import { SprintModule } from "@scrum/api/modules/sprint/sprint.module";
import { FileModule } from "@scrum/api/modules/file/file.module";
import { JobRecordModule } from "@scrum/api/modules/job-record/job.record.module";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: "Board", schema: BoardSchema }]),
    UserModule,
    ColumnBoardModule,
    FileModule,
    forwardRef(() => TaskModule),
    forwardRef(() => SprintModule),
    forwardRef(() => JobRecordModule)
  ],
  controllers: [BoardController],
  providers: [BoardService],
  exports: [BoardService]
})
export class BoardModule {}
