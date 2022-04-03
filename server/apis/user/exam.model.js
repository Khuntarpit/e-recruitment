const mongoose = require("mongoose");

const examSchema = new mongoose.Schema({
  userInfo: {
    type: Object,
  },
  exam: [
    {
      question: {
        type: String
      },
      choice: {
        type: String,
      },
      answer: {
        type: String,
      },
    },
  ],
  totalMark: {
    type: String
  }
});

module.exports = mongoose.model("exam", examSchema);
