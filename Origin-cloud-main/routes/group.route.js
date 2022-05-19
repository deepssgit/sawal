const router = require('express').Router()
const { createGroup, getGroupInfo, updateGroup, joinGroup, getGroups } = require('../controllers/group.controller')
const { authenticate, authorize } = require('../controllers/user.controller')

router.post('/create', createGroup)
router.post('/update/:name',  updateGroup)
router.post('/join/:name',  joinGroup)
router.get('/random',  getGroups)
router.get('/:name',  getGroupInfo)

// router.get('/create',function(req,res){
//     res.render("user-groups")
// })

router.get('/groupfollowers',function(req,res){
    res.render("group-followers")
})

router.get('/grouptimeline',function(req,res){
    res.render("group-timeline")
})

router.get('/userfollowers',function(req,res){
    res.render("user-followers")
})

router.get('/usertimeline',function(req,res){
    res.render("user-timeline")
})


module.exports = router