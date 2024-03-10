import { User } from "../../models";
import CustomErrorHandler from "../../Services/CustomerrorHandler";
import bcrypt from 'bcrypt';
import Joi from 'joi';

const userController = {
    async getUsersOne(req, res, next) {
        let document;
        try {
            document = await User.findOne({ _id: req.params.id }).select('-updatedAt -__v -createdAt -password -_id');
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
            age: Joi.string().required(),
            gender: Joi.string().required(),
        });

        const { error } = updateSchema.validate(req.body);
        if (error) {
            return next(CustomErrorHandler.badRequest());
        }

        try {
            const user = await User.findOne({ email: req.body.email });
            if (!user) {
                discord.SendErrorMessageToDiscord(req.body.email, "Update User", "error user not exist in database !");
                return next(CustomErrorHandler.badRequest());
            }

            const { userName, age, gender, email } = req.body;
            await User.findOneAndUpdate({ _id: req.user._id}, {
                userName,
                age,
                gender,
                email,
            }).select('-updatedAt -__v -createdAt');
        } catch (err) {
            discord.SendErrorMessageToDiscord(req.body.email, "Update User", err);
            return next(CustomErrorHandler.alreadyExist('This email is not registered please contact to technical team.'));
        }
        res.status(200).json({ msg: "Updated Successfully !!!  ", });
    }
}

export default userController;