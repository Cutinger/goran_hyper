const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const jwt = require('jsonwebtoken');
var nodemailer = require('nodemailer');
const crypto = require('crypto');

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


userSchema.pre('save', function( next ) {
    var user = this;
    if(user.isModified('password')){      
        bcrypt.genSalt(saltRounds, function(err, salt){
            if(err) return next(err);
    
            bcrypt.hash(user.password, salt, function(err, hash){
                if(err) return next(err);
                user.password = hash 
                let token = ((+new Date) + Math.random() * 100).toString(32);
                user.tokenConf = crypto.createHash('md5').update(token).digest("hex");

    if (user.token_mail == false){
             var transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: 'julie.poncet92@gmail.com',
                    pass: 'Matcha123@'
                }
                });
    console.log("user token is :" ,user.tokenConf)
    
    var mailOptions = {
      from: 'Hypertube',
      to: user.email,
      subject: 'Sending Email using Node.js',
      text: ` Hi there, 
      <br/>
      Thank you for registering!
      <br/><br/>
      Please verify your email by clicking on the following link:
      <br/>
      <a href="http://localhost:3000/confirmation/${user.tokenConf}">clic Here!!!</a>
      <br/><br/>
      Have a pleasant day!`
    };
    
    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });
}
                next()
            })
        })
    } else {
        next()
    }

});

userSchema.methods.CheckTokenMail = function(tokenfind, cb){
    var user = this
    return cb(null ,user.token_mail)
}
userSchema.methods.ConfTokenMail = function(token, cb){
    var user = this
    console.log("test")
    return cb(null ,user.token_mail)
}

userSchema.methods.comparePassword = function(plainPassword,cb){
    bcrypt.compare(plainPassword, this.password, function(err, isMatch){
        if (err) return cb(err);
        cb(null, isMatch)
    })
}

userSchema.methods.generateToken = function(cb) {
    var user = this;
    var token =  jwt.sign(user._id.toHexString(),'secret')

    user.token = token;
    user.save(function (err, user){
        if(err) return cb(err)
        cb(null, user);
    })
}

userSchema.statics.findByToken = function (token, cb) {
    var user = this;

    jwt.verify(token,'secret',function(err, decode){
        user.findOne({"_id":decode, "token":token}, function(err, user){
            if(err) return cb(err);
            cb(null, user);
        })
    })
}

const User = mongoose.model('User', userSchema);

module.exports = { User }