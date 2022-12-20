const mongoose = require('mongoose')    

const productSchema = mongoose.Schema ({
    id: {type: mongoose.Schema.Types.ObjectId},
    name: {type: String, required: true},
    tag: {type: String},
    description:{type: String},
    price: {type: Number, required: true},
    category:{type: String},
    imageName: {type: String},
    rating: {type: Number}
})

module.exports = mongoose.model("product", productSchema)