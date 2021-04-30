// const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy;
const mongoose = require("mongoose")
const passport = require("passport")
const bcrypt = require("bcryptjs")
const User = require("../model/UserSchema")
const keys = require("../config/key")
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const findOrCreate = require("mongoose-findorcreate")

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
    

    // facebook authentication
    passport.use(new FacebookStrategy({
        clientID: keys.FACEBOOK_APP_ID_PRO,
        clientSecret: keys.facebook_Secrete_PRO,
        callbackURL: keys.callbackURL_dev,
        profileFields: ['id', 'displayName', 'photos', 'email', 'name', "gender"],
        enableProof: true
      },
      function(accessToken, refreshToken, profile, cb) {
          console.log(profile);
        User.findOrCreate({ facebookId: profile.id, username:profile.displayName, email:profile.emails[0].value, userImg:profile.photos[0].value, gender:profile.gender}, function (err, user) {
          return cb(err, user);
        });
      }
    ));
    


     
    // App ID 289365682667423
    // Instagram App Secret
    // App Secret  ae23c331510d534cffa50efb2f3e0d21

    // google authentication
    passport.use(new GoogleStrategy({
        clientID: keys.GOOGLE_CLIENT_ID,
        clientSecret: keys.GOOGLE_CLIENT_SECRET,
        callbackURL: keys.callbackURL,

      },
      function(accessToken, refreshToken, profile, cb) {
        User.findOrCreate({ googleId:profile.id, username:profile.displayName, email:profile.emails[0].value }, function (err, user) {
            // console.log(profile);
           
          return cb(err, user);
        });
      }
    ));


}