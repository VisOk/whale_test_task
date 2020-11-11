const { v4: uuidv4 } = require("uuid");
const { updateTokenKeyDb } = require("../db/delete_token");
const { userList } = require("./init");

async function updateKey(data){
    let key = uuidv4();
    for(let i of userList){
        if(i.id==data.id){
            i.key = key;
            break;
        }
    }

    try{
        await updateTokenKeyDb({id:data.id, token: key, });
    }
    catch(e){
        throw e;
    }
}

module.exports.updateKey = updateKey;