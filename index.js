const express = require('express')
const mongoose=require('mongoose')
require('dotenv').config();
const Transaction=require('./models/transaction.model.js')
const transactionRoute=require("./routes/transaction.route.js")
const app= express()
const{main}=require("./trackERC721.js");
const { error } = require('console');
const dbUrl=process.env.DB_URL;

app.use(express.json())
app.use(express.urlencoded({extended: false}));



app.use("/api/transactions",transactionRoute)


app.get('/',(req,res)=>{
    res.send("Hello node server is running")
});



console.log("dburl=",dbUrl)
mongoose.connect(dbUrl)
.then(()=>{
    console.log("Connected to db");
    app.listen(3000,()=>{
        console.log('Server is running on port 3000');
    });
    main();
})
.catch(()=>{
    console.log("Connection Failed");
   
});
