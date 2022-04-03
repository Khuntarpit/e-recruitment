const express = require('express');
const recipeCtrl = require('./recipe.controller');
const Joi = require('joi');
const httpStatus = require('http-status');
const APIResponse = require('../../helpers/APIResponse');
const router = express.Router(); // eslint-disable-line new-cap
const userBloked = require('../../middleware/middleware');
const { mediaUploadS3 } = require('../s3-multer');
router.route("/createrecipe").post(userBloked, mediaUploadS3.array('image'), Validate, recipeCtrl.create);
router.route("/getAllRecipeByCook").get(userBloked, recipeCtrl.getAllRecipeByCook);
router.route("/getRecipeByLimit").get(recipeCtrl.getRecipeByLimit);
router.route("/getAll").get(userBloked, recipeCtrl.getAll);

router.route("/:id").put(userBloked, IDParamsRequiredValidation, mediaUploadS3.array('image'), recipeCtrl.update);
router.route("/getById").post(IDQueryRequiredValidation, recipeCtrl.getByID);
router.route('/:id').delete(userBloked, IDParamsRequiredValidation, recipeCtrl.remove);
router.route('/getRecipeByCategory').post(recipeCtrl.getRecipeByCategory)
router.route('/getRecipeByGlobalFilter').post(recipeCtrl.getRecipeByGlobalFilter)


const Validation = Joi.object().keys({
    title: Joi.string().required().error(new Error('title is required!')),
    description: Joi.string().required().error(new Error('description is required!')),
    price: Joi.string().required().error(new Error('Price is required!')),
    serveSize: Joi.string().required().error(new Error('Serve Size is required!')),
    // role: Joi.string().required().error(new Error('role is required!'))
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
const getBtIdValidation = Joi.object().keys({
    id: Joi.string().required().error(new Error('id is required!'))
}).unknown();

function IDQueryRequiredValidation(req, res, next) {
    const Data = req.body;
    Joi.validate((Data), getBtIdValidation, (error, result) => {
        if (error) {
            return res.status(httpStatus.BAD_REQUEST).json(new APIResponse(null, error.message, httpStatus.BAD_REQUEST));
        } else {
            return next();
        }
    });
}

module.exports = router;