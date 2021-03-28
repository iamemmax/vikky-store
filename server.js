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
const app = express()


require("./config/passport")(passport)

app.set("view engine", "ejs")
app.use(express.static(path.join(__dirname, "public")))
app.use(express.urlencoded({extended:false}))
app.use(express.json())
app.use(methodOverride("_method"))


app.use(session({
    secret: 'iam untouchable',
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires:108000000
    }
}))
app.use(passport.initialize());
app.use(passport.session());

app.use(flash())





mongoose.connect(process.env.db_url, {
    useNewUrlParser:true, useCreateIndex:true, useUnifiedTopology:true,useFindAndModify:false
}, (err)=>{
    if(err){
        console.log(err);
    }else{
        console.log("database connected successfully".red);
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

  let cart = await CartSchema.findOne({userId:req.user.id})
// console.log(cart);

  
    res.render("index", {
        title:"Homepage",
        user:req.user,
        products,
        cart,
 
        
        
        
       
       
    })
   
})


// routes
app.use("/users", require("./Route/UserRouter"))
app.use("/product", require("./Route/productRouter"))
app.use("/users/cart", require("./Route/cartRouter"))

const PORT = process.env.PORT || 4000
app.listen(PORT, () =>{
    console.log(`server started at port ${PORT}`);
})