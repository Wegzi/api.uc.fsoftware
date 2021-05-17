import mongoose, { Document, Schema, Model } from 'mongoose';
import { ServiceParams } from '../definitions/interfaces/Service';

export interface Service extends ServiceParams, Document {}

export interface IServiceModel extends Model<Service> {}

const ServiceSchema = new Schema<Service>(
  {
    title: {
      type: Schema.Types.String,
      required: true
    },
    description: {
      type: Schema.Types.String,
      required: true
    },
    value: {
      type: Schema.Types.Number,
      required: true
    },
    owner: {
      type: Schema.Types.ObjectId,
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

const ServiceModel = mongoose.model<Service, IServiceModel>('Service', ServiceSchema);

export { ServiceModel };
