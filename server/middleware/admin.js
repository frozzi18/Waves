let admin = (req, res, next) =>{
    if (req.body.role == 0){
        res.send("You are not allowed");
    }

    next()
}

module.exports = { admin }