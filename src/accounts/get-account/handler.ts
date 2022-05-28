import type {APIGatewayProxyEventBase} from 'aws-lambda';
import middy from '@middy/core';
import httpErrorHandler from '@middy/http-error-handler';
import jsonBodyParser from '@middy/http-json-body-parser';
import prisma from '../../../libs/dal/client/client';
import logger, {setDefaultLoggerMeta} from '../../../libs/logger/logger';
import type {AuthorizerContext} from '../../../libs/types/auth';

type Request = APIGatewayProxyEventBase<AuthorizerContext>;

const getAccountHandler = async (event: Request) => {
  const {accountId, userId, role} = event.requestContext.authorizer;
  setDefaultLoggerMeta({accountId, userId, role});

  const account = await prisma.account.findUnique({
    where: {
      id: accountId,
    },
  });
  logger.info(`Fetched account`);

  return {
    statusCode: 200,
    body: JSON.stringify(account),
  };
};

export const handler = middy(getAccountHandler).use(jsonBodyParser()).use(httpErrorHandler());
