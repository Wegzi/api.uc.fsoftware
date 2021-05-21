import mongoose, { Document, Schema, Model } from 'mongoose';

export interface PurchaseReport extends Document {}

export interface IPurchaseReportModel extends Model<PurchaseReport> {}

const PurchaseReportSchema = new Schema<PurchaseReport>(
  {
    title: {
      type: Schema.Types.String,
      required: true
    },
    message: {
      type: Schema.Types.String,
      required: true
    },
    owner_id: {
      type: Schema.Types.ObjectId,
      required: true
    },
    purchase_id: {
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

const PurchaseReportModel = mongoose.model<PurchaseReport, IPurchaseReportModel>(
  'PurchaseReport',
  PurchaseReportSchema,
  'purchase_reports'
);

export { PurchaseReportModel };
