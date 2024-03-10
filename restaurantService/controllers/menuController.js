import { Order, User, Menu } from "../models";
import CustomErrorHandler from '../Services/CustomerrorHandler';
import { OrderValidation } from '../validators';

const menuController = {
    async create(req, res, next) {
        // console.log(req.user);
        const { error } = MenuValidation.validate(req.body);
        if (error) return next(error);

        try {
            const { restaurantId, items } = req.body;
            // items = [{name: chicken, price: 200, availability: true}]
            try {
                await Menu.create({
                    restaurantId,
                    items
                });
                // console.log(document);
            } catch (err) {
                return next(err);
            }
            res.status(201).json({ msg: "Order Palaced Successfully." });
        } catch (err) {
            return next(CustomErrorHandler.serverError());
        }
    },
    async update(req, res, next) {
        // console.log(req.user);
        const { error } = MenuValidation.validate(req.body);
        if (error) return next(error);

        try {
            const { restaurantId, name, items, phone, address } = req.body;
            // items = [{SN: 1, count: 2}]
            const { _id } = req.user;
            const exist = await User.exists({ _id: _id });

            if (exist) {
                try {
                    let menu = await Menu.findOne({ restaurantId });
                    let totalGrand = 0;
                    items.forEach(it => {
                        totalGrand += menu[it.SN].price;
                    });
                    await Order.create({
                        customerId: _id,
                        name,
                        items,
                        phone,
                        totalGrand,
                        address
                    });
                } catch (err) {
                    return next(err);
                }
                res.status(201).json({ msg: "Order Palaced Successfully." });
            }
        } catch (err) {
            return next(CustomErrorHandler.alreadyExist('User not logged in.'));
        }
    },
    async getMenu(req, res, next) {
        //  use pagination here for big data library is mongoose pagination
        let document;
        try {
            document = await Menu.findOne({ customerId: req.params.id }).select('-__v -updatedAt -customerId');
        } catch (err) {
            return next(CustomErrorHandler.serverError());
        }
        res.json(document);
    }
}
export default menuController;