
const abi = [
{
"constant": false,
"inputs": [
{
  "internalType": "bool",
  "name": "_forSale",
  "type": "bool"
},
{
  "internalType": "string",
  "name": "_title",
  "type": "string"
},
{
  "internalType": "string",
  "name": "_subtitle",
  "type": "string"
},
{
  "internalType": "string",
  "name": "_content",
  "type": "string"
}
],
"name": "createPost",
"outputs": [],
"payable": false,
"stateMutability": "nonpayable",
"type": "function"
},
{
"constant": false,
"inputs": [
{
  "internalType": "uint256",
  "name": "_id",
  "type": "uint256"
},
{
  "internalType": "bool",
  "name": "_value",
  "type": "bool"
}
],
"name": "set_forSale",
"outputs": [],
"payable": false,
"stateMutability": "nonpayable",
"type": "function"
},
{
"constant": false,
"inputs": [
{
  "internalType": "uint256",
  "name": "_id",
  "type": "uint256"
}
],
"name": "tipPost",
"outputs": [],
"payable": true,
"stateMutability": "payable",
"type": "function"
},
{
"inputs": [],
"payable": false,
"stateMutability": "nonpayable",
"type": "constructor"
},
{
"constant": true,
"inputs": [],
"name": "get_count",
"outputs": [
{
  "internalType": "uint256",
  "name": "",
  "type": "uint256"
}
],
"payable": false,
"stateMutability": "view",
"type": "function"
},
{
"constant": true,
"inputs": [],
"name": "name",
"outputs": [
{
  "internalType": "string",
  "name": "",
  "type": "string"
}
],
"payable": false,
"stateMutability": "view",
"type": "function"
},
{
"constant": true,
"inputs": [],
"name": "postCount",
"outputs": [
{
  "internalType": "uint256",
  "name": "",
  "type": "uint256"
}
],
"payable": false,
"stateMutability": "view",
"type": "function"
},
{
"constant": true,
"inputs": [
{
  "internalType": "uint256",
  "name": "",
  "type": "uint256"
}
],
"name": "posts",
"outputs": [
{
  "internalType": "uint256",
  "name": "id",
  "type": "uint256"
},
{
  "internalType": "bool",
  "name": "forSale",
  "type": "bool"
},
{
  "internalType": "uint256",
  "name": "tipAmount",
  "type": "uint256"
},
{
  "internalType": "string",
  "name": "title",
  "type": "string"
},
{
  "internalType": "string",
  "name": "subtitle",
  "type": "string"
},
{
  "internalType": "string",
  "name": "content",
  "type": "string"
},
{
  "internalType": "address payable",
  "name": "author",
  "type": "address"
}
],
"payable": false,
"stateMutability": "view",
"type": "function"}]

// var account;
const c_address="0x0231CE2f680d4986DE84E55f2a72cBade878B774";

window.addEventListener('load', ()=>{

  if(typeof(web3)==='undefined')
  {
    console.log('NO WEB3')
  }
  else{
    console.log('FOUND WEB3')
  }
  web3= new Web3(window.web3.currentProvider);
  ethereum.enable();
});


bob=web3.eth.contract(abi).at(c_address)
// console.log(bob)


//FOR CHANGING PAGE
web3.eth.getAccounts(function get(err, res){            
      account=res[0]
      console.log(account)

  });


