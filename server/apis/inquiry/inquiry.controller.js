const inquiryModel = require("./inquiry.model");
const APIResponse = require("../../helpers/APIResponse");
const Utils = require("../../helpers/util");
const httpStatus = require("http-status");

async function createInquiry(req, res, next) {
  try {
    const inquiryInfo = await inquiryModel.create(req.body);
    res
      .status(httpStatus.OK)
      .send(new APIResponse(inquiryInfo, Utils.messages.SUCCESS_INSERT));
  } catch (err) {
    next(err);
  }
}

async function getInquiry(req, res, next) {
  try {
    const inquiryInfo = await inquiryModel.find();
    res
      .status(httpStatus.OK)
      .send(new APIResponse(inquiryInfo, Utils.messages.SUCCESS_MSG));
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createInquiry,
  getInquiry
}