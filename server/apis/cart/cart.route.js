const express = require('express');
const cartCtrl = require('./cart.controller');
const Joi = require('joi');
const httpStatus = require('http-status');
const APIResponse = require('../../helpers/APIResponse');
const router = express.Router(); // eslint-disable-line new-cap


router.route("/createCart").post(Validate, cartCtrl.create);
router.route("/getAllCartByUser").get(cartCtrl.getAllCartByUser);
router.route("/:id").put(IDParamsRequiredValidation, cartCtrl.update);
router.route("/:id").get(IDParamsRequiredValidation, cartCtrl.getByID);
router.route('/:id').delete(IDParamsRequiredValidation, cartCtrl.remove);

const Validation = Joi.object().keys({
    userId: Joi.string().required().error(new Error('userId is required!')),
    recipeId: Joi.string().required().error(new Error('recipeId is required!')),

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