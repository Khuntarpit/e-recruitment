const cv = require('./cv.model');
const APIResponse = require("../../helpers/APIResponse");
const Utils = require("../../helpers/util");
const httpStatus = require("http-status");
const userModel = require('../user/user.model');
const mongoose = require('mongoose');


// async function getAllRecipeByCook(req, res, next) {
//     try {
//         let { _id } = req.user;
//         const recipeData = await recipe.find({ userId: _id, isActive: true }).sort({ createdAt: -1 });
//         res.status(httpStatus.OK).send(new APIResponse(recipeData, Utils.messages.SUCCESS_MSG));
//     } catch (e) {
//         next(e);
//     }
// }
// async function getRecipeByLimit(req, res, next) {
//     try {
//         const recipeData = await recipe.find({ isActive: true }).sort({ createdAt: -1 }).limit(6);
//         res.status(httpStatus.OK).send(new APIResponse(recipeData, Utils.messages.SUCCESS_MSG));
//     } catch (e) {
//         next(e);
//     }
// }

async function getAll(req, res, next) {
    try {
        const cvData = await cv.find({ isActive: true }).sort({ createdAt: -1 });
        res.status(httpStatus.OK).send(new APIResponse(cvData, Utils.messages.SUCCESS_MSG));
    } catch (e) {
        next(e);
    }
}

async function getByID(req, res, next) {
    try {
        const cvData = await cv.findOne({ userId: req.params.id });
        console.log("cvData", cvData);
        res.status(httpStatus.OK).send(new APIResponse(cvData, Utils.messages.SUCCESS_MSG));
    } catch (e) {
        next(e);
    }
}

async function getByCompanyID(req, res, next) {
    try {
         const companyData = await cv.findById({ _id: req.params.companyId});
        console.log("companyData", companyData);
        res.status(httpStatus.OK).send(new APIResponse(companyData, Utils.messages.SUCCESS_MSG));
    } catch (e) {
        next(e);
    }
}


async function create(req, res, next) {
    let { _id } = req.user;

    let body = {
        userId: _id,
        name:req.body.name,
        profile_address: req.body.profile_address,
        email: req.body.email,
        phone: req.body.phone,
        degree: req.body.degree,
        university: req.body.university,
        grade: req.body.grade,
        year: req.body.year,
        company_name: req.body.company_name,
        job_title:req.body.job_title,
        start_date: req.body.start_date,
        end_date: req.body.end_date,
        details: req.body.details,
        skill: req.body.skill,
        objective: req.body.objective,
        ref_name: req.body.ref_name,
        ref_job_title: req.body.ref_job_title,
        ref_company_name: req.body.ref_company_name,
        ref_email: req.body.ref_email,
        ref_phone: req.body.ref_phone,
        project_title: req.body.project_title,
        project_desription: req.body.project_desription,
        help_tips: req.body.help_tips ,
        experience: req.body.experience,
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
    const todo = new cv({
        ...body
    });
    try {
        const savedrecipe = await todo.save();
        let userData = await userModel.findById({ _id: _id });
        userData.CVIds = userData.CVIds ? userData.CVIds : [];
        userData.CVIds.push(savedrecipe._id);
        console.log("=============>",userData.CVIds,savedrecipe)
        userData = await userModel.findByIdAndUpdate(_id, {
            CVIds:userData.CVIds
        }, { new: true });
        res
            .status(httpStatus.OK)
            .send(new APIResponse(savedrecipe, Utils.messages.SUCCESS_INSERT));
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
        console.log()
        const updatcv = await cv.findOneAndUpdate({ userId: req.params.id}, {
            ...body
        }, { new: true })
        res.status(httpStatus.OK).send(new APIResponse(updatcv, Utils.messages.SUCCESS_UPDATE));

    } catch (e) {
        next(e);
    }
}

async function remove(req, res, next) {
    try {
         await cv.findByIdAndDelete(req.params.id)
        res.status(httpStatus.OK).send(new APIResponse( Utils.messages.SUCCESS_DELETE));

    } catch (e) {
        next(e);
    }
}

// async function getRecipeByCategory(req, res, next) {
//     try {
//         let body = req.body
//         if (body.categoryId) {
//             let recipes = await recipe.find({ categoryId: body.categoryId, isActive: true }).sort({ createdAt: -1 })
//                 .populate("categoryId")

//             res
//                 .status(httpStatus.OK)
//                 .send(new APIResponse(recipes, Utils.messages.SUCCESS_MSG));
//         } else {
//             let recipes = await recipe.find({ isActive: true }).sort({ createdAt: -1 })
//                 .populate("categoryId");

//             res
//                 .status(httpStatus.OK)
//                 .send(new APIResponse(recipes, Utils.messages.SUCCESS_MSG));
//         }
//     } catch (e) {
//         res
//             .status(httpStatus.CREATED)
//             .send(new APIResponse(Utils.messages.FILTER_MESSAGE, httpStatus.CREATED));
//     }
// }

// async function getRecipeByGlobalFilter(req, res, next) {
//     try {
//         let body = req.body
//         if (body.title) {
//             let recipes = await recipe.find({ title: { $regex: body.title, $options: "i" }, isActive: true }).sort({ createdAt: -1 })
//                 .populate("categoryId")

//             res
//                 .status(httpStatus.OK)
//                 .send(new APIResponse(recipes, Utils.messages.SUCCESS_MSG));
//         } else {
//             let recipes = await recipe.find({ isActive: true }).sort({ createdAt: -1 })
//                 .populate("categoryId");

//             res
//                 .status(httpStatus.OK)
//                 .send(new APIResponse(recipes, Utils.messages.SUCCESS_MSG));
//         }
//     } catch (e) {
//         res
//             .status(httpStatus.CREATED)
//             .send(new APIResponse(Utils.messages.FILTER_MESSAGE, httpStatus.CREATED));
//     }
// }

module.exports = {
    create,
    update,
    remove,
    // getAllRecipeByCook,
    getAll,
    getByID,
    getByCompanyID,
    // getRecipeByLimit,
    // getRecipeByCategory,
    // getRecipeByGlobalFilter
};
