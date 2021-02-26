
module.exports = function auth(req, res, next){

    if(req.isAuthenticated()){
        next()
    }else{
        res.redirect("/users/Login")
    }
    

}



