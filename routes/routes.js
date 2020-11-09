const express = require("express");
const router = express.Router();
const md5 = require("md5");
const ping = require("ping");
const { generateToken, updateToken, deleteToken } = require("../token/jwt");
const { corsHeaders, checkUser, isAuth, optionOk } = require("./middleware");


router

.options("/signin", corsHeaders, optionOk)
.post("/signin", corsHeaders, checkUser, async (req, res)=>{
    res.status(200).json({
        token: `Bearer ${await generateToken({id: req.id, auth_id: req.auth_id})}`,
    });
})

.options("/signup", corsHeaders, optionOk)
.post("/signup", corsHeaders, (req, res)=>{
    
})

.get("/info", corsHeaders, isAuth, (req, res)=>{

})

.options("/latency", corsHeaders, optionOk)
.get("/latency", corsHeaders, isAuth, async (req, res)=>{
    res.status(200).json( {
        ping: (await ping.promise.probe("google.com")).time,
        token: `Bearer ${updateToken(req.token)}`,
    });
})

.options("/logout", corsHeaders, optionOk)
.get("/logout", corsHeaders, isAuth, async (req, res)=>{
    deleteToken({token: req.token, id: req.id, all: req.query.all=="true" ? true : false, });
    res.sendStatus(200);
})

.get("/main.js", (req, res)=>{
    res.sendFile("D:/Projects/Test task/front/main.js");
})


module.exports = router;