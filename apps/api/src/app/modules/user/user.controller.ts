import { Body, Controller, Get, HttpStatus, NotFoundException, Param, Post, Put, Query, Req, Res, UseGuards } from "@nestjs/common";
import { BaseController } from "@scrum/api/core/controllers/base.controller";
import { JwtAuthGuard } from "@scrum/api/core/guards/jwt-auth.guard";
import sendMail from "@scrum/api/core/services/mail.service";
import { AuthService } from "@scrum/api/modules/user/auth.service";
import { UserService } from "@scrum/api/modules/user/user.service";
import { VerifyService } from "@scrum/api/modules/verify/verify.service";
import { RecoveryFormDto } from "@scrum/shared/dtos/recovery/recovery.form.dto";
import { RecoveryPasswordFormDto } from "@scrum/shared/dtos/recovery/recovery.password.form.dto";
import { UserCreateFormDto } from "@scrum/shared/dtos/user/user.create.form.dto";
import { UserDto } from "@scrum/shared/dtos/user/user.dto";
import { UserEditFormDto } from "@scrum/shared/dtos/user/user.edit.form.dto";
import { UserLoginFormDto } from "@scrum/shared/dtos/user/user.login.form.dto";
import { UserPasswordFormDto } from "@scrum/shared/dtos/user/user.password.form.dto";
import { VerifyCreateDto } from "@scrum/shared/dtos/verify/verify.create.dto";
import { VerifyEmailTypeEnum } from "@scrum/shared/enums/verify.email.type.enum";
import * as bcrypt from "bcrypt";
import { Response, Request } from "express";
import * as uuid from "uuid";
import { environment } from "../../../environments/environment";

@Controller('user')
export class UserController extends BaseController {

  public constructor(private readonly userService: UserService,
                     private readonly authService: AuthService,
                     private readonly verifyService: VerifyService) {
    super();
  }

  @UseGuards(JwtAuthGuard)
  @Get('/check')
  public async check(@Res() res: Response) {
    return res.status(HttpStatus.NO_CONTENT).end();
  }

  @Get('check-email')
  public async findByEmail(@Res() res: Response, @Query() query: { email: string }) {
    const user = await this.userService.findByEmail(query.email);
    const result: { isBusy: boolean } = {
      isBusy: !!user
    };
    return res.status(HttpStatus.OK).json(result).end();
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
  @Get('search')
  public async searchUsers(@Res() res: Response, @Query() query: { q: string }) {
    const entities = await this.userService.findAll({ $or: [ { login: { $regex: query.q } }, { email: { $regex: query.q } } ] }, { password: 0, token: 0 });
    return res.status(HttpStatus.OK).json(entities).end();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  public async getUser(@Res() res: Response, @Param('id') id: string) {
    const user = await this.userService.findById(id, { password: 0, token: 0 });
    return res.status(HttpStatus.OK).json(user).end();
  }

  @Post()
  public async create(@Res() res: Response, @Body() body: UserCreateFormDto) {
    const bodyParams = this.validate<UserCreateFormDto>(body, UserCreateFormDto);

    const userEmail = await this.userService.findByEmail(body.email);
    if (userEmail) {
      throw new NotFoundException("Такая почта уже занята");
    }
    const userLogin = await this.userService.findByLogin(body.login);
    if (userLogin) {
      throw new NotFoundException("Такой логин уже занят");
    }

    const pathVerify = uuid.v4();
    const verify = await this.verifyService.create<VerifyCreateDto>({
      path: pathVerify,
      type: VerifyEmailTypeEnum.REGISTER,
      email: bodyParams.email
    });
    if (!verify) {
      throw new NotFoundException("Произошла ошибка");
    }

    await sendMail({
      to: bodyParams.email,
      subject: 'Регистрация на Grace Scrum',
      html: `
      <div style="display: flex; justify-content: center; text-align: center">
        <div>
          <h3>Добрый день! Вы подали заявку на регистрацию в Grace Scrum</h3>
          <p>Чтобы продолжить регистрацию нажмите на кнопку ниже.</p>
          <div style="margin-top: 1rem">
            <a href="${environment.url}/user/verify/${pathVerify}" target="_blank" style="padding: 0.5rem;border-radius: 10px;border: none;background-color: green;color: white">Подтвердить</a>
          </div>
          <p style="margin-top: 5rem">Если вы не оставляли заявку на регистрацию, то проигнорируйте это письмо</p>
        </div>
      </div>`
    });

    bodyParams.password = bcrypt.hashSync(bodyParams.password, 10);
    const newUser = await this.userService.create<UserCreateFormDto>(bodyParams);
    return res.status(HttpStatus.CREATED).json(newUser).end();
  }

  @Post('/login')
  public async login(@Res() res: Response, @Body() body: UserLoginFormDto) {
    const bodyParams = this.validate<UserLoginFormDto>(body, UserLoginFormDto);

    const user = await this.userService.findByEmail(bodyParams.email);
    if (!user) {
      throw new NotFoundException("Нет такого аккаунта");
    }
    if (bcrypt.compareSync(bodyParams.password, user.password)) {
      if (!user.isValidatedEmail) {
        throw new NotFoundException("Аккаунт не подтвержден");
      }
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

  @Post('/recovery')
  public async recovery(@Res() res: Response, @Body() body: RecoveryFormDto) {
    const bodyParams = this.validate<RecoveryFormDto>(body, RecoveryFormDto);

    const user = await this.userService.findByEmail(bodyParams.email);
    if (!user) {
      throw new NotFoundException("Нет такого аккаунта");
    }

    const pathVerify = uuid.v4();
    const verify = await this.verifyService.create<VerifyCreateDto>({
      path: pathVerify,
      type: VerifyEmailTypeEnum.RECOVERY,
      email: bodyParams.email
    });
    if (!verify) {
      throw new NotFoundException("Произошла ошибка");
    }

    await sendMail({
      to: bodyParams.email,
      subject: 'Восстановление пароля на Grace Scrum',
      html: `
      <div style="display: flex; justify-content: center; text-align: center">
        <div>
          <h3>Добрый день! Вы подали заявку на восстановление пароля в Grace Scrum</h3>
          <p>Чтобы продолжить процесс восстановление пароля нажмите на кнопку ниже.</p>
          <div style="margin-top: 1rem">
            <a href="${environment.url}/user/verify/${pathVerify}" target="_blank" style="padding: 0.5rem;border-radius: 10px;border: none;background-color: green;color: white">Восстановить</a>
          </div>
          <p style="margin-top: 5rem">Если вы не оставляли заявку на восстановление пароля, то проигнорируйте это письмо</p>
        </div>
      </div>`
    });

    return res.status(HttpStatus.OK).end();
  }

  @Post('/recovery-password')
  public async changePasswordRecovery(@Res() res: Response, @Body() body: RecoveryPasswordFormDto) {
    const bodyParams = this.validate<RecoveryPasswordFormDto>(body, RecoveryPasswordFormDto);

    const verify = await this.verifyService.findByPath(bodyParams.path);
    if (!verify) {
      throw new NotFoundException("Ссылка недействительная");
    }

    const user = await this.userService.findByEmail(verify.email);
    if (!user) {
      throw new NotFoundException("Нет пользователя");
    }
    user.password = bcrypt.hashSync(bodyParams.password, 10);
    await user.save();
    return res.status(HttpStatus.OK).end();
  }

  @UseGuards(JwtAuthGuard)
  @Post('/task-change-email')
  public async taskChangeEmail(@Res() res: Response, @Body() body: RecoveryFormDto, @Req() req: Request) {
    const bodyParams = this.validate<RecoveryFormDto>(body, RecoveryFormDto);

    const user: UserDto = req.user as UserDto;
    const pathVerify = uuid.v4();
    const verify = await this.verifyService.create<VerifyCreateDto>({
      path: pathVerify,
      type: VerifyEmailTypeEnum.CHANGE,
      email: bodyParams.email,
      oldEmail: user.email
    });
    if (!verify) {
      throw new NotFoundException("Произошла ошибка");
    }

    await sendMail({
      to: bodyParams.email,
      subject: 'Смена почты на Grace Scrum',
      html: `
      <div style="display: flex; justify-content: center; text-align: center">
        <div>
          <h3>Добрый день! Вы подали заявку на смену почты в Grace Scrum</h3>
          <p>Чтобы продолжить процесс смены почты нажмите на кнопку ниже.</p>
          <div style="margin-top: 1rem">
            <a href="${environment.url}/user/verify/${pathVerify}" target="_blank" style="padding: 0.5rem;border-radius: 10px;border: none;background-color: green;color: white">Сменить</a>
          </div>
          <p style="margin-top: 5rem">Если вы не оставляли заявку на смену почты, то проигнорируйте это письмо</p>
        </div>
      </div>`
    });

    return res.status(HttpStatus.OK).end();
  }

  @Post('/change-email')
  public async changeEmail(@Res() res: Response, @Body() body: { path: string }) {
    const verify = await this.verifyService.findByPath(body.path);
    if (!verify) {
      throw new NotFoundException("Ссылка недействительная");
    }

    const user = await this.userService.findByEmail(verify.oldEmail);
    if (!user) {
      throw new NotFoundException("Нет пользователя");
    }

    const entity = await this.userService.update<Partial<UserDto>>(user._id, { email: verify.email });
    if (!entity) {
      throw new NotFoundException("Нет такого объекта!");
    }
    return res.status(HttpStatus.OK).end();
  }

  @UseGuards(JwtAuthGuard)
  @Post('/change-password')
  public async changePassword(@Res() res: Response, @Body() body: UserPasswordFormDto, @Req() req: Request) {
    const bodyParams = this.validate<UserPasswordFormDto>(body, UserPasswordFormDto);

    const user: UserDto = req.user as UserDto;
    user.password = bcrypt.hashSync(bodyParams.password, 10);
    await this.userService.update<Partial<UserDto>>(user._id, { password: user.password });
    return res.status(HttpStatus.OK).end();
  }

  @UseGuards(JwtAuthGuard)
  @Post('/logout')
  public async logout(@Res() res: Response, @Body() body: Partial<UserDto>) {
    await this.userService.logout(body._id);
    return res.status(HttpStatus.OK).end();
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  public async update(@Res() res: Response, @Param('id') id: string, @Body() body: UserEditFormDto) {
    const bodyParams = this.validate<UserEditFormDto>(body, UserEditFormDto);

    const entity = await this.userService.update(id, bodyParams);
    if (!entity) {
      throw new NotFoundException("Нет такого объекта!");
    }
    return res.status(HttpStatus.OK).json(entity).end();
  }

}
