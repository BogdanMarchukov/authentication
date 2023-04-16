import {
  Body,
  ConflictException,
  Controller,
  Post,
  ValidationPipe,
} from '@nestjs/common';
import { UserDto } from './user.dto';
import { UserService } from './user.service';
import { AuthService } from '../auth/auth.service';
import { Sequelize } from 'sequelize-typescript';

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
      return await this.authService.signIn(
        user.login,
        userDto.password,
        transaction,
      );
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
}
