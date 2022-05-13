import type {APIGatewayProxyEventBase} from 'aws-lambda';
import middy from '@middy/core';
import httpErrorHandler from '@middy/http-error-handler';
import prisma from '../../../libs/dal/client/client';
import logger, {setDefaultLoggerMeta} from '../../../libs/logger/logger';
import type {AuthorizerContext} from '../../../libs/types/auth';

const getProjectsHandler = async (event: APIGatewayProxyEventBase<AuthorizerContext>) => {
  const {accountId, userId, role} = event.requestContext.authorizer;
  setDefaultLoggerMeta({accountId, userId, role});

  const projects = await prisma.project.findMany({
    where: {
      accountId,
    },
  });
  logger.info(`Fetched projects`);

  return {
    statusCode: 200,
    body: JSON.stringify(projects),
  };
};

export const handler = middy(getProjectsHandler).use(httpErrorHandler());
