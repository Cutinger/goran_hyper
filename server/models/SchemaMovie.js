// const mongoose = require('mongoose');
// const Schema = mongoose.Schema;

// const videoSchema = mongoose.Schema({
//     writer: {
//         type:Schema.Types.ObjectId,
//         ref: 'User'
//     },
//     title: {
//         type:String,
//         maxlength:50,
//     },
//     description: {
//         type: String,
//     },
//     privacy: {
//         type: Number,
//     },
//     filePath : {
//         type: String,
//     },
//     catogory: String,
//     views : {
//         type: Number,
//         default: 0 
//     },
//     duration :{
//         type: String
//     },
//     thumbnail: {
//         type: String
//     }
// }, { timestamps: true })


// const Video = mongoose.model('Video', videoSchema);

// module.exports = { Video }


const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
    imdb_code: {
        type: String,
        lowercase: true,
        required: true,
        unique: true
    },
    views: {
        default: [],
        required: false,
        type: Array
    },
    like: {
        default: [],
        required: false,
        type: Array
    },
    comments: {
        default: [],
        required: false,
        type: Array
    },
    path: {
        required: false,
        type: Array
    },
    downloaded: {
        required: false,
        type: Array
    },
    lastView: {
        default: Date.now,
        required: false,
        type: Date
    },
    userViews: {
        default: [],
        required: false,
        type: Array
    }
});

module.exports = Movie = mongoose.model("Movie", movieSchema);