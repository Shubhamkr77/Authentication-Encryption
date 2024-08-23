const asyncErrorHandler = require("express-async-handler");
const User = require( '../models/UserModel');
const crypto = require('crypto');


const securedPage = asyncErrorHandler( async(req,res) => {
    res.status(201).json("Page accessed successfully");
})

// Encryption function
// function encrypt(text, key, iv) {
//     let cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(key), iv);
//     let encrypted = cipher.update(text);
//     encrypted = Buffer.concat([encrypted, cipher.final()]);
//     return encrypted.toString('hex');
// }

// const key = crypto.randomBytes(32); // 256-bit key
// const iv = crypto.randomBytes(16);  // Initialization vector

let algorithm = 'aes256'; // or any other algorithm supported by OpenSSL
const iv = crypto.randomBytes(16);



const encryptData = asyncErrorHandler(async(req,res) => {
    const {data,email} = req.body;
    if(!data || !email){
        res.status(400);
        throw new Error('Please Enter all fields');
    }

    try {
        const user = await User.findOne({email});
        const secret = user.key;
        // console.log(key);
        // let algorithm = 'aes256'; // or any other algorithm supported by OpenSSL
        // const key = user.key;
        const key = await crypto.createHash('sha256').update(String(user.key)).digest('base64').slice(0, 32);
            const id = user._id;
            // const iv = crypto.randomBytes(16);  // Initialization vector
            // const iv = crypto.randomBytes(16);
            const originalText = data;
            let cipher = await crypto.createCipheriv(algorithm, key, iv);  
            // const encryptedText = await encrypt(originalText, key, iv);
            let encryptedText = await cipher.update(data, 'utf8', 'hex') + cipher.final('hex');
            const message = await User.findByIdAndUpdate(
                id,
                {encrypted_data:encryptedText,key},

                { new: true }
            )
            console.log(iv);
            // 920fc41873b65618e237af2a70e8a76b65262d191da62d7f4a7ff7230a07ac95
            res.status(201).send({
                success: true,
                message: "Data encrypted Successfully",
                message,
            });
            
       
        
    } catch (error) {
        console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error while encrypting",
    });
    }
    
})

const decryptData = asyncErrorHandler(async(req,res) => {
    const {email,key} = req.body;
    if(!email || !key){
        res.status(400);
        throw new Error('Please Enter all fields');
    }

    try {
        const user = await User.findOne({email});
        // const key = user.key;
        const id = user._id;
        const encrypted = user.encrypted_data;
        let decipher = await crypto.createDecipheriv(algorithm, key, iv);
        console.log(iv);
        console.log(decipher);
        console.log(key);
        let decrypted = await decipher.update(encrypted, 'hex', 'utf8') + decipher.final('utf8');
        console.log(decrypted);
        res.status(200).send({
            success:true,
            message: "Data dcecrypted successfully",
            decrypted_data : decrypted,
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
          success: false,
          error,
          message: "Error while decrypting",
        });
    }
})

module.exports = {securedPage,encryptData,decryptData};


