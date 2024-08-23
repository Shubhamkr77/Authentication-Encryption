const express = require('express');
const dotenv = require('dotenv');
const userRoutes = require('./routes/UserRoutes');
const SecuredRoutes = require('./routes/SecuredRoutes')
const connectDB = require('./config/db')

dotenv.config();

const app = express();

app.get("/",(req,res) =>{
    res.send("Api is running")
})

app.use(express.json());
app.use("/api/user", userRoutes);
app.use("/api/secure", SecuredRoutes);

const PORT = process.env.PORT || 5000;


const start = async() => {
    try {
        await connectDB();
        
        app.listen(PORT,console.log('server is listening on port 5000'));
    } catch (error) {
        console.log(error.message);
    }

}
start();

