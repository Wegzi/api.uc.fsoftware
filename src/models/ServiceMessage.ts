import mongoose, { Document, Schema, Model } from 'mongoose';

export interface ServiceMessage extends Document {}

export interface IServiceMessageModel extends Model<ServiceMessage> {}

const ServiceMessageSchema = new Schema<ServiceMessage>(
  {
    message: {
      type: Schema.Types.String,
      required: true
    },
    answerer: {
      type: Schema.Types.Boolean,
      required: true
    },
    owner_id: {
      type: Schema.Types.ObjectId,
      required: true
    },
    service_id: {
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

const ServiceMessageModel = mongoose.model<ServiceMessage, IServiceMessageModel>(
  'ServiceMessage',
  ServiceMessageSchema,
  'service_messages'
);

export { ServiceMessageModel };
