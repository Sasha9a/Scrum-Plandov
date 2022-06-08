import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { FileDto } from "@scrum/shared/dtos/file.dto";
import { Model } from "mongoose";

@Injectable()
export class FileService {

  public constructor(@InjectModel("File") private readonly fileModel: Model<File>) {
  }

  public async upload(file: FileDto): Promise<File> {
    const uploadFile = new this.fileModel(file);
    return uploadFile.save();
  }

  public async deleteFile(path: string): Promise<FileDto> {
    return await this.fileModel.findOneAndDelete<FileDto>({ path: path }).exec();
  }
}
