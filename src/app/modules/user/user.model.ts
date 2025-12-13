import { model, Schema } from 'mongoose';
import bcrypt from 'bcrypt';
import config from '../../config';
import { TUser, UserModel } from './user.interface';
import { USER_ROLES } from './user.constant';

const userSchema = new Schema<TUser, UserModel>(
  {
    name: { type: String, required: true, trim: true },

    email: {
      type: String,
      required: true,
      unique: true,
      immutable: true,
      trim: true,
    },

    password: { type: String, required: true, select: 0 },

    role: { type: String, required: true, enum: Object.values(USER_ROLES) },
    department: { type: String, default: 'N/A' },
    skills: { type: [String], default: [] },

    phone: { type: String, default: 'N/A' },
    profileImage: { type: [String], default: [] },
    address: { type: String, default: 'N/A' },
    city: { type: String, default: 'N/A' },

    passwordChangedAt: { type: Date },

    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true },
);

userSchema.pre('save', async function (next) {
  this.password = await bcrypt.hash(
    this.password,
    Number(config.bcrypt_salt_rounds),
  );
  next();
});

userSchema.post('save', async function (doc, next) {
  doc.password = '';
  next();
});

userSchema.statics.isUserExist = async function (email: string) {
  return await User.findOne({ email, isDeleted: false }).select('+password');
};

userSchema.statics.isThePasswordMatched = async function (
  plainTextPassword: string,
  hashPassword: string,
) {
  return await bcrypt.compare(plainTextPassword, hashPassword);
};

userSchema.statics.isJWTIssuedBeforePasswordChanged = function (
  passwordChangedTimestamp: Date,
  jwtIssuedTimestamp: number,
) {
  const passwordChangedTime = new Date(passwordChangedTimestamp).getTime() / 1000;
  return passwordChangedTime > jwtIssuedTimestamp;
};

export const User = model<TUser, UserModel>('User', userSchema);
