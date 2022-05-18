import type {PrismaClient} from '@prisma/client';
import type {DeepMockProxy} from 'jest-mock-extended';
import {mockDeep, mockReset} from 'jest-mock-extended';
import prisma from './client';

jest.mock('./client', () => {
  return {
    __esModule: true,
    default: mockDeep<PrismaClient>(),
  };
});

beforeEach(() => {
  // eslint-disable-next-line @typescript-eslint/no-use-before-define
  mockReset(prismaMock);
});

export const prismaMock = prisma as unknown as DeepMockProxy<PrismaClient>;
