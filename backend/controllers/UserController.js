const express = require('express');
const generateToken = require("../config/generateToken");
const User = require( '../models/UserModel');
const asyncErrorHandler = require('express-async-handler');

const registerUser = asyncErrorHandler( async ( req,res) => {
   const { name, email, password} = req.body;
    console.log(req.body.name);

    if(!name || !email || !password){
        res.status(400);
        throw new Error('Please Enter all fields');
    }

    const alreadyExists = await User.findOne({email});
    if(alreadyExists){
        res.status(400);
        throw new Error('Email already exists');
    }
    const user = await User.create({
        name , email , password
    })

    if(user){
        res.status(201).json({
            _id:user._id,
            name:user.name,
            email:user.email,
            token:generateToken(user._id)
        })
    }else{
        res.status(400);
        throw new Error("Failed to create User");
    }

})

const loginUser = asyncErrorHandler(async (req, res) => {
    const {email , password} = req.body;

    if(!email || !password) {
        res.status(400);
        throw new Error('Please fill all fields');
    }
    const user = await User.findOne({email});
    if(user && (await user.matchPassword(password))){
        res.status(201).json({
            _id:user._id,
            name:user.name,
            email:user.email,
            token:generateToken(user._id)
        })
    }else{
        res.status(401);
       throw new Error("Invalid email or password");
    }
})

module.exports = {registerUser , loginUser};