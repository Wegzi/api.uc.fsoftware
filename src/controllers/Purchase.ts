import { Request, Response } from 'express';
import { bodyValidator, controller, description, post } from '../decorators';
import { PurchaseBody } from '../definitions/interfaces/Purchase';
import { PurchaseModel } from '../models';
import { ObjectId } from 'mongodb';

@controller('/purchase', {
  name: 'Purchases',
  description: 'Purchase Controller'
})
export class Purchase {
  @post('/')
  @description('Purchase a service')
  @bodyValidator([
    { name: 'owner_id', message: 'User is required' },
    { name: 'service_id', message: 'Service is required' }
  ])
  async create(req: Request<null, null, PurchaseBody>, res: Response): Promise<void> {
    const { body } = req;
    const { owner_id, service_id } = body;
    const purchase = await PurchaseModel.create({
      owner_id: ObjectId.createFromHexString(owner_id),
      service_id: ObjectId.createFromHexString(service_id)
    });
    res.status(201).send(purchase);
  }
}
