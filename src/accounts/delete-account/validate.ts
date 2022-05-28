import createHttpError from 'http-errors';
import prisma from '../../../libs/dal/client/client';
import logger from '../../../libs/logger/logger';

export async function validate(userId: string) {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });
  logger.info('Fetched user');

  if (user.role !== 'owner') {
    throw createHttpError(403, `The action is not allowed`);
  }
}
