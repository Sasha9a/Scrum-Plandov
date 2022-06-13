import { Controller, Delete, forwardRef, Get, HttpStatus, Inject, NotFoundException, Param, Res } from "@nestjs/common";
import { UserService } from "@scrum/api/modules/user/user.service";
import { VerifyService } from "@scrum/api/modules/verify/verify.service";
import { UserDto } from "@scrum/shared/dtos/user/user.dto";
import { VerifyEmailTypeEnum } from "@scrum/shared/enums/verify.email.type.enum";
import { Response } from "express";

@Controller('verify')
export class VerifyController {

  public constructor(private readonly verifyService: VerifyService,
                     @Inject(forwardRef(() => UserService))
                     private readonly userService: UserService) {
  }

  @Get(':path')
  public async findByPath(@Res() res: Response, @Param('path') path: string) {
    let verifyObject = await this.verifyService.findByPath(path);
    if (verifyObject?.type === VerifyEmailTypeEnum.REGISTER) {
      const user = await this.userService.findByEmail(verifyObject?.email);
      if (!user) {
        verifyObject = null;
      }
    }
    return res.status(HttpStatus.OK).json(verifyObject).end();
  }

  @Delete(':id')
  public async deleteById(@Res() res: Response, @Param('id') id: string) {
    const entity = await this.verifyService.delete(id);
    if (!entity) {
      throw new NotFoundException("Нет такого объекта!");
    }
    if (entity.type === VerifyEmailTypeEnum.REGISTER) {
      const user = await this.userService.findByEmail(entity.email);
      if (user) {
        await this.userService.update<Partial<UserDto>>(user._id, { isValidatedEmail: true });
      }
    }
    return res.status(HttpStatus.OK).end();
  }

}
