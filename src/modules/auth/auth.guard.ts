import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { StorageService, TokenType } from '../storage/storage.service';
import { User } from '../../models/User.model';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly authService: AuthService,
    private readonly storageService: StorageService,
  ) {}

  async validateRequest(req) {
    try {
      let token = req.headers['authorization'];
      if (!token) {
        return false;
      }
      token = token.replace(/Bearer /g, '');
      const payload = this.authService.decodeToken(token) as {
        id: string;
        [key: string]: string;
      };

      if (!payload) {
        return false;
      }

      const tokenFromStorage = await this.storageService.getToken(
        payload.id,
        token,
        TokenType.Access,
      );

      if (!tokenFromStorage || tokenFromStorage !== token) {
        return false;
      }

      this.authService.verifyToken(token);
      const user = await User.findByPk(payload.id);
      if (!user) {
        return false;
      }
      req.user = user;

      return true;
    } catch (e) {
      console.log(e);
      return false;
    }
  }
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    return this.validateRequest(request);
  }
}
