const { default: slugify } = require("slugify");
const Product = require("../models/productModel");
const fs= require('fs');
const Category = require("../models/categoryModel");
//for payment perpose
var braintree = require("braintree");
const Order = require("../models/orderModel");

const createProductController = async (req, res) => {
  try {
    const { name, description, price, category, quantity, shipping } =
      req.fields;
    const { photo } = req.files;
    //Validation
    switch (true) {
      case !name:
        return res.status(500).send({ error: "Name is Required" });
      case !description:
        return res.status(500).send({ error: "Description is Required" });
      case !price:
        return res.status(500).send({ error: "Price is Required" });
      case !category:
        return res.status(500).send({ error: "Category is Required" });
      case !quantity:
        return res.status(500).send({ error: "Quantity is Required" });
      case photo && photo.size > 1000000:
        return res
          .status(500)
          .send({ error: "photo is Required and should be less then 1mb" });
    }

    const products = new Product({ ...req.fields, slug: slugify(name) });
    if (photo) {
      products.photo.data = fs.readFileSync(photo.path);
      products.photo.contentType = photo.type;
    }
    await products.save();
    res.status(201).send({
      success: true,
      message: "Product Created Successfully",
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error in crearing product",
    });
  }
};

//get All products
const getAllProductsController=async (req,res)=>{
    try {
        const products= await Product.find({}).populate('category').select("-photo").limit(12).sort({createAt: -1});
        res.status(200).send({
            success: true,
            message: "Get All Products",
            totalproducts: products.length,
            products
        });
    } catch (error) {
        console.log(error);
        req.status(500).send({
            success: false,
            message: "Error while get All products",
            error
        })
    }
}

//get single product using slug
const getSingleProductsController=async (req,res)=>{
    try {
        const {slug}=req.params;
        const product= await Product.findOne({slug:slug}).select("-photo").populate('category');
        res.status(200).send({
            success: true,
            message: "Successfully Single Product Get",
            product
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error while get single product",
            error
        })
    }
}

//get product photo
const getProductPhotoController=async(req,res)=>{
    try {
        const {pid} = req.params;
        const product = await Product.findById({_id:pid}).select("photo");
        if(product.photo.data){
            res.set('Content-type',product.photo.contentType);
            return res.status(200).send(product.photo.data);
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error While get Product photo",
            error
        })
    }
}

//delete Product
const deleteProduct= async(req,res)=>{
    try {
        const {id} = req.params;
        await Product.findByIdAndDelete({_id:id});
        res.status(200).send({
            success: true,
            message: "Prodect deleting Successfully",
        })
        
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error while Deleting The Product",
            error
        })
    }
}

//update product 
const updateProductController=async(req,res)=>{
    try {
        const {name,description,price,category,quantity,shipping}=req.fields;
        const {photo}= req.files

        //save the product in database
        const product =await Product.findByIdAndUpdate(req.params.pid,{...req.fields , slug:slugify(name)},{new:true})
        //validate photo
        if(photo){
            product.photo.data = fs.readFileSync(photo.path);
            product.photo.contentType = photo.type;
        }
        await product.save();
        res.status(201).send({
            success: true,
            message: "Product is Updated",
            product
        })
    }catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error while Update the Product",
            error
        })
    }
}

//get filtered product
const applyProductFilterController=async(req,res)=>{
  try {
    const {checked,radio} = req.body;
    let args={};
    if(checked.length > 0){
      args.category = checked; 
    }
    if(radio.length){
      args.price = {$gte : radio[0] , $lte : radio[1]};
    }

    const products= await Product.find(args);

    res.status(200).send({
      success: true,
      message: "Success fully filtered",
      products
    })
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success:false,
      message: "Error While filtering Products",
      error
    })
  }
}

//product count
const productCountController =async(req,res)=>{
  try {
    const total= await Product.find({}).estimatedDocumentCount();
    res.status(200).send({
      success: true,
      total
    })
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success:false,
      error,
      message: "Error in product Count"
    })
  }
}

//product per page
const productListController=async (req,res)=>{
  try {
    const perPage=6;
    const page = req.params.page ? req.params.page : 1;
    const products = await Product
      .find({})
      .select("-photo")
      .skip((page-1) * perPage)
      .limit(perPage)
      .sort({createdAt : -1});

  res.status(200).send({
    success: true,
    products
  })
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: true,
      message: "Error in Page product",
      error
    })
  }
}

//search product controller
const searchProductController=async(req,res)=>{
  try {
    const {keyword} = req.params;
    const result = await Product.find({
      $or: [
        {name : {$regex : keyword , $options : "i"}},
        {description : {$regex : keyword , $options : "i"}},
      ]
    }).select("-photo");

    res.json(result);
    
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "Error while search the Product",
      error
    })
  }
}

//similar product
const similarProductController = async(req,res)=>{
  try {
      const {pid,cid} = req.params;
      const similarList = await Product.find({
        category: cid,
        _id:{$ne:pid}
      }).select("-photo").limit(5).populate("category");
      res.status(200).send({
        success: true,
        similarList
      });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "Error while got Similar Product",
      error
    })
  }
}

//get Category wise product
const categoryWiseProductController = async(req,res)=>{
  try {
    const {slug} = req.params;
    const category= await Category.find({slug:slug});
    const products= await Product.find({category}).populate("category");
    res.status(200).send({
      success: true,
      message: "sucessfully get",
      category,
      products
    })
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "Error While got Category wise Product",
      error
    })
  }
}

//payment related part starts hear
var gateway = new braintree.BraintreeGateway({
  environment: braintree.Environment.Sandbox,
  merchantId: process.env.BRAINTREE_MERCHENT_ID,
  publicKey: process.env.BRAINTREE_PUBLIC_KEY,
  privateKey: process.env.BRAINTREE_PRIVATE_KEY,
});

const brainTreeTokenController= async(req,res)=>{
  try {
    gateway.clientToken.generate({}, function(error,response){
      if(error){
        res.status(500).send(error);
      }else{
        res.send(response);
      }
    })
  } catch (error) {
    console.log(erroe)
  }
}

const brainTreePaymentController= async(req,res)=>{
  try {
    const {cart, nonce} = req.body;
    let total=0;
    cart.map((ele)=>{
      total = total + ele.price
    });
    let newTransaction = gateway.transaction.sale({
      amount: total,
      paymentMethodNonce: nonce,
      options:{
        submitForSettlement: true
      }
    },function(error,result){
      if(result){
        const order = new Order({
          products: cart,
          payment: result,
          buyer: req.user._id
        }).save();
        res.json({ok:true});
      }else{
        res.status(500).send(error);
      }
    })
  } catch (error) {
    console.log(error);
  }
}
module.exports={createProductController, getAllProductsController, getSingleProductsController, getProductPhotoController, deleteProduct, updateProductController,applyProductFilterController, productCountController, productListController, searchProductController, similarProductController, categoryWiseProductController, brainTreeTokenController,brainTreePaymentController};