const mongoose = require('mongoose')

const ReviewSchema = new mongoose.Schema({
    rating :{
        type : Number,
        min : 1,
        max : 5,
        required : [true,'Please provide rating']
    },
    title :{
        type : String,
        required : [true,'Please provide review title'],
        maxlength  :100

    },
    comment :{
        type : String,
        required : [true,'Please provide review comment ']
    },
    user:{
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: true
    },
    product :{
        type: mongoose.Types.ObjectId,
        ref: 'Product',
        required : true
    },
},{timestamps : true})

ReviewSchema.index({product : 1,user :1}, {unique:true})
/* The index method is used to create an index on the "product" and "user" fields in the "ReviewSchema". The index is created with {unique: true}, indicating that each combination of "product" and "user" should be unique in the collection. 
This means that you cannot have two documents with the same values for both "product" and "user". */
ReviewSchema.statics.calculateAverageRating = async function (productId){
    const result = await this.aggregate([
        {$match : {product :productId}},
        {
            $group :{
                _id :null,
                averageRating : {$avg : '$rating'},
                numOfReviews : { $sum: 1},
            }
        }
    ])
    try {
        await this.model('Product').findOneAndUpdate(
            { _id: productId},
            {
                averageRating : Math.ceil(result[0]?.averageRating || 0),
                numOfReviews : result[0]?.numOfReviews|| 0,
            }
        )
    } catch (error) {
        console.log(error)
    }
}
ReviewSchema.post('save',async function(){
    await this.constructor.calculateAverageRating(this.product)
})
ReviewSchema.post('remove',async function(){
    await this.constructor.calculateAverageRating(this.product)
})
module.exports = mongoose.model('Review',ReviewSchema)