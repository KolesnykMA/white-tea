import type {APIGatewayProxyEvent} from 'aws-lambda';
import middy from '@middy/core';
import jsonBodyParser from '@middy/http-json-body-parser';
import validator from '@middy/validator';
import httpErrorHandler from '@middy/http-error-handler';
import prisma from '../../../libs/dal/client/client';
import logger, {setDefaultLoggerMeta} from '../../../libs/logger/logger';
import inputSchema from './schema';
import {validate} from './validate';

type Request = APIGatewayProxyEvent & {
  body: {
    name: string;
  };
};

const updateAccountHandler = async (event: Request) => {
  const {accountId, userId, role} = event.requestContext.authorizer;
  setDefaultLoggerMeta({accountId, userId, role});

  const {name} = event.body;
  logger.info(`Received input`, {body: event.body});

  await validate(userId);

  const account = await prisma.account.update({
    where: {
      id: 'viola@prisma.io',
    },
    data: {
      name,
    },
  });
  logger.info(`Updated account`);

  return {
    statusCode: 200,
    body: JSON.stringify({account}),
  };
};

export const handler = middy(updateAccountHandler)
  .use(jsonBodyParser())
  .use(
    validator({
      inputSchema,
    })
  )
  .use(httpErrorHandler());
