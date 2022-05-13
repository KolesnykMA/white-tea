import createHttpError from 'http-errors';
import prisma from '../../../libs/dal/client/client';
import logger from '../../../libs/logger/logger';

export async function validate(email: string, accountId: string): Promise<void> {
  const [existingUser, account] = await Promise.all([
    prisma.user.findUnique({where: {email}}),
    prisma.account.findUnique({where: {id: accountId}}),
  ]);
  logger.info(`Fetched user by email and account`);

  if (existingUser) {
    throw createHttpError(409, `User with email already exists`);
  }

  if (account.usersCount === account.usersLimit) {
    throw createHttpError(400, `Max amount of users per account reached`);
  }
}
