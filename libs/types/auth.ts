import type {User} from '@prisma/client';

export type DecodedToken = {
  userId: string;
  accountId: string;
  role: User['role'];
};
