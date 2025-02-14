const mongoose = require('mongoose');
const dotenv = require('dotenv');

const DB = process.env.DB_URL;


console.log(DB);


mongoose.connect(DB,{
    retryWrites: true,
    w: 'majority',
    appName: 'Cluster0'
})
.then(()=>{
    console.log("connection succesful");
    
})
.catch((e)=>{
    console.log(e);
    
})
