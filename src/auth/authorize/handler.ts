import jwt from 'jsonwebtoken';
import type {Callback} from 'aws-lambda/handler';
import type {APIGatewayTokenAuthorizerEvent} from 'aws-lambda/trigger/api-gateway-authorizer';
import type {DecodedToken} from '../../../libs/types/auth';

const authorize = async (
  event: APIGatewayTokenAuthorizerEvent,
  callback: Callback<DecodedToken>
): Promise<DecodedToken | void> => {
  const token = event.authorizationToken.replace('Bearer ', '');

  if (!token) {
    return callback('Unauthorized', null);
  }

  const secret = Buffer.from(process.env.JWT_SECRET, 'base64');

  // verifies token
  const decodedToken = jwt.verify(token, secret) as DecodedToken;

  if (!decodedToken || !decodedToken.accountId) {
    return callback('Unauthorized', null);
  }

  return callback(null, decodedToken);
};

export const handler = authorize;
