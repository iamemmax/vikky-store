// const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy;
const mongoose = require("mongoose")
const passport = require("passport")
const bcrypt = require("bcryptjs")
const User = require("../model/UserSchema")

module.exports =  function (){

    passport.use(
        new LocalStrategy({
            usernameField:"email"}, (email, password, done) =>{
    
            User.findOne({email:email})
            .then(user =>{
                console.log(user);
                if(!user){
                    console.log("incorrect username or password");
                    return done(null, false, {msg: "incorrect username or password"})

                }else{

                    bcrypt.compare(password, user.password, (err, isMatch) =>{
                        if(err)throw err
                        if(isMatch){
                            return done(null, user)
                            
                        
                    }else{
                        console.log("incorrect username or password");
                        
                
                    return done(null, false, {msg: "incorrect username or password"})
                        
                    }
                })
            }
            }).catch(err => console.log(err))
   
    })       
    )


     passport.serializeUser(function(user, done) {
         done(null, user.id);
     });
     
     passport.deserializeUser(function(id, done) {
         User.findById(id, function(err, user) {
             done(err, user);
            });
        });
    
}
