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
import {validate} from './validate';

type Request = APIGatewayProxyEventBase<AuthorizerContext> & {
  body: {
    name: string;
  };
};

const createProjectHandler = async (event: Request) => {
  const {accountId, userId, role} = event.requestContext.authorizer;
  setDefaultLoggerMeta({accountId, userId, role});

  const {name} = event.body;
  logger.info(`Received input`, {body: event.body});

  await validate(accountId, name);

  const project = await prisma.project.create({
    data: {
      id: ulid(),
      account: {connect: {id: accountId}},
      name,
    },
  });
  logger.info(`Created project`);

  return {
    statusCode: 200,
    body: JSON.stringify(project),
  };
};

export const handler = middy(createProjectHandler)
  .use(jsonBodyParser())
  .use(
    validator({
      inputSchema,
    })
  )
  .use(httpErrorHandler());
