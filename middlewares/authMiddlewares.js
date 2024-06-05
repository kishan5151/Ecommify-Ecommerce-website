const jwt=require("jsonwebtoken");
const User = require("../models/userModel");

//protected route using jwt
const requiredSignIn = async(req,res,next)=>{
    try {
        // console.log(req.headers.authorization);
        const decode=await jwt.verify(req.headers.authorization, process.env.JWT_SECREAT);
        req.user=decode;
        next();
    } catch (error) {
        console.log(error);
    }
}

//admin Access
const isAdmin= async(req,res,next)=>{
    try {
        // console.log(req.user);
        const user=await User.findById(req.user._id);
        // console.log(user);
        if(user.role !== 1){
            console.log("1");
            return res.status(401).send({
                success:false,
                message:" Unauthorized Access"
            });
        }else{
            console.log("2");
            next();
        }
    } catch (error) {
        console.log("3");
        console.log(error);
        res.status(401).send({
            success:false,
            message:"Invalid Admin",
            error
        })
    }
}

module.exports={requiredSignIn,isAdmin}