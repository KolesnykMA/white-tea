import jwt from 'jsonwebtoken';
import type {DecodedToken} from '../../../libs/types/auth';

export async function signToken(payload: DecodedToken): Promise<string> {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: '100d',
  });
}
