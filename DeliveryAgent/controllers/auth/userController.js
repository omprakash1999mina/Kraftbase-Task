import { Agent } from "../../models";
import CustomErrorHandler from "../../Services/CustomerrorHandler";
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
            age: Joi.string().required(),
            gender: Joi.string().required(),
            password: Joi.string().min(8).max(50).required(),
            status_id: Joi.number().required(),
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
            
            const { name, age, gender, email,status_id } = req.body;
            const status_array = ["Available","Assigned","Offline"];
            if(status_id<0 || status_id > 2) return next(CustomErrorHandler.badRequest());
            let document;
            document = await Agent.findOneAndUpdate({ _id: req.params.id }, {
                name,
                email,
                age,
                gender,
                status: status_array[status_id]
            }).select('-updatedAt -__v -createdAt');
        } catch (err) {
            discord.SendErrorMessageToDiscord(req.body.email, "Update Agent", err);
            return next(CustomErrorHandler.alreadyExist('This email is not registered please contact to technical team ! . '));
            // return next( err );
        }
        res.status(200).json({ msg: "Updated Successfully.", });
    }
}
export default AgentController;