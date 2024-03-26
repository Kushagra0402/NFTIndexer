# NFTIndexer
How to setup locally and run the indexer:

1. npm install
2. npm run serve


To run the api :

1. Get All Transfers 

GET http://localhost:3000/api/transactions/all

2. Query the Indexed Transfers:
http://localhost:3000/api/transactions?${queryParam}=${paramValue}

where queryParam can be any of the following: tokenId,sender,receiver,blockNumber,contractAddress,transactionHash.

Examples: 
a. http://localhost:3000/api/transactions?blockNumber=19519783
b. http://localhost:3000/api/transactions?logIndex=70
