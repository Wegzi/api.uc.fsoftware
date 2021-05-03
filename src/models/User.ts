import bcrypt from 'bcrypt';
import moment from 'moment';
import mongoose, { Document, Schema, Model } from 'mongoose';
import { UserParams } from '../definitions/interfaces/User';
/**
 * Interface that represents User mongoose Document
 */
export interface User extends UserParams, Document {
  /**
   * Get age (in years) of user
   * @returns {number} age
   */
  getAge(): number;

  /**
   * Compare given password to registered (encrypted) password
   * @param {string} password
   * @returns {boolean} true if password matches, false if not
   */
  verifyPassword(password: string): boolean;
}

/**
 * Interface that represents User mongoose Model
 */
export interface IUserModel extends Model<User> {
  findByEmail(email: string): Promise<User | null>;
}

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

UserSchema.methods.getAge = function (): number {
  return moment().diff(this.birth_date, 'years');
};

UserSchema.methods.verifyPassword = function (password: string): boolean {
  return bcrypt.compareSync(password, this.password);
};

UserSchema.statics.findByEmail = async function (email: string): Promise<User | null> {
  const user = await this.findOne({ email });
  return user;
};

const UserModel = mongoose.model<User, IUserModel>('User', UserSchema);

export { UserModel };
