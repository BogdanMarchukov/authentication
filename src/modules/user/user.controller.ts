import {
  Body,
  ConflictException,
  Controller,
  Post,
  UseGuards,
  ValidationPipe,
  Request,
} from '@nestjs/common';
import { UserDto } from './user.dto';
import { UserService } from './user.service';
import { AuthService } from '../auth/auth.service';
import { Sequelize } from 'sequelize-typescript';
import { AuthGuard } from '../auth/auth.guard';
import { User } from '../../models/User.model';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
    private sequelize: Sequelize,
  ) {}
  @Post('create')
  async createNewUser(@Body(new ValidationPipe()) userDto: UserDto) {
    const transaction = await this.sequelize.transaction();
    try {
      const { user, isNewUser } = await this.userService.createUser(
        userDto,
        transaction,
      );
      if (!isNewUser) {
        throw new ConflictException(`${userDto.login} already exist`);
      }
      const result = await this.authService.signIn(
        user.login,
        userDto.password,
        transaction,
      );
      await transaction.commit();
      return result;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
  @UseGuards(AuthGuard)
  @Post('info')
  async userInfo(@Request() req) {
    const { user }: { user: User } = req;
    const { login, lastName, id, firstName } = user;
    return {
      login,
      lastName,
      id,
      firstName,
    };
  }
}
