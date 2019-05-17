const { User } = require('./../models/user')

let auth = (req, res, next) =>{
    let token = req.cookies.w_auth;

}

module.exports = { auth }