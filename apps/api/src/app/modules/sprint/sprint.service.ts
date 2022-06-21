import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { BaseService } from "@scrum/api/core/services/base.service";
import { Sprint } from "@scrum/shared/schemas/sprint.schema";
import { Model } from "mongoose";

@Injectable()
export class SprintService extends BaseService<Sprint> {

  public constructor(@InjectModel(Sprint.name) private readonly sprintModel: Model<Sprint>) {
    super(sprintModel);
  }

}
