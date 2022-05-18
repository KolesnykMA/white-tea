import type {APIGatewayProxyEvent} from 'aws-lambda';
import createHttpError from 'http-errors';
import middy from '@middy/core';
import jsonBodyParser from '@middy/http-json-body-parser';
import validator from '@middy/validator';
import httpErrorHandler from '@middy/http-error-handler';
import prisma from '../../../libs/dal/client/client';
import logger from '../../../libs/logger/logger';
import {signToken} from '../../../libs/auth/jwt';
import inputSchema from './schema';
import {verifyPasswordHash} from '../../../libs/auth/password-hasher';

type Request = APIGatewayProxyEvent & {
  body: {
    email: string;
    password: string;
  };
};

const loginHandler = async (event: Request) => {
  const {email, password} = event.body;
  logger.info(`Received input`, {body: event.body});
  const user = await prisma.user.findUnique({where: {email: email}});

  if (!user) {
    throw createHttpError(401, 'Invalid credentials');
  }

  if (!(await verifyPasswordHash(password, user.passwordHash))) {
    throw createHttpError(401, 'Invalid credentials');
  }

  const token = await signToken(
    {accountId: user.accountId, userId: user.id, role: user.role},
    process.env.JWT_SECRET
  );
  logger.info(`Created token`);

  return {
    statusCode: 200,
    body: JSON.stringify({token}),
  };
};
export const handler = middy(loginHandler)
  .use(jsonBodyParser())
  .use(
    validator({
      inputSchema,
    })
  )
  .use(httpErrorHandler());
