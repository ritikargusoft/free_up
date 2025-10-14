import Joi from "joi";
export const uploadImageSchema = Joi.object({
  product_id: Joi.number().integer().required(),
  is_thumbnail: Joi.boolean().optional().default(false),
});
export const deleteImageSchema = Joi.object({
  image_uuid: Joi.string()
    .guid({ version: ["uuidv4", "uuidv5"] })
    .required(),
});
export const listImagesSchema = Joi.object({
  product_id: Joi.number().integer().required(),
});
