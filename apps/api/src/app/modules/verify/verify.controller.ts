import { Controller, Delete, Get, HttpStatus, NotFoundException, Param, Res } from "@nestjs/common";
import { ValidateObjectId } from "@scrum/api/core/pipes/validate.object.id.pipes";
import { VerifyService } from "@scrum/api/modules/verify/verify.service";
import { Response } from "express";

@Controller('verify')
export class VerifyController {

  public constructor(private readonly verifyService: VerifyService) {
  }

  @Get(':path')
  public async findByPath(@Res() res: Response, @Param('path') path: string) {
    const verifyObject = await this.verifyService.findByPath(path);
    return res.status(HttpStatus.OK).json(verifyObject).end();
  }

  @Delete(':id')
  public async deleteById(@Res() res: Response, @Param('id', new ValidateObjectId()) id: string) {
    const entity = await this.verifyService.delete(id);
    if (!entity) {
      throw new NotFoundException("Нет такого объекта!");
    }
    return res.status(HttpStatus.OK).end();
  }

}
