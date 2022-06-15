import { Injectable, NestMiddleware } from "@nestjs/common";
import { UserService } from "@scrum/api/modules/user/user.service";
import { User } from "@scrum/shared/schemas/user.schema";
import { NextFunction, Request, Response } from "express";
import moment from "moment-timezone";

@Injectable()
export class LoggerMiddleware implements NestMiddleware {

  public constructor(private readonly userService: UserService) {
  }

  public async use(req: Request, res: Response, next: NextFunction): Promise<void> {
    let user: User = null;
    if (req.headers.authorization) {
      user = await this.userService.findByToken(req.headers.authorization.replace("Bearer ", ""));
    } else if (req.query.token) {
      user = await this.userService.findByToken(req.query.token as string);
    }
    if (user) {
      user.lastEntranceDate = moment().toDate();
      await user.save();
    }
    let result = `--> [${moment().format('HH:mm:ss DD.MM.YYYY')}][${req.method} ${req.url} ${JSON.stringify(req.query)}] (USER ${JSON.stringify(user)})`;
    result = result.concat(` ${JSON.stringify(req.body)}`);
    console.log('\x1b[90m%s\x1b[0m', result);
    next();
  }

}
