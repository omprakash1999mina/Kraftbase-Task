import { Order, User, Menu, Restaurant } from "../models";
import CustomErrorHandler from '../Services/CustomerrorHandler';
import discord from "../Services/discord";
import { OrderValidation } from '../validators';

const orderController = {
    async place(req, res, next) {
        // console.log(req.user);
        const { error } = OrderValidation.validate(req.body);
        if (error) return next(error);

        try {
            const { restaurantId, name, items, phone, address } = req.body;
            // items = [{SN: 1, count: 2}]
            const { _id } = req.user;
            const exist = await User.exists({ _id: _id });

            if (exist) {
                let document;
                try {
                    let restaurant = Restaurant.findOne({_id: restaurantId});
                    if(restaurantId.status != "Available") next(CustomErrorHandler.badRequest("Restaurant is unavailable or Offline."));
                    let menu = await Menu.findOne({ restaurantId });
                    let totalGrand = 0;
                    items.forEach(it => {
                        totalGrand += menu[it.SN].price;
                    });
                    document = await Order.create({
                        customerId: _id,
                        name,
                        items,
                        phone,
                        totalGrand,
                        address
                    });
                    // console.log(document);
                } catch (err) {
                    return next(err);
                }
                res.status(201).json({ msg: "Order Palaced Successfully." });
            }
            else return next(CustomErrorHandler.badRequest('User not logged in.')); 
        } catch (err) {
            return next(CustomErrorHandler.serverError(err.message));
        }
    },
    async get_Order_One(req, res, next) {
        let document;
        try {
            document = await Order.find({ customerId: req.params.id }).select('-__v -updatedAt -customerId');
            if (!document) {
                discord.SendErrorFeedbackToDiscord(req.params.id, "Order Find One", "No such Order in DB");
                return next(CustomErrorHandler.badRequest("No such Order exist."));
            }
        } catch (err) {
            return next(CustomErrorHandler.serverError());
        }
        res.json(document);
    },
    async get_Order_All(req, res, next) {
        //  use pagination here for big data library is mongoose pagination
        let document;
        try {
            document = await Order.find().select('-__v -updatedAt -customerId');
            if (!document) {
                discord.SendErrorFeedbackToDiscord(req.params.id, "Order Find All", "No such Orders in DB");
                return next(CustomErrorHandler.badRequest("No such Orders exist."));
            }
        } catch (err) {
            return next(CustomErrorHandler.serverError());
        }
        res.json(document);
    }
}
export default orderController;
