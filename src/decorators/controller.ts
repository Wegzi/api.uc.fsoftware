import 'reflect-metadata';
import { Request, Response, NextFunction, RequestHandler } from 'express';
import { MetadataKeys, Methods } from '.';
import { AppRouter } from '../AppRouter';
import { ControllerDetails, BodyValidatorProps } from '../definitions/Decorators';

/**
 * Simple Request Body validation
 *
 * @param keys properties to be validated
 */
function bodyValidators(keys: BodyValidatorProps[]): RequestHandler {
  return function bodyValidator(req: Request, res: Response, next: NextFunction) {
    if (!req.body) {
      res.status(422).send('Invalid request');
      return;
    }

    const errors: { [key: string]: string } = {};

    for (const key of keys) {
      let property: string;
      let message: string;

      if (typeof key === 'string') {
        property = key;
        message = `Missing property ${key}`;
      } else if (key instanceof Array) {
        property = key[0];
        message = key[1];
      } else {
        property = key.name;
        message = key.message;
      }

      if (!req.body[property]) {
        errors[property] = message;
      }
    }

    if (Object.keys(errors).length > 0) {
      res.status(422).send({ errors });
      return;
    }

    next();
  };
}

/**
 * Assembles and registers new Controller
 *
 * @param routePrefix Controller prefix
 * @param details Controller Details (optional)
 */
export function controller(routePrefix: string, details: ControllerDetails = {}) {
  // eslint-disable-next-line @typescript-eslint/ban-types
  return function (target: Function): void {
    const router = AppRouter.getInstance();

    const { name, description: controllerDescription, middlewares: controllerMiddlewares = [] } = details;

    AppRouter.addController({
      path: routePrefix,
      routes: [],
      name,
      description: controllerDescription
    });

    for (const key in target.prototype) {
      const routeHandler: RequestHandler = target.prototype[key];
      const path = Reflect.getMetadata(MetadataKeys.path, target.prototype, key);
      const method: Methods = Reflect.getMetadata(MetadataKeys.method, target.prototype, key);
      const middlewares = Reflect.getMetadata(MetadataKeys.middleware, target.prototype, key) || [];
      const { keys: requiredBodyProps } = Reflect.getMetadata(MetadataKeys.validator, target.prototype, key) || [];
      const description = Reflect.getMetadata(MetadataKeys.description, target.prototype, key);

      const validator = bodyValidators(requiredBodyProps);

      const finalPath = `${routePrefix !== '/' ? routePrefix : ''}${path}`;

      Reflect.defineMetadata('name', key, routeHandler);

      const handlers = [...controllerMiddlewares, ...middlewares, validator, routeHandler];

      if (path) {
        router[method](finalPath, handlers);

        AppRouter.addRoute(routePrefix, {
          method,
          path,
          description: description || '',
          handlers: handlers.reduce((names, handler) => {
            const name = Reflect.getMetadata('name', handler) || handler.name;
            return [...names, name];
          }, [])
        });
      }
    }
  };
}
