import express from "express";
import mongoose from "mongoose";
import {User} from "../db";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import {z} from "zod";
import {userSchema} from "../validators/userValidation";


const Router= express.Router();

Router.post("/signup",async(req,res)=>{
    const {name, email, password, role, department}=req.body;

    try{
        
    const {success}=userSchema.safeParse(req.body);
    if(!success){
        return res.status(411).json({
            message:"incorrect inputs"
        })
    }

    const existingUser= await User.findOne({ email })
    if(existingUser){
        return res.status(404).json({
            message:"user already exists"
        });
    }

    const hashedPassword= await bcrypt.hash(password,10);
    const user = await User.create({
    username,
    firstname,
    lastname,
    password: hashedPassword
});
     
    const userId= user._id;
    
    const token= jwt.sign({
            userId
        },process.env.JWT_SECRET);
    
        res.status(201).json({
        message: "User created successfully",
        token:token
        })


    }catch(err){
        
         message:err.message
        
    }
})

Router.post("/signin",async(req,res)=>{
    const {username,password} =req.body;
    try{
    const user= await User.findOne({
        email
    });
    if(!user){
        return res.status(400),json({
            message:"user does not exist"
        })
    }

    const isMatch= await bcrypt.compare(password, user.password);
    if(!isMatch){
      return res.status(401).json({
            message:"invalid credentials"
        })
    }

    const userId= user._id;
    
    const token= jwt.sign({
        userId
    },process.env.JWT_SECRET);

    res.json({
        message:"login successful",
        token:token
    })
} catch(err){
    message:err.message
}


})