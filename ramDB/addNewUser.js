const { addUserToRamDb } = require("./init");
const addUserDb = require("../db/new_user");

async function addNewUser(user){
    try{
        let newUser = await addUserDb(user);
        addUserToRamDb(newUser);
        return newUser;
    }
    catch (e){
        throw e;
    }
}

module.exports.addNewUser = addNewUser;