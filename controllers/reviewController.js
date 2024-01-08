const Review = require('../models/Review')
const {StatusCodes} = require('http-status-codes')
const CustomError = require('../errors');
const Product = require('../models/Product');
const {checkPermissions} = require('../utils')


const createReview = async(req,res) =>{
    const {product :productId} = req.body

    const isValidProduct = await Product.findOne({_id : productId})
    if(!isValidProduct){
        throw new CustomError.BadRequestError(`No product with id: ${productId}`)
    }
    const alreadySubmitted = await Review.findOne({
        product : productId,
        user : req.user.userId
    })
    if(alreadySubmitted){
        throw new CustomError.BadRequestError('Already submitted review for this product')
    }
    req.body.user = req.user.userId;
    const review = await Review.create(req.body)
    res.status(StatusCodes.CREATED).json({review})
}

const getAllReviews = async(req,res) =>{
    const reviews = await Review.find({})
    .populate({
        path : 'product',
        select : 'name company price'
    })
    .populate({
        path : 'user',
        select : 'name'
    })
    /* In Mongoose, the populate method is used to replace specified paths in a document 
    with the actual document(s) from other collections. This is particularly useful when dealing with relationships between 
    documents in different collections, allowing you to retrieve and display related data. Here it
    would replace the product property in review with actual product data buts only the properties listed
    in select option */
    res.status(StatusCodes.OK).json({reviews,count : reviews.length})
}

const getSingleReview = async(req,res) =>{
    const {id : reviewId} = req.params
    const review = await Review.findOne({_id : reviewId})

    if(!review){
        throw new CustomError.NotFoundError(`No review with id : ${reviewId}`)
    }
    res.status(StatusCodes.OK).json({review})
}

const updateReview = async(req,res) =>{
    const {id : reviewId} = req.params
    const{rating,title,comment}= req.body

    const review = await Review.findOne({_id : reviewId})

    if(!review){
        throw new CustomError.NotFoundError(`No review with id : ${reviewId}`)
    }
    checkPermissions(req.user,review.user);
    review.comment = comment;
    review.title = title;
    review.rating = rating;
    await review.save();
    res.status(StatusCodes.OK).json({review})
}

const deleteReview = async(req,res) =>{
    const{id : reviewId} = req.params
    const review = await Review.findOne({_id : reviewId})

    if(!review){
        throw new CustomError.NotFoundError(`No review with id : ${reviewId}`)
    }
    checkPermissions(req.user,review.user);
    await review.remove();
    res.status(StatusCodes.OK).json({msg : 'Success! Review Deleted'})

}
/* This is another way of getting reviews for product by not using virtuals.
And in reviews controller we have access to review model */
const getSingleProductReviews = async (req,res) =>{
    const { id : productId} = req.params;
    const reviews = await Review.find({product : productId});
    res.status(StatusCodes.OK).json({reviews,count : reviews.length})
}
module.exports = {
    createReview,
    getAllReviews,
    getSingleReview,
    updateReview,
    deleteReview,
    getSingleProductReviews
}