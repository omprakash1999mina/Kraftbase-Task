import Joi from 'joi';

const orderSchema = Joi.object({
    restaurantId : Joi.string().required(),
    name : Joi.string().required(),
    items: Joi.object().required(),
    phone: Joi.string().required(),
    totalGrand: Joi.number().required(),
    address: Joi.string().required()
});

export default orderSchema;