import jwt from 'jsonwebtoken';
import type {Callback, Context} from 'aws-lambda/handler';
import type {APIGatewayTokenAuthorizerEvent} from 'aws-lambda/trigger/api-gateway-authorizer';
import type {DecodedToken} from '../../../libs/types/auth';
import logger from '../../../libs/logger/logger';

const authorize = async (
  event: APIGatewayTokenAuthorizerEvent,
  context: Context,
  callback: Callback<DecodedToken>
): Promise<DecodedToken | void> => {
  logger.info(`Received event`, {event});

  const token = event.authorizationToken?.split(' ')[1];
  logger.info(`Received token`, {token});

  if (!token) {
    return callback('Unauthorized', null);
  }

  const decodedToken = jwt.verify(token, process.env.JWT_SECRET) as DecodedToken;
  logger.info(`Decoded token`, {decodedToken});

  if (!decodedToken.accountId || !decodedToken.userId || !decodedToken.role) {
    return callback('Unauthorized', null);
  }

  return callback(null, decodedToken);
};

export const handler = authorize;
