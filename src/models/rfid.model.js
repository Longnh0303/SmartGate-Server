const mongoose = require("mongoose");
const { toJSON } = require("./plugins");

const RfidSchema = mongoose.Schema(
  {
    cardId: {
      type: String,
      unique: true,
      required: true,
    },
    balance: {
      type: Number,
      default: 0,
    },
    name: {
      type: String,
      default: "",
    },
    usercode: {
      type: String,
    },
    role: {
      type: String,
      enum: ["student", "teacher", "employee", "guest"],
      default: "student",
    },
    department: {
      type: String,
    },
    carInfo: {
      type: String,
    },
    carColor: {
      type: String,
    },
    licensePlates: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
);

RfidSchema.statics.isCardIdExisted = async function (cardId, excludeCardId) {
  const rfid = await this.findOne({ cardId, _id: { $ne: excludeCardId } });
  return !!rfid;
};

RfidSchema.plugin(toJSON);

const Rfid = mongoose.model("Rfid", RfidSchema);
module.exports = Rfid;
