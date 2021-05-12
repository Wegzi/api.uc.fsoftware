import bcrypt from 'bcrypt';
import moment from 'moment';
import mongoose, { Document, Schema, Model } from 'mongoose';
import * as User_1 from '../definitions/interfaces/Service';
/**
 * Interface that represents Service mongoose Document
 */
export interface Service extends Service_1.ServiceParams, Document {}

/**
 * Interface that represents Service mongoose Model
 */
export interface IServiceModel extends Model<Service> {}

const ServiceSchema = new Schema<Service>(
  {
    name: {
      type: Schema.Types.String,
      required: true
    },
    value: {
      type: Schema.Types.Double,
      required: true
    }
  },
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    }
  }
);

const ServiceModel = mongoose.model<Service, IServiceModel>('User', ServiceSchema);

export { ServiceModel };
