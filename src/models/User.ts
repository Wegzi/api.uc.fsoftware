import mongoose, { Document, Schema, Model } from 'mongoose';
import { UserParams } from '../definitions/interfaces/User';
/**
 * Interface that represents User mongoose Document
 */
export interface User extends UserParams, Document {}

/**
 * Interface that represents User mongoose Model
 */
export interface IUserModel extends Model<User> {}

const UserSchema = new Schema<User>(
  {
    name: {
      type: Schema.Types.String,
      required: true
    },
    email: {
      type: Schema.Types.String,
      required: true
    },
    password: {
      type: Schema.Types.String,
      required: true
    },
    birth_date: {
      type: Schema.Types.Date
    }
  },
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    }
  }
);

const UserModel = mongoose.model<User, IUserModel>('User', UserSchema);

export { UserModel };
