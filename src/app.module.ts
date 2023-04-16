import { Module } from '@nestjs/common';
import configuration from './config/configuration';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { JwtModule } from '@nestjs/jwt';
import { readFileSync } from 'fs';
import { join } from 'path';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { User } from './models/User.model';
import { StorageModule } from './modules/storage/storage.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    JwtModule.register({
      global: true,
      privateKey: readFileSync(
        join(__dirname, '../', 'secret', 'jwtRS256.key'),
      ),
      publicKey: readFileSync(
        join(__dirname, '../', 'secret', 'jwtRS256.key.pub'),
      ),
      signOptions: { expiresIn: '24h', algorithm: 'RS256' },
    }),
    SequelizeModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        dialect: configService.get('database.dialect') || 'postgres',
        host: configService.get('database.host') || '127.0.0.1',
        port: +configService.get('database.port') || 5433,
        username: configService.get('database.userName') || 'postgres',
        password: configService.get('database.password') || 'mysecretpassword',
        database: configService.get('database.database') || 'postgres',
        models: [User],
      }),
      inject: [ConfigService],
    }),
    UserModule,
    AuthModule,
    StorageModule,
  ],
})
export class AppModule {}
