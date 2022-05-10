import type {APIGatewayProxyEvent} from 'aws-lambda';
import middy from '@middy/core';
import prismaClient from '../../../libs/dal/client/client';
import logger from '../../../libs/logger/logger';

const getAllAccountsHandler = async (event: APIGatewayProxyEvent) => {
  logger.info('Received event', {event});

  const accounts = await prismaClient.account.findMany();
  logger.info(`Fetched ${accounts.length} accounts from db`);

  return {
    statusCode: 200,
    body: JSON.stringify(accounts),
  };
};

export const handler = middy(getAllAccountsHandler);
