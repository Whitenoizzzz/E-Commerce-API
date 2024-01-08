const User = require('../models/User')
const {StatusCodes} = require('http-status-codes')
const CustomError = require('../errors')
const {attachCookiesToResponse,createTokenUser} = require('../utils')

const register = async(req,res) =>{
    const {email,name,password} = req.body
    const emailAlreadyExists = await User.findOne({email})
    if(emailAlreadyExists){
        throw new CustomError.BadRequestError('Email already exists')
    }
    const isFirstAccount = (await User.countDocuments({})) === 0;
    const role = isFirstAccount ? 'admin' : 'user';
    const user = await User.create({email,name,password,role})

    const tokenUser = createTokenUser(user);
    attachCookiesToResponse({res,user : tokenUser})
    res.status(StatusCodes.CREATED).json({user:tokenUser})
}

const login = async(req,res) =>{
    const{email,password} = req.body
    if(!email || !password){
        throw new CustomError.BadRequestError('Email or password is missing')
    }
    const user = await User.findOne({email})
    if(!user){
        throw new CustomError.UnauthenticatedError('No user exists')
    }
    const isPasswordCorrect = await user.comparePassword(password)
    if(!isPasswordCorrect){
        throw new CustomError.UnauthenticatedError('Incorrect password')
    }
    const tokenUser = createTokenUser(user)
    attachCookiesToResponse({res,user : tokenUser})
    res.status(StatusCodes.OK).json({user:tokenUser})
}

const logout = async(req,res) =>{
    // this is done to delete the token cookie by setting the time now and 
    // also changing the value of token cookie
    res.cookie('token','logout', {
        httpOnly : true,
        expires : new Date(Date.now())
    })
    res.status(StatusCodes.OK).json({msg : 'User logged out!'})
}

module.exports = {
    register,
    login,
    logout
}