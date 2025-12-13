import jwt, { JwtPayload, SignOptions } from 'jsonwebtoken';
import { TUserRole } from '../user/user.interface';


export const createToken = (
  jwtPayload: { email: string; role: TUserRole, userId: string },
  secret: string,
  expiresIn: string,
) => {
  const options: SignOptions = {
    expiresIn: expiresIn as SignOptions['expiresIn'],
  };
  return jwt.sign(jwtPayload, secret, options);
};

export const verifyToken = (token: string, secret: string) => {
  return jwt.verify(token, secret) as JwtPayload;
};
