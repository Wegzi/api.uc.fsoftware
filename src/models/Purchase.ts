import mongoose, { Document, Schema, Model } from 'mongoose';

export interface Purchase extends Document {}

export interface IPurchaseModel extends Model<Purchase> {}

const PurchaseSchema = new Schema<Purchase>(
  {
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

const PurchaseModel = mongoose.model<Purchase, IPurchaseModel>('Purchase', PurchaseSchema);

export { PurchaseModel };
