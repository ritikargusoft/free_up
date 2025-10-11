import Joi from "joi";

export const autoCompleteCategorySchema = Joi.object({
  q: Joi.string().optional().allow(""),
  limit: Joi.number().integer().min(1).max(50).default(8),
});

export const createCategorySchema = Joi.object({
  name: Joi.string().trim().min(1).max(255).required(),
  description: Joi.string().allow("", null).optional(),
});

export const updateCategorySchema = Joi.object({
  name: Joi.string().trim().min(1).max(255).optional(),
  description: Joi.string().allow("", null).optional(),
}).min(1);