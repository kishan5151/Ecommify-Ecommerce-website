const express= require("express");
const { craeteCategoryController, updateCategoryController, getAllCategoryController, getSingleCategoryController, deleteCategoryController } = require("../controllers/categoryController");
const { requiredSignIn, isAdmin } = require("../middlewares/authMiddlewares");

const router= express.Router();

//routing
//create category / post method
router.post('/create-category',requiredSignIn,isAdmin,craeteCategoryController);

//update Category
router.put('/update-category/:id',requiredSignIn,isAdmin,updateCategoryController);

//get all category
router.get('/getall-category',getAllCategoryController);

//get single category
router.get('/single-category/:slug',getSingleCategoryController);

//delete category
router.delete('/delete-category/:id',deleteCategoryController);



module.exports= router;