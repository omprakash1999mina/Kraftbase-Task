import { Agent, Order } from "../models";
import CustomErrorHandler from '../Services/CustomerrorHandler';
import { OrderStatusValidation } from '../validators';

const orderController = {
    async update_status(req, res, next) {
        const { error } = OrderStatusValidation.validate(req.body);
        if (error) {
            return next(error);
        }
        try {
            const status_Array = ["Placed", "Accepted", "Rejected", "In Process", "Ready", "Out For Delivery"]
            const { orderId, status_id } = req.body;
            // const {orderId,customerId,status} = req.body;
            if (status_id < 0 || status_id > 5) return next(CustomErrorHandler.badRequest());
            let agentId = "Not Assigned";
            if (status_id == 4) agentId = assignAgent();
            const customerId = req.user._id;
            await Order.findOneAndUpdate({ _id: orderId }, {
                status: status_Array[status_id],
                agentId,
                updatedBy: customerId,
            });
        } catch (err) {
            return next(CustomErrorHandler.serverError());
        }
        res.status(200).json({ msg: "Order Status Updated Successfully." });
    },
    async get_status(req, res, next) {
        try {
            const order_data = await Order.findOne({ _id: req.params.id }).select('-__v -updatedAt -customerId');
            res.status(200).json(order_data);
        } catch (err) {
            return next(CustomErrorHandler.serverError());
        }
    }
}
export default orderController;

const assignAgent = async () => {
    const agent = await Agent.findOneAndUpdate({ status: "Available" }, {
        status: "Assigned"
    });
    return agent;
}