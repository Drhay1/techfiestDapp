import { join } from 'path';
import { MailService } from './mail.service';
import { ConfigService } from '@nestjs/config';
import { Global, Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';

@Global()
@Module({
  imports: [
    MailerModule.forRootAsync({
      useFactory: async (configService: ConfigService) => ({
        transport: {
          secure: false,
          host: configService.get('SENDGRID_HOST'),
          auth: {
            user: configService.get('SENDGRID_USER'),
            pass: configService.get('SENDGRID_API_KEY'),
          },
        },
        defaults: {
          from: `"techFiesta" <${configService.get('SENDGRID_FROM_EMAIL')}>`,
        },
        template: {
          dir: join(__dirname, '..', '../src/modules/mail/templates'),
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
