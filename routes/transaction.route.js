const express = require("express");
const Transaction=require("../models/transaction.model.js");
const router = express.Router();
const {  getTransactions,getTransactionsByParam,addTransaction} = require('../controllers/transaction.controller.js');

router.get('/all',getTransactions)

router.get('/',getTransactionsByParam)

module.exports=router
