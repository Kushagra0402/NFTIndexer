const mongoose=require('mongoose')

//Schema for storing indexed ERC721 transfers
const transactionSchema=mongoose.Schema(
    {


        transactionHash:{
            type: String,
            required:true
        },

        sender:{
            type: String,
            required:true
        },

        receiver:{
            type: String,
            required:true
        },

        tokenId:{
            type: Number,
            required:true
        },

        logIndex:{
            type: String,
            required: true
        },

        blockNumber:{
            type:String,
            required:true
        },
        contractAddress:{
            type:String,
            require:true
        },
        metadataURI:{
            type:String,
            require:true
        }
    },
    {   
        timestamps:true,

    }
);

const Transaction=mongoose.model("Transaction",transactionSchema);
module.exports=Transaction;