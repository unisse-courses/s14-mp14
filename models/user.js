const mongoose = require('mongoose');

//user schema
const UserSchema = mongoose.Schema({
    username:{
        type: String,
        required:true
    },
    password:{
        type: String,
        required:true
    },
    profile_pic:{
        data: Buffer,
        contentType: String,
        required:false
    },
/*
    favourites:{
        type: Array,
        required:true
    },
    written_books:{
        type: Array,
        required:true
    },
*/
});

//lets you access this model outside
const User = module.exports = mongoose.model('User',UserSchema);