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

// Models
const { User } = require('./models/user')
const { Brand } = require('./models/brand')

// Middleware
const { auth } = require('./middleware/auth')
const { admin } = require('./middleware/admin')

// Middleware
app.get('/api/users/auth', auth, (req,res)=>{
    
    res.status(200).json({
       isAdmin: req.user.role == 0? false : true,
       isAuth : true,
       email:req.user.emal,
       name : req.user.name,
       lastname : req.user.lastname,
       role : req.user.role,
       cart : req.user.cart,
       history : req.user.history

    })

}) 


// =============================
/// BRAND
// =============================


app.post('/api/product/brand', auth, admin, (req, res)=>{
    const brand = new Brand(req.body)

    brand.save((err, doc)=>{
        if(err) return res.json({success:false, err})
        res.status(200).json({
            success:true,
            brand:doc
        })
    })
})

app.get('/api/product/brands', (req,res)=>{
    Brand.find({},(err, brands)=>{
        if (err) return res.status(400).send(err);
        res.status(400).send(brands)
    })
})

// =============================
/// USERS
// =============================

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

app.get('/api/users/logout', auth, (req, res)=>{

    User.findByIdAndUpdate( 
        {_id : req.user._id},
        {token :'' },
        (err, doc)=>{
            if(err) return res.json({success: false, err});
            return res.status(200).json({
                success: true
            }) 
        }
    )
})

const port = process.env.PORT || 3002;


app.listen(port,()=>{
    console.log(`Success connection at ${port}`)
})