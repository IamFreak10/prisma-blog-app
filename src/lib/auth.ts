import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { prisma } from './prisma';
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});
export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: 'postgresql',
  }),
  trustedOrigins: [process.env.APP_URL || 'http://localhost:3000'],
  user: {
    additionalFields: {
      role: {
        type: 'string',
        defaultValue: 'USER',
        required: false,
      },
      phone: {
        type: 'string',
        required: false,
      },
      status: {
        type: 'string',
        defaultValue: 'ACTIVE',
        required: false,
      },
    },
  },
  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
    requireEmailVerification: true,
  },
  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user, url, token }, request) => {
      try {
        const info = await transporter.sendMail({
          from: process.env.SMTP_FROM,
          to: user.email,
          subject: 'Please verify your email',
          text: `Please click the link to verify your email: ${url}?token=${token}`,
        });
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
      } catch (error) {
        console.log('Error:', error);
      }
    },
  },
});
