const express = require('express')

const router = express.Router()

const Group = require('../models/group.model')
const User = require('../models/user.model')



router.use(express.static('public'))
const { append } = require("express/lib/response");

const { createGroup, getGroupInfo, updateGroup, joinGroup, getGroups } = require('../controllers/group.controller')
const { authenticate, authorize } = require('../controllers/user.controller')


// router.get('/random',  getGroups)
// router.get('/:name',  getGroupInfo)

// router.get('/create',function(req,res){
//     res.render("user-groups")
// })


 
router.get('/grouphome', authenticate ,function(req,res){
    const User_id=req.user.uid
     User.find({_id:User_id},function(err,foundOne){
        
            Group.find({admin:User_id},function(err,foundgroups){
                res.render("user-groups",{groups:foundgroups,user:foundOne})  
              })
       
     })
    // console.log(logged_in_user);

})



router.get('/userfollowers',function(req,res){
    res.render("user-followers")
})

router.get('/groupfollowers',function(req,res){
    res.render("group-followers")
})

router.get('/grouptimeline',function(req,res){
    res.render("group-timeline")
})

router.get('/usertimeline',function(req,res){
    res.render("user-timeline")
})

router.post('/creategroup',authenticate,createGroup)




router.post('/update/:name',  updateGroup)
router.post('/join/:name',  joinGroup)

module.exports = router