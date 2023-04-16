import { Injectable, Logger } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { User } from '../../models/User.model';

type UserCredential = {
  login: string;
  password: string;
  firstName?: string;
  lastName?: string;
};
@Injectable()
export class UserService {
  constructor(private readonly authService: AuthService) {}
  private readonly logger = new Logger(UserService.name);
  async createUser(userCredential: UserCredential) {
    const { login, password, firstName, lastName } = userCredential;
    const existUser = await User.findOne({ where: { login } });
    if (existUser) {
      return {
        user: existUser,
        isNewUser: false,
      };
    }

    const passwordHash = this.authService.getHash(password);
    const newUser = await User.create({
      login,
      password: passwordHash,
      firstName,
      lastName,
    });

    this.logger.log(`Create new user ${newUser.login} is success`);

    return {
      user: newUser,
      isNewUser: true,
    };
  }
}
