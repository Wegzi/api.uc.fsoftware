import Joi from 'joi';

const schemaService = Joi.object({
  _id: Joi.string(),
  title: Joi.string().min(3).max(120).required(),
  description: Joi.string().min(3).max(3000).required(),
  value: Joi.number().integer(),
  team: Joi.array().items(Joi.string()).length(1).required(),
  tags: Joi.array().items(Joi.string()).length(1).required(),
  owner_id: Joi.string().alphanum().required(),
  created_at: Joi.string(),
  updated_at: Joi.string(),
  __v: Joi.number().integer()
});
const schemaServiceMessage = Joi.object({
  _id: Joi.string(),
  message: Joi.string().min(1).max(2000).required(),
  answerer: Joi.boolean().required(),
  owner_id: Joi.string().alphanum().required(),
  created_at: Joi.string(),
  updated_at: Joi.string(),
  __v: Joi.number().integer()
});

export { schemaService as ServiceValidator, schemaServiceMessage as ServiceMessageValidator };
