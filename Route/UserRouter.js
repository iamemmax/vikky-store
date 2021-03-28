const express = require("express")
const UserRouter = express.Router()
const bcrypt = require("bcryptjs")
const mongoose = require("mongoose")
const User = require("../model/UserSchema")
const cartSchema = require("../model/CartSchema") 
const productSchema = require("../model/productSchema")
const passport = require("passport")
const LocalStrategy = require('passport-local').Strategy;
const auth = require("../config/auth")
const UserSchema = require("../model/UserSchema")


UserRouter.get("/register",  (req, res) =>{
    let {username, email, password, password2} = req.body

    res.render("Register",{
        title:"Join E-shop",
        user:req.user,
        
    })
})
UserRouter.get("/login",  (req, res) =>{
    res.render("login",{
        title:"Login Account",
        user:req.user,

    })
})

UserRouter.post("/register", (req, res) =>{
    let error = [];
    let {username, email, password, password2} = req.body
    try {
        if(!username || !email || !password || !password2){
            error.push({msg: "all field are required"})
              
         }
            if(password !== password2){
                error.push({msg: "password not match"})
               
            }
            if(password.length > 0 && password.length < 5){
                error.push({msg: "password too weak"})

            }
            if(username.length > 0 && username.length < 5){
                error.push({msg: "choose a username"})
              

                console.log("choose a username")
                
            }
            // check if email exist
       User.findOne({email:email}, (err, result) =>{
           if(err) throw err
           if(result){   
               error.push({msg: "email already  exist"})
               
               res.render("register", {
                title:"Register user",
                error,
                username,
                email,
                password,
                user:req.user,
                
            })
    
    

            }
        })

        User.findOne({username:username}, (err, result) =>{
            if(err) {
               console.log(err);
            }
            if(result){
          
              
                error.push({msg: "username already exist"})
                
                res.render("register", {
                    title:"Register user",
                    error,
                    username,
                    email,
                    password,
                    user:req.user,
                    
                })
        
        

            }
       })
       
       
       if(error.length > 0){
          
        res.render("register", {
            title:"Register user",
            error,
            username,
            email,
            password,
            user:req.user,
            
            // layout:false,
            
            
            
        })


        
        
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
                //  console.log(result);
                 res.redirect("/users/Login")
             })

            })
          })
    
          
          
        }
        // console.log(req.body);
    } catch (error) {
        console.log(error);
    }
})




UserRouter.post("/login", (req, res, next) =>{
    let {email, password } = req.body
    let error = [];
    if(!email || !password ){
        error.push({msg: "Please fill all field"})
        console.log( "Please fill all field")
       
    }
    if(error.length > 0){
        res.render("login", {
            title:"Login Account",
            error,
            email,
            password
        })

    }else{
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
    
    
         
     
    passport.authenticate("local",{
        failureFlash: true})(req, res, function(err){
        if(err){
            res.redirect("/users/login")

        }else{
            res.redirect("/")
        }
    })
}
})

UserRouter.get("/logout", auth, (req, res)=>{
    req.logout()
    req.flash("logout", "you have successfully logout")
    res.redirect("/users/Login")
})




UserRouter.get("/dashboard", auth, async (req, res) =>{
    let cart =  await cartSchema.findOne({userId:req.user._id},(err, data) =>{
        if(err)throw err
      }).populate("postedBy product")
     
      let mycart = cart.userCart.map(da =>da.quantity);

    res.render("dashboard",{
        title:"dashboard",
        user:req.user,
        cart,
        mycart
    })
})



// change password

UserRouter.get("/change-pass/:id", auth, (req, res) =>{
    
let error  = []
    res.render("change-pass", {
        title : "change password",
        user:req.user,
        error
    })
})

UserRouter.post("/change-pass/:id", async(req, res)=>{
    let error = []
    let user =  await UserSchema.findOne({_id:req.params.id}).populate("postedBy product")
    let {old, password, password2} = req.body

    if(!old || !password || !password2){
        error.push({msg: "all field are required"})
          
     }
        if(password !== password2){
            error.push({msg: "password not match"})
            console.log("pass1 and pass 2 not match");
           
        }
        if(error.length > 0){
            res.render("change-pass", {
                title:"change password",
                user:req.user.id,
                error,
                old,
                password,
                password2
           })
           
        }else{
            if(user){
                 const salt = 10;
                bcrypt.genSalt(salt,  function(err, salt) {
                    bcrypt.hash(password, salt,   function(err, hash) {
                   
                        bcrypt.compare(old, user.password, (err, isMatch) =>{
                            if(err)throw err
                    if(isMatch){
                       
                            UserSchema.findOneAndUpdate({_id:req.user.id}, {$set:{password:hash}},(err, data) =>{
                                if(err)console.log(err);
                                if(data){
                                    res.redirect("/")
                                    console.log("password changed successfully");
                                }
                            }, {new:true})
                            
                        
                    
       
                
                }else{
                    error.push({msg: "user not found"})
                    
                }
                        })
                })
          
            
        
    })

            }}
    })
        
module.exports = UserRouter