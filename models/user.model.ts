import { Schema, model, models } from 'mongoose';

export type UserType = {
  _id: string;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  birthday: Date;
  createdAt?: Date;
  updatedAt?: Date;
};

export type CurrentUser = Omit<UserType, 'password'> & {
  iat: number;
  exp: number;
};

const UserSchema = new Schema<UserType>(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    birthday: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

export const User = models.User || model<UserType>('User', UserSchema);