import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const userSchema = new Schema({
    userName: { type: String, required: true },
    password: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    age: {type:String, default: "None"},
    gender: {type:String, default: "Male" },
}, { timestamps: true });

export default mongoose.model('User', userSchema, 'users');




