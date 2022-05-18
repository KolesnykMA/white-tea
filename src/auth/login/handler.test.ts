jest.mock('../../../libs/dal/client/client', () => {
  return {
    user: {
      findUnique: jest.fn().mockResolvedValue({
        id: 'user-id-1',
        accountId: 'acc-id-1',
        role: 'owner',
        passwordHash: 'pwdHash',
      }),
    },
  };
});
jest.mock('../../../libs/auth/password-hasher');
jest.mock('../../../libs/auth/jwt');

import prisma from '../../../libs/dal/client/client';
import {verifyPasswordHash} from '../../../libs/auth/password-hasher';
import {signToken} from '../../../libs/auth/jwt';
import {handler} from './handler';

(verifyPasswordHash as jest.Mock).mockResolvedValue(true);
(signToken as jest.Mock).mockReturnValue('token');

it('should call findUnique with input email from input params', async () => {
  const event: any = {
    body: {email: 'maxym@ukma.edu.ua', password: '12345678'},
  };

  await handler(event, {} as any, {} as any);

  expect(prisma.user.findUnique).toHaveBeenCalledWith({where: {email: 'maxym@ukma.edu.ua'}});
});

it('should call verifyPasswordHash with password from input params and user from db', async () => {
  const event: any = {
    body: {email: 'maxym@ukma.edu.ua', password: '12345678'},
  };

  await handler(event, {} as any, {} as any);

  expect(verifyPasswordHash).toHaveBeenCalledWith('12345678', 'pwdHash');
});

it('should call signToken with correct params', async () => {
  const event: any = {
    body: {email: 'maxym@ukma.edu.ua', password: '12345678'},
  };

  await handler(event, {} as any, {} as any);

  expect(signToken).toHaveBeenCalledWith(
    {accountId: 'acc-id-1', role: 'owner', userId: 'user-id-1'},
    'jwt-secret'
  );
});

it('should return result if no errors thrown', async () => {
  const event: any = {
    body: {email: 'maxym@ukma.edu.ua', password: '12345678'},
  };

  const result = await handler(event, {} as any, {} as any);

  expect(result).toEqual({
    body: '{"token":"token"}',
    statusCode: 200,
  });
});

it('should throw error password is too short', async () => {
  const event: any = {
    body: {email: 'maxym@ukma.edu.ua', password: '1234567'},
  };

  const result = await handler(event, {} as any, {} as any);

  expect(result).toEqual({
    body: 'Event object failed validation',
    headers: {'Content-Type': 'text/plain'},
    statusCode: 400,
  });
});

it('should throw error if email is invalid', async () => {
  const event: any = {
    body: {email: 'x', password: '12345678910'},
  };

  const result = await handler(event, {} as any, {} as any);

  expect(result).toEqual({
    body: 'Event object failed validation',
    headers: {'Content-Type': 'text/plain'},
    statusCode: 400,
  });
});
