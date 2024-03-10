import { Order, User, Menu } from "../models";
import CustomErrorHandler from '../Services/CustomerrorHandler';
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
                    let menu = await Menu.findOne({restaurantId});
                    let totalGrand=0;
                    items.forEach(it => {
                        totalGrand+=menu[it.SN].price;
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
        } catch (err) {
            return next(CustomErrorHandler.alreadyExist('User not logged in.'));
        }
    },
    async getorders(req, res, next) {
        //  use pagination here for big data library is mongoose pagination
        let document;
        try {
            document = await Order.find({ customerId: req.params.id }).select('-__v -updatedAt -customerId');
        } catch (err) {
            return next(CustomErrorHandler.serverError());
        }
        res.json(document);
    }
}
export default orderController;
