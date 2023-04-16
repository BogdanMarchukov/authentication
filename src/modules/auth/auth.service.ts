import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  getHash(inputString: string) {
    return bcrypt.hashSync(inputString, 3);
  }
}
