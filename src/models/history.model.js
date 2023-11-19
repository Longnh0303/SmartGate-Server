const mongoose = require("mongoose");
const { toJSON } = require("./plugins");

const HistorySchema = mongoose.Schema({
  cardId: {
    type: String,
    required: true,
  },
  gateIn: {
    type: String,
  },
  gateOut: {
    type: String,
  },
  name: {
    type: String,
  },
  role: {
    type: String,
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
  fee: {
    type: Number,
    default: 0,
  },
  done: {
    type: Boolean,
    default: false,
  },
});

HistorySchema.plugin(toJSON);

const History = mongoose.model("History", HistorySchema);
module.exports = History;
