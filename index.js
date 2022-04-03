require("dotenv").config();
const mongoose = require("mongoose");
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const sgMail = require("@sendgrid/mail");

const app = express();

//CORS Middleware
app.use(cors());

app.use(bodyParser.json());
app.use(express.json());

// const API_KEY ='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'

sgMail.setApiKey(process.env.API_KEY);

const msg = {
  from: "dev020.rejoice@gmail.com",
  to: ["dev020.rejoice@gmail.com", "dev011.rejoice@gmail.com"],
  subject: "Hello from send grid",
  text: "this is the first test mail from sendgrid",
  html: "<h1>Hello all people from send grid.</h1>",
};

// sgMail
//    .send(msg)
//    .then((res) => {console.log("email sent...")})
//    .catch((err)=>{console.log("send grid error",err.message)});

// make bluebird default Promise
Promise = require("bluebird"); // eslint-disable-line no-global-assign

// plugin bluebird promise in mongoose
mongoose.Promise = Promise;

// connect to mongo db
const mongoUri = process.env.MONGO_HOST;
const mongoConfig = {
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true,
  poolSize: 2,
  promiseLibrary: global.Promise,
};
mongoose.connect(mongoUri, mongoConfig);

mongoose.connection.on("error", () => {
  throw new Error(`unable to connect to database: ${mongoUri}`);
});

function setupRoutes() {
  const routes = require("./index.route");
  routes.setup(app);
}

setupRoutes();

// when a random route is inputed
app.get("*", (req, res) =>
  res.status(200).send({
    message: "Welcome to this API.",
  })
);
const port = process.env.PORT || 8080;

app.listen(port, () => {
  console.log(`Server is running on PORT ${port}`);
});

module.exports = app;
