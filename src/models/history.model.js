const mongoose = require("mongoose");
const { toJSON } = require("./plugins");

const HistorySchema = mongoose.Schema({
  cardId: {
    type: String,
    required: true,
  },
  old_balance: {
    type: Number,
  },
  new_balance: {
    type: Number,
  },
  time_check_in: {
    type: Date,
  },
  time_check_out: {
    type: Date,
  },
  done: {
    type: Boolean,
    default: false,
  },
});

HistorySchema.plugin(toJSON);

const History = mongoose.model("History", HistorySchema);
module.exports = History;
