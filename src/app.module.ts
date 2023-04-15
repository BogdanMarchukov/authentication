import { Module } from '@nestjs/common';
import configuration from './config/configuration';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
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
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
