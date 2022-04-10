const User = require("./user.model");
const Question = require("./question.model");
const Exam = require("./exam.model");
const APIResponse = require("../../helpers/APIResponse");
// const APIError = require("../../helpers/APIError");
const Utils = require("../../helpers/util");
const httpStatus = require("http-status");
const request = require("request");
const fs = require("fs");
const JWTHelper = require("../../helpers/jwt.helper");
const sendMail = require("../../helpers/sendMail");
// const emailHelper = require("../../helpers/emails/emails.helper");
// const { celebrate, Joi: BaseJoi } = require("celebrate");
// const Joi = require('joi');

async function create(req, res) {
  try {
    req.body.password = Utils.encrypt(req.body.password);
    let email = req.body.email;
    let result = await User.findEmail(email, req.body.role);
    if (result) {
      return res
        .status(httpStatus.BAD_REQUEST)
        .json(new APIResponse({}, `Email Already Exists`, httpStatus.OK));
    } else {
      let model = new User(req.body);
      let response = await model.save();
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
  // console.log("8d0ccc9b8efcf2", Utils.decrypt('8d0ccc9b8efcf2'))

  try {
    let response = await User.login(
      body.email,
      Utils.encrypt(body.password),
      body.role
    );
    console.log("res", response);

    if (response) {
      response = await User.findByIdAndUpdate(response._id, {
        new: true,
      }).populate("CVIds");
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
    const user = await User.findOne({
      email: req.body.email,
      role: req.body.role,
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
        const user1 = await user.save();
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
      console.log("req.filereq.file", req.file, req.body);
      body = {
        ...body,
        profile: req.file.location,
      };
    }
    const updateuser = await User.findByIdAndUpdate(
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
    const user = await User.findOne({
      email: req.body.email,
      role: req.body.role,
    });
    if (user) {
      let Password = Utils.generateUUID();

      sendMail(req.body.email, "Reset password", Password);
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

async function getUserByRole(req, res, next) {
  try {
    const user = await User.findByRole(req.params.role);
    res
      .status(httpStatus.OK)
      .send(new APIResponse(user, Utils.messages.SUCCESS_MSG));
  } catch (e) {
    next(e);
  }
}

async function getQuestion(req, res, next) {
  console.log(`exam`, req);
  try {
    const question = await Question.find();
    res
      .status(httpStatus.OK)
      .send(new APIResponse(question, Utils.messages.SUCCESS_MSG));
  } catch (e) {
    next(e);
  }
}

async function submitExam(req, res, next) {
  try {
    const examData = req.body;
    const updatedArray = [];
    let totalMark = 0;
    for (let i = 0; i < examData.length; i++) {
      const ele = examData[i];
      const findElement = await Question.findOne({ _id: ele._id });
      if (findElement) {
        updatedArray.push({
          _id: findElement._id,
          question: findElement.question,
          choice: ele.choice,
          answer: findElement.answer,
        });
      }
      if (findElement.answer === ele.choice) {
        totalMark++;
      }
    }

    const findMarks = await Exam.create({
      userInfo: req.user,
      exam: updatedArray,
      totalMark,
      examSubmit: true,
    });
    res
      .status(httpStatus.OK)
      .send(new APIResponse(findMarks, Utils.messages.SUCCESS_MSG));
  } catch (e) {
    next(e);
  }
}

module.exports = {
  create,
  login,
  update,
  ChangePassword,
  forgatePassword,
  getUserByRole,
  getQuestion,
  submitExam,
};
