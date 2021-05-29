import { Request, Response } from 'express';
import { bodyValidator, controller, description, post, get } from '../decorators';
import { PurchaseParams, PurchaseBody } from '../definitions/interfaces/Purchase';
import { PurchaseModel, ServiceModel } from '../models';
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

  @get('/:user_id/serving')
  @description('List user serving service')
  async indexUserServing(req: Request<PurchaseParams, null, null>, res: Response): Promise<void> {
    const { params } = req;
    const userId = params.user_id;

    const purchases = await ServiceModel.aggregate([
      { $match: { team: ObjectId.createFromHexString(userId) } },
      {
        $lookup: {
          from: 'purchases',
          localField: '_id',
          foreignField: 'service_id',
          as: 'purchase'
        }
      },
      { $unwind: '$purchase' }
    ]);
    res.status(201).send(purchases);
  }
}
