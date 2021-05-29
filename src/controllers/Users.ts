import { Request, Response } from 'express';
import { ObjectId } from 'mongodb';
import { bodyValidator, controller, del, description, get, post, put } from '../decorators';
import { Roles } from '../definitions/enums/User';
import { UserBody, UserParams } from '../definitions/interfaces/User';
import { PurchaseModel, ServiceModel, UserModel } from '../models';
import { LoginValidator, UserValidator } from '../definitions/validators/user';

@controller('/users', {
  name: 'Users',
  description: 'User Controller'
})
export class Users {
  @get('/')
  @description('Fetch all users')
  async index(req: Request, res: Response): Promise<void> {
    const users = await UserModel.find({});
    res.send(users);
  }
  @post('/')
  @description('Create user')
  async create(req: Request<null, null, UserBody>, res: Response): Promise<void> {
    const { body } = req;
    const result = UserValidator.validate({ ...body });
    if (result.error) {
      res.status(422).send(result.error.details);
      return;
    }
    const { name, email, password, cpf, phone_number, birth_date, role } = body;
    const user = await UserModel.create({
      name,
      email,
      password,
      cpf,
      phone_number,
      role: role ?? Roles.administrator,
      birth_date: birth_date ? new Date(birth_date) : null
    });
    res.status(201).send(user);
  }

  @put('/:user_id')
  @description('Update user')
  async update(req: Request<UserParams, unknown, UserBody>, res: Response): Promise<void> {
    const { body, params } = req;

    const result = UserValidator.validate({ ...body });
    if (result.error) {
      res.status(422).send(result.error.details);
      return;
    }

    const { name, email, password, phone_number, birth_date, cpf, role } = body;
    const user_id = params?.user_id;
    if (!user_id) return;
    const user = await UserModel.findOneAndUpdate(
      { _id: ObjectId.createFromHexString(user_id) },
      {
        name,
        email,
        password,
        phone_number,
        birth_date,
        cpf,
        role: role ?? Roles.administrator
      },
      { new: true }
    );

    res.status(200).send(user?.toJSON());
  }
  @del('/:user_id')
  @description('Delete user')
  async delete(req: Request<UserParams, unknown, null>, res: Response): Promise<void> {
    const { params } = req;

    const user_id = params?.user_id;
    if (!user_id) return;
    await UserModel.deleteOne({ _id: ObjectId.createFromHexString(user_id) });

    res.status(200).send();
  }
  @post('/login')
  @description('Authenticate user')
  async login(req: Request<null, null, UserBody>, res: Response): Promise<void> {
    const { body } = req;

    const result = LoginValidator.validate({ ...body });
    if (result.error) {
      res.status(422).send(result.error.details);
      return;
    }

    const { email, password } = body;
    const user = await UserModel.findOne({ email, password }, { password: 0 });
    if (user) {
      res.status(200).send(user);
      return;
    }
    res.status(404).send([{ message: 'user not found' }]);
  }
  @get('/:user_id/services')
  @description('Find user services')
  async userServices(req: Request<UserParams, null, null>, res: Response): Promise<void> {
    try {
      const { params } = req;
      const { user_id } = params;
      if (!user_id) return;
      const services = await ServiceModel.find({ owner_id: ObjectId.createFromHexString(user_id) });
      res.send(services);
    } catch (error) {
      res.status(500).send(error);
    }
  }

  @get('/:user_id/purchases')
  @description('Find user purchases')
  async userPurchases(req: Request<UserParams, null, null>, res: Response): Promise<void> {
    try {
      const { params } = req;
      const { user_id } = params;
      const services = await PurchaseModel.aggregate([
        { $match: { owner_id: ObjectId.createFromHexString(user_id) } },
        {
          $lookup: {
            from: 'services',
            localField: 'service_id',
            foreignField: '_id',
            as: 'service'
          }
        },
        { $unwind: '$service' }
      ]);
      res.send(services);
    } catch (error) {
      res.status(500).send(error);
    }
  }
}
