import Joi from "joi";

export const bulkAddCategoriesSchema = Joi.object({
  product_id: Joi.number().integer().required(),
  category_ids: Joi.array()
    .items(Joi.number().integer().required())
    .min(1)
    .required(),
});

export const deleteMappingSchema = Joi.object({
  product_id: Joi.number().integer().required(),
  category_id: Joi.number().integer().required(),
});

export const getCategoriesForProductSchema = Joi.object({
  product_id: Joi.number().integer().required(),
});
