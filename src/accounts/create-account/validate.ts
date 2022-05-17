import createHttpError from 'http-errors';
import prisma from '../../../libs/dal/client/client';
import logger from '../../../libs/logger/logger';

export async function validate(email: string) {
  const existingUser = await prisma.user.findUnique({where: {email}});
  logger.info(`Fetched user by his email`);

  if (existingUser) {
    throw createHttpError(400, `User with email already exists`);
  }
}
