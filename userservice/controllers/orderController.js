import { Order, User, Menu, Restaurant } from "../models";
import CustomErrorHandler from '../Services/CustomerrorHandler';
import discord from "../Services/discord";
import { OrderValidation } from '../validators';

const orderController = {
    async place(req, res, next) {
        // console.log(req.user);
        const { error } = OrderValidation.validate(req.body);
        if (error) return next(CustomErrorHandler.badRequest());

        try {
            const { restaurantId, menuId, name, items, phone, address } = req.body;
            // items = [{SN: 1, count: 2}]
            const { _id } = req.user;
            const exist = await User.exists({ _id: _id });

            if (exist) {
                let document;
                try {
                    let rest = await Restaurant.findOne({ _id: restaurantId });
                    if (rest.status != 'Available') return next(CustomErrorHandler.badRequest("Restaurant is unavailable or Offline."));
                    let menu = await Menu.findOne({ _id: menuId });
                    if (!menu) return next(CustomErrorHandler.badRequest("No Menu exist."))
                    let totalGrand = 0;
                    const entries = Object.entries(items);
                    entries.map(([k, v]) => {
                        const key = Number(k);
                        const value = Number(v);
                        totalGrand += (Number(menu.items[key].price) * value);
                    })

                    document = await Order.create({
                        customerId: _id,
                        restaurantId,
                        name,
                        items,
                        phone,
                        totalGrand,
                        address
                    });
                    // console.log(document);
                    res.status(201).json({id: document._id, msg: "Order Palaced Successfully." });
                } catch (err) {
                    // console.log(err)
                    discord.SendErrorMessageToDiscord(restaurantId, "Order Place", err);
                    return next(CustomErrorHandler.serverError());
                }
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
            let id = req.user._id;
            document = await Order.find({customerId: id}).select('-__v -updatedAt -customerId');
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
