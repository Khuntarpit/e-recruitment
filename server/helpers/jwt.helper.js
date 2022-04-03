const jwt = require('jsonwebtoken');
require('dotenv').config();
const User = require('../apis/user/user.model');

function decodeToken(token) {
    return jwt.decode(token.replace('Bearer ', ''));
}

async function getAuthUser(token) {
    try {
        const tokenData = decodeToken(token);
        // console.log('tokeData', tokenData.id);
        const user = await User.findById(tokenData.id);
        // console.log("user123", user);
        // const resUser = JSON.parse(JSON.stringify(user));
        // delete resUser.password;
        return user;
    } catch (e) {
        return null;
    }
}


function getJWTToken(data) {
    let token
    if (data.expiresIn) {
        token = `Bearer ${jwt.sign(data, process.env.JWT_SECRET || "0a6b944d-d2fb-46fc-a85e-0295c986cd9f", { expiresIn: data.expiresIn })}`;
    } else {
        token = `Bearer ${jwt.sign(data, process.env.JWT_SECRET || "0a6b944d-d2fb-46fc-a85e-0295c986cd9f")}`;
    }
    return token;
}

module.exports = { decodeToken, getJWTToken, getAuthUser };
