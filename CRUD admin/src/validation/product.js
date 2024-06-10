import Joi from "joi";

export const productValid = Joi.object({
    name: Joi.string().required(), 
    price: Joi.alternatives().try(Joi.number(), Joi.string()).required(),
    developer: Joi.string().required(),
    tag: Joi.array().items(Joi.string()).required()
})