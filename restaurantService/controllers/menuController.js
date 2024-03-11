import { Order, User, Menu, Restaurant } from "../models";
import CustomErrorHandler from '../Services/CustomerrorHandler';
import { MenuValidation } from '../validators';
import discord from '../Services/discord';

const menuController = {
    async create(req, res, next) {
        // console.log(req.user);
        const { error } = MenuValidation.validate(req.body);
        if (error) return next(CustomErrorHandler.badRequest());
        const restaurantId = req.user._id;
        let document;
        try {
            const { items } = req.body;
            // items = [{name: chicken, price: 200, availability: true}]
            const exist = await Menu.findOne({ restaurantId: restaurantId });
            if (exist) return next(CustomErrorHandler.badRequest("Menu Already Exist."))
            try {
                document = await Menu.create({
                    restaurantId,
                    items
                });
                const rest = await Restaurant.findOneAndUpdate({_id: restaurantId},{
                    menuId: document._id
                });
                if(!rest) discord.SendErrorMessageToDiscord(restaurantId,"Create Menu", "Error in update restaurant menu id");
                // console.log(document);
            } catch (err) {
                return next(CustomErrorHandler.serverError(err));
            }
            res.status(201).json({ menuId: document._id, msg: "Menu created Successfully." });
        } catch (err) {
            discord.SendErrorMessageToDiscord(restaurantId,"Create Menu", err);
            return next(CustomErrorHandler.serverError());
        }
    },
    async update(req, res, next) {
        // console.log(req.user);
        const { error } = MenuValidation.validate(req.body);
        if (error) return next(CustomErrorHandler.badRequest());
        const restaurantId = req.user._id;
        let document;
        try {
            const { items } = req.body;
            // items = [{name: chicken, price: 200, availability: true}]
            try {
                document = await Menu.findOneAndReplace({ restaurantId: restaurantId },{
                    items
                });
                const rest = await Restaurant.findOneAndUpdate({_id: restaurantId},{
                    menuId: document._id
                });
                if(!rest) discord.SendErrorMessageToDiscord(restaurantId,"Update Menu", "Error in update restaurant menu id");
                // console.log(document);
            } catch (err) {
                return next(CustomErrorHandler.serverError(err));
            }
            res.status(200).json({ menuId: document._id, msg: "Menu Updated Successfully." });
        } catch (err) {
            discord.SendErrorMessageToDiscord(restaurantId,"Update Menu", err);
            return next(CustomErrorHandler.serverError());
        }
    },
    async getMenu(req, res, next) {
        //  use pagination here for big data library is mongoose pagination
        let document;
        try {
            document = await Menu.findOne({ customerId: req.params.id }).select('-__v ');
        } catch (err) {
            return next(CustomErrorHandler.serverError());
        }
        res.json(document);
    }
}
export default menuController;