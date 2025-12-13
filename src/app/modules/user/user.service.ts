import httpStatus from 'http-status';
import QueryBuilder from '../../builder/QueryBuilder';
import AppError from '../../errors/AppError';
import { User } from './user.model';
import { TUser } from './user.interface';
import { userSearchableFields } from './user.constant';
import { Types } from 'mongoose';

const registerUser = async (payload: TUser) => {
  // role default member
  const data: TUser = {
    ...payload,
    role: payload.role ?? 'member',
  };

  const created = await User.create(data);
  return created;
};

const getAllUsers = async (query: Record<string, unknown>) => {
  const qb = new QueryBuilder(User.find({ isDeleted: false }), query)
    .search(userSearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();

  return {
    result: await qb.modelQuery,
    meta: await qb.countTotal(),
  };
};

const getSingleUser = async (userId: string) => {
  if (!Types.ObjectId.isValid(userId)) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Invalid user id');
  }

  const user = await User.findOne({ _id: userId, isDeleted: false });
  if (!user) throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  return user;
};

const getMe = async (email: string) => {
  const user = await User.findOne({ email, isDeleted: false });
  if (!user) throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  return user;
};

const updateProfile = async (email: string, data: Partial<TUser>) => {
  const user = await User.findOne({ email });
  if (!user) throw new AppError(httpStatus.NOT_FOUND, 'User not found');

  if (user.isDeleted) throw new AppError(httpStatus.FORBIDDEN, 'User is deleted');

  const updated = await User.findOneAndUpdate(
    { email, isDeleted: false },
    data,
    { new: true },
  );

  return updated;
};

export const UserServices = {
  registerUser,
  getAllUsers,
  getSingleUser,
  getMe,
  updateProfile,
};
