import { Request, Response } from 'express';
import { ObjectId } from 'mongodb';
import mongoose from 'mongoose';
import passport from 'passport';
import { bodyValidator, controller, del, description, get, post, put } from '../decorators';
import { UserBody, UserParams } from '../definitions/interfaces/User';
import { UserModel } from '../models';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
@controller('/users', {
  name: 'Users',
  description: 'User Controller'
  // middlewares: [passport.authenticate('token')]
})
export class Users {
  @get('/')
  @description('Fetch all users')
  async index(req: Request, res: Response): Promise<void> {
    const users = await UserModel.find({});
    // SELECT * FROM users
    res.send(users);
  }
  @post('/')
  @description('Create user')
  @bodyValidator([
    { name: 'name', message: 'Name is required' },
    { name: 'email', message: 'Email is required' },
    { name: 'password', message: 'Password is required' }
  ])
  async create(req: Request<null, null, UserBody>, res: Response): Promise<void> {
    const { body } = req;
    const { name, email, password, birth_date } = body;

    const user = await UserModel.create({
      name,
      email,
      password,
      birth_date: birth_date ? new Date(birth_date) : null
    });
    res.status(201).send({ user });
  }

  @put('/:user_id')
  @description('Update user')
  @bodyValidator([
    { name: 'name', message: 'Name is required' },
    { name: 'email', message: 'Email is required' },
    { name: 'password', message: 'Password is required' }
  ])
  async update(req: Request<UserParams, unknown, UserBody>, res: Response): Promise<void> {
    const { body, params } = req;

    const { name, email, password, birth_date } = body;
    const user_id = params?.user_id;
    if (!user_id) return;
    const user = await UserModel.findOneAndUpdate(
      { _id: ObjectId.createFromHexString(user_id) },
      { name, email, password, birth_date },
      { new: true }
    );

    res.status(201).send(user?.toJSON());
  }
  @del('/:user_id')
  @description('Delete user')
  async delete(req: Request<UserParams, unknown, null>, res: Response): Promise<void> {
    const { params } = req;

    const user_id = params?.user_id;
    if (!user_id) return;
    await UserModel.deleteOne({ _id: ObjectId.createFromHexString(user_id) });

    res.status(201).send('ok');
  }
}
