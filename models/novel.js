const mongoose = require('mongoose');
//const timestamps    = require('mongoose-timestamp');
//user schema

const coverImageBasePath = 'uploads';
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
        /*
        data: Buffer,
        contentType: String
        */
        
        type: String,
        required: true
        
        /*
        type: String,
        default: 'placeholder.jpg'
        */
        
    },
    /*
    cover_type: {
        type: String,
        required: true
      },

      */
    /*
    status:{
        type: Boolean,
        required:true
    },
    */
    content:{
        type: String,
        required:true
    },

    genre:{
        type: String,
         required: true
    },

    //pages:{type: [Schema.Types.Page]},

});

NovelSchema.index({title: 'text', author: 'text'});

NovelSchema.virtual('coverImagePath').get(function() {
    if (this.cover_pic != null) {
      return path.join('/', coverImageBasePath, this.cover_pic)
    }
  })
 // automatically adds createdAt and updatedAt timestamps
//lets you access this model outside
const Novel = module.exports = mongoose.model('Novel',NovelSchema);
module.exports.coverImageBasePath = coverImageBasePath;