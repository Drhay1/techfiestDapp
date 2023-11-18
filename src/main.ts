import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { ValidationPipe } from '@nestjs/common';
import { WinstonModule } from 'nest-winston';
import { transports, format } from 'winston';
import 'winston-daily-rotate-file';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: WinstonModule.createLogger({
      transports: [
        new transports.DailyRotateFile({
          filename: `logs/%DATE%-error.log`,
          level: 'error',
          format: format.combine(format.timestamp(), format.json()),
          datePattern: 'YYYY-MM-DD',
          zippedArchive: false,
          maxFiles: '30d',
        }),
        new transports.DailyRotateFile({
          filename: `logs/%DATE%-combined.log`,
          format: format.combine(format.timestamp(), format.json()),
          datePattern: 'YYYY-MM-DD',
          zippedArchive: false,
          maxFiles: '30d',
        }),
        new transports.Console({
          format: format.combine(
            format.cli(),
            format.splat(),
            format.timestamp(),
            format.printf((info) => {
              return `${info.timestamp} ${info.level}: ${info.message}`;
            }),
          ),
        }),
      ],
    }),
  });

  const swaggerConfig = new DocumentBuilder()
    .setTitle(process.env.APP_NAME)
    .setDescription(process.env.APP_DESCRIPTION)
    .setVersion(process.env.API_VERSION)
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig, {
    ignoreGlobalPrefix: false,
  });

  try {
    SwaggerModule.setup('api', app, document);
  } catch (error) {
    this.logger.error(error);
  }
  const allowed =
    process.env.NODE_ENV === 'development'
      ? 'http://localhost:5173'
      : 'https://techfiesta.dev';

  // app.enableCors({ origin: [allowed] });
  app.enableCors();

  app.useStaticAssets(join(__dirname, '../client/dist'));

  app.useGlobalPipes(new ValidationPipe());

  await app.listen(
    process.env.APP_SERVER_LISTEN_PORT,
    process.env.APP_SERVER_LISTEN_IP,
  );

  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
