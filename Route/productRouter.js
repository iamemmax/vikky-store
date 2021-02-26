const express = require("express");
const multer = require("multer")
const sharp = require("sharp")
const productRouter = express.Router()



productRouter.get("/new", (req, res) =>{
    res.render("newProduct", {
        title:"Upload New product",
        user:req.user
    })
})



module.exports = productRouter