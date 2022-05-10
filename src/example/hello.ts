import {ulid} from 'ulid';
import type {APIGatewayProxyCallback} from 'aws-lambda';

export const handler = async (callback: APIGatewayProxyCallback) => {
  const response = {
    statusCode: 200,
    body: JSON.stringify({
      message: `Hello ${ulid()}`,
    }),
  };

  callback(null, response);
};
