import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { User } from '../../models/User.model';
import { JwtService } from '@nestjs/jwt';
import { Transaction } from 'sequelize';
import { StorageService, TokenType } from '../storage/storage.service';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private readonly storageService: StorageService,
  ) {}
  getHash(inputString: string) {
    return bcrypt.hashSync(inputString, 2);
  }

  async signIn(login: string, password: string, transaction?: Transaction) {
    const user = await User.findOne({
      where: { login },
      transaction,
    });

    if (!bcrypt.compareSync(password, user.password)) {
      throw new UnauthorizedException();
    }

    const payload = { id: user.id };
    const accessToken = await this.jwtService.signAsync(payload, {
      algorithm: 'RS256',
      expiresIn: '1h',
    });
    const refreshToken = await this.jwtService.signAsync(payload, {
      algorithm: 'RS256',
      expiresIn: '3d',
    });

    await Promise.all([
      this.storageService.setToken(user.id, accessToken, TokenType.Access),
      this.storageService.setToken(user.id, refreshToken, TokenType.Refresh),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }
}
