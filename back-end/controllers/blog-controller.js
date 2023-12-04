import Blog from "../models/blog.js";
import User from "../models/user.js";
import mongoose from "mongoose";
export const getAllBlogs = async (req,res,next)=>{
    let blogs;
    try{
        blogs = await Blog.find();
    }catch(err){
        console.log(err);
    }
    if(!blogs){
        return res.status(404).json({message:"No Blog Found"});
    }
    return res.status(200).json({blogs});
}

export const addBlog = async (req,res,next)=>{
    const {title,description,image,user}= req.body;

    let existingUser ;
    try{
        existingUser = await User.findById(user);
    }catch(err){
        return console.log(err);
    }
    if(!existingUser){
        return res.status(400).json({message: 'User not exist with this ID'});
    }
    const blog = new Blog({
        title,
        description,
        image,
        user
    });
    try{
        const session = await mongoose.startSession();
        session.startTransaction();
        await blog.save({session});
        existingUser.blogs.push(blog);
        await existingUser.save({session});
        await session.commitTransaction();
        // await blog.save();
        // existingUser.blogs.push(blog);
        // await existingUser.save();
    }catch(err){
        return console.log(err);
    }
    return res.status(200).json({blog});
}

export const updateBlog = async (req,res,next) => {
    const {title,description} =req.body;
    const blogId = req.params.id;
    let blog;
    try{
        blog = await Blog.findByIdAndUpdate(blogId,{
            title,
            description
        })
        console.log(blog);
    }catch(err){
        return console.log(err);
    }
    if(!blog){
        return res.status(500).json({message: 'blog not exist'});
    }
    return res.status(200).json({blog});
}

export const deleteBlog = async (req,res,next) =>{
    const blogId =req.params.id;
    let blog;
    try{
        blog = await Blog.findByIdAndDelete(blogId).populate('user');
        await blog.user.blogs.pull(blog);
        await blog.user.save();
    }catch(err){
        return console.log(err);
    }
    if(!blog){
        return res.status(500).json({message: 'Unable to Delete'});
    }
    return res.status(200).json({message: 'Deleted Successfully'});
}

export const getById = async (req,res,next) =>{
    const blogId =req.params.id;
    let blog;
    try{
        blog = await Blog.findById(blogId);
    }catch(err){
        return console.log(err);
    }
    if(!blog){
        return res.status(404).json({message: "No Blog Found"});
    }
    return res.status(200).json({blog});
}