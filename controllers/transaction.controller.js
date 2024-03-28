const Transaction=require('../models/transaction.model');

//controller function which actually interacts with the db
const getTransactions=async(req,res)=>{
    try{
        const transactions=await Transaction.find({});
        res.status(200).json(transactions)
    }catch(error){
        res.status(500).json({message:error.message})
    }
}

//controller function to query by request param
const getTransactionsByParam=async(req,res)=>{
try{
    console.log("query",req.query)
    const transactions= await Transaction.find(req.query);
    res.status(200).json(transactions)
}catch(error){
    res.status(500).json({message:error.message}) 
}
}

//controller function called internally by erc721 transfer event listener script
const addTransaction=async(req)=>{
    try{
        console.log("REQ ="+req)
         await Transaction.create(req);
    }catch(error){
        console.log("error happened",error.message)
    }
}

module.exports={
    getTransactions,
    getTransactionsByParam,
    addTransaction
}