const express = require('express');
const router = express.Router();
const { User } = require("../models/User");
const { auth } = require("../middleware/auth");
const crypto = require('crypto');
var nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');
const moviesData = require('./stream/MovieInfos.js');
//=================================
//             User
//=================================


router.get("/auth", auth, (req, res) => {
    res.status(200).json({
        _id: req.user._id,
        isAdmin: req.user.role === 0 ? false : true,
        isAuth: true,
        email: req.user.email,
        username: req.user.username,
        firstName: req.user.firstName,
        lastName: req.user.lastName,
        role: req.user.role,
        image: req.user.image,
    });
});

router.post("/register", (req, res) => {
    // User.findOne({ username: req.body.username }, (err, findUser) => {
    //     if (findUser)
    //         return res.status(400).json({
    //             text: "Username already exists"
    //         });
    //     });
    // User.findOne({ email: req.body.email }, (err, findEmail) => {
    // if (findEmail)
    //     return res.status(400).json({
    //         text: "Email already exists"
    //     });
    // });

    const user = new User(req.body);

    user.save((err, doc) => {
        if (err) return res.json({ success: false, err });
        return res.status(200).json({
            success: true
        });
    });
});

router.post('/reset/:token', async(req, res) => {
    let errors = {
        password: false,
        password_confirm: false
    };
    try {
        const token = req.body.tokenConf;
        console.log(token)
        const user = await User.findOne({tokenConf: token});
        if (user){
            // check if the entries are valid
            
            let password = req.body.password;
            let password_confirm = req.body.password_confirm;
            // if (password && !schema.validate(password))
            //     errors.password = "Password must contain at least one uppercase, one number and one symbol, and at least 8 characters."
            // if (password && password_confirm && !Validator.equals(password, password_confirm))
            //     errors.password_confirm = "Passwords must match";
            if (!errors.password && !errors.password_confirm){
                 user.password = password
                 user.save();
                return res.status(200).json({});
            }
            else
                throw new Error('Error password');
        } else
            throw new Error('Token not find');
    } catch(err){
        console.log(err);
        if (errors.password || errors.password_confirm)
            return res.status(400).json({errors: errors});
        return res.status(400).json({});
    }
});

router.get('/confirmation/:tokenConf',function(req,res){
    
        var token = req.params.tokenConf;
       
        try{
           
            User.findOne({ tokenConf: token })
                .exec(function(err,user){
                   
                    if(err) throw new Error("error find one")

                    else if(!user)throw new Error("error user not find")

                    else{
                        user.token_mail = true;
                        user.save(function(update_err,update_data){
                            if(update_err) throw new Error("error save update")
                            else{
                                console.log("token mail is true  "+update_data._id);
                                return res.status(200).json({});
                            }
                        });
                    }
            });
        }
        catch(err){
            console.log(err);
            return res.status(400).json({});
        }
        
});

router.post("/login", (req, res) => {
    User.findOne({ username: req.body.username }, (err, user) => {
        if (!user)
            return res.json({
                loginSuccess: false,
                message: "Auth failed, username not found"
            });

        user.comparePassword(req.body.password, (err, isMatch) => {
            if (!isMatch)
                return res.json({ loginSuccess: false, message: "Wrong password" });

        user.CheckTokenMail(req.body.username, (err, tokenfind) => {
            console.log("the mail is confirmed :", tokenfind)
            if (!tokenfind)
                return res.json({ loginSuccess: false, message: "thx to check your email"});    
            user.generateToken((err, user) => {
                if (err) return res.status(400).send(err);
                res.cookie("w_authExp", user.tokenExp);
                res
                    .cookie("w_auth", user.token)
                    .status(200)
                    .json({
                        loginSuccess: true, userId: user._id
                    });
                 });
                });
        });
    });
});

router.post('/forgotPassword', async(req, res) => {
    
    // const { errors, isValid } = validateResetSend(req.body);
    // Check validation
    // if (!isValid)
    //     return res.status(400).json(errors);
        
    try {
        console.log("TEST 1")
        const email = req.body.email;
        const user = await User.findOne({email: email});
        if (user){
            console.log("TEST 2")
            // Token for mail
            let token = ((+new Date) + Math.random()* 100).toString(32);
            let hashtoken = crypto.createHash('md5').update(token).digest("hex");
            user.tokenConf = hashtoken;
            user.save();
            var transport = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: 'julie.poncet92@gmail.com',
                    pass: 'Matcha123@'
                }
                });
            const message = {
                from: 'Hypertube',
                to: req.body.email,
                subject: 'Reset Password',
                text: `Hello ${user.username}!\n
                Here is the link to reset your password\n
                <a href="http://localhost:3000/confirmation/ResetPassword/Reset/${hashtoken}">clic Here!!!</a>`,
            };
            transport.sendMail(message, function(err, info) {
                if (err) console.log(err)
                else console.log(info);
            });
        }
        return res.status(200).json({});
    } catch(err){
        console.log(err);
        console.log(5);
        return res.status(400).json({});
    }
});

router.get("/logout", auth, (req, res) => {
    User.findOneAndUpdate({ _id: req.user._id }, { token: "", tokenExp: "" }, (err, doc) => {
        if (err) return res.json({ success: false, err });
        return res.status(200).send({
            success: true
        });
    });
});

module.exports = router;
