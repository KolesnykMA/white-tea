import jwt from 'jsonwebtoken';
import type {DecodedToken} from '../types/auth';

export async function signToken(payload: DecodedToken, secret: string): Promise<string> {
  return jwt.sign(payload, secret, {
    expiresIn: '100d',
  });
}

export async function verifyToken(token: string, secret: string): Promise<DecodedToken> {
  return jwt.verify(token, secret) as DecodedToken;
}
