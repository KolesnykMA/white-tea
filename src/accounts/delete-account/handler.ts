import type {APIGatewayProxyEvent} from 'aws-lambda';
import middy from '@middy/core';
import jsonBodyParser from '@middy/http-json-body-parser';
import httpErrorHandler from '@middy/http-error-handler';
import {setDefaultLoggerMeta} from '../../../libs/logger/logger';
import {validate} from './validate';

const deleteAccountHandler = async (event: APIGatewayProxyEvent) => {
  const {accountId, userId, role} = event.requestContext.authorizer;
  setDefaultLoggerMeta({accountId, userId, role});

  await validate(userId);

  return {
    statusCode: 200,
    body: JSON.stringify({}),
  };
};

export const handler = middy(deleteAccountHandler).use(jsonBodyParser()).use(httpErrorHandler());
