import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { BoardController } from "@scrum/api/modules/board/board.controller";
import { BoardService } from "@scrum/api/modules/board/board.service";
import { ColumnBoardModule } from "@scrum/api/modules/column-board/column-board.module";
import { UserModule } from "@scrum/api/modules/user/user.module";
import { BoardSchema } from "@scrum/shared/schemas/board.schema";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: "Board", schema: BoardSchema }]),
    UserModule,
    ColumnBoardModule
  ],
  controllers: [BoardController],
  providers: [BoardService],
  exports: [BoardService]
})
export class BoardModule {}
