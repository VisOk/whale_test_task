const jwt = require("jsonwebtoken");
const { findTokenKey, addToBlackList, updateKey, checkBlackList } = require("../ramDB/init");


async function generateToken(data){
    const expiration = '10m';
    return jwt.sign({ data, }, findTokenKey(data.id), { expiresIn: expiration });
}

function updateToken(token){
    const expiration = '10m';
    const data = jwt.decode(token).data;
    return jwt.sign( {data, }, findTokenKey(data.id), { expiresIn: expiration });
}

//True если токен подписан правильно и не в черном листе
function checkToken(token){
    try{
        jwt.verify(token, findTokenKey(jwt.decode(token).data.id));
    }
    catch (e){
        return false;
    }
    if(checkBlackList(token)) return false;

    return true;
}

function deleteToken(data){
    if(data.all){
        console.log("all")
        updateKey({ token: data.token, id: data.id, });
    } else{
        addToBlackList(data.token);
    }
}


module.exports.generateToken = generateToken;
module.exports.updateToken = updateToken;
module.exports.checkToken = checkToken;
module.exports.deleteToken = deleteToken;