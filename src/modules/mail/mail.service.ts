import { join } from 'path';
import moment from 'moment';
import sgMail from '@sendgrid/mail';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { supportedTokens } from '@/utils/constants';
import { ISendMailOptions, MailerService } from '@nestjs-modules/mailer';
import { AuthProps, UserProps } from '../user/interfaces/user.interfaces';

export const emailIconsPath = join(
  __dirname,
  '../../../src/modules/mail/attachments',
);

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export const emailAttachments = [
  {
    filename: 'techfiesta_logo.png',
    path: `${emailIconsPath}/techfiesta_logo.png`,
    cid: 'companyLogo',
  },
  {
    filename: 'twitterIcon.png',
    path: `${emailIconsPath}/twitterIcon.png`,
    cid: 'twitterLogo',
  },
  {
    filename: 'discordIcon.png',
    path: `${emailIconsPath}/discordIcon.png`,
    cid: 'discordLogo',
  },
  {
    filename: 'telegramIcon.png',
    path: `${emailIconsPath}/telegramIcon.png`,
    cid: 'telegramLogo',
  },
  {
    filename: 'linkedInLogo.png',
    path: `${emailIconsPath}/linkedInLogo.png`,
    cid: 'linkedInLogo',
  },
  {
    filename: 'hashNodeLogo.png',
    path: `${emailIconsPath}/hashNodeLogo.png`,
    cid: 'hashNodeLogo',
  },
  {
    filename: 'youtubeLogo.png',
    path: `${emailIconsPath}/youtubeLogo.png`,
    cid: 'youtubeLogo',
  },
];

@Injectable()
export class MailService {
  constructor(
    private mailerService: MailerService,
    private configService: ConfigService,
  ) {}

  async sendUserVerificationEmail(
    user: UserProps,
    emailToken: string,
  ): Promise<void> {
    const url = `${this.configService.get(
      'SERVER_URL',
    )}/user/verify-account/${emailToken}`;

    const confirmationTemplate = {
      from: process.env.SENDGRID_FROM_EMAIL,
      subject: 'Verify Your Email Address For techFiesta',
      context: {
        url: url,
      },
      attachments: [...emailAttachments],
    };

    const msg = {
      to: user.email,
      ...confirmationTemplate,
    };

    await this.sendEmailVerificationMail(msg);
  }

  async sendClientVerificationEmail(
    emailToken: number,
    email: string,
  ): Promise<any> {
    const url = `${this.configService.get(
      'SERVER_URL',
    )}/user/verify-account/${emailToken}`;

    const confirmationTemplate = {
      from: process.env.SENDGRID_FROM_EMAIL,
      subject: 'Verify Your Email Address For techFiesta',
      context: {
        url: url,
      },
      attachments: [...emailAttachments],
    };

    const msg = {
      to: email,
      ...confirmationTemplate,
    };

    await this.sendEmailVerificationMail(msg);
  }

  async sendEmailVerificationMail(options: ISendMailOptions): Promise<void> {
    try {
      return await this.mailerService.sendMail({
        to: options.to,
        subject: options.subject,
        text: options.text,
        template: 'emailVerification',
        context: options.context,
        attachments: options.attachments,
      });
    } catch (error) {
      throw new Error(error);
    }
  }

  async sendForgotPasswordEmail(
    email: string,
    emailToken: string,
  ): Promise<void> {
    const url = `${this.configService.get(
      'SERVER_URL',
    )}/user/reset-password?code=${emailToken}`;

    const confirmationTemplate = {
      from: process.env.SENDGRID_FROM_EMAIL,
      subject: '[techFiesta] Password Reset Request',
      context: {
        email: email,
        url: url,
      },
      attachments: [...emailAttachments],
    };

    const msg = {
      to: email,
      ...confirmationTemplate,
    };

    await this.sendUpdatePasswordMail(msg);
  }

  async sendUpdatePasswordMail(options: ISendMailOptions): Promise<void> {
    try {
      return await this.mailerService.sendMail({
        to: options.to,
        subject: options.subject,
        text: options.text,
        template: 'updatePassword',
        context: options.context,
        attachments: options.attachments,
      });
    } catch (error) {
      throw new Error(error);
    }
  }

  async sendUsersPublishedHackathon(
    hackathon: any,
    users: UserProps[],
    url: string,
  ): Promise<any> {
    const {
      hackathonName,
      totalRewardinUsd,
      startDate,
      submissionDeadline,
      endDate,
      company: { companyName },
      rewardTokenAddress,
    } = hackathon;

    const token = supportedTokens.find(
      (tk) => tk.address === rewardTokenAddress,
    );

    const convertToUTC = (date: Date) => {
      const isUtc = date.toISOString().endsWith('Z');
      const utcDateTime = isUtc ? moment.utc(date) : moment.utc(date + 'Z');

      const formatDate = utcDateTime.format('MMMM Do, YYYY HH:mm [UTC]');

      return formatDate;
    };

    //different email subjects
    const subjectTemplates: string[] = [
      `Unleash Your Creativity! Join ${hackathonName} with ${totalRewardinUsd} ${token.symbol} in Prizes!`,
      `Calling All Innovators! Kicking off ${hackathonName} with ${totalRewardinUsd} ${token.symbol} in Prizes!`,
      `You're Invited to ${hackathonName}: Win ${totalRewardinUsd} ${token.symbol}  in Prizes!`,
    ];

    //Select a random subject template
    const generateSubject = () => {
      const randomIndex = Math.floor(Math.random() * subjectTemplates.length);
      return subjectTemplates[randomIndex];
    };

    const confirmationTemplate = {
      from: process.env.SENDGRID_FROM_EMAIL,
      subject: generateSubject(),
      context: {
        url: url,
        hackathonName: hackathonName,
        totalRewardinUsd: totalRewardinUsd,
        startDate: convertToUTC(startDate),
        submissionDeadline: convertToUTC(submissionDeadline),
        endDate: convertToUTC(endDate),
        companyName: companyName,
      },
      attachments: [...emailAttachments],
    };

    const usersEmail = users.map((user) => user.email);

    await this.notifyUsersEmailOnHackathonPublished(
      confirmationTemplate,
      usersEmail,
    );
  }

  async notifyUsersEmailOnHackathonPublished(
    options: ISendMailOptions,
    recipients: string[],
  ): Promise<void> {
    try {
      const emailsPromises = recipients.map((recipient) => {
        return this.mailerService.sendMail({
          to: recipient,
          subject: options.subject,
          text: options.text,
          template: 'usersEmailOnHackathonPublished',
          context: options.context,
          attachments: options.attachments,
        });
      });
      await Promise.all(emailsPromises);
    } catch (error) {
      throw new Error(error);
    }
  }

  async notifyEmailOnHackathonRegister(
    options: ISendMailOptions,
  ): Promise<void> {}

  async notifyEmailOnSubmission(options: ISendMailOptions): Promise<void> {
    try {
      return await this.mailerService.sendMail({
        to: options.to,
        subject: options.subject,
        text: options.text,
        template: 'userSubmissionReceived',
        context: options.context,
        attachments: options.attachments,
      });
    } catch (error) {
      throw new Error(error);
    }
  }

  async sendInviteUsersEmail(createdUsers: AuthProps[]): Promise<any> {
    const url = `${this.configService.get('CLIENT_URL')}/login`;

    const confirmationTemplate = {
      from: process.env.SENDGRID_FROM_EMAIL,
      subject: 'Welcome to techFiesta!',
      context: {
        email: '',
        password: '',
        url: url,
      },
      attachments: [...emailAttachments],
    };

    await this.notifyUsersEmailOnInviteUsers(
      confirmationTemplate,
      createdUsers,
    );
  }

  async notifyUsersEmailOnInviteUsers(
    options: ISendMailOptions,
    createdUsers: AuthProps[],
  ): Promise<void> {
    try {
      const emailsPromises = createdUsers.map((createdUser) => {
        const context = {
          email: createdUser.email,
          password: createdUser.password,
          url: options.context.url,
        };

        return this.mailerService.sendMail({
          to: createdUser.email,
          subject: options.subject,
          text: options.text,
          template: 'inviteUsers',
          context: context,
          attachments: options.attachments,
        });
      });
      await Promise.all(emailsPromises);
    } catch (error) {
      throw new Error(error);
    }
  }
}
