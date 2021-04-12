const mongoose = require('mongoose');

//user schema
const NovelSchema = mongoose.Schema({
    title:{
        type: String,
        required:true
    },
    author:{
        type: String,
        required:true
    },
    cover_pic:{
        data: Buffer,
        contentType: String,
        required:false
    },
    status:{
        type: Boolean,
        required:true
    },
    description:{
        type: String,
        required:true
    },
/*
    genres:{
        type: Array,
        required:true
    },
    pages:{
        type: Array,
        required:true
    },
*/
});

//lets you access this model outside
const Novel = module.exports = mongoose.model('Novel',NovelSchema);