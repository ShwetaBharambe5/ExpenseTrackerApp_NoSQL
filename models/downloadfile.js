const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const downloadSchema = new Schema({
    fileUrl:{
        type:String,
        required:true
    },
     
    createdAt:{
        type:Date,
        required:true
    },

    id:{
        type:Schema.Types.ObjectId,
        ref:'User',
        required:true
    }
})

const DownloadedFile = mongoose.model('DownloadedFile',downloadSchema)

module.exports = DownloadedFile;
