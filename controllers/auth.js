const express = require("express")
const router = express.Router()
const bcrypt = require('bcrypt')
const User = require('../models/user.js')

router.get('/sign-up', (req, res) => {
    res.render('auth/sign-up.ejs');
})

router.post('/sign-up', async (req, res) => {


    const userInDatabase = await User.findOne({ username: req.body.username })
    if(userInDatabase) {
        return res.send('Username already taken!')
    }

    if(req.body.password !== req.body.confirmPassword) {
        return res.send("Password does not match!")
    }
    
    const hasUpperCase = /[A-Z]/.test(req.body.password)
    if(!hasUpperCase) {
        return res.send('Password must have at least one uppercase letter')
    }

    if(req.body.password.length < 8 ) {
        return res.send("Password must have 8 characters long")
    }

    const hashedPassword = bcrypt.hashSync(req.body.password, 10)

    req.body.password = hashedPassword

    const user = await User.create(req.body);
    res.send(`Thanks for signing up ${user.username}`)
})

module.exports = router;