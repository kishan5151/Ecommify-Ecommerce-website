const mongoose = require("mongoose");

const orderSchema= new mongoose.Schema({
    products: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product"
        }
    ],
    payment: {},
    buyer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    status: {
        type: String,
        default: "Not Process",
        enum: ["Not Process", "Processing" , "Shipped" , "Deliverd" , "Cancel"]
    }
},{timestamps:true});

const Order = mongoose.model("Order", orderSchema);

module.exports=Order;