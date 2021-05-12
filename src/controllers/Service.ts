import { Request, Response } from 'express';
import { ObjectId } from 'mongodb';
import mongoose from 'mongoose';
import passport from 'passport';
import { bodyValidator, controller, del, description, get, post, put } from '../decorators';
import { ServiceBody, ServiceParams } from '../definitions/interfaces/Service';
import { ServiceModel } from '../models';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
@controller('/Service', {
  name: 'Services',
  description: 'Service Controller'
  // middlewares: [passport.authenticate('token')]
})
export class Services {
  @get('/')
  @description('Fetch all services')
  async index(req: Request, res: Response): Promise<void> {
    const srvices = await ServiceModel.find({});
    // SELECT * FROM services
    res.send(services);
  }
  @post('/')
  @description('Create Service')
  @bodyValidator([
    { name: 'name', message: 'Name is required' },
    { name: 'value', message: 'Value is required' },
  ])
  async create(req: Request<null, null, ServiceBody>, res: Response): Promise<void> {
    const { body } = req;
    const { name, value } = body;

    const service = await ServiceModel.create({
      name,
      value,
    });
    res.status(201).send({ service });
  }

  @put('/:service_id')
  @description('Update service')
  @bodyValidator([
    { name: 'name', message: 'Name is required' },
    { name: 'value', message: 'Value is required' },
  ])
  async update(req: Request<ServiceParams, unknown, ServiceBody>, res: Response): Promise<void> {
    const { body, params } = req;

    const { name, value } = body;
    const service_id = params?.service_id;
    if (!service_id) return;
    const service = await ServiceModel.findOneAndUpdate(
      { _id: ObjectId.createFromHexString(service_id) },
      { name, value },
      { new: true }
    );

    res.status(201).send(service?.toJSON());
  }
  @del('/:service_id')
  @description('Delete service')
  async delete(req: Request<ServiceParams, unknown, null>, res: Response): Promise<void> {
    const { params } = req;

    const service_id = params?.service_id;
    if (!service_id) return;
    await ServiceModel.deleteOne({ _id: ObjectId.createFromHexString(service_id) });

    res.status(201).send('ok');
  }
}
