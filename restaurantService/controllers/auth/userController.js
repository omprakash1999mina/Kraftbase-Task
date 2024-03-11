import { Restaurant } from "../../models";
import CustomErrorHandler from "../../Services/CustomerrorHandler";
import Joi from 'joi';

const userController = {
    async getUsersOne(req, res, next) {
        let document;
        try {
            document = await Restaurant.findOne({ _id: req.params.id }).select('-updatedAt -__v -createdAt -password -_id');
        } catch (err) {
            discord.SendErrorMessageToDiscord(req.params.id, "Get one user", err);
            return next(CustomErrorHandler.serverError());
        }
        res.json(document);
    },

    async update(req, res, next) {
        // validation
        const updateSchema = Joi.object({
            userName: Joi.string().min(3).max(100).required(),
            email: Joi.string().email().required(),
            address: Joi.string().required(),
            menuId: Joi.string().required(),
            status_id: Joi.number().required(),
            password: Joi.string().min(8).max(50).required()
        });

        const { error } = updateSchema.validate(req.body);
        if (error) {
            return next(CustomErrorHandler.badRequest());
        }

        try {
            const rest = await Restaurant.findOne({ email: req.body.email });
            if (!rest) {
                discord.SendErrorMessageToDiscord(req.body.email, "Update User", "error user not exist in database !");
                return next(CustomErrorHandler.badRequest());
            }

            const { userName, email, status_id, address, menuId, password } = req.body;
            const hashedPassword = await bcrypt.hash(password, 10);
            const status_Array = ["Available","Closed"];
            if(status_id<0 || status_id>1) return next(CustomErrorHandler.badRequest());

            await Restaurant.findOneAndUpdate({ _id: req.user._id }, {
                userName,
                email,
                menuId,
                address,
                status: status_Array[status_id],
                password: hashedPassword
            }).select('-updatedAt -__v -createdAt');
        } catch (err) {
            discord.SendErrorMessageToDiscord(req.body.email, "Update User", err);
            return next(CustomErrorHandler.alreadyExist('This email is not registered please contact to technical team.'));
        }
        res.status(200).json({ msg: "Updated Successfully.", });
    }
}

export default userController;