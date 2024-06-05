const express=require("express");
const {registerController,loginController, testController, forgetPassword,updateUserControlle, orderController, getAllOrderForAdminController, updateOrderStatusController}=require("../controllers/authController");
const {requiredSignIn,isAdmin}= require("../middlewares/authMiddlewares");
//router object
const router=express.Router();

//routing
//Register API / Method post
router.post('/register',registerController);

//LOGIN / method POST
router.post('/login',loginController);

//forget Password /method posr
router.post('/forget-password',forgetPassword);

//test routes
router.get('/test',requiredSignIn,isAdmin,testController);

//protected user Routes /method get
router.get('/user-auth', requiredSignIn, (req,res)=>{
    res.status(200).send({ok:true});
});

//protected Admin Rotes /method get
router.get('/admin-auth',requiredSignIn, isAdmin, (req,res)=>{
    res.status(200).send({ok:true});
})

//update user 
router.put('/user-update',requiredSignIn,updateUserControlle);    

//get all order
router.get('/user/order', requiredSignIn ,orderController);

//all orders for admin to show
router.get('/admin-all-order',requiredSignIn, isAdmin, getAllOrderForAdminController);

//update status of order
router.put("/order-status/:orderId" , requiredSignIn, isAdmin, updateOrderStatusController)

module.exports=router;