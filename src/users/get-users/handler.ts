import type {APIGatewayProxyEventBase} from 'aws-lambda';
import middy from '@middy/core';
import httpErrorHandler from '@middy/http-error-handler';
import prisma from '../../../libs/dal/client/client';
import logger, {setDefaultLoggerMeta} from '../../../libs/logger/logger';
import type {DecodedToken} from '../../../libs/types/auth';

const getUsersHandler = async (event: APIGatewayProxyEventBase<DecodedToken>) => {
  const {accountId, userId, role} = event.requestContext.authorizer;
  setDefaultLoggerMeta({accountId, userId, role});

  const users = await prisma.user.findMany({
    where: {
      accountId,
    },
  });
  logger.info(`Fetched users`);

  return {
    statusCode: 200,
    body: JSON.stringify(users),
  };
};

export const handler = middy(getUsersHandler).use(httpErrorHandler());
