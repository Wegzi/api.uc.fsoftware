import { Request, Response } from 'express';
import { ObjectId } from 'mongodb';
import mongoose from 'mongoose';
import passport from 'passport';
import { bodyValidator, controller, del, description, get, post, put } from '../decorators';
import { ServiceBody, ServiceParams } from '../definitions/interfaces/Service';
import { ServiceModel } from '../models';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
@controller('/services', {
  name: 'Services',
  description: 'Service Controller'
})
export class Services {
  @get('/')
  @description('Fetch all services')
  async index(req: Request, res: Response): Promise<void> {
    const services = await ServiceModel.find({});
    res.send(services);
  }
  @get('/:service_id')
  @description('Find service')
  async find(req: Request, res: Response): Promise<void> {
    const { params } = req;
    const services = await ServiceModel.findById(params?.service_id);
    res.send(services);
  }
  @post('/')
  @description('Create Service')
  @bodyValidator([
    { name: 'title', message: 'Title is required' },
    { name: 'description', message: 'Description is required' },
    { name: 'value', message: 'Value is required' }
  ])
  async create(req: Request<null, null, ServiceBody>, res: Response): Promise<void> {
    const { body } = req;
    const { title, description, value, owner } = body;
    try {
      const service = await ServiceModel.create({
        title,
        description,
        value,
        owner: ObjectId.createFromHexString(owner)
      });
      res.status(201).send(service);
    } catch (error) {
      res.status(500).send(error);
    }
  }

  @put('/:service_id')
  @description('Update service')
  @bodyValidator([
    { name: 'title', message: 'Title is required' },
    { name: 'description', message: 'Description is required' },
    { name: 'value', message: 'Value is required' }
  ])
  async update(req: Request<ServiceParams, unknown, ServiceBody>, res: Response): Promise<void> {
    const { body, params } = req;

    const { title, value, description } = body;
    const service_id = params?.service_id;
    if (!service_id) return;
    const service = await ServiceModel.findOneAndUpdate(
      { _id: ObjectId.createFromHexString(service_id) },
      { title, value, description },
      { new: true }
    );

    res.status(200).send(service?.toJSON());
  }
  @del('/:service_id')
  @description('Delete service')
  async delete(req: Request<ServiceParams, unknown, null>, res: Response): Promise<void> {
    const { params } = req;

    const service_id = params?.service_id;
    if (!service_id) return;
    await ServiceModel.deleteOne({ _id: ObjectId.createFromHexString(service_id) });

    res.status(200).send();
  }
}
