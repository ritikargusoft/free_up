import Joi from "joi";

export const autoCompleteBrandSchema = Joi.object({
  q: Joi.string().optional().allow(""),
  limit: Joi.number().integer().min(1).max(50).default(8),
});

export const createBrandSchema = Joi.object({
  name: Joi.string().trim().min(1).max(255).required(),
  description: Joi.string().allow("", null).optional(),
});

export const updateBrandSchema = Joi.object({
  name: Joi.string().trim().min(1).max(255).optional(),
  description: Joi.string().allow("", null).optional(),
}).min(1);