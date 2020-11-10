const { findUser, findLogin } = require("../ramDB/init")
const { generateToken, checkToken } = require("../token/jwt");
const md5 = require("md5");
const jwt = require("jsonwebtoken");

const corsHeaders = function (req, res, next){
    res.set('Access-Control-Allow-Origin', "*");
    res.set("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    // res.set('Access-Control-Allow-Methods', 'GET,POST, OPTIONS');
    // res.set('Access-Control-Allow-Credentials', 'true');
    return next();
}

const optionOk = function (req, res, next){
    res.sendStatus(200);
}

const checkUser = async function (req, res, next){
    let userExist;
    try{
        userExist = await findUser( {login: req.body.login, password: md5(md5(req.body.password))} );
    }
    catch (error){
        return res.send(JSON.stringify({error: error.message})).end();
    }

    if(userExist){
        req.id = userExist.id;
        req.auth_id = userExist.auth_id;
        return next();
    } else{
        return res.send(JSON.stringify({error: "User not found"})).end();
    }
}

const isAuth = function (req, res, next){
    if(!req.headers.authorization || req.headers.authorization.split(" ")[0]!="Bearer"){
        return res.status(401).json({error: "Missing token"}).end();
    }

    if(!checkToken(req.headers.authorization.split(" ")[1])){
        return res.status(401).json({error: "invalid signature"}).end();
    };
    // console.log(req.headers.authorization);
    req.token = req.headers.authorization.split(" ")[1];
    req.id = jwt.decode(req.headers.authorization.split(" ")[1]).data.id;
    next();
}

const checkAvailableLogin = function (req, res, next){
    try{
        return findLogin(req.body.login) ? res.status(200).json({
            error: "Логин уже существует", 
            errno: 1, 
            }).end() : next();
    }
    catch (e){
        return res.status(500).json({error: e.message}).end();
    }
}

module.exports.corsHeaders = corsHeaders;
module.exports.checkUser = checkUser;
module.exports.isAuth = isAuth;
module.exports.optionOk = optionOk;
module.exports.checkAvailableLogin = checkAvailableLogin;