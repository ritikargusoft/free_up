import Joi from "joi";

export const createProductSchema = Joi.object({
  product_name: Joi.string().trim().min(1).max(255).required(),
  description: Joi.string().allow("", null),
  brand_id: Joi.number().integer().optional(),
  brand_name: Joi.string().trim().min(1).max(255).optional(),
  categories: Joi.array()
    .items(Joi.alternatives().try(Joi.number().integer(), Joi.string().trim()))
    .optional(),
  condition: Joi.string().valid("used", "new", "refurbished").default("used"),
  status: Joi.string().valid("available", "sold", "draft").default("available"),
  available_quantity: Joi.number().integer().min(0).default(1),
  target_audience: Joi.string().allow("", null).optional(),
});

export const updateProductSchema = Joi.object({
  product_name: Joi.string().trim().min(1).max(255).optional(),
  description: Joi.string().allow("", null).optional(),
  brand_id: Joi.number().integer().optional(),
  brand_name: Joi.string().trim().min(1).max(255).optional(),
  categories: Joi.array()
    .items(Joi.alternatives().try(Joi.number().integer(), Joi.string().trim()))
    .optional(),
  condition: Joi.string().valid("used", "new", "refurbished").optional(),
  status: Joi.string().valid("available", "sold", "draft").optional(),
  available_quantity: Joi.number().integer().min(0).optional(),
  target_audience: Joi.string().allow("", null).optional(),
}).min(1);

export const listProductsSchema = Joi.object({
  limit: Joi.number().integer().min(1).max(200).default(20),
  offset: Joi.number().integer().min(0).default(0),
  q: Joi.string().allow("", null).optional(),
  brand_id: Joi.number().integer().optional(),
  category_id: Joi.number().integer().optional(),
  seller_uuid: Joi.string().uuid().optional(),
  status: Joi.string().optional(),
  target_audience: Joi.string().optional(),
  orderBy: Joi.string().optional(),
  orderDir: Joi.string().valid("ASC", "DESC", "asc", "desc").optional(),
});
