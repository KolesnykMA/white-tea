export type DecodedToken = {
  userId: string;
  accountId: string;
  role: 'owner' | 'worker';
};
