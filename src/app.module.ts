import { Module } from '@nestjs/common';
import configuration from './config/configuration';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { JwtModule } from '@nestjs/jwt';
import { readFileSync } from 'fs';
import { join } from 'path';
import { UserModule } from './user/user.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    JwtModule.register({
      global: true,
      privateKey: readFileSync(join(__dirname, '../', 'secret', 'auth')),
      publicKey: readFileSync(join(__dirname, '../', 'secret', 'auth.pub')),
      signOptions: { expiresIn: '24h' },
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
        models: [],
      }),
      inject: [ConfigService],
    }),
    UserModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
