import { Op } from "sequelize";
import ReferralCode from "../../models/referralCode/referralCode.js";
import { bodyReqFields, queryReqFields } from "../../utils/requiredFields.js";
import {
  created,
  frontError,
  catchError,
  successOk,
  successOkWithData,
  notFound,
  conflictError,
} from "../../utils/responses.js";
import crypto from "crypto";

// ###################################################
//                 Helping Functions
// ###################################################

const generateReferralCode = () => {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let referralCode = "";
  for (let i = 0; i < 10; i++) {
    const randomIndex = crypto.randomInt(0, characters.length);
    referralCode += characters[randomIndex];
  }
  return referralCode;
};

// ###################################################
//                 getAllReferralCodes
// ###################################################

export async function getAllReferralCodes(req, res) {
  try {
    const referralCodes = await ReferralCode.findAll();

    if (referralCodes.length === 0) {
      return notFound(res, "No referral codes found.");
    }

    return successOkWithData(
      res,
      "Referral codes fetched successfully.",
      referralCodes
    );
  } catch (err) {
    console.error("Error fetching referral codes:", err);
    return catchError(res, err);
  }
}

// ###################################################
//                generateReferralCodes
// ###################################################

export async function generateReferralCodes(req, res) {
  try {
    const requiredFields = ["phone", "maxDays", "maxUsage"];
    const bodyValidation = bodyReqFields(req, res, requiredFields);
    if (bodyValidation.error) return bodyValidation.response;

    let { phone, maxDays, maxUsage } = req.body;
    phone = phone.trim();

    const existingCode = await ReferralCode.findOne({ where: { phone } });
    if (existingCode) {
      return conflictError(
        res,
        "Referral code already exists for this phone number."
      );
    }

    const code = generateReferralCode();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + maxDays);

    await ReferralCode.create({
      phone,
      referralCode: code,
      maxDays,
      expiresAt,
      maxUsage,
    });

    return created(res, "Referral code generated successfully.");
  } catch (err) {
    console.error("Error generating referral code:", err);
    return catchError(res, err);
  }
}

// ###################################################
//                updateReferralCode
// ###################################################

export async function updateReferralCode(req, res) {
  try {
    const queryValidation = queryReqFields(req, res, ["referredBy"]);
    if (queryValidation.error) return queryValidation.response;

    const bodyValidation = bodyReqFields(req, res, [
      "daysToAdd",
      "increaseUsage",
    ]);
    if (bodyValidation.error) return bodyValidation.response;

    const { referredBy } = req.query;
    const { daysToAdd, increaseUsage } = req.body;

    const referralCodeData = await ReferralCode.findOne({
      where: { phone: referredBy },
    });
    if (!referralCodeData) {
      return notFound(res, "Referral code not found for this phone number.");
    }

    if (daysToAdd) {
      const expiresAt = referralCodeData.expiresAt
        ? new Date(referralCodeData.expiresAt)
        : new Date();
      expiresAt.setDate(expiresAt.getDate() + daysToAdd);
      referralCodeData.expiresAt = expiresAt;
    }

    if (increaseUsage) {
      const newMaxUsage = referralCodeData.maxUsage + increaseUsage;
      if (newMaxUsage < referralCodeData.usageCount) {
        return frontError(
          res,
          "Total attempts left cannot be less than the current used count.",
          "maxUsage"
        );
      }
      referralCodeData.maxUsage = newMaxUsage;
    }

    if (daysToAdd) referralCodeData.maxDays += daysToAdd;

    await referralCodeData.save();
    return successOk(res, "Referral code updated successfully.");
  } catch (error) {
    console.error("Error updating referral code:", error);
    return catchError(res, error);
  }
}

// ###################################################
//                  deleteReferralCode
// ###################################################

export async function deleteReferralCode(req, res) {
  try {
    const queryValidation = queryReqFields(req, res, ["referredBy"]);
    if (queryValidation.error) return queryValidation.response;

    const { referredBy } = req.query;
    const referralCodeData = await ReferralCode.findOne({
      where: { phone: referredBy },
    });
    if (!referralCodeData) {
      return notFound(res, "No referral code found for this phone number.");
    }

    await referralCodeData.destroy();
    return successOk(res, "Referral code deleted successfully.");
  } catch (error) {
    console.error("Error deleting referral code:", error);
    return catchError(res, error);
  }
}
