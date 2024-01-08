const express = require('express')
const router = express.Router()
const {authenticateUser,authorizePermissions} = require('../middleware/authentication')
const { getAllUsers,
    getSingleUser,
    showCurrentUser,
    updateUser,
    updateUserPassword} = require('../controllers/userController')

/* When you pass a paramter here authorizePermissions('admin','owner') it executes the function 
immediately and express requires a callback. So to do like this when you are executing this 
function, return a function which will then be callback function as required by express */
router.route('/').get(authenticateUser,authorizePermissions('admin','owner'),getAllUsers)
router.route('/showMe').get(authenticateUser,showCurrentUser)
router.route('/updateUser').patch(authenticateUser,updateUser)
router.route('/updateUserPassword').patch(authenticateUser,updateUserPassword)
// this id route is places at end to avoid conflict with three routes above as 
// if you keep id above them it can give you error 
router.route('/:id').get(authenticateUser,getSingleUser)
module.exports = router

