import type {APIGatewayProxyEventBase} from 'aws-lambda';
import {ulid} from 'ulid';
import middy from '@middy/core';
import httpErrorHandler from '@middy/http-error-handler';
import jsonBodyParser from '@middy/http-json-body-parser';
import validator from '@middy/validator';
import prisma from '../../../libs/dal/client/client';
import logger, {setDefaultLoggerMeta} from '../../../libs/logger/logger';
import inputSchema from '../../accounts/create-account/schema';
import type {AuthorizerContext} from '../../../libs/types/auth';
import {createPasswordHash} from '../../../libs/auth/password/hasher';
import {validate} from './validate';

type Request = APIGatewayProxyEventBase<AuthorizerContext> & {
  body: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  };
};

const createUserHandler = async (event: Request) => {
  const {accountId, userId, role} = event.requestContext.authorizer;
  setDefaultLoggerMeta({accountId, userId, role});

  const {email, password, firstName, lastName} = event.body;
  logger.info(`Received input`, {body: event.body});

  await validate(email, accountId);

  const [user] = await Promise.all([
    prisma.user.create({
      data: {
        id: ulid(),
        account: {connect: {id: accountId}},
        email,
        passwordHash: await createPasswordHash(password),
        firstName,
        lastName,
        role,
      },
    }),
    prisma.account.update({
      where: {
        id: accountId,
      },
      data: {
        usersCount: {
          increment: 1,
        },
      },
    }),
  ]);
  logger.info(`Created user and incremented usersCount on account`);

  return {
    statusCode: 200,
    body: JSON.stringify(user),
  };
};

export const handler = middy(createUserHandler)
  .use(jsonBodyParser())
  .use(
    validator({
      inputSchema,
    })
  )
  .use(httpErrorHandler());
