import type {APIGatewayProxyEventBase} from 'aws-lambda';
import middy from '@middy/core';
import httpErrorHandler from '@middy/http-error-handler';
import jsonBodyParser from '@middy/http-json-body-parser';
import validator from '@middy/validator';
import prisma from '../../../libs/dal/client/client';
import logger, {setDefaultLoggerMeta} from '../../../libs/logger/logger';
import type {AuthorizerContext} from '../../../libs/types/auth';
import inputSchema from '../../accounts/create-account/schema';

type Request = APIGatewayProxyEventBase<AuthorizerContext> & {
  pathParameters: {
    projectId: string;
  };
};

const getProjectHandler = async (event: Request) => {
  const {accountId, userId, role} = event.requestContext.authorizer;
  const {projectId} = event.pathParameters;
  setDefaultLoggerMeta({accountId, userId, role});

  const project = await prisma.project.findUnique({
    where: {
      id: projectId,
    },
    include: {
      features: true,
    },
  });
  logger.info(`Fetched project with features`);

  return {
    statusCode: 200,
    body: JSON.stringify(project),
  };
};

export const handler = middy(getProjectHandler)
  .use(jsonBodyParser())
  .use(
    validator({
      inputSchema,
    })
  )
  .use(httpErrorHandler());
