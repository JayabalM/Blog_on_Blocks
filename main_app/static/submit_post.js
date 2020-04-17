
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
// console.log('hey')
// a = web3.eth.accounts[0]
// console.log(a)

bob=web3.eth.contract(abi).at(c_address)
// console.log(bob)

// bob.get_count.call((err,res)=>{
//   if(err){
//     return console.log(err)
//   }
//   else{
//     return console.log(res.toString())
//   }
// })
function waitForReceipt(hash, cb) {
    web3.eth.getTransactionReceipt(hash, function (err, receipt) {
      if (err) {
        error(err);
      }
      if (receipt !== null) {
        // Transaction went through
        if (cb) {
          cb(receipt);
        }
      } else {
        // Try again in 1 second
        window.setTimeout(function () {
          waitForReceipt(hash, cb);
        }, 1000);
      }
    });
  }
      //FOR CHANGING PAGE
      function append(){
        $("#rec_url").text("RECEIPT IS LOADING......")
        var sale;
        let title=$("#title").val();
        let subtitle=$("#subtitle").val();
        let content=$("#content").val();
        let for_sale=$("#for_sale").val();

        if(for_sale == 'on'){
          sale = true;
        }
        else{
          sale = false;
        }
        console.log(title)
        console.log(subtitle)
         web3.eth.getAccounts(function get(err, res){            
                  account=res[0]
                  console.log(account)

                  transaction = 
        ({
          from: account,
          "gas": 300000,
          "chainId": 3,
          'gasPrice': web3.toWei(4.1,'Gwei'),

          })
        bob.createPost.sendTransaction(
          sale,
          title,
          subtitle,
          content,
          transaction,
          (error,result)=>{
            if(error){
              return console.log(error)
            }
            else{
            waitForReceipt(result, function(){
                console.log(result)
                var newUrl = "https://ropsten.etherscan.io/tx/" + result

                $("#rec_url").attr("href", newUrl)
                $("#rec_url").text(result)

            })
            

          }
        });
      
      });
        
  }
