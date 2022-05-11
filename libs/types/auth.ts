import type {JwtPayload} from 'jsonwebtoken';

export type DecodedTokenData = {
  userId: string;
  accountId: string;
  role: 'owner' | 'worker';
};

export type DecodedToken = DecodedTokenData & JwtPayload;

export type AuthorizerContext = DecodedTokenData;
