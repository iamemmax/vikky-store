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
const productSchema = require("./model/productSchema")
const auth = require("./config/auth")
const UserSchema = require("./model/UserSchema")
const Layout = require("express-layouts")

const app = express()




app.set("view engine", "ejs")
app.set('layout', 'layout'); // defaults to 'layout'
app.use(express.static(path.join(__dirname, "public")))
app.use(express.urlencoded({extended:false}))
app.use(express.json())
app.use(Layout)

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

   
app.get("/",   auth, async(req, res) =>{
    let products =  await productSchema.find((err, data) =>{
        if(err)throw err
    })

  await CartSchema.findOne({userId:req.user.id}, (err, cart)=>{
      if(err){
          console.log(err);
      }
      console.log(cart);
      if(cart){
        let myCart = cart.userCart.map(c => c.quantity)
        let totalQty = myCart.reduce((a, b) => a + b, 0)
          
        res.render("index", {
            title:"Homepage",
            user:req.user,
            products,
            cart,
            layout: false,
            totalQty
    
        })
      }else{
        res.render("index", {
            title:"Homepage",
            user:req.user,
            products,
            cart,
            layout: false,
            
    
          
        })
    
      }
  }).populate("productId")

  
     
  
   
    
   
})

app.get("/:q", auth, async(req, res) =>{
   let query = req.query.q

    let regex = new RegExp(query, "i")
    let search =  await productSchema.find({productName:regex})


    await CartSchema.findOne({userId:req.user.id}, (err, cart)=>{
        if(err){
            console.log(err);
        }
        if(cart){
          let myCart = cart.userCart.map(c => c.quantity)
          let totalQty = myCart.reduce((a, b) => a + b, 0)
            
          res.render("search", {
            user:req.user,
            title: "search",
            cart,
            search,
            query,
              layout: false,
              totalQty
      
          })

        }else{
            res.render("search", {
                user:req.user,
                title: "search",
                cart,
                search,
                query,
                  layout: false,
                  
          
              })
     
        }

    
})

})

// routes
app.use("/users", require("./Route/UserRouter"))
app.use("/product", require("./Route/productRouter"))
app.use("/users/cart", require("./Route/cartRouter"))

const PORT = process.env.PORT || 5050
app.listen(PORT, () =>{
    console.log(`server started at port ${PORT}`);
})
