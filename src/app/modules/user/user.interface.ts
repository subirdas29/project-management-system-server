import { Model, Types } from 'mongoose';
import { USER_ROLES } from './user.constant';

export type TUserRole = keyof typeof USER_ROLES;

export type TUser = {
  _id?: Types.ObjectId; 
  name: string;
  email: string;
  password: string;
  role: TUserRole;

  // PDF fields
  department?: string;
  skills?: string[];

  phone?: string;
  profileImage?: string[];
  address?: string;
  city?: string;

  isDeleted?: boolean;
  passwordChangedAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
};

export interface UserModel extends Model<TUser> {
  isThePasswordMatched(
    plainTextPassword: string,
    hashPassword: string,
  ): Promise<boolean>;

  isUserExist(email: string): Promise<TUser | null>;

  isJWTIssuedBeforePasswordChanged(
    passwordChangedTimestamp: Date,
    jwtIssuedTimestamp: number,
  ): boolean;
}
