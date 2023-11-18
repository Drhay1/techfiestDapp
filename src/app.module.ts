import { join } from 'path';
import * as winston from 'winston';
import { AppService } from './app.service';
import { AppController } from './app.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from '@nestjs/schedule';
import { ErrorFilter } from './filters/error.filter';
import { Web3Module } from './modules/web3/web3.module';
import { MailModule } from './modules/mail/mail.module';
import { UserModule } from './modules/user/user.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Web3Controller } from './modules/web3/web3.controller';
import { CompanyModule } from './modules/company/company.module';
import { Logger, MiddlewareConsumer, Module } from '@nestjs/common';
import { ErrorInterceptor } from './interceptors/error.interceptor';
import { HackathonModule } from './modules/hackathon/hackathon.module';
import { RequestLoggerMiddleware } from './utils/request-logger.middleware';
import { SubmissionsModule } from './modules/submissions/submissions.module';
import { ParticipantsModule } from './modules/participants/participants.module';
import {
  utilities as nestWinstonModuleUtilities,
  WinstonModule,
} from 'nest-winston';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'client/dist'),
      exclude: ['/api*'],
    }),
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRootAsync({
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get('DB_URI'),
      }),
      inject: [ConfigService],
    }),
    WinstonModule.forRoot({
      transports: [
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.ms(),
            nestWinstonModuleUtilities.format.nestLike('MyApp', {
              colors: true,
              prettyPrint: true,
            }),
          ),
        }),
      ],
    }),
    UserModule,
    CompanyModule,
    HackathonModule,
    Web3Module,
    ParticipantsModule,
    SubmissionsModule,
    MailModule,
  ],
  controllers: [AppController, Web3Controller],
  providers: [
    AppService,
    Logger,
    {
      provide: APP_INTERCEPTOR,
      useClass: ErrorInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: ErrorFilter,
    },
  ],
})
export class AppModule {
  constructor() {}

  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestLoggerMiddleware).forRoutes('*');
  }
}
