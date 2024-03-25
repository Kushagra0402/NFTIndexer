const express = require('express')
const mongoose=require('mongoose')
const Transaction=require('./models/transaction.model.js')
const transactionRoute=require("./routes/transaction.route.js")
const app= express()
const{main}=require("./trackERC721.js")
app.use(express.json())
app.use(express.urlencoded({extended: false}));



app.use("/api/transactions",transactionRoute)


app.get('/',(req,res)=>{
    res.send("Hello node server is running")
});




mongoose.connect("mongodb+srv://kushagrakanodia:MiXECUBnYUEyRuhD@eventindexerdb.gvmywlk.mongodb.net/Transaction?retryWrites=true&w=majority&appName=EventIndexerDB")
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
