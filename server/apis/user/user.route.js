const express = require('express');
const usersCtrl = require('./user.controller');
const httpStatus = require('http-status');
const router = express.Router(); // eslint-disable-line new-cap
const Joi = require('joi');
const APIResponse = require('../../helpers/APIResponse');
const userBloked = require('../../middleware/middleware');
const { mediaUploadS3 } = require('../s3-multer');


router.route("/signup").post(signupValidate, usersCtrl.create);
router.route("/login").post(LoginValidate, usersCtrl.login);
router.route("/:id").put(userBloked, mediaUploadS3.single('profile'), usersCtrl.update);
router.route("/ChangePassword").post(changePasswordValidationValidate, usersCtrl.ChangePassword);
router.route("/forgatePassword").post(forgatePasswordValidationValidate, usersCtrl.forgatePassword);
router.route("/getByRole/:role").get(RoleParamsRequiredValidation, usersCtrl.getUserByRole);
router.route("/exam").get(usersCtrl.getQuestion);
router.route("/submitExam").post(usersCtrl.submitExam);


const LoginValidation = Joi.object().keys({
    email: Joi.string().required().error(new Error('Email is required!')),
    password: Joi.string().required().error(new Error('Password is required!')),
    role: Joi.string().required().error(new Error('Role is required!')),

}).unknown();

function LoginValidate(req, res, next) {
    const Data = req.body;
    Joi.validate((Data), LoginValidation, (error, result) => {
        if (error) {
            return res.status(httpStatus.BAD_REQUEST).json(new APIResponse(null, error.message, httpStatus.BAD_REQUEST));
        } else {
            return next();
        }
    });
}

const signupValidation = Joi.object().keys({
    userName: Joi.string().required().error(new Error('User Name is Required!')),
    email: Joi.string().required().error(new Error('Email is Required!')),
    password: Joi.string().required().error(new Error('Password is Required')),
    // mobile: Joi.string().required().error(new Error('Mobile Number is Required')),
    role: Joi.string().required().error(new Error('Role  is Required')),

}).unknown();



function signupValidate(req, res, next) {
    const Data = req.body;
    console.log("Data", Data);
    Joi.validate((Data), signupValidation, (error, result) => {
        if (error) {
            return res.status(httpStatus.BAD_REQUEST).json(new APIResponse(null, error.message, httpStatus.BAD_REQUEST));
        } else {
            return next();
        }
    });
}


const forgatePasswordValidation = Joi.object().keys({
    email: Joi.string().required().error(new Error('Email is required!')),
}).unknown();

function forgatePasswordValidationValidate(req, res, next) {
    const Data = req.body;
    Joi.validate((Data), forgatePasswordValidation, (error, result) => {
        if (error) {
            return res.status(httpStatus.BAD_REQUEST).json(new APIResponse(null, error.message, httpStatus.BAD_REQUEST));
        } else {
            return next();
        }
    });
}
const changePasswordValidation = Joi.object().keys({
    email: Joi.string().required().error(new Error('Email is required!')),
    oldPassword: Joi.string().required().error(new Error('Old Password is required!')),
    newPassword: Joi.string().required().error(new Error('New Password is required!')),
    role: Joi.string().required().error(new Error('role is required!')),
}).unknown();

function changePasswordValidationValidate(req, res, next) {
    const Data = req.body;
    Joi.validate((Data), changePasswordValidation, (error, result) => {
        if (error) {
            return res.status(httpStatus.BAD_REQUEST).json(new APIResponse(null, error.message, httpStatus.BAD_REQUEST));
        } else {
            return next();
        }
    });
}

function RoleParamsRequiredValidation(req, res, next) {
    if (req.params && req.params.hasOwnProperty('role')) {
        next();
    } else {
        return res.status(httpStatus.BAD_REQUEST)
            .json(new APIResponse(null, 'role param not found', httpStatus.BAD_REQUEST));
    }
}




module.exports = router;