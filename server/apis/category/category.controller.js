const Category = require('./category.model');
const APIResponse = require("../../helpers/APIResponse");
const Utils = require("../../helpers/util");
const httpStatus = require("http-status");


async function getAllCategory(req, res, next) {
    try {
        const CategoryData = await Category.find().sort({ createdAt: -1 });
        res.status(httpStatus.OK).send(new APIResponse(CategoryData, Utils.messages.SUCCESS_MSG));
    } catch (e) {
        next(e);
    }
}


async function getByID(req, res, next) {
    try {
        const CategoryData = await Category.findById({ _id: req.params.id });
        res.status(httpStatus.OK).send(new APIResponse(CategoryData, Utils.messages.SUCCESS_MSG));
    } catch (e) {
        next(e);
    }
}

async function create(req, res, next) {
    try {
        if (req.file) {
            const Categorys = new Category({
                name: req.body.name,
                image: req.file.location
            });
            const savedCategory = await Categorys.save();
            res.status(httpStatus.OK).send(new APIResponse(savedCategory, Utils.messages.SUCCESS_INSERT));
        } else {
            return res.status(httpStatus.BAD_REQUEST).json(new APIResponse({}, 'Image is Required', httpStatus.BAD_REQUEST));

        }

    } catch (error) {
        next(e);
    }
}



async function update(req, res, next) {
    try {
        let body = {
            ...req.body
        }
        const updateCategory = await Category.findByIdAndUpdate(req.params.id, {
            ...body
        }, { new: true })
        res.status(httpStatus.OK).send(new APIResponse(updateCategory, Utils.messages.SUCCESS_UPDATE));

    } catch (e) {
        next(e);
    }
}

async function remove(req, res, next) {
    try {
        const deletericipe = await Category.deleteOne({ _id: req.params.id }, { new: false })
        res.status(httpStatus.OK).send(new APIResponse(deletericipe, Utils.messages.SUCCESS_DELETE));

    } catch (e) {
        next(e);
    }
}

module.exports = {
    create,
    update,
    remove,
    getAllCategory,
    getByID
};
