import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const menuSchema = new Schema({
    restaurantId: {type: Object, required: true },
    items: {
        type: [{
            name: { type: String, required: true },
            price: { type: String, required: true },
            availability: { type: Boolean, default: true }
        }],
        required: true
    }
}, { timestamps: true  });

export default mongoose.model('Menu', menuSchema, 'menus');