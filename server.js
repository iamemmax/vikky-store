const express = require("express")
const path = require('path')
const mongoose = require("mongoose")
require("dotenv").config()
const methodOverride = require("method-override")
const session = require("express-session")
const flash = require("connect-flash")
const User = require("./model/UserSchema")
const CartSchema = require("./model/CartSchema")
const Product = require("./model/productSchema")
const passport = require("passport")
const LocalStrategy = require('passport-local').Strategy;
const cors = require("cors")
const productSchema = require("./model/productSchema")
const auth = require("./config/auth")
const UserSchema = require("./model/UserSchema")
const Layout = require("express-ejs-layouts")
// const { request } = require("http")
const axios = require("axios").default
const app = express()





app.use(cors())
app.use(Layout)
app.set('layout', './layouts/dashboard-layout')
app.set('view engine', 'ejs')
app.use(express.static(path.join(__dirname, "public")))
app.use(express.urlencoded({extended:false}))
app.use(express.json())

app.use(methodOverride("_method"))
app.use(session({
    secret:"emmalex",
    cookie:{maxAge: 600000000000000},
    resave:true,
    saveUninitialized:true
}))
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

require("./config/passport")(passport)






mongoose.connect(process.env.db_url, {
    useNewUrlParser:true, useCreateIndex:true, useUnifiedTopology:true,useFindAndModify:false
}, (err)=>{
    if(err){
        console.log(err);
    }else{
        console.log("database connected successfully");
    }
})




passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
        done(err, user);
       });
   });

   
   
app.get("/",   async(req, res) =>{
    const {page = 1, limit = 20} = req.query
    let products =  await productSchema.find((err, data) =>{

        if(err)throw err
    }).limit(limit * 1).skip((page - 1) * limit)
let error = []
  

          
        res.render("index", {
            title:"Homepage",
            user:req.user,
            products,
            layout: false,
           
            success:req.flash("success")   
      
  })
  
       
   
})





app.get("/:q",  async(req, res) =>{
   let query = req.query.q
  
    let regex = new RegExp(query, "i")
    let search =  await productSchema.find({productName:regex})

          res.render("search", {
            user:req.user,
            title: "search",
            search,
            query,
            layout: "./layouts/search-category"
              
      
          })

       

})

app.get("/privacy", (req, res) =>{
    res.render("privacy-policy", {
        title: "privacy-policy",
        user:req.user,
        
    })
})

// routes
app.use("/users", require("./Route/UserRouter"))
app.use("/product", require("./Route/productRouter"))
app.use("/cart", require("./Route/cartRouter"))

const PORT = process.env.PORT || 5050
app.listen(PORT, () =>{
    console.log(`server started at port ${PORT}`);
})
