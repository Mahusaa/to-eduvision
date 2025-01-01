import bcrypt from 'bcryptjs';

// Jumlah salt rounds (disarankan antara 10-12 untuk keamanan yang optimal)
const SALT_ROUNDS = 4;

export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(SALT_ROUNDS);
  return await bcrypt.hash(password, salt);
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return await bcrypt.compare(password, hashedPassword);
}

