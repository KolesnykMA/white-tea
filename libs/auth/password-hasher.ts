import bcrypt from 'bcrypt';

const SALT = 13;

export async function createPasswordHash(password: string) {
  return bcrypt.hash(password, SALT);
}

export async function verifyPasswordHash(password: string, passwordHash: string) {
  return bcrypt.compare(password, passwordHash);
}
