const PaymentSetting = require("../models/PaymentSetting");

const getPaymentSetting = async (req, res, next) => {
  try {
    let setting = await PaymentSetting.findOne();

    if (!setting) {
      setting = await PaymentSetting.create({});
    }

    return res.json(setting);
  } catch (error) {
    return next(error);
  }
};

const updatePaymentSetting = async (req, res, next) => {
  try {
    const {
      bankName,
      accountNumber,
      accountName,
      transferContent,
      isQrEnabled,
      qrImage,
    } = req.body;

    let setting = await PaymentSetting.findOne();

    if (!setting) {
      setting = await PaymentSetting.create({});
    }

    if (bankName !== undefined) setting.bankName = bankName;
    if (accountNumber !== undefined) setting.accountNumber = accountNumber;
    if (accountName !== undefined) setting.accountName = accountName;
    if (transferContent !== undefined)
      setting.transferContent = transferContent;
    if (isQrEnabled !== undefined) setting.isQrEnabled = isQrEnabled;
    if (qrImage !== undefined) setting.qrImage = qrImage;

    await setting.save();

    return res.json({
      message: "Update payment setting successfully",
      setting,
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  getPaymentSetting,
  updatePaymentSetting,
};
