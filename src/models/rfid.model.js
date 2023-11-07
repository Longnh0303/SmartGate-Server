const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const RfidSchema = new Schema(
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
    status: {
        type: String,
        enum: ["checkedIn", "checkedOut"],
        default: "checkedOut",
      },
        name: {
          type: String,
        },
        usercode: {
            type: String,
            required: true
          },
        role: {
            type: String,
            enum: ["student", "teacher", "employee"],
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
  }
);

const Rfid = mongoose.model("Rfid", RfidSchema);
module.exports = Rfid;
