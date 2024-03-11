import Joi from 'joi';

const MenuValidation = Joi.object({
    items: Joi.array().items(Joi.object({
      name: Joi.string().required(),
      price: Joi.string().required(),
      availability: Joi.boolean().required(),
    })).required()
});

export default MenuValidation;