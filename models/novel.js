const mongoose = require('mongoose');
const timestamps    = require('mongoose-timestamp');
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

    genres:{type: [String], required: true},

    pages:{type: [Schema.Types.Page]},

});
cateorySchema.plugin(timestamps); // automatically adds createdAt and updatedAt timestamps
//lets you access this model outside
const Novel = module.exports = mongoose.model('Novel',NovelSchema);