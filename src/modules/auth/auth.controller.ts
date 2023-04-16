import { Body, Controller, Post, ValidationPipe } from '@nestjs/common';
import { UserDto } from '../user/user.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('login')
  login(@Body(new ValidationPipe()) userDto: UserDto) {
    return this.authService.signIn(userDto.login, userDto.password);
  }
}
