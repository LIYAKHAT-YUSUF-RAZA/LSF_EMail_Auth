// returns user deatisl 
// import { useReducer } from "react";
import userModel from "../models/userModel.js"
export const getUserData = async(req, res) => {
    try {
        // const {userId} = req.body;
        const userId = req.userId; // Assuming userId is set in the request by userAuth middleware
        const user = await userModel.findById(userId);

        if(!user) {
            return res.json({success: false, message: 'User not found in getUserData in userController.js'})      
        }

        res.json({
            success : true,
            userData : {
                name : user.name,
                isAccountVerified : user.isAccountVerified
            }
        });


    } catch (error) {
        res.json({success: false, message:'error in getUserData in userController.js'+error.message})
    }
}