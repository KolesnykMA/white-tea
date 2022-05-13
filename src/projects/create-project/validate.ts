import createHttpError from 'http-errors';
import prisma from '../../../libs/dal/client/client';
import logger from '../../../libs/logger/logger';

export async function validate(accountId: string, name: string): Promise<void> {
  const existingProject = await prisma.project.findUnique({
    where: {
      accountId_name: {
        accountId,
        name,
      },
    },
  });
  logger.info(`Fetched project on account by name`);

  if (existingProject) {
    throw createHttpError(400, `Project with name already exists`);
  }
}
