// const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy;
const mongoose = require("mongoose")
const passport = require("passport")
const bcrypt = require("bcryptjs")
const User = require("../model/UserSchema")

module.exports =   function passportAuth (res){

    passport.use(
        new LocalStrategy({
            usernameField:"email"}, (email, password, done) =>{
    
                let error = []
            User.findOne({email:email})
            .then(user =>{
                console.log(user);
                if(!user){
                    error.push({msg: "incorrect username or password"})
                    res.render("login", {
                        title:"Login Account",
                        error,
                        email,
                        password
                    })
                    console.log("incorrect username or password");
                    // return done(null, false, {msg: "incorrect username or password"})
                   

                }else{

                    bcrypt.compare(password, user.password, (err, isMatch) =>{
                        if(err)throw err
                        if(isMatch){
                            return done(null, user)

                    }else{
                    error.push({msg: "incorrect username or password"})
                    res.render("login", {
                        title:"Login Account",
                        error,
                        email,
                        password
                    })
                    console.log("incorrect username or password");
                        // return done(null, false, {msg: "incorrect username or password"})
                    }
                })
            }
            }).catch(err => console.log(err))
   
    })       
    )
}
