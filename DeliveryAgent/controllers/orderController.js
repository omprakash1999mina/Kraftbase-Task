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
            const status_Array= ["Placed","Accepted","Rejected","In Process","Ready","Out For Delivery"]
            const {orderId,status_id} = req.body;
            // const {orderId,customerId,status} = req.body;
            if (status_id<0 || status_id>5) return next(CustomErrorHandler.badRequest());

            await Order.findOneAndUpdate({ _id: orderId }, {
                status: status_Array[status_id],
                updatedBy: customerId
            });
        } catch (err) {
            return next(CustomErrorHandler.serverError());
        }
        res.status(200).json({ msg: "Order Status Updated Successfully." });
    }
}
export default orderController;
