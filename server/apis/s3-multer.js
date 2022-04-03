const multer = require("multer");
const multerS3 = require("multer-s3");
var AWS = require("aws-sdk");

const { s3Config } = require("./../helpers/config");

AWS.config.update({
  accessKeyId: s3Config.clientId,
  secretAccessKey: s3Config.clientSecret,
  region: s3Config.region,
});

const s3 = new AWS.S3();

const mediaUploadS3 = multer({
  storage: multerS3({
    s3: s3,
    bucket: s3Config.bucket,
    acl: "public-read",
    contentType: multerS3.AUTO_CONTENT_TYPE,
    metadata: function (req, file, cb) {
      cb(null, { fieldName: file.fieldname });
    },
    key: function (req, file, cb) {
      cb(
        null,
        Date.now().toString() +
          "." +
          file.mimetype.split("/")[file.mimetype.split("/").length - 1]
      );
    },
  }),
});

module.exports = {
  mediaUploadS3,
};
