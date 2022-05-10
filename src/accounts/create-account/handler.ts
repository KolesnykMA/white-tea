import bcrypt from 'bcrypt';
import type {APIGatewayProxyEvent} from 'aws-lambda';
import {ulid} from 'ulid';
import createHttpError from 'http-errors';
import middy from '@middy/core';
import jsonBodyParser from '@middy/http-json-body-parser';
import validator from '@middy/validator';
import httpErrorHandler from '@middy/http-error-handler';
import prisma from '../../../libs/dal/client/client';
import logger from '../../../libs/logger/logger';
import {signToken} from '../../auth/login/service';
import inputSchema from './schema';

type Request = APIGatewayProxyEvent & {
  body: {
    name: string;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  };
};

const createAccountHandler = async (event: Request) => {
  const {name, email, password, firstName, lastName} = event.body;
  logger.info(`Received input`, {body: event.body});

  const existingUser = await prisma.user.findUnique({where: {email}});
  logger.info(`Fetched user by email`);

  if (existingUser) {
    throw createHttpError(409, `User with email already exists`);
  }

  const accountId = ulid();
  const userId = ulid();
  const role = 'owner';

  const passwordHash: string = await bcrypt.hash(password, 13);
  logger.info(`Created password`);

  const account = await prisma.account.create({
    data: {
      id: accountId,
      name,
      email,
      createdAt: new Date().toISOString(),
      users: {
        create: {
          id: userId,
          email,
          passwordHash,
          firstName,
          lastName,
          role,
          createdAt: new Date().toISOString(),
        },
      },
    },
  });
  logger.info(`Created account with related owner user`);

  const token = await signToken({accountId, userId, role});
  logger.info(`Created token`);

  return {
    statusCode: 200,
    body: JSON.stringify({account, token}),
  };
};

export const handler = middy(createAccountHandler)
  .use(jsonBodyParser())
  .use(
    validator({
      inputSchema,
    })
  )
  .use(httpErrorHandler());
