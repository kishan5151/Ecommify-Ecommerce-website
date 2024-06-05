const express= require('express');
const { requiredSignIn, isAdmin } = require('../middlewares/authMiddlewares');
const { createProductController, getAllProductsController, getSingleProductsController, getProductPhotoController, deleteProduct, updateProductController, applyProductFilterController, productCountController, productListController, searchProductController, similarProductController, categoryWiseProductController, brainTreeTokenController, brainTreePaymentController } = require('../controllers/productController');
const router= express.Router();
const formidable = require('express-formidable');

//routers
//create Product
router.post('/create-product',requiredSignIn,isAdmin,formidable() ,createProductController)

//get all products
router.get('/getall-products',getAllProductsController);

//get single product
router.get('/single-product/:slug',getSingleProductsController);

//get product photo
router.get('/product-photo/:pid',getProductPhotoController);

//update product /post
router.put('/update-product/:pid',requiredSignIn ,isAdmin , formidable() ,updateProductController)

//delete Product
router.delete('/delete-product/:id',deleteProduct);

//filter Routes
router.post('/product-filter',applyProductFilterController);

//count products
router.get('/product-count',productCountController);

//product per Page
router.get('/product-list/:page',productListController);

//search product route
router.get('/search-product/:keyword',searchProductController);

//similar Products
router.get('/similar-product/:pid/:cid',similarProductController)

//category Wise all product
router.get('/category-wise-product/:slug', categoryWiseProductController)

//payment Routes
//get token
router.get('/braintree/token', brainTreeTokenController);

//payments
router.post('/braintree/payment', requiredSignIn ,brainTreePaymentController);

module.exports= router;