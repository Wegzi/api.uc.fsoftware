import { Request, Response } from 'express';
import { bodyValidator, controller, description, post, get } from '../decorators';
import { ObjectId } from 'mongodb';
import { ServiceChatBody } from '../definitions/interfaces/ServiceChat';
import { ServiceChatModel, ServiceModel, UserModel } from '../models';
import { ServiceParams } from '../definitions/interfaces/Service';

@controller('/service/:service_id/chat', {
  name: 'Service chat',
  description: 'Service Chat Controller'
})
export class ServiceChat {
  @get('/')
  @description('List service message')
  async index(req: Request<ServiceParams, null, null>, res: Response): Promise<void> {
    const { service_id } = req.params;
    const purchase = await ServiceChatModel.aggregate([
      { $match: { service_id: ObjectId.createFromHexString(service_id) } },
      {
        $lookup: {
          from: 'users',
          localField: 'owner_id',
          foreignField: '_id',
          as: 'user'
        }
      },
      { $unwind: '$user' }
    ]);
    res.status(201).send(purchase);
  }
  @post('/')
  @description('Send service message')
  @bodyValidator([{ name: 'owner_id', message: 'owner_id is required' }])
  async create(req: Request<ServiceParams, null, ServiceChatBody>, res: Response): Promise<void> {
    const { body, params } = req;
    const { service_id } = params;
    const { owner_id, message, answerer } = body;
    try {
      const service = await ServiceModel.findById(service_id);
      const user = await UserModel.findById(owner_id);
      if (!service || !user) {
        res.status(404).send();
        return;
      }
      const newMessage = await ServiceChatModel.create({
        message,
        answerer,
        owner_id: ObjectId.createFromHexString(owner_id),
        service_id: ObjectId.createFromHexString(service_id)
      });
      res.status(201).send({ ...newMessage.toJSON(), user });
    } catch (error) {
      res.status(500).send(error);
      return;
    }
  }
}
