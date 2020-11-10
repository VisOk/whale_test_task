const { findUser, findLogin, addNewUser } = require("../ramDB/init")
const { generateToken, checkToken, updateJwtToken } = require("../token/jwt");
const md5 = require("md5");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");

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
        return res.status(500).json(error).end();
    }

    if(userExist){
        req.id = userExist.id;
        req.auth_id = userExist.auth_id;
        req.type_id = userExist.type_id;
        return next();
    } else{
        return res.status(404).json({error: "User not found"}).end();
    }
}

const isAuth = function (req, res, next){
    if(!req.headers.authorization || req.headers.authorization.split(" ")[0]!="Bearer"){
        return res.status(401).json({error: "Missing token"}).end();
    }

    if(!checkToken(req.headers.authorization.split(" ")[1])){
        return res.status(401).json({error: "invalid signature"}).end();
    };
    
    let userData = jwt.decode(req.headers.authorization.split(" ")[1]).data;
    req.token = req.headers.authorization.split(" ")[1];
    req.id = userData.id;
    req.auth_id = userData.auth_id;
    req.type_id = userData.type_id;
    next();
}

const checkAvailableLogin = async function (req, res, next){
    try{
        return await findLogin(req.body.login) ? res.status(200).json({
            error: "Логин уже существует", 
            errno: 1, 
            }).end() : next();
    }
    catch (e){
        return res.status(500).json({error: e.message}).end();
    }
}

const createNewUser = async function(req, res, next){
    try{
        let user = await addNewUser({ 
            auth_id: req.body.login,
            password: md5(md5(req.body.password)),
            type_id: req.body.login.match(/@/) ? "mail" : "phone",  //correct check must be in front
            token: uuidv4(),
            create_date: new Date(), 
            last_signin: new Date(),
            });

            req.auth_id = user.auth_id;
            req.type_id = user.type_id;
            req.id = user.id;
        }
        catch (e){
            return res.status(500).json({error: e.message}).end();
        }

        next();
}

const genToken = async function(req, res, next){
    try{
        req.token = await generateToken({id: req.id, auth_id: req.auth_id, type_id: req.type_id});
    }
    catch (e){
        res.status(500).json(e);
    }

    next();
}

const updateToken = async function(req, res, next){
    req.token = await updateJwtToken(req.token);
    next();
}

module.exports.corsHeaders = corsHeaders;
module.exports.checkUser = checkUser;
module.exports.isAuth = isAuth;
module.exports.optionOk = optionOk;
module.exports.checkAvailableLogin = checkAvailableLogin;
module.exports.createNewUser = createNewUser;
module.exports.genToken = genToken;
module.exports.updateToken = updateToken;