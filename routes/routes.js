const express = require("express");
const router = express.Router();
const md5 = require("md5");
const ping = require("ping");
const jwt = require("jsonwebtoken");
const { generateToken, updateJwtToken, deleteToken } = require("../token/jwt");
const { corsHeaders, 
    checkUser, 
    isAuth, 
    optionOk, 
    checkAvailableLogin, 
    createNewUser, 
    genToken,
    updateToken } = require("./middleware");


router

.options("/signin", corsHeaders, optionOk)
.post("/signin", corsHeaders, checkUser, genToken, async (req, res)=>{
    res.status(200).json({token: `Bearer ${req.token}`, });
})

.options("/signup", corsHeaders, optionOk)
.post("/signup", corsHeaders, checkAvailableLogin, createNewUser, genToken, (req, res)=>{
    res.status(200).json({token: `Bearer ${req.token}`});
})

.options("/info", corsHeaders, optionOk)
.get("/info", corsHeaders, isAuth, updateToken, (req, res)=>{
    res.status(200).json({
        id: req.auth_id,
        type: req.type_id,
        token: `Bearer ${req.token}`,
    });
})

.options("/latency", corsHeaders, optionOk)
.get("/latency", corsHeaders, isAuth, updateToken, async (req, res)=>{
    try{
        res.status(200).json( {
            ping: (await ping.promise.probe("google.com")).time,
            token: `Bearer ${req.token}`,
        });
    }
    catch (e){
        res.status(500).json(e);
    }
})

.options("/logout", corsHeaders, optionOk)
.get("/logout", corsHeaders, isAuth, async (req, res)=>{
    try{
        await deleteToken({token: req.token, id: req.id, all: req.query.all=="true" ? true : false, });
        res.sendStatus(200);
    }
    catch (e){
        res.status(500).json(e);
    }
})

.get("/main.js", (req, res)=>{
    res.sendFile(__dirname.split("\\").slice(0, -1).join("\\") + "/front/main.js");
})


module.exports = router;