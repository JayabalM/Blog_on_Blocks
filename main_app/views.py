import json
from web3 import Web3
from .render import Render
from .models import Rec_Model
from django.http import HttpResponseRedirect
from django.contrib import messages
from django.core.paginator import Paginator
from django.shortcuts import render,redirect,HttpResponse
from django.contrib.sessions.models import Session

url = 'https://ropsten.infura.io/v3/<YOUR API KEY GOES HERE>'
web3 = Web3(Web3.HTTPProvider(url))

address = web3.toChecksumAddress("0x0231CE2f680d4986DE84E55f2a72cBade878B774")
abi = json.loads('''[
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
		"type": "function"
	}
]''')
	
contract = web3.eth.contract(address=address,abi=abi)

def connect(request):
	return render(request,'main_app/index.html')

#CONNECTING TO SMART CONTRACT FOR POST,PAYMENTS etc
def get_posts_from_contract():
	func_to_call = 'postCount'
	contract_func = contract.functions[func_to_call]
	postCount = contract_func().call()

	posts=[]
	for i in range(postCount):
		p = contract.functions.posts(i+1).call()
		posts.append(p)	
	return posts


def append(request):
	return render(request, 'main_app/submit.html')


#ACCESSING AND DISPLAY OF POSTS
def posts(request):
	
	posts = get_posts_from_contract()
	# print(f'{posts}\n\n')

	posts.sort(key = lambda x: x[2], reverse=True)

	paginator = Paginator(posts,5)
	page_number =  request.GET.get('page')
	page_obj = paginator.get_page(page_number)

	context={
		'page':page_obj,
		'posts':posts,
		# 'author':account_address
	}

	return render(request,'main_app/posts.html',context)

def get_free_post(request,pid):
	posts=[]
	posts_list=get_posts_from_contract()
	for p in posts_list:
		if p[0] == pid:
			if p[1] == False:
				posts.append(p)
	if len(posts)==0:
		messages.warning(request,'THIS POST IS NOT FOR SALE')
		return redirect('posts')

	context={
		'posts':posts[0],
		'pid':pid
	}
	return render(request, 'main_app/get_post.html',context)
			
def get_receipt(request,pid):
	if request.method=='POST':
		global receipt
		receipt = request.POST.get('receipt')
		check = Rec_Model.objects.filter(receipt=receipt).exists()
		if check:
			messages.warning(request,'THIS RECEIPT HAS BEEN USED EARLIER')
			return redirect('receipt', pid=pid)
		else:
			if (receipt.startswith("0x") and len(receipt)==66):
				rec=web3.eth.waitForTransactionReceipt(receipt)
				rec=dict(rec)
				status = rec["status"]
				if status==1:
					request.session['has_receipt']=True
					rec = Rec_Model.objects.create(receipt=receipt)
					if rec:
						return redirect('get_post', pid=pid)
				else:
					messages.warning(request,'INVALID TRANSACTION RECEIPT')
					return redirect('payment',pid=pid)
			else:
				messages.warning(request,'INVALID RECEIPT')
				return redirect('receipt', pid=pid)
			
	return render(request, "main_app/receipt.html")

def get_post(request,pid):
	if request.session.has_key('has_receipt'):
		posts=[]
		posts_list=get_posts_from_contract()
		for p in posts_list:
			if p[0] == pid:
				posts.append(p)
		print(posts[0][0])
		context={
			'posts':posts[0],
			'pid':pid
		}

		return render(request, 'main_app/get_post.html',context)
	else:
		return redirect('receipt',pid=pid)



def payment(request, pid):
	context ={
		'pid':pid
	}
	return render(request, 'main_app/payment.html',context)


#DOWNLOADING THE CONTENT ON SYSTEM
def get_pdf(request,pid, *args, **kwargs):
	posts=[]
	posts_list=get_posts_from_contract()
	for p in posts_list:
		if p[0] == pid:
			posts.append(p)
	print(posts[0])
	context={
		'posts':posts[0]
	}

	return Render.render('main_app/get_post.html', context)




























