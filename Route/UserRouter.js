const express = require("express")
const UserRouter = express.Router()
const bcrypt = require("bcryptjs")
const mongoose = require("mongoose")
const User = require("../model/UserSchema")
const passport = require("passport")
const LocalStrategy = require('passport-local').Strategy;
const auth = require("../config/auth")






UserRouter.get("/register",  (req, res) =>{
    res.render("Register",{
        title:"Join E-shop",
        user:req.user,
        
    })
})
UserRouter.get("/Login", (req, res) =>{
    res.render("Login",{
        title:"Login Account",
        user:req.user,

    })
})

UserRouter.post("/register", (req, res) =>{
    let {username, email, password, password2} = req.body
    try {
       let error = [];
       if(!username || !email || !password || !password2){
           error.push({msg: "Please fill all field"})
       }
        
       if(username.length < 5){
           error.push({msg: "username to weak"})
       }
        if(password !== password2){
                error.push({msg: "password not match"})
        }
        if(password.length < 3 ){
            error.push({msg: "please choose a strong password"})
        }

        // check if email exist
       User.findOne({email:email}, (err, result) =>{
        if(err) throw err
           if(result){   
               console.log(email + " already exist");
            error.push({msg: "email already  exist"})
            res.redirect("/users/register")

           }
       })
       User.findOne({username:username}, (err, result) =>{
           if(err) throw err
           if(result){   
               console.log(username + " already exist");
            error.push({msg: "username already  exist"})
            res.redirect("/users/register")

           }
       })

       
       if(error.length > 0){
        error.push({msg: "sorry something went wrong"})
        res.redirect("/users/register")


       }else{
        const salt = 10;
        bcrypt.genSalt(salt,  function(err, salt) {
            bcrypt.hash(password, salt,   function(err, hash) {

             let regUser = new User({
                 username,
                 email, 
                 password:hash
             })

             regUser.save((err, result)=>{
                 if(err){
                     console.log(err);
                 res.redirect("/users/Register")

                 }
                 console.log(result);
                 res.redirect("/users/Login")
             })

            })
          })
    
       }

           
    } catch (error) {
        console.log(error);
    }
    console.log(req.body);
})




UserRouter.post("/Login", (req, res, next) =>{
    let {email, password } = req.body
    let error = [];
    if(!email || !password ){
        error.push({msg: "Please fill all field"})
        console.log( "Please fill all field")
       
    }
    if(error.length > 0){
        res.redirect("/users/Login")
    }else{
 
    passport.authenticate("local",{
        failureFlash: true})(req, res, function(err){
        if(err){
            res.redirect("/users/Login")

        }else{
            res.redirect("/users/dashboard")
        }
    })
}
})

UserRouter.get("/logout", (req, res)=>{
    req.logout()
    req.flash("logout", "you have successfully logout")
    res.redirect("/users/Login")
})




UserRouter.get("/dashboard", auth, (req, res) =>{
    res.render("dashboard",{
        title:"dashboard",
        user:req.user
    })
})



module.exports = UserRouter