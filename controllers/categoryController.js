const { default: slugify } = require("slugify");
const Category = require("../models/categoryModel");

const craeteCategoryController= async (req,res)=>{
    try {
        const {name} = req.body;
        // console.log(name);
        //validation
        if(!name){
            return res.status(401).send({message:"Name is required"});
        }
        //check existance of category
        const existibgCategory= await Category.findOne({name});
        if(existibgCategory){
            return res.status(200).send({
                success: true,
                message: "Category already Exists"
            })
        }

        //if not exists then store in databse
        const category= await new Category({
            name:name,
            slug: slugify(name)
        }).save();

        // send the response
        res.status(201).send({
            success: true,
            message: "Successfully Category Created",
            category
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error in Category",
            error
        })
    }
}

const updateCategoryController=async (req,res)=>{
    try {
        const {name}= req.body;
        const {id}=req.params;  
        const category= await Category.findByIdAndUpdate(id,{name: name,slug:slugify(name)},{new:true});
        res.status(200).send({
            success: true,
            message: "Category Update Successfully",
            category
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error while update category",
            error
        })
    }
}

const getAllCategoryController=async(req,res)=>{
    try {
        const category= await Category.find({});
        res.status(200).send({
            success: true,
            message: "All Categories list",
            category
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: "Error while getting all category",
            error
        })
    }
}

const getSingleCategoryController= async(req,res)=>{
    try {
        const {slug}=req.params;
        const singleCat= await Category.findOne({slug:slug});
        res.status(200).send({
            success: true,
            message: "Successfully get Single Category",
            singleCat
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error while getting single category",
            error
        })
    }
}

const deleteCategoryController= async (req,res)=>{
    try {
       const {id} = req.params;
       await Category.findByIdAndDelete({_id:id});
       res.status(200).send({
        success: true,
        message: "Category Deleted Successfully"
       }) 
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error while Deleting Category",
            error
        })
    }
}

module.exports={craeteCategoryController, updateCategoryController, getAllCategoryController, getSingleCategoryController, deleteCategoryController}