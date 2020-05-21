const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const novelSchema = mongoose.Schema({
    writer: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    title: {
        type: String,
        maxlength: 50
    },
    description: {
        type: String
    },
    images: {
        type: Array,
        default: []
    },
    genres : {
        type: Number,
        default: 1
    },
    likes: {
        type: Number,
        maxlength: 1000000,
        default: 0
    },
    views: {
        type: Number,
        default: 0
    }
}, { timestamps: true })

novelSchema.index({
    title:'text',
    description: 'text',
},
{
    weights:{
        title:5,
        description: 1,
    }
})

const Novel = mongoose.model('Novel', novelSchema);

module.exports = { Novel }