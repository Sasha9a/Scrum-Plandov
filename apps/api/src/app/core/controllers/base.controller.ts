import { PreconditionFailedException } from "@nestjs/common";
import { plainToInstance } from "class-transformer";
import { validateSync } from "class-validator";

export class BaseController {

  protected validate<T>(data: any, dto: any): T {
    const result: any = plainToInstance(dto, data);

    const errors = validateSync(result);

    if (errors.length > 0) {
      throw new PreconditionFailedException(errors);
    }

    return result;
  }

}
