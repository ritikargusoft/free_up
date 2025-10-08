import Joi from "joi"

export const registerSchema = Joi.object({
    name: Joi.string().min(2).max(150).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).max(128).required(),
    phone: Joi.string().allow("", null).max(50),
    address: Joi.string().allow("", null).max(500)
})

export const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
})

export const refreshSchema = Joi.object({
    refresh: Joi.string().optional()
})


export const updateUserSchema = Joi.object({
    name: Joi.string().min(2).max(150).optional(),
    phone: Joi.string().allow("", null).max(50).optional(),
    address: Joi.string().allow("", null).max(500).optional()
}).min(1)


export const changePasswordSchema = Joi.object({
    oldPassword: Joi.string().min(6).required(),
    newPassword: Joi.string().min(6).required(),
   
})