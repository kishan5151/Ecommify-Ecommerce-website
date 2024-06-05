const mongoose=require("mongoose");
const colors=require("colors");

const connectDB=async ()=>{
    try {
        const conn=await mongoose.connect(process.env.MONGODB_URL);
        console.log(`Database Successfully connected ${conn.connection.host}`.bgGreen.white)
        
    } catch (error) {
        console.log(`Error In Mongodb connection ${error}`.bgRed.white);
    }
}

module.exports=connectDB;