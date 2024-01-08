const User = require('../models/User')
const CustomError = require('../errors')
const {StatusCodes} = require('http-status-codes')
const { createTokenUser, attachCookiesToResponse ,checkPermissions} = require('../utils')

const getAllUsers = async (req,res) =>{
    const users = await User.find({role : 'user'}).select('-password')
    res.status(StatusCodes.OK).json({users})
}

const getSingleUser = async (req,res) =>{
    const user = await User.findOne({_id : req.params.id}).select('-password')
    if(!user){
        throw new CustomError.NotFoundError(`No user with id : ${req.params.id}`)
    }
    checkPermissions(req.user, user._id);
    res.status(StatusCodes.OK).json({user})
}

const showCurrentUser = async (req,res) =>{
    res.status(StatusCodes.OK).json({user : req.user})
}

const updateUserOld = async (req,res) =>{
   const {name,email} = req.body
   const {userId} = req.user
   if(!name || !email){
    throw new CustomError.BadRequestError('Please enter name and email')
   }
   const user = await User.findOneAndUpdate({_id: userId},{email : email, name : name}, 
    { new: true, runValidators: true })
   const tokenUser = createTokenUser(user);
   attachCookiesToResponse({res,user : tokenUser})
    res.status(StatusCodes.CREATED).json({user:tokenUser})

}
const updateUser = async (req,res) =>{
    const {name,email} = req.body
    const {userId} = req.user
    if(!name || !email){
     throw new CustomError.BadRequestError('Please enter name and email')
    }
    const user = await User.findOne({_id: userId})
    user.name = name;
    user.email = email;
    await user.save()
    const tokenUser = createTokenUser(user);;
    attachCookiesToResponse({res,user : tokenUser})
     res.status(StatusCodes.CREATED).json({user:tokenUser})
 
 }

const updateUserPassword = async (req,res) =>{
    const {oldPassword,newPassword} = req.body;
    if(!oldPassword || !newPassword){
        throw new CustomError.BadRequestError('Please enter both old and new Password')
    }
    const user = await User.findOne({_id: req.user.userId})
    const isPasswordCorrect = await user.comparePassword(oldPassword)
    if(!isPasswordCorrect){
        throw new CustomError.UnauthenticatedError('Incorrect old password')
    }
    user.password = newPassword;
    
    await user.save();
    
    res.status(StatusCodes.OK).json({msg :"Success! Password Updated" })
   
}

module.exports = {
    getAllUsers,
    getSingleUser,
    showCurrentUser,
    updateUser,
    updateUserPassword
}