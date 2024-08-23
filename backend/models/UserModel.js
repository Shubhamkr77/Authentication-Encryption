const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jsonwebtoken = require('jsonwebtoken');


const userschema = mongoose.Schema(
    {
        name:{type: String, required: true},
        email:{type: String , required: true,unique:true},
        password:{type:String , required : true},
        encrypted_data:{type:String},
        key:{type:String},
    },
     { timestamps: true }
);

userschema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

userschema.pre("save", async function (next) {
  if (!this.isModified) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model('User' , userschema);

module.exports = User;


