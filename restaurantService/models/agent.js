import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const agentSchema = new Schema({
    name: { type: String, required: true },
    password: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    age: {type:String, default: ""},
    gender: {type:String, default: "Male" },
    status: {type:String, default: "Available" },
}, { timestamps: true });

export default mongoose.model('Agent', agentSchema, 'agents');




