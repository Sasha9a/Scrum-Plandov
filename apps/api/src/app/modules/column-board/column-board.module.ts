import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { ColumnBoardService } from "@scrum/api/modules/column-board/column-board.service";
import { ColumnBoardSchema } from "@scrum/shared/schemas/column.board.schema";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: "ColumnBoard", schema: ColumnBoardSchema }])
  ],
  providers: [ColumnBoardService],
  exports: [ColumnBoardService]
})
export class ColumnBoardModule {}
