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

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Post('create')
  async createNewUser(@Body(new ValidationPipe()) userDto: UserDto) {
    const { user, isNewUser } = await this.userService.createUser(userDto);
    if (!isNewUser) {
      throw new ConflictException(`${userDto.login} already exist`);
    }
    return {
      id: user.id,
    };
  }
}
