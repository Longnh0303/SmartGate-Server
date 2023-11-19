const mongoose = require("mongoose");
const { toJSON } = require("./plugins");

const deviceSchema = mongoose.Schema(
  {
    mac: {
      type: String,
      unique: true,
      required: true,
    },
    describe: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
);

deviceSchema.statics.isDeviceExisted = async function (mac, excludeMac) {
  const device = await this.findOne({ mac, _id: { $ne: excludeMac } });
  return !!device;
};

deviceSchema.plugin(toJSON);

const Device = mongoose.model("Device", deviceSchema);
module.exports = Device;
