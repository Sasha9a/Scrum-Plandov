import { Body, Controller, Get, HttpStatus, NotFoundException, Param, Post, Put, Query, Res, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "@scrum/api/core/guards/jwt-auth.guard";
import { ValidateObjectId } from "@scrum/api/core/pipes/validate.object.id.pipes";
import { AuthService } from "@scrum/api/modules/user/auth.service";
import { UserService } from "@scrum/api/modules/user/user.service";
import { UserCreateFormDto } from "@scrum/shared/dtos/user/user.create.form.dto";
import { UserDto } from "@scrum/shared/dtos/user/user.dto";
import { UserEditFormDto } from "@scrum/shared/dtos/user/user.edit.form.dto";
import { UserLoginFormDto } from "@scrum/shared/dtos/user/user.login.form.dto";
import { Response } from "express";
import * as bcrypt from 'bcrypt';

@Controller('user')
export class UserController {

  public constructor(private readonly userService: UserService,
                     private readonly authService: AuthService) {
  }

  @UseGuards(JwtAuthGuard)
  @Get('/check')
  public async check(@Res() res: Response) {
    return res.status(HttpStatus.NO_CONTENT).end();
  }

  @Get('check-login')
  public async findByLogin(@Res() res: Response, @Query() query: { login: string }) {
    const user = await this.userService.findByLogin(query.login);
    const result: { isBusy: boolean } = {
      isBusy: !!user
    };
    return res.status(HttpStatus.OK).json(result).end();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  public async getUser(@Res() res: Response, @Param('id', new ValidateObjectId()) id: string) {
    const user = await this.userService.findById(id, { password: 0, token: 0 });
    return res.status(HttpStatus.OK).json(user).end();
  }

  @Post()
  public async addUser(@Res() res: Response, @Body() body: UserCreateFormDto) {
    const userFromEmail = await this.userService.findByEmail(body.email);
    if (userFromEmail) {
      throw new NotFoundException("Такой логин уже занят");
    }
    body.password = bcrypt.hashSync(body.password, 10);
    const newUser = await this.userService.create<UserCreateFormDto>(body);
    return res.status(HttpStatus.CREATED).json(newUser).end();
  }

  @Post('/login')
  public async login(@Res() res: Response, @Body() body: UserLoginFormDto) {
    const user = await this.userService.findByEmail(body.email);
    if (!user) {
      throw new NotFoundException("Нет такого аккаунта");
    }
    if (bcrypt.compareSync(body.password, user.password)) {
      const token = await this.authService.login(user);
      const login: Partial<UserDto> = {
        _id: user._id,
        email: user.email,
        registerDate: user.registerDate,
        lastEntranceDate: user.lastEntranceDate,
        login: user.login,
        roles: user.roles,
        token: token.accessToken,
        avatar: user.avatar,
        name: user.name
      };
      await this.userService.setToken(user._id, token.accessToken);
      return res.status(HttpStatus.OK).json(login).end();
    }
    throw new NotFoundException("Неверный пароль");
  }

  @UseGuards(JwtAuthGuard)
  @Post('/logout')
  public async logout(@Res() res: Response, @Body() body: Partial<UserDto>) {
    await this.userService.logout(body._id);
    return res.status(HttpStatus.OK).end();
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  public async update(@Res() res: Response, @Param('id', new ValidateObjectId()) id: string, @Body() body: UserEditFormDto) {
    const entity = await this.userService.update(id, body);
    if (!entity) {
      throw new NotFoundException("Нет такого объекта!");
    }
    return res.status(HttpStatus.OK).json(entity).end();
  }

}
