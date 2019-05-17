const express = require('express');
const bodyParser = require('body-parser');
const cookiesParser = require('cookie-parser');

const mongoose = require('mongoose');
const app = express();
require('dotenv').config();

mongoose.Promise = global.Promise;
mongoose.connect(process.env.DATABASE);

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(cookiesParser());

const { User } = require('./models/user')

const {auth} = require('./middleware/auth')

// Middleware
app.get('/api/users/cart', auth, (req,res)=>{

})

/////////////////////////////////
/// USERS
/////////////////////////////////

app.post('/api/users/register', (req,res)=>{
    const user = new User(req.body);

    user.save((err,doc)=>{
        if (err) return res.json({success:false,err})
        res.status(200).json({
            success:true,
            userdata:doc
        })
    })
})

app.post('/api/users/login', (req,res)=>{

    User.findOne({'email':req.body.email}, (err, user)=>{
        if(!user) return res.json({loginSuccess:false, message:"Auth Failed. Email is incorrect"});

        user.comparePassword(req.body.password, (err, isMatch)=>{
            if(!isMatch) return res.json({loginSucess:false, message:"Password is incorrect"})

            user.generateToken((err, user)=>{
                if(err) return res.status(400).send(err);
                res.cookie('w_auth', user.token).status(200).json({
                    loginSuccess:true
                })
            })

        })
    })
})

const port = process.env.PORT || 3002;


app.listen(port,()=>{
    console.log(`Success connection at ${port}`)
})