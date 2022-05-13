import type {Context} from 'aws-lambda/handler';
import type {
  APIGatewayAuthorizerWithContextCallback,
  APIGatewayTokenAuthorizerEvent,
} from 'aws-lambda/trigger/api-gateway-authorizer';
import type {AuthorizerContext, DecodedToken} from '../../../libs/types/auth';
import prisma from '../../../libs/dal/client/client';
import logger from '../../../libs/logger/logger';
import {verifyToken} from '../../../libs/auth/jwt';

const authorize = async (
  event: APIGatewayTokenAuthorizerEvent,
  _: Context,
  callback: APIGatewayAuthorizerWithContextCallback<AuthorizerContext>
): Promise<APIGatewayAuthorizerWithContextCallback<AuthorizerContext> | void> => {
  const token = event.authorizationToken?.split(' ')[1];

  if (!token) {
    return callback('Unauthorized', null);
  }

  const decodedToken = await verifyToken(token, process.env.JWT_SECRET);

  if (!validateDecodedToken(decodedToken)) {
    return callback('Unauthorized', null);
  }

  const {accountId, userId, role} = decodedToken;

  const [account, user] = await Promise.all([
    prisma.account.findUnique({
      where: {
        id: accountId,
      },
    }),
    prisma.user.findUnique({
      where: {
        id: userId,
      },
    }),
  ]);
  logger.info(`Fetched account and user`);

  if (!account || !user) {
    return callback('Unauthorized', null);
  }

  const authorizerContext = {
    accountId,
    userId,
    role,
  };

  return callback(
    null,
    generateAuthorizerResponse({
      principalId: decodedToken.userId,
      methodArn: event.methodArn,
      context: authorizerContext,
    })
  );
};

function validateDecodedToken(decodedToken: DecodedToken): boolean {
  return !(!decodedToken.accountId || !decodedToken.userId || !decodedToken.role);
}

function generateAuthorizerResponse({
  principalId,
  methodArn,
  context,
}: {
  principalId: string;
  methodArn: string;
  context: AuthorizerContext;
}) {
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
