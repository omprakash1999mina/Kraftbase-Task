import Joi from 'joi';

const OrderStatusValidation = Joi.object({
    orderId: Joi.string().required(),
    status_id: Joi.number().required()
});

export default OrderStatusValidation;