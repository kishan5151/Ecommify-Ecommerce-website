const Order = require('../models/orderModel');
const User=require('../models/userModel');
const {hashPassword, comparePassword} = require("../utils/authHelper");
const jwt=require('jsonwebtoken');

const registerController=async (req,res)=>{
    try {
        const {name, email ,password, phone, address, answer}=req.body;

        //validation
        if(!name){
            return res.send({message: "Name is Require"})
        }
        if(!email){
            return res.send({message: "Email is Require"})
        }
        if(!password){
            return res.send({message: "Password is Require"})
        }
        if(!phone){
            return res.send({message: "Phone No. is Require"})
        }
        if(!address){
            return res.send({message: "Address is Require"})
        }
        if(!answer){
            return res.send({message: "Remember field is Require if You forget Password"});
        }
        
        //existing user check
        const existinguser= await User.findOne({email: email});
        if(existinguser){
            return res.status(200).send({
                success: true,
                message: "User already register Please Login"
            })
        }

        //register User
        const hPassword= await hashPassword(password);
        //save the user in database
        const storeUser=await new User({
            name:name,
            email: email,
            password: hPassword,
            phone: phone,
            answer: answer,
            address
        }).save();
        res.status(201).send({
            success:true,
            message: "User Register Successfully",
            storeUser
        })

    } catch (error) {
        console.log(error);
        res.status(500).send({
            message:'Error in Registration',
            success: false,
            error: error
        })
    }
}

const loginController=async(req,res)=>{
    try {
        const {email, password}=req.body;

        //validation
        if(!email || !password){
            return res.status(404).send({
                success:false,
                message:"Invalid Email Or Password",
            })
        }

        //find the user
        const user=await User.findOne({email});
        if(!user){
            return res.status(404).send({
                success: false,
                message: "User Not Found ! Please Register First"
            })
        }
        
        //matched the password
        const matched = await comparePassword(password,user.password);
        if(matched == false){
            return res.status(200).send({
                success:false,
                message: "Invalid Password"
            })
        }
        //create token
        const token =await jwt.sign({_id:user._id}, process.env.JWT_SECREAT, {expiresIn: '7d'});
        //send final Response
        res.status(200).send({
            success:true,
            message:"Login Successfully",
            user:{
                name: user.name,
                email: user.email,
                phone: user.phone,
                address: user.address,
                role: user.role
            },
            token
        })
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            success:false,
            message: "Login Error",
            error
        })
    }
}

const forgetPassword= async(req,res)=>{
    const {email , answer , newPassword}= req.body;
    
    try {
        //validation
        if(!email){
            return res.send({message: "Email is Require"});
        }
        if(!answer){
            return res.send({message: "validate answer is Require"});
        }
        if(!newPassword){
            return res.send({message: "New Password is Require"});
        }

        //existance
        const user= await User.findOne({email,answer});
        if(!user){
            return res.status(404).send({
                success: false,
                message: "Wrong Email or answer"
            })
        }

        //decode the new password
        const hashNewPassword=await hashPassword(newPassword);

        await User.findByIdAndUpdate(user._id, {password : hashNewPassword});

        res.status(200).send({
            success: true,
            message: "Password Update Successfully"
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Password Not Updated ! Somthing went Wrong",
            error
        })
    }

}

const testController=(req,res)=>{
    res.send("protected Routes");
}

//update user controller
const updateUserControlle= async(req,res)=>{
    try {
        const {name,email,password,phone,address} = req.body;
        const user = await User.findById(req.user._id);

        //password
        if(password && password.length <6){
            return res.json({error: 'Password is required and 6 charecter long'});
        }
        const hPassword= password ? await hashPassword(password) : undefined;
        const updatedUser = await User.findByIdAndUpdate(req.user._id,{
            name: name || user.name,
            password: hPassword || user.password,
            phone: phone || user.phone,
            address: address || user.address,
            email : email || user.email
        },{new: true});
        res.status(200).send({
            success: true,
            message: "Profile Update Successfully",
            updatedUser
        })
    } catch (error) {
        console.log(error);
        res.status(400).send({
            success: true,
            message: "Error While Update the user",
            error
        })
    }
}

//get all order
const orderController=async (req,res)=>{
    try {
        const orders= await Order.find({buyer: req.user._id})
            .populate("products","-photo")
            .populate("buyer","name");
            
        res.json(orders);
    } catch (error) {
        console.log(error);
        res.status(400).send({
            success: false,
            message: "Error While get the order",
            error
        })
    }
}

//get All order for Admin
const getAllOrderForAdminController = async(req,res)=>{
    try {
        const orders= await Order
            .find({})
            .populate("products","-photo")
            .populate("buyer","name")
            .sort({createdAt : -1});
            
        res.json(orders);
    } catch (error) {
        console.log(error);
        res.status(400).send({
            success: false,
            message: "Error While get order for Admin",
            error
        })
    }
}

//update order status
const updateOrderStatusController=async(req,res)=>{
try {
    const { orderId } = req.params;
    const { status } = req.body;
    const orders = await Order.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    );
    res.json(orders);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error While Updateing Order",
      error,
    });
  }
}

module.exports={registerController,loginController,testController,forgetPassword,updateUserControlle,orderController, getAllOrderForAdminController,updateOrderStatusController};