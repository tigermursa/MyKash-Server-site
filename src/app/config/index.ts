import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env') });

const jwt_secret = process.env.JWT_SECRET?.trim();
const jwt_expires = process.env.JWT_EXPIRES_IN?.trim();

if (!jwt_secret || !jwt_expires) {
  throw new Error('JWT_SECRET or JWT_EXPIRES_IN is not defined.');
}

export default {
  port: process.env.PORT?.trim(),
  dataBase: process.env.DATABASE_URL?.trim(),
  jwt_expires, // e.g., "30d"
  jwt_secret,
};
