import Joi from 'joi';

const schemaUser = Joi.object({
  _id: Joi.string(),
  name: Joi.string().min(3).max(30).required(),
  email: Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
    .required(),
  password: Joi.string().min(6).max(30).required(),
  cpf: Joi.number().integer(),
  phone_number: Joi.number().integer(),
  birth_date: Joi.date().iso().less('now').required(),
  role: Joi.string().alphanum().required(),
  created_at: Joi.string(),
  updated_at: Joi.string(),
  __v: Joi.number().integer()
});

const schemaLogin = Joi.object({
  email: Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
    .required(),
  password: Joi.string().alphanum().required()
});

export { schemaUser as UserValidator, schemaLogin as LoginValidator };
