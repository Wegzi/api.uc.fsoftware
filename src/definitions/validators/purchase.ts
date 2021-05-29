import Joi from 'joi';

const schemaPurchaseReport = Joi.object({
  _id: Joi.string(),
  title: Joi.string().min(3).max(120).required(),
  message: Joi.string().min(3).max(3000).required(),
  owner_id: Joi.string().alphanum().required(),
  purchase_id: Joi.string(),
  created_at: Joi.string(),
  updated_at: Joi.string(),
  __v: Joi.number().integer()
});

export { schemaPurchaseReport as PurchaseReportValidator };

// owner_id, title, message
