const Admin = require("./admin.model");
const Exam = require("../user/exam.model");
const APIResponse = require("../../helpers/APIResponse");
// const APIError = require("../../helpers/APIError");
const Utils = require("../../helpers/util");
const httpStatus = require("http-status");
const request = require("request");
const fs = require("fs");
const JWTHelper = require("../../helpers/jwt.helper");
const sendMail = require("../../helpers/sendMail");
// const { celebrate, Joi: BaseJoi } = require("celebrate");
// const Joi = require('joi');

async function create(req, res) {
  try {
    req.body.password = Utils.encrypt(req.body.password);
    let email = req.body.email;
    let result = await Admin.findEmail(email);
    if (result) {
      return res
        .status(httpStatus.BAD_REQUEST)
        .json(new APIResponse([], `Email Already Exists`, httpStatus.OK));
    } else {
      let model = new Admin(req.body);
      let response = await model.save();
      const token = JWTHelper.getJWTToken({
        _id: response._id,
        email: response.email,
        isActive: response.isActive,
        role: "Cook",
      });
      response = {
        ...JSON.parse(JSON.stringify(response)),
        token: token,
      };
      delete response.password;
      return res
        .status(httpStatus.OK)
        .json(
          new APIResponse(
            response,
            `User Registered successfully`,
            httpStatus.OK
          )
        );
    }
  } catch (error) {
    return res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json(
        new APIResponse(
          {},
          "Error in Registration",
          httpStatus.INTERNAL_SERVER_ERROR,
          error
        )
      );
  }
}

async function login(req, res) {
  let body = req.body;
  console.log("8d0ccc9b8efcf2", Utils.decrypt("8d0ccc9b8efcf2"));

  try {
    let response = await Admin.login(body.email, body.password);
    console.log("res", response);

    if (response) {
      response = await Admin.findByIdAndUpdate(response._id, {
        new: true,
      });
      const token = JWTHelper.getJWTToken({
        _id: response._id,
        email: response.email,
        isActive: response.isActive,
        role: response.role,
      });
      response = {
        ...JSON.parse(JSON.stringify(response)),
        token: token,
      };
      delete response.password;

      return res
        .status(httpStatus.OK)
        .json(new APIResponse(response, "Login successfully", httpStatus.OK));
    }
    return res
      .status(httpStatus.UNAUTHORIZED)
      .json(
        new APIResponse({}, "Authentication error", httpStatus.UNAUTHORIZED)
      );
  } catch (error) {
    return res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json(
        new APIResponse(
          {},
          "Error authenticating user",
          httpStatus.INTERNAL_SERVER_ERROR,
          error
        )
      );
  }
}

async function ChangePassword(req, res, next) {
  try {
    const user = await Admin.findOne({
      email: req.body.email,
    });
    if (user) {
      const oldPassword = Utils.decrypt(user.password);
      if (oldPassword === req.body.oldPassword) {
        let newPassword = Utils.encrypt(req.body.newPassword);
        user.password = newPassword;
        //   user.userName = req.body.userName ? req.body.userName : user.userName;
        const token = JWTHelper.getJWTToken({
          _id: user._id,
          email: user.email,
          isActive: user.isActive,
          role: user.role,
        });
        user.token = token;
        const user1 = await Admin.save();
        return res
          .status(httpStatus.OK)
          .send(new APIResponse(user1, Utils.messages.SUCCESS_RESETPASS));
      } else {
        return res
          .status(httpStatus.BAD_REQUEST)
          .send(
            new APIResponse(
              null,
              Utils.messages.NOT_MATCH_OLDPASSWORD,
              httpStatus.BAD_REQUEST
            )
          );
      }
    } else {
      return res
        .status(httpStatus.BAD_REQUEST)
        .send(
          new APIResponse(
            null,
            Utils.messages.USER_EMAIL_NOT_EXISTS,
            httpStatus.BAD_REQUEST
          )
        );
    }
  } catch (e) {
    next(e);
  }
}

async function update(req, res, next) {
  try {
    let body = {
      ...req.body,
    };
    if (req.file) {
      console.log("req.filereq.file", req.file);
      body = {
        ...body,
        profile: req.file.location,
      };
    }
    const updateuser = await Admin.findByIdAndUpdate(
      req.params.id,
      {
        ...body,
      },
      { new: true }
    );
    res
      .status(httpStatus.OK)
      .send(new APIResponse(updateuser, Utils.messages.SUCCESS_UPDATE));
  } catch (e) {
    next(e);
  }
}

async function forgatePassword(req, res, next) {
  try {
    const user = await Admin.findOne({
      email: req.body.email,
    });
    if (user) {
      let Password = Utils.generateUUID();
      const mailData = {
        PASSWORD: Password,
      };
      sendMail(
        req.body.email.trim(),
        "Reset password",
        "user/admin-sendpassword.html",
        mailData
      );
      user.password = Utils.encrypt(Password);
      await user.save();
      return res
        .status(httpStatus.OK)
        .json(
          new APIResponse(
            {},
            "Your Password Sucessfully Send Your Mail ",
            httpStatus.OK
          )
        );
    } else {
      return res
        .status(httpStatus.BAD_REQUEST)
        .send(
          new APIResponse(null, "User Not Exists ", httpStatus.BAD_REQUEST)
        );
    }
  } catch (e) {
    next(e);
  }
}

async function userExams(req, res, next) {
  const userData = await Exam.find();
  const responseObj = {
    userData,
    userInfo: req.user
  }
  return res
    .status(httpStatus.OK)
    .json(new APIResponse(responseObj, `Users get successfully`, httpStatus.OK));
}

async function getUserExam(req, res, next) {
  const userData = await Exam.findOne({ _id: req.params.id });
  const responseObj = {
    userData,
    userInfo: req.user
  }
  return res
    .status(httpStatus.OK)
    .json(new APIResponse(responseObj, `Users get successfully`, httpStatus.OK));
}

module.exports = {
  create,
  login,
  update,
  ChangePassword,
  forgatePassword,
  userExams,
  getUserExam
};
