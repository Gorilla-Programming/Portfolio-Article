import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    firstName: { type: String },
    lastName: { type: String },
    email: { type: String, unique: true, sparse: true },
    username: { type: String, unique: true, sparse: true },
    password: { type: String, required: true },
    phone: { type: String },
    role: { type: String, default: 'user', enum: ['user', 'admin'] }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
export default User;
