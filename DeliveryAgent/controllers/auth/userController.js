import { Agent } from "../../models";
import CustomErrorHandler from "../../Services/CustomerrorHandler";
import bcrypt from 'bcrypt';
import Joi from 'joi';

const AgentController = {
    async getUsersOne(req, res, next) {

        let document;
        try {
            document = await Agent.findOne({ _id: req.params.id }).select('-updatedAt -__v -createdAt -password -_id');
        } catch (err) {
            discord.SendErrorMessageToDiscord(req.params.id, "Get one Agent", err);
            return next(CustomErrorHandler.serverError());
        }
        res.json(document);
    },

    async update(req, res, next) {
        // validation
        const updateSchema = Joi.object({
            name: Joi.string().min(3).max(100).required(),
            email: Joi.string().email().required(),
            age: Joi.string().min(18).required(),
            gender: Joi.string().required(),
            password: Joi.string().min(8).max(50).required(),
        });

        const { error } = updateSchema.validate(req.body);

        // if error in the updation of profile delete the uploaded file 
        if (error) {
            return next(CustomErrorHandler.badRequest());
        }

        try {
            const agent = await Agent.findOne({ email: req.body.email });
            if (!agent) {
                discord.SendErrorMessageToDiscord(req.body.email, "Update Agent", "error Agent not exist in database !");
                return next(CustomErrorHandler.wrongCredentials());
            }

            //password varification
            const match = await bcrypt.compare(req.body.password, agent.password);
            if (!match) {
                return next(CustomErrorHandler.wrongCredentials());
            }
            const { name, age, gender, email } = req.body;
            let document;
            document = await Agent.findOneAndUpdate({ _id: req.params.id }, {
                name,
                email,
                age,
                gender,
            }).select('-updatedAt -__v -createdAt');
        } catch (err) {
            discord.SendErrorMessageToDiscord(req.body.email, "Update Agent", err);
            return next(CustomErrorHandler.alreadyExist('This email is not registered please contact to technical team ! . '));
            // return next( err );
        }
        res.status(200).json({ msg: "Updated Successfully !!!  ", });
    }
}
export default AgentController;