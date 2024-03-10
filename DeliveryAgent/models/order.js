import mongoose from 'mongoose';
const Schema = mongoose.Schema;
 
const orderSchema = new Schema({
    customerId: {type: String, required: true },
    restaurantId: {type: String, required: true },
    name: {type: String, required: true },
    items: {type: Object, required: true },
    phone: {type: String, required: true },
    totalGrand: {type: Number, required: true },
    address: {type: String, required: true },
    paymentType: {type: String, default: 'COD' },
    status: {type: String, default: 'placed' },
    agentId: {type: String, default: 'Not Assigned' }
}, { timestamps: true  });

export default mongoose.model('Order', orderSchema, 'orders');
