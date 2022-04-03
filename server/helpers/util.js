const crypto = require('crypto');
// const iv = crypto.randomBytes(16);  
const messages = require('../helpers/constants/message');

// const key = crypto.randomBytes(32);
const key = '06f3gk1185gzc70f6ucee1jua1714t7d78gplufaxz4ff0qw';
const algorithm = 'aes-256-ctr';

const encrypt = (text) => {
    const cipher = crypto.createCipher(algorithm, key);
    console.log("decipher", cipher);

    let crypted = cipher.update(text, 'utf8', 'hex');
    crypted += cipher.final('hex');
    return crypted;
};

const decrypt = (text) => {
    try {
        const decipher = crypto.createCipher(algorithm, key);
        console.log("decipher", decipher);
        let dec = decipher.update(text, 'hex', 'utf8');
        console.log("decipher", dec);

        dec += decipher.final('utf8');
        return dec;

    } catch (error) {
        console.log("error", error);
    }

};


const generateUUID = (length = 6, options = { numericOnly: true }) => {
    let text = '';
    const possible =
        options && options.numericOnly
            ? '0123456789'
            : 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
};

module.exports = {
    encrypt,
    decrypt,
    messages,
    generateUUID
};
