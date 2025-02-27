import Account from '../account/account.model';
import bcrypt from 'bcryptjs';
import jwt, { SignOptions } from 'jsonwebtoken';
import ms from 'ms';
import config from '../../config';
import { IAccount } from '../account/account.interface';

export const register = async (data: Partial<IAccount>): Promise<IAccount> => {
  // Generate userID if not provided
  if (!data.userID) {
    data.userID = 'U' + Date.now();
  }

  // Check uniqueness of mobile, email, and nid
  const existingMobile = await Account.findOne({ mobile: data.mobile });
  if (existingMobile) throw new Error('Mobile already exists.');

  const existingEmail = await Account.findOne({ email: data.email });
  if (existingEmail) throw new Error('Email already exists.');

  const existingNid = await Account.findOne({ nid: data.nid });
  if (existingNid) throw new Error('NID already exists.');

  // Hash the PIN (ensure we pass a string)
  const salt = await bcrypt.genSalt(10);
  data.pin = await bcrypt.hash(data.pin!, salt);

  // Set balance and active status based on role
  if (data.role === 'user') {
    data.balance = 40;
    data.isActive = true;
  } else if (data.role === 'agent') {
    data.balance = 0; // Initial balance for agent
    data.isActive = false; // Requires admin approval
  }

  // Create the account
  const account = await Account.create(data);
  return account.toObject();
};

export const login = async (
  identifier: string,
  pin: string,
): Promise<{ account: IAccount; token: string }> => {
  // Find account by mobile or email
  const account = await Account.findOne({
    $or: [{ mobile: identifier }, { email: identifier }],
  });
  if (!account) throw new Error('Account not found.');

  // Compare the provided PIN with the hashed PIN
  const isMatch = await bcrypt.compare(pin, account.pin);
  if (!isMatch) throw new Error('Invalid credentials.');

  // Prepare payload for the JWT token
  const payload = { id: account._id, role: account.role };

  // Convert jwt_expires (e.g., "30d") to milliseconds using ms
  const expiresInMs = ms(config.jwt_expires as any);
  if (typeof expiresInMs !== 'number') {
    throw new Error('Invalid JWT_EXPIRES_IN value.');
  }
  // Convert milliseconds to seconds
  const expiresInSeconds = Math.floor(expiresInMs / 1000);

  // Create token options with expiresIn as a number (seconds)
  const options: SignOptions = { expiresIn: expiresInSeconds };

  // Generate JWT token using the secret
  const token = jwt.sign(payload, config.jwt_secret as string, options);

  return { account: account.toObject(), token };
};
