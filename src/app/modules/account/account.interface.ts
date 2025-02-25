export interface IAccount {
  userID: string;
  name: string;
  mobile: string;
  email: string;
  nid: string;
  pin: string;
  role: 'user' | 'agent' | 'admin';
  balance: number;
  isBlocked: boolean;
  isDelete: boolean;
  isActive: boolean;
  favorites?: string[];
  createdAt?: Date;
  updatedAt?: Date;
}
