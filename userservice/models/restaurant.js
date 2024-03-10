import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const RestaurantSchema = new Schema({
    name: {type: String, required: true },
    storeOpen: {type: String, required: true },
    storeClose: {type: String, required: true },
    menuId: {type: String, required: true },
    email: {type: String, required: true },
    address: {type: String, required: true },
}, { timestamps: true  });

export default mongoose.model('Restaurant', RestaurantSchema, 'Restaurants');