export type User = {
  id: string;
  email: string;
  passwordHash: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  createdAt: Date;
  accountId: string;
};

export const UserRole = {
  owner: 'owner',
  worker: 'worker',
};

export type UserRole = typeof UserRole[keyof typeof UserRole];
