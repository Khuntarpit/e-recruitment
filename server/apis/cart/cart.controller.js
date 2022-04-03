const Cart = require('./cart.model');
const APIResponse = require("../../helpers/APIResponse");
const Utils = require("../../helpers/util");
const httpStatus = require("http-status");


async function getAllCartByUser(req, res, next) {
    try {
        let { _id } = req.user;
        const cartData = await Cart.find({ userId: _id, isActive: true }).sort({ createdAt: -1 }).populate('userId').populate('recipeId');
        let subTotal = 0;
        for (let i in cartData) {
            let price = cartData[i].recipeId.price ? cartData[i].recipeId.price : 0
            subTotal = subTotal + (cartData[i].quantity * price);
        }
        let response = {
            cartData: cartData,
            subTotal: subTotal
        }
        console.log("recipeid", response);

        res.status(httpStatus.OK).send(new APIResponse(response, Utils.messages.SUCCESS_MSG));
    } catch (e) {
        next(e);
    }
}


async function getByID(req, res, next) {
    try {
        const cartData = await Cart.findById({ _id: req.params.id }).populate('userId').populate('recipeId');
        res.status(httpStatus.OK).send(new APIResponse(cartData, Utils.messages.SUCCESS_MSG));
    } catch (e) {
        next(e);
    }
}

async function create(req, res, next) {
    try {
        let { _id } = req.user;
        const CartExists = await Cart.find({ $and: [{ userId: req.body.userId }, { recipeId: req.body.recipeId }] });
        if (CartExists.length) {
            res.status(httpStatus.OK).send(new APIResponse(CartExists[CartExists.length - 1], Utils.messages.Cart_PRODUCT_EXISTS));
        } else {
            const Carts = new Cart({
                userId: _id,
                recipeId: req.body.recipeId,
                quantity: req.body.quantity,
                isActive: true
            });
            const savedCart = await Carts.save();
            res.status(httpStatus.OK).send(new APIResponse(savedCart, Utils.messages.SUCCESS_INSERT));
        }
    } catch (e) {
        next(e);
    }
}



async function update(req, res, next) {
    try {
        let body = {
            ...req.body
        }
        const updatecart = await Cart.findByIdAndUpdate(req.params.id, {
            ...body
        }, { new: true })
        res.status(httpStatus.OK).send(new APIResponse(updatecart, Utils.messages.SUCCESS_UPDATE));

    } catch (e) {
        next(e);
    }
}

async function remove(req, res, next) {
    try {
        const deletericipe = await Cart.deleteOne({ _id: req.params.id }, { new: false })
        res.status(httpStatus.OK).send(new APIResponse(deletericipe, Utils.messages.SUCCESS_UPDATE));

    } catch (e) {
        next(e);
    }
}

module.exports = {
    create,
    update,
    remove,
    getAllCartByUser,
    getByID
};
