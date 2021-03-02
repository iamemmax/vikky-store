
 module.exports = function auth (req, res, next){
    if(req.isAuthenticated()){
        next()
        console.log("authenticated");
    }else{
        res.redirect("/users/login")
    }
 }


