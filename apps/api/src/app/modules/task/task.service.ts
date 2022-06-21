import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { BaseService } from "@scrum/api/core/services/base.service";
import { Task } from "@scrum/shared/schemas/task.schema";
import { Model } from "mongoose";

@Injectable()
export class TaskService extends BaseService<Task> {

  public constructor(@InjectModel(Task.name) private readonly taskModel: Model<Task>) {
    super(taskModel);
  }

}
