import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const RestaurantSchema = new Schema({
    userName: {type: String, required: true },
    menuId: {type: String, required: true },
    email: {type: String, required: true },
    address: {type: String, required: true },
    status: {type: String, required: true, default: "Available" },
    password: { type: String, required: true },
}, { timestamps: true  });

export default mongoose.model('Restaurant', RestaurantSchema, 'Restaurants');