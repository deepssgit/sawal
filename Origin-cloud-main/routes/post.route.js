
const express = require('express')

const router = express.Router()

const Post = require('../models/post.model')

// const path = require('path');

var MongoClient = require('mongodb').MongoClient;

router.use(express.static('public'))

const { append } = require("express/lib/response");

const {askQuestion,createPoll, createPost, updatePost, deletePost, getUserPosts, likePost, getLikes, votePoll } = require('../controllers/post.controller')
const { authenticate, authorize } = require('../controllers/user.controller')

router.get('/grouptimeline/:name', authenticate ,function(req,res){
    const grp_name=req.params.name
    console.log(grp_name);
    Post.find({group:grp_name},function(err,foundposts){
        // console.log(foundposts);
        res.render("groups-timeline",{posts:foundposts,groupPost:grp_name})
    })
    
})


router.post('/createPost/:name', authenticate , createPost)


router.post("/commentpost/:name", authenticate ,function(req,res){
    comnt_body = req.body.comment_body
    post_id = req.body.postid
    console.log(post_id);
    Post.findOne({_id:post_id},function(err,foundOne){
        const objid=foundOne._id

        MongoClient.connect('mongodb://localhost:27017', function(err, client) {
        if(err) throw err;
        var db =client.db("openDB")
        var collection = db.collection('posts');
        collection.updateOne({_id:objid},{ $push:{comments:{cmnt:comnt_body}}})
         
        res.redirect("/post/grouptimeline/"+ req.params.name)

        })

    })
     
})

router.post("/answerQuest/:name", authenticate ,function(req,res){
    comnt_body = req.body.ans_body
    post_id = req.body.postid
    console.log(post_id);
    Post.findOne({_id:post_id},function(err,foundOne){
        const objid=foundOne._id

        MongoClient.connect('mongodb://localhost:27017', function(err, client) {
        if(err) throw err;
        var db =client.db("openDB")
        var collection = db.collection('posts');
        collection.updateOne({_id:objid},{ $push:{answers:{ans:comnt_body}}})
         
        res.redirect("/post/grouptimeline/"+ req.params.name)

        })

    })
     
})
router.post("/answercomment/:ans", authenticate ,function(req,res){
    comnt_body = req.body.answer_comment
    post_id = req.body.postid
    answer=req.params.ans
    console.log(post_id);
    Post.findOne({_id:post_id},function(err,foundOne){
        const objid=foundOne._id
        const name = foundOne.group

        MongoClient.connect('mongodb://localhost:27017', function(err, client) {
        if(err) throw err;
        var db =client.db("openDB")
        var collection = db.collection('posts');
        collection.updateOne({_id:objid},{ $push:{ans_comment:{ans:answer,cmnt:comnt_body}}})
         
        res.redirect("/post/grouptimeline/"+ name)

        })

    })
     
})

router.post('/update/:id', authenticate, function(req,res){
    post_id = req.body.updatepost
    Updated_body = req.body.edited_post
    console.log(post_id);
    Post.findOne({_id:post_id},function(err,foundOne){
        const objid=foundOne._id
        const name = foundOne.group

        MongoClient.connect('mongodb://localhost:27017', function(err, client) {
        if(err) throw err;
        var db =client.db("openDB")
        var collection = db.collection('posts');
        collection.updateOne({_id:objid},{$set:{body:Updated_body}})
         
        res.redirect("/post/grouptimeline/"+ name)

        })

    })
   
})


router.post('/delete/:id', authenticate , function(req,res){
    post_id = req.body.deletepost
    console.log(post_id);
    Post.findOne({_id:post_id},function(err,foundOne){
        const objid=foundOne._id
        const name = foundOne.group

        MongoClient.connect('mongodb://localhost:27017', function(err, client) {
        if(err) throw err;
        var db =client.db("openDB")
        var collection = db.collection('posts');
        collection.deleteOne({_id:objid})
         
        res.redirect("/post/grouptimeline/"+ name)

        })

    })
   
})

// Done
router.post('/createPolls/:name', authenticate, createPoll) 


router.post('/like/:id', authenticate, likePost)

// Done
router.post('/vote/:id/:option', authenticate, votePoll)


router.post("/askQuestion/:name",authenticate,askQuestion)


router.get('/like/:id', authorize, getLikes)

router.get('/user/:id', authorize, getUserPosts)

module.exports = router