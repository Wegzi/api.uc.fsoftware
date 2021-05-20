import mongoose, { Document, Schema, Model } from 'mongoose';

export interface Service extends Document {}

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
    owner_id: {
      type: Schema.Types.ObjectId,
      required: true
    },
    tags: {
      type: [String],
      required: false,
      default: []
    },
    team: {
      type: [Schema.Types.ObjectId],
      required: false,
      default: []
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
