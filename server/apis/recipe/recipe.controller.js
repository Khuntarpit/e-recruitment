const recipe = require('./recipe.model');
const APIResponse = require("../../helpers/APIResponse");
const Utils = require("../../helpers/util");
const httpStatus = require("http-status");


async function getAllRecipeByCook(req, res, next) {
    try {
        let { _id } = req.user;
        const recipeData = await recipe.find({ userId: _id, isActive: true }).sort({ createdAt: -1 });
        res.status(httpStatus.OK).send(new APIResponse(recipeData, Utils.messages.SUCCESS_MSG));
    } catch (e) {
        next(e);
    }
}
async function getRecipeByLimit(req, res, next) {
    try {
        const recipeData = await recipe.find({ isActive: true }).sort({ createdAt: -1 }).limit(6);
        res.status(httpStatus.OK).send(new APIResponse(recipeData, Utils.messages.SUCCESS_MSG));
    } catch (e) {
        next(e);
    }
}

async function getAll(req, res, next) {
    try {
        const recipeData = await recipe.find({ isActive: true }).sort({ createdAt: -1 });
        res.status(httpStatus.OK).send(new APIResponse(recipeData, Utils.messages.SUCCESS_MSG));
    } catch (e) {
        next(e);
    }
}

async function getByID(req, res, next) {
    try {
        const recipeData = await recipe.findById({ _id: req.body.id });
        console.log("recipedata", recipeData);
        res.status(httpStatus.OK).send(new APIResponse(recipeData, Utils.messages.SUCCESS_MSG));
    } catch (e) {
        next(e);
    }
}

async function create(req, res, next) {
    let { _id } = req.user;

    let body = {
        userId: _id,
        title: req.body.title,
        description: req.body.description,
        price: req.body.price,
        serveSize: req.body.serveSize,
        categoryId: req.body.categoryId,
        isActive: true
    }
    let image = [];
    if (req.files) {
        console.log(req.files);
        req.files.map((e) => image.push({ type: e.contentType, url: e.location }));
        body = {
            ...body,
            image: image
        }
    }
    const todo = new recipe({
        ...body
    });
    try {
        const savedrecipe = await todo.save();
        res
            .status(httpStatus.OK)
            .send(new APIResponse(savedrecipe, Utils.messages.SUCCESS_FFFINSERT));
    } catch (e) {
        next(e);
    }
}

async function update(req, res, next) {
    try {
        let body = {
            ...req.body
        }
        let image = [];
        if (req.body.oldImage) {
            console.log("req.body.oldImage", JSON.parse(req.body.oldImage));
            let img = JSON.parse(req.body.oldImage);
            image = image.concat(img);
            delete req.body.oldImage;
        }
        if (req.files) {
            req.files.map((e) => image.push({ type: e.contentType, url: e.location }));
            body = {
                ...body,
                image: image
            }
        }
        console.log("bodybody", body);
        const updaterecipe = await recipe.findByIdAndUpdate(req.params.id, {
            ...body
        }, { new: true })
        res.status(httpStatus.OK).send(new APIResponse(updaterecipe, Utils.messages.SUCCESS_UPDATE));

    } catch (e) {
        next(e);
    }
}

async function remove(req, res, next) {
    try {
        const deletericipe = await recipe.findByIdAndDelete(req.params.id)
        res.status(httpStatus.OK).send(new APIResponse(deletericipe, Utils.messages.SUCCESS_DELETE));

    } catch (e) {
        next(e);
    }
}

async function getRecipeByCategory(req, res, next) {
    try {
        let body = req.body
        if (body.categoryId) {
            let recipes = await recipe.find({ categoryId: body.categoryId, isActive: true }).sort({ createdAt: -1 })
                .populate("categoryId")

            res
                .status(httpStatus.OK)
                .send(new APIResponse(recipes, Utils.messages.SUCCESS_MSG));
        } else {
            let recipes = await recipe.find({ isActive: true }).sort({ createdAt: -1 })
                .populate("categoryId");

            res
                .status(httpStatus.OK)
                .send(new APIResponse(recipes, Utils.messages.SUCCESS_MSG));
        }
    } catch (e) {
        res
            .status(httpStatus.CREATED)
            .send(new APIResponse(Utils.messages.FILTER_MESSAGE, httpStatus.CREATED));
    }
}

async function getRecipeByGlobalFilter(req, res, next) {
    try {
        let body = req.body
        if (body.title) {
            let recipes = await recipe.find({ title: { $regex: body.title, $options: "i" }, isActive: true }).sort({ createdAt: -1 })
                .populate("categoryId")

            res
                .status(httpStatus.OK)
                .send(new APIResponse(recipes, Utils.messages.SUCCESS_MSG));
        } else {
            let recipes = await recipe.find({ isActive: true }).sort({ createdAt: -1 })
                .populate("categoryId");

            res
                .status(httpStatus.OK)
                .send(new APIResponse(recipes, Utils.messages.SUCCESS_MSG));
        }
    } catch (e) {
        res
            .status(httpStatus.CREATED)
            .send(new APIResponse(Utils.messages.FILTER_MESSAGE, httpStatus.CREATED));
    }
}

module.exports = {
    create,
    update,
    remove,
    getAllRecipeByCook,
    getAll,
    getByID,
    getRecipeByLimit,
    getRecipeByCategory,
    getRecipeByGlobalFilter
};
