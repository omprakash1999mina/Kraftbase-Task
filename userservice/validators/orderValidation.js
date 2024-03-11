import Joi from 'joi';

const orderSchema = Joi.object({
    restaurantId : Joi.string().required(),
    name : Joi.string().required(),
    items: Joi.object().required(),
    phone: Joi.string().required(),
    menuId: Joi.string().required(),
    address: Joi.string().required(),
    paymentType: Joi.string(),
    status: Joi.string()
});

export default orderSchema;