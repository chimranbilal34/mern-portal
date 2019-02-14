var express = require('express')
var User = require('../../model/User')
var keys = require('../../config/keys')
var garvatar = require('gravatar')
var bcrypt = require('bcryptjs')
var passport = require('passport')
var jwt = require('jsonwebtoken')

var router = express.Router()

var validateRegisterInput = require('../../validation/register')

router.get('/test', (req, res) => {
    res.json({ msg: 'User Successfull' })
})

router.post('/register', (req, res) => {
    const { errors, isValid } = validateRegisterInput(req.body)

    //If error
    if(!isValid){
        res.status(400).json(errors)
    }

    User.findOne({ email: req.body.email })
        .then(user => {
            if (user) {
                errors.email='Email already exist';
                return res.status(400).json(errors)
            }
            else {
                const avatar = garvatar.url(req.body.email, {
                    s: '200',
                    r: 'pg',
                    d: 'mm'
                })
                const newUser = new User({
                    name: req.body.name,
                    email: req.body.email,
                    password: req.body.password,
                    avatar: avatar
                })

                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(newUser.password, salt, (err, hash) => {
                        if (err) throw err;
                        newUser.password = hash;
                        newUser.save()
                            .then((user) => {
                                res.json(user)
                            })
                            .catch(err => {
                                console.log(err)
                            })
                    })

                })
            }
        })
})

router.post('/login', (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    //Find by emai

    User.findOne({ email })
        .then(user => {
            //Check for user
            if (!user) {
                return res.status(400).json({ email: 'Email not Found' })
            }

            //check Password
            bcrypt.compare(password, user.password)
                .then(isMatch => {
                    if (isMatch) {
                        //Password match
                        //payload safe user infomation which is a user

                        const payload = { id: user.id, name: user.name, avatar: user.avatar }

                        //Sign Token
                        jwt.sign(payload, keys.secret, { expiresIn: 540000 }, (err, token) => {
                            res.json({
                                success: true,
                                token: 'Bearer ' + token
                            })
                        })

                    }
                    else {
                        return res.status(400).json({ password: 'password Not match' })
                    }
                })
        })
})

router.get('/current', passport.authenticate('jwt', { session: false }), (req, res) => {
    res.json(req.user)
})

module.exports = router;