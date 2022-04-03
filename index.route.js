"use strict";
require('dotenv').config();
var jwt = require("express-jwt");

exports.setup = function (app) {
    console.log("Setting up routes.");
    console.log("db connect successfully");

    app.use(
        "/api/", function (req, res, next) {
            // console.log("req.originalUrl", req.originalUrl);
            // console.log("req.headers", req.headers);
            // console.log("req.body", req.body);
            // console.log("req.params", req.params);
            next();
        },
        jwt({
            secret: process.env.JWT_SECRET || "0a6b944d-d2fb-46fc-a85e-0295c986cd9f"
        }).unless({
            path: [
                "/api/user/signup",
                "/api/user/login",
                "/api/admin/signup",
                "/api/admin/login",
                "/api/user/forgatePassword",
                "/api/user/ChangePassword",
            ]
        })
    );
    app.use("/api/user", require("./server/apis/user/user.route"));
    app.use("/api/admin", require("./server/apis/admin/admin.route"));
    app.use("/api/cv", require("./server/apis/cv/cv.route"));
    app.use("/api/inquiry", require("./server/apis/inquiry/inquiry.route"));


};

module.exports = exports;