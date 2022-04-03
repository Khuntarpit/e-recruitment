require('dotenv').config();
const s3Config = {
    clientId: process.env.clientId || "AKIAQBBC5CKFUSRJSUPF",
    clientSecret: process.env.clientSecret || "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",
    region: process.env.region || "ap-south-1",
    bucket: process.env.bucket || "homedine"
}
module.exports = {
    s3Config
};