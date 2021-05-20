import mongoose, { Document, Schema, Model } from 'mongoose';

export interface ServiceChat extends Document {}

export interface IServiceChatModel extends Model<ServiceChat> {}

const ServiceChatSchema = new Schema<ServiceChat>(
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

const ServiceChatModel = mongoose.model<ServiceChat, IServiceChatModel>('ServiceChat', ServiceChatSchema);

export { ServiceChatModel };
