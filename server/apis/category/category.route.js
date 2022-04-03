const express = require('express');
const categoryCtrl = require('./category.controller');
const Joi = require('joi');
const httpStatus = require('http-status');
const APIResponse = require('../../helpers/APIResponse');
const router = express.Router(); // eslint-disable-line new-cap
const { mediaUploadS3 } = require('../s3-multer');

router.route("/createCategory").post(mediaUploadS3.single('image'), Validate, categoryCtrl.create);
router.route("/getAllCategory").get(categoryCtrl.getAllCategory);
router.route("/:id").put(mediaUploadS3.single('profile'), IDParamsRequiredValidation, categoryCtrl.update);
router.route("/:id").get(IDParamsRequiredValidation, categoryCtrl.getByID);
router.route('/:id').delete(IDParamsRequiredValidation, categoryCtrl.remove);

const Validation = Joi.object().keys({
    name: Joi.string().required().error(new Error('name is required!')),

}).unknown();

function Validate(req, res, next) {
    const Data = req.body;
    Joi.validate((Data), Validation, (error, result) => {
        if (error) {
            return res.status(httpStatus.BAD_REQUEST).json(new APIResponse(null, error.message, httpStatus.BAD_REQUEST));
        } else {
            return next();
        }
    });
}

function IDParamsRequiredValidation(req, res, next) {
    if (req.params && req.params.hasOwnProperty('id')) {
        next();
    } else {
        return res.status(httpStatus.BAD_REQUEST)
            .json(new APIResponse(null, 'id param not found', httpStatus.BAD_REQUEST));
    }
}

module.exports = router;