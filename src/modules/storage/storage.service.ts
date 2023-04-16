import { Injectable } from '@nestjs/common';
import { createClient } from 'redis';

export enum TokenType {
  Access = 'access',
  Refresh = 'refresh',
}
@Injectable()
export class StorageService {
  public client = createClient();

  async onModuleInit() {
    await this.client.connect();
  }

  async setToken(userId: string, token: string, type: TokenType) {
    return this.client.set(`${type}_${userId}`, token);
  }

  async getToken(userId: string, token: string, type: TokenType) {
    return this.client.get(`${type}_${userId}`);
  }
}
