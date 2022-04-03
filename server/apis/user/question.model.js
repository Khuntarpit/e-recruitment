const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
  question: {
    type: String,
  },
  choice1: {
      type: String
  },
  choice2: {
      type: String
  },
  choice3: {
      type: String
  },
  choice4: {
      type: String
  },
  answer: {
    type: String,
  },
});

module.exports = mongoose.model('question', questionSchema);
