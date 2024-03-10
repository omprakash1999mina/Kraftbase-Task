import Joi from 'joi';

const OrderStatusValidation = Joi.object({
    orderId: Joi.string().required(),
    status: Joi.string().required()
});

export default OrderStatusValidation;