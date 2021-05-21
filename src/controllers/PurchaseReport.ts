import { Request, Response } from 'express';
import { bodyValidator, controller, description, post, get } from '../decorators';
import { ObjectId } from 'mongodb';
import { PurchaseReportBody, PurchaseReportParams } from '../definitions/interfaces/PurchaseReport';
import { PurchaseReportModel } from '../models/PurchaseReport';
import { PurchaseModel, UserModel } from '../models';

@controller('/purchase/:purchase_id/report', {
  name: 'Purchase report',
  description: 'Purchase Report Controller'
})
export class PurchaseReport {
  @get('/')
  @description('List service message')
  async index(req: Request<PurchaseReportParams, null, null>, res: Response): Promise<void> {
    const { purchase_id } = req.params;
    const purchase = await PurchaseReportModel.aggregate([
      { $match: { purchase_id: ObjectId.createFromHexString(purchase_id) } },
      { $lookup: { from: 'users', localField: 'owner_id', foreignField: '_id', as: 'user' } },
      { $unwind: '$user' }
    ]);
    res.status(201).send(purchase);
  }
  @post('/')
  @description('Send purchase report')
  @bodyValidator([{ name: 'owner_id', message: 'owner_id is required' }])
  async create(req: Request<PurchaseReportParams, null, PurchaseReportBody>, res: Response): Promise<void> {
    const { body, params } = req;
    const { purchase_id } = params;
    const { owner_id, title, message } = body;
    try {
      const service = await PurchaseModel.findById(purchase_id);
      const user = await UserModel.findById(owner_id);
      if (!service || !user) {
        res.status(404).send();
        return;
      }
      const newMessage = await PurchaseReportModel.create({
        title,
        message,
        owner_id: ObjectId.createFromHexString(owner_id),
        purchase_id: ObjectId.createFromHexString(purchase_id)
      });
      res.status(201).send({ ...newMessage.toJSON(), user });
    } catch (error) {
      res.status(500).send(error);
      return;
    }
  }
}
