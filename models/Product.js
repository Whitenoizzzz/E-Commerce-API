const mongoose = require('mongoose')

const ProductSchema =  new mongoose.Schema({
    name : {
        type : String,
        trim : true,
        required : [true, 'Please provide product name'],
        maxLength :[100, 'Name cannot be more than 100 characters']
    },
    price : {
        type : Number,
        required : [true, 'Please provide product price'],
        default : 0
    },
    description : {
        type : String,
        required : [true, 'Please provide product description'],
        maxLength :[1000, 'Description cannot be more than 100 characters']

    },
    image : {
        type : String,
        default : '/uploads/example.jpeg'
    },
    category : {
        type : String,
        required : [true, 'Please provide product category'],
        enum : ['office','kitchen','bedroom']
    },
    company : {
        type : String,
        required : [true, 'Please provide company'],
        enum : {
            values : ['ikea','liddy','marcos'],
            message : `{VALUE} is not supported`
        }
    },
    colors : {
        type : [String],
        default : ['#555'],
        required:true
    },
    featured : {
        type : Boolean,
        default : false
    },
    freeShipping : {
        type : Boolean,
        default : false
    },
    inventory : {
        type : Number,
        default : 15,
        required:true
    },
    averageRating: {
        type : Number,
        default : 0
    },
    numOfReviews : {
        type:Number,
        default : 0
    },
    user : {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: true
    },
},
{ timestamps: true, toJSON :{virtuals : true},toObject : {virtuals:true} })
/* By setting virtuals: true for toJSON and toObject, you ensure that virtual properties are 
included when converting a Mongoose document to JSON or a plain JavaScript object */
ProductSchema.virtual('reviews',{
    ref : 'Review',
    localField : '_id',
    foreignField : 'product',
    justOne :false
})
/* virtuals are a way to define properties on your documents that are not stored in the MongoDB collection 
but can be calculated or derived from other fields. Virtuals are useful forcreating dynamic properties 
that are based on existing data or for formatting data in a particular way. This will make a virtual property
reviews and add all the reviews where _id field of product matches with product field of reviews*/

ProductSchema.pre('remove',async function(next){
    await this.model('Review').deleteMany({product : this._id})
})

module.exports = mongoose.model('Product',ProductSchema)