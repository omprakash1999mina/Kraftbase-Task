import { Restaurant,Menu } from "../models";
import CustomErrorHandler from '../Services/CustomerrorHandler';
import discord from '../Services/discord';

const restaurantController = {
    async get_All_Online(req, res, next) {
        //  use pagination here for big data library is mongoose pagination
        let document;
        try {
            document = await Restaurant.find({ status: "Available" }).select('-__v -updatedAt');
        } catch (err) {
            discord.SendErrorMessageToDiscord("Restaurant Controller", "Get All Restaurant Online", err.message)
            return next(CustomErrorHandler.serverError());
        }
        res.json(document);
    },
    async get_Menu(req, res, next) {
        let document;
        try {
            document = await Menu.findOne({ customerId: req.params.id }).select('-__v -updatedAt -customerId');
            if (!document) {
                discord.SendErrorFeedbackToDiscord(req.params.id, "Menu Find One", "No such Menu in DB");
                return next(CustomErrorHandler.badRequest("No such Menu exist."));
            }
        } catch (err) {
            return next(CustomErrorHandler.serverError());
        }
        res.json(document);
    }
}
export default restaurantController;