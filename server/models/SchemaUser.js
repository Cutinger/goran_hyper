const mongoose = require('mongoose'); // Erase if already required

const userSchema = mongoose.Schema({
    username: {
        type:String,
        maxlength:50
    },
    email: {
        type:String,
        trim:true,
        unique: 1 
    },
    password: {
        type: String,
        minglength: 5
    },
    firstName: {
        type: String,
        maxlength: 50
    },
    lastName: {
        type: String,
        maxlength: 50
    },
    role : {
        type: Number,
        default: 0 
    },
    image: { 
        type: String,
    },
    token : {
        type: String,
    }, 
    tokenConf : {
        type: String,
    },
    token_mail: {
        type: Boolean,
        default: false
      },
    tokenExp :{
        type: Number
    }
})

// Export the model
module.exports = User = mongoose.model("users", userSchema);