// here we create the users model that will be stored in the database
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true, // to ensure that the email is unique
    },
    password: {
        type: String,
        required: true,
    },
    verifyOtp: {
        type: String,
        default: '', // user is not verified by default
    },
    verifyOtpExpireAt: {
        type: Number,
        default: 0, // user is not verified by default
    },
    isAccountVerified: {
        type: Boolean, // it can either true or false
        default: false, // user is not verified by default
    },
    resetOtp: {
        type: String,
        default: '', // user is not verified by default
    },
    resetOtpExpireAt: {
        type: Number,
        default: 0, // user is not verified by default
    },
})

const userModel = mongoose.models.user || mongoose.model('user', userSchema); // create a model from the schema
// 'user' is the name of the model and userSchema is the schema we created above
// 'mongoose.model('user', userSchema);' this line is used to create a model again and again whenever we run this code   so we will add mongoose.model

export default userModel;