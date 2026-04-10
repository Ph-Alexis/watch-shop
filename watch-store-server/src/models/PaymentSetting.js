const mongoose = require("mongoose");

const paymentSettingSchema = new mongoose.Schema(
  {
    bankName: {
      type: String,
      default: "MB BANK",
    },
    accountNumber: {
      type: String,
      default: "123456789",
    },
    accountName: {
      type: String,
      default: "WATCH STORE",
    },
    transferContent: {
      type: String,
      default: "Thanh toan don hang WatchStore",
    },
    isQrEnabled: {
      type: Boolean,
      default: true,
    },
    qrImage: {
      type: String,
      default: "",
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("PaymentSetting", paymentSettingSchema);
