import { Order } from "../models";
import CustomErrorHandler from '../Services/CustomerrorHandler';
import { OrderStatusValidation } from '../validators';

const orderController = {
    async status(req,res,next){
        const { error }=OrderStatusValidation.validate(req.body);
        if (error) {
            return next(error);
        }
        try {
            const {orderId,status} = req.body;
            // const {orderId,customerId,status} = req.body;
            let document = await Order.findOneAndUpdate({ _id: orderId }, {
                status,
                updatedBy: customerId
            });
            // console.log(document);
        } catch (err) {
            return next(CustomErrorHandler.serverError());
        }
        res.status(200).json({ msg: "Order Status Updated Successfully." });
    }
}
export default orderController;
