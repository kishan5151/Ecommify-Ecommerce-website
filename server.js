require('dotenv').config();
const express=require("express");
const colors=require("colors");
const morgan=require("morgan");
const connectDB=require("./config/conn");
const cors=require("cors");

//port
const port=process.env.PORT || 8080;

//database connection
connectDB();

//rest Object
const app=express();

//middelwares
app.use(express.json());
app.use(morgan('dev'));
app.use(cors());

//routes
//routes import
const authRoutes =require("./routers/authRoutes");
const categoryRotres= require("./routers/categoryRoutes");
const productRoutes= require("./routers/productRoutes");

//use routes
app.use('/api/v1/auth',authRoutes);
app.use('/api/v1/category',categoryRotres);
app.use('/api/v1/product',productRoutes);

//rest API
app.get("/",(req,res)=>{
    res.send("<h1>Welcome to E-commerce MERN Stack App</h1>");
})

//listen the server
app.listen(port,()=>{
    console.log(`Server Running on Port Number : ${port}`.bgCyan.white);
})