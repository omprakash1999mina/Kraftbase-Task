import { Feedback, User } from "../models";
import CustomErrorHandler from '../Services/CustomerrorHandler';
import discord from '../Services/discord';
import { feedbackValidation } from '../validators';

const feedbackController = {
    async post(req, res, next) {
        const { error } = feedbackValidation.validate(req.body);
        if (error) {
            return next(error);
        }

        try {
            const { name, email, message } = req.body;
            const exist = await User.exists({ email });
            // console.log(exist)
            if (exist) {
                await Feedback.create({
                    name,
                    email,
                    message,
                });
            }
            else {
                discord.SendErrorFeedbackToDiscord(email, "contact us Feedback", "user not found in db/not registered");
                return next(CustomErrorHandler.badRequest("User not registered"));
            }
        } catch (err) {
            discord.SendErrorFeedbackToDiscord(req.body.email, "contact us Feedback", err);
            return next(err);
        }
        res.status(201).json({ message: "Feedback posted Successfully." });
    },
    async destroy(req, res, next) {
        try {
            const document = await Feedback.findOneAndRemove({ _id: req.params.id });
            if (!document) {
                discord.SendErrorFeedbackToDiscord(req.params.id, "contact us Feedback delete", "No such data in db for delete");
                return next(new Error("No such data for Delete."));
            }
            res.status(200).json("Successfully deleted.");
        } catch (err) {
            discord.SendErrorFeedbackToDiscord(req.params.id, "Feedback delete", err);
            return next(CustomErrorHandler.serverError());
        }
    },
    async get_All(req, res, next) {
        //  use pagination here for big data library is mongoose pagination
        let document;
        try {
            // document = await Product.find().select('-updatedAt -__v -createdAt').sort({_id: -1});
            document = await Feedback.find().select('-__v -updatedAt');
            if (!document) {
                discord.SendErrorFeedbackToDiscord("Find All", "Feedback Find All", "No such feedback");
                return next(CustomErrorHandler.badRequest("No such feedback."));
            }
        } catch (err) {
            return next(CustomErrorHandler.serverError());
        }
        res.json(document);
    },
    async get_One(req, res, next) {
        let document;
        try {
            document = await Feedback.find({ _id: req.params.id }).select('-__v -updatedAt');
            if (!document) {
                discord.SendErrorFeedbackToDiscord(req.params.id, "Feedback Find One", "No such feedback");
                return next(CustomErrorHandler.badRequest("No such feedback."));
            }
        } catch (err) {
            return next(CustomErrorHandler.serverError());
        }
        res.json(document);
    }
}
export default feedbackController;