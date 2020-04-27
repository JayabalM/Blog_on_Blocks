pragma solidity ^0.5.1;


contract SocialNetwork{
    //STATE VARIABLES
    
    ///name of the contract
    string public name;
    
    ///represents the total number of post counts
    uint public postCount;
    
    /// Post struct represents all the attributes a Post can have
    struct Post{
        uint id;
        
        ///this is indicator of whether a particular article is for sale or for free of cost
        bool forSale;
        uint tipAmount;
        string title;
        string subtitle;
        string content;
        address payable author;
    }
    
    /// posts is more like a storage system for all the Posts
    mapping(uint => Post) public posts;
    
    constructor() public{
        name='Blog On Blocks';
    }
    
    function get_count() view public returns(uint){
        return postCount;
    }
    
    ///this function:
    // sets the 'for sale' attribute to True or False

    
    function set_forSale(uint _id, bool _value) public{
        Post memory _post = posts[_id];
        _post.forSale=_value;
        posts[_id]=_post;
    }
    
    ///this function:
    // adds a new Post with all attributes taken from user
    // stores the post in the mappings
    // also verifies that the content of the post is not empty and has some words in it


    function createPost(bool _forSale,string memory _title, string memory _subtitle,string memory _content) public{
        require(bytes(_content).length > 0);
        postCount++;
        posts[postCount] = Post(postCount,_forSale,0,_title,_subtitle,_content,msg.sender);
    }
    
    ///this function:
    // selects a post based on its id
    // detects the author of the Post
    // transfer the ether to the selected _author
    // finally add this data to the mapping

    function tipPost(uint _id) payable public{
        Post memory _post = posts[_id];
        address payable _author = _post.author;
        address (_author).transfer(msg.value);
        _post.tipAmount = _post.tipAmount+msg.value;
        posts[_id] = _post;

        
    }    
} 

