import type {APIGatewayProxyEvent} from 'aws-lambda';
import middy from '@middy/core';
import validator from '@middy/validator';
import {ulid} from 'ulid';
import prismaClient from '../../../libs/dal/client/client';
import logger from '../../../libs/logger/logger';
import inputSchema from './schema';

type Request = APIGatewayProxyEvent & {
  body: {
    name: string;
    email: string;
  };
};

const createAccountHandler = async (event: Request) => {
  logger.defaultMeta = {user: 'Kolesnyk'};

  const {name, email} = event.body;

  const id = ulid();
  const account = await prismaClient.account.create({
    data: {
      id,
      name,
      email,
      createdAt: new Date().toISOString(),
    },
  });
  logger.info(`Created account in DDB`);

  return {
    statusCode: 200,
    body: JSON.stringify(account),
  };
};

export const handler = middy(createAccountHandler).use(
  validator({
    inputSchema,
  })
);
