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

export type Request = APIGatewayProxyEventBase<AuthorizerContext> & {
  body: {
    title: string;
    status?: string;
    projectId: string;
    executiveId?: string;
    featureId?: string;
    releaseId: string;
  };
};

const createTaskHandler = async (event: Request) => {
  const {accountId, userId, role} = event.requestContext.authorizer;
  setDefaultLoggerMeta({accountId, userId, role});

  const {title, projectId, featureId, releaseId, executiveId} = event.body;
  logger.info(`Received input`, {body: event.body});

  await validate(accountId, event.body);

  const task = await prisma.task.create({
    data: {
      id: ulid(),
      title,
      project: {connect: {id: projectId}},
      creator: {connect: {id: userId}},
      ...(featureId && {feature: {connect: {id: featureId}}}),
      ...(releaseId && {release: {connect: {id: releaseId}}}),
      ...(executiveId && {executive: {connect: {id: executiveId}}}),
    },
  });
  logger.info(`Created task`);

  return {
    statusCode: 200,
    body: JSON.stringify(task),
  };
};

export const handler = middy(createTaskHandler)
  .use(jsonBodyParser())
  .use(
    validator({
      inputSchema,
    })
  )
  .use(httpErrorHandler());
