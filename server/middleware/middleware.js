const jwt_decode = require("jwt-decode")
const User = require("../apis/user/user.model");
module.exports = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt_decode(token);
    // if(decoded._id){
    //   const users = await User.findById(decoded._id);
    // }


    const users = await User.findById(decoded._id);


    if (decoded) {
      if (users) {
        if (users.isBloked) {
          return res.status(401).json({
            message: "You are Bloked",
            status: 401
          });
        }
      }
      next();

    }
  }

  catch (error) {
    console.log('error----', error)
    return res.status(401).json({
      message: "Authentication Failed",
      status: 401
    });
  }
};
