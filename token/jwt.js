const jwt = require("jsonwebtoken");
const { addToBlackList, checkBlackList } = require("../ramDB/init");
const { findTokenKey } = require("../ramDB/findTokenKey");
const { updateKey } = require("../ramDB/updateTokenKey");


async function generateToken(data){
    const expiration = '10m';
    try{
        return jwt.sign({ data, }, await findTokenKey(data.id), { expiresIn: expiration });
    }
    catch (e){
        throw e;
    }
}

async function updateJwtToken(token){
    const expiration = '10m';
    const data = jwt.decode(token).data;
    try{
        return jwt.sign( {data, }, await findTokenKey(data.id), { expiresIn: expiration });
    }
    catch (e){
        throw e;
    }
    
}

//True если токен подписан правильно и не в черном листе
async function checkToken(token){
    try{
        jwt.verify(token, (await findTokenKey(jwt.decode(token).data.id)));
    }
    catch (e){
        if(e.errno==2){
            throw e;
        }
        return false;
    }
    if(checkBlackList(token)) return false;

    return true;
}

async function deleteToken(data){
    if(data.all){
        try{
            await updateKey({ token: data.token, id: data.id, });
        }
        catch (e){
            throw e;
        }
    } else{
        addToBlackList(data.token);
    }
}


module.exports.generateToken = generateToken;
module.exports.updateJwtToken = updateJwtToken;
module.exports.checkToken = checkToken;
module.exports.deleteToken = deleteToken;