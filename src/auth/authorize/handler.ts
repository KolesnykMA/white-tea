import jwt from 'jsonwebtoken';
import type {Context} from 'aws-lambda/handler';
import type {
  APIGatewayAuthorizerWithContextCallback,
  APIGatewayTokenAuthorizerEvent,
} from 'aws-lambda/trigger/api-gateway-authorizer';
import type {DecodedToken} from '../../../libs/types/auth';

const authorize = async (
  event: APIGatewayTokenAuthorizerEvent,
  context: Context,
  callback: APIGatewayAuthorizerWithContextCallback<DecodedToken>
): Promise<APIGatewayAuthorizerWithContextCallback<DecodedToken> | void> => {
  const token = event.authorizationToken?.split(' ')[1];

  if (!token) {
    return callback('Unauthorized', null);
  }

  const decodedToken = jwt.verify(token, process.env.JWT_SECRET) as DecodedToken;

  if (!decodedToken.accountId || !decodedToken.userId || !decodedToken.role) {
    return callback('Unauthorized', null);
  }

  return callback(
    null,
    generateAuthorizerResponse(decodedToken.userId, event.methodArn, decodedToken)
  );
};

function generateAuthorizerResponse(principalId: string, methodArn: string, context: DecodedToken) {
  return {
    principalId,
    policyDocument: {
      Version: '2012-10-17',
      Statement: [
        {
          Action: 'execute-api:Invoke',
          Effect: 'Allow',
          Resource: methodArn,
        },
      ],
    },
    context,
  };
}

export const handler = authorize;
