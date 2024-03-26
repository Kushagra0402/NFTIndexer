const { Web3 } = require("web3");
const axios = require('axios');
const abi = require('./abi.json');
require('dotenv').config();
const {addTransaction} = require('./controllers/transaction.controller.js');

const infuraUrlHttp=process.env.INFURA_URL_HTTP;
const infuraUrlWss=process.env.INFURA_URL_WSS;

//Function to interact with ERC721 transfer events
async function main(){
    console.log("started");
  const web3 = new Web3(infuraUrlWss);

  let options721 = {
    topics: [web3.utils.sha3("Transfer(address,address,uint256)")],
  };
  
  //Subscribing to erc721 
  let subscription721 = await web3.eth.subscribe("logs", options721);

  //checking if subsciption started successfully
  subscription721.on("error", (err) => {
    throw err;
  });

  subscription721.on("connected", (nr) =>
  console.log("Subscription on ERC-721 started with ID %s", nr),
);


//decoding the event log data. 
subscription721.on('data', async(event) => {
    if (event.topics.length == 4) {
        let transaction = web3.eth.abi.decodeLog(
            [
              {
                type: "address",
                name: "from",
                indexed: true,
              },
              {
                type: "address",
                name: "to",
                indexed: true,
              },
              {
                type: "uint256",
                name: "tokenId",
                indexed: true,
              },
            ],
            event.data,
            [event.topics[1], event.topics[2], event.topics[3]],
          );


          console.log(
            `\n` +
              `New ERC-721 transaction found in block number ${event.blockNumber} with transaction hash ${event.transactionHash}\n` +
              `From: ${
                transaction.from === "0x0000000000000000000000000000000000000000"
                  ? "new nft mint"
                  : transaction.from
              }\n` +
              `To: ${transaction.to}\n` +
              `Token contract: ${event.address}\n` +
              `Token ID: ${transaction.tokenId}\n`+
              `Log index: ${event.logIndex}`
          );
          console.log(typeof(transaction.tokenId))

          //Retrieving NFT metadata if its in Url format i.e.ipfs link
          let tokenURI=''
          try {
            tokenURI = await getTokenURI(event.address, transaction.tokenId);
            console.log("TOKEN URI FINALLY IS HERE", tokenURI)
            //const metadata = await fetchMetadata(tokenURI);
            //req.metadata = metadata; // Add metadata to the request object
          } catch (error) {
            console.error('Error retrieving or processing metadata:', error);
          }

        //preparing the request body for posting to db .
        let req={}
        req['transactionHash']=event.transactionHash
        req['blockNumber']=event.blockNumber.toString()
        req['receiver']=transaction.to
        req['sender']=transaction.from
        req['tokenId']=Number(transaction.tokenId)
        req['logIndex']=event.logIndex
        req['contractAddress']=event.address
        req['metadataURI']=tokenURI
        await addTransaction(req)      



    }
});


async function getTokenURI(contractAddress, tokenId) {
  try{
    
    const web3 = new Web3(new Web3.providers.HttpProvider(infuraUrlHttp));
    const contract = new web3.eth.Contract(abi, contractAddress);
    const tokenURI = await contract.methods.tokenURI(tokenId).call();
    if (tokenURI.startsWith("http://") || tokenURI.startsWith("https://"))//checking for infura or url based metadata link
     {
    return tokenURI;
  }
  else{
    return "invalid Format"
  }
  }
  catch(error){
    return ""
  }
 }

}


module.exports={
main
}