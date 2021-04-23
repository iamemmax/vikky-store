const express = require("express")
const bcrypt = require("bcryptjs")
const mongoose = require("mongoose")
const User = require("../model/UserSchema")
const cartSchema = require("../model/CartSchema") 
const productSchema = require("../model/productSchema")
const passport = require("passport")
const LocalStrategy = require('passport-local').Strategy;
const auth = require("../config/auth")
const UserSchema = require("../model/UserSchema")
const Layout = require("express-layouts")
const UserRouter = express.Router()


UserRouter.get("/register",  (req, res) =>{
    res.render("Register",{
        title:"Join E-shop",
        user:req.user,
        layout: false,

        
    })
})


UserRouter.get("/login", (req, res)=>{
    res.render("Login", {
        title:"Login Account",
        user: req.user,
        layout: false,
        
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
               
               res.render("Register", {
                title:"Register user",
                error,
                username,
                email,
                password,
                user:req.user,
                layout: false,

                
            })
    
    

            }
        })

        User.findOne({username:username}, (err, result) =>{
            if(err) {
               console.log(err);
               error.push({msg: "username already exist"})
                
                res.render("Register", {
                    title:"Register user",
                    error,
                    username,
                    email,
                    password,
                    user:req.user,
                    layout: false,

                    
                })
            }
            if(result){
          
              
                error.push({msg: "username already exist"})
                
                res.render("Register", {
                    title:"Register user",
                    error,
                    username,
                    email,
                    password,
                    layout: false,
                    user:req.user,
                    
                })
        
        

            }
       })
       
       
       if(error.length > 0){
          
        res.render("Register", {
            title:"Register user",
            error,
            username,
            email,
            password,
            user:req.user,
            layout: false,

          
            
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
                     res.redirect("/users/register")

                 }
                if(result){
                    res.redirect("/users/login")
                }
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
    // let {email, password } = req.body
    let email = req.body.email.trim()
    let password = req.body.password.trim()
    let error = [];
    if(!email || !password ){
        error.push({msg: "Please fill all field"})
        console.log( "Please fill all field")
       
    }
    if(error.length > 0){
        res.render("Login", {
            title:"Login Account",
            error,
            email,
            password,
            layout: false,

        })

    }else{
        passport.use(
            new LocalStrategy({
                usernameField:"email"}, (email, password, done) =>{
        
                    let error = []
                User.findOne({email:email})
                .then(user =>{
                    if(!user){
                        error.push({msg: "incorrect username or password"})
                        res.render("Login", {
                            title:"Login Account",
                            error,
                            email,
                            password,
                                                        layout: false,

                        })
                        // /console.log("incorrect username or password");
                        // return done(null, false, {msg: "incorrect username or password"})
                       
    
                    }else{
    
                        bcrypt.compare(password, user.password, (err, isMatch) =>{
                           if(err)console.log(err);
                            if(isMatch){
                                return done(null, user)
    
                        }else{
                        error.push({msg: "incorrect username or password"})
                        res.render("Login", {
                            title:"Login Account",
                            error,
                            email,
                            password,
                            user:user.id,
                            layout: false,

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
    res.redirect("/users/login")
})




UserRouter.get("/dashboard/:id", auth, async (req, res) =>{

    let cart = await cartSchema.find({userId:req.user.id}, (err)=>{
        
    }).populate("userCart.productId userId")
    if(cart){
        let myCart = cart[0].userCart.map(c => c.quantity)
        let totalQty = myCart.reduce((a, b) => a + b, 0)

        
            res.render("dashboard", {
                title: "dashboard",
                user:req.user,
                layout:Layout,
                layout:true,
                cart,
                totalQty
           
        })
    }else{
        res.render("dashboard", {
            title: "dashboard",
            user:req.user,
            layout:Layout,
            layout:true,
            cart
          
        })
    }
    
   





})



// change password

UserRouter.get("/dashboard/change-pass/:id", auth, async (req, res) =>{
    let error  = []
    let cart = await cartSchema.find({userId:req.user.id}, (err)=>{
    
    }).populate("userCart.productId userId")
    if(cart){
        let myCart = cart[0].userCart.map(c => c.quantity)
        let totalQty = myCart.reduce((a, b) => a + b, 0)

        res.render("change-pass", {
            title : "change password",
            user:req.user,
            error,
            layout: true,
            user:req.user,
            cart,
            totalQty

        })
    }else{

        res.render("change-pass", {
            title : "change password",
            user:req.user,
            error,
            layout: true,
            user:req.user,
            cart
        })
    }
})

UserRouter.post("/dashboard/change-pass/:id", async(req, res)=>{
    let error = []
    let user =  await UserSchema.findOne({_id:req.params.id}).populate("postedBy product")
    let {old, password, password2} = req.body

    if(!old || !password || !password2){
        error.push({msg: "all field are required"})
          
     }
        if(password !== password2){
            error.push({msg: "password not match"})  
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



    

    UserRouter.get("/account/:id",  auth, async(req, res) =>{

        let error =  []
        let cart = await cartSchema.find({userId:req.user.id}, (err, data)=>{
            if(err)console.log(err);
         }).populate("userCart.productId userId")
         if(cart){
             let myCart = cart[0].userCart.map(c => c.quantity)
             let totalQty = myCart.reduce((a, b) => a + b, 0)

        res.render("edit", {
            title: "Edit",
            user:req.user,
            error,
            cart,
            totalQty
        })

    }else{
        res.render("edit", {
            title: "Edit",
            user:req.user,
            layout: true,
            error,
            
        })
    }
    })


    
    UserRouter.put("/account/:id",  auth, async(req, res) =>{
        let error = [];

        let {firstname, lastname, email, phone, dob, gender} = req.body
        if(!firstname || !lastname || !email || !phone || !gender){
            error.push({msg: "please filled all field"})
            res.render("edit", {
                title: "Edit",
                user:req.user,
                 error,
                
            })
        }

        if(error.length > 0){
            error.push({msg: "unable to update account"})

        }else{
            await UserSchema.findOneAndUpdate({_id:req.params.id}, {$set:{firstname, lastname:lastname, email:email, phone:phone, gender:gender, dob:dob}}, (err, data)=>{
                if(err)console.log(err);

                if(data){
                    res.redirect(`/users/dashboard/${req.user.id}`)
                    console.log("success");
                }
            }, {new:true})

        }
        console.log(req.body);

    })








    UserRouter.get("/dashboard/:id/edit-profile", auth, async(req, res) =>{

        let error  = []
        let cart = await cartSchema.find({userId:req.user.id}, (err, data)=>{
           if(err)console.log(err);
        }).populate("userCart.productId userId")
        if(cart){
            let myCart = cart[0].userCart.map(c => c.quantity)
            let totalQty = myCart.reduce((a, b) => a + b, 0)
    
            res.render("editProfile", {
                title : "Edit",
                user:req.user,
                error,
                layout: true,
                user:req.user,
                cart,
                totalQty
    
            })

        }
        res.render("editProfile", {
            title: "Edit",
            user:req.user,
            cart,
            layout: true,
            error
        })
    })


    
        
module.exports = UserRouter