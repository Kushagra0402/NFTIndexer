const { Web3 } = require("web3");
const axios = require('axios');
const abi = require('./abi.json');
const {addTransaction} = require('./controllers/transaction.controller.js');
const infuraUrl='https://mainnet.infura.io/v3/73bbf158fcfc4ae683879fab67a6d762';

async function main(){
    console.log("started");
  const web3 = new Web3("wss://mainnet.infura.io/ws/v3/73bbf158fcfc4ae683879fab67a6d762");

  let options721 = {
    topics: [web3.utils.sha3("Transfer(address,address,uint256)")],
  };
  
  let subscription721 = await web3.eth.subscribe("logs", options721);

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

          let tokenURI=''
          try {
            tokenURI = await getTokenURI(event.address, transaction.tokenId);
            console.log("TOKEN URI FINALLY IS HERE", tokenURI)
            //const metadata = await fetchMetadata(tokenURI);
            //req.metadata = metadata; // Add metadata to the request object
          } catch (error) {
            console.error('Error retrieving or processing metadata:', error);
          }

        let req={}
        req['transactionHash']=event.transactionHash
        req['blockNumber']=event.blockNumber.toString()
        req['receiver']=transaction.to
        req['sender']=transaction.from
        req['tokenId']=transaction.tokenId.toString()
        req['logIndex']=event.logIndex
        req['contractAddress']=event.address
        req['metadataURI']=tokenURI
        await addTransaction(req)      



    }
});


async function getTokenURI(contractAddress, tokenId) {
  try{
    
    const web3 = new Web3(new Web3.providers.HttpProvider(infuraUrl));
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
    console.log("token uri not found",error)
    return ""
  }
 }

}


module.exports={
main
}