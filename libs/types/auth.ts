export type DecodedToken = {
  userId: string;
  accountId: string;
  role: 'Owner' | 'Worker';
};
