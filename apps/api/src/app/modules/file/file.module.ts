import { MongooseModule } from "@nestjs/mongoose";
import { FileController } from "@scrum/api/modules/file/file.controller";
import { FileService } from "@scrum/api/modules/file/file.service";
import { FileSchema } from "@scrum/shared/schemas/file.schema";
import { Module } from "@nestjs/common";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: "File", schema: FileSchema }])
  ],
  controllers: [FileController],
  providers: [FileService],
  exports: [FileService]
})
export class FileModule {}
