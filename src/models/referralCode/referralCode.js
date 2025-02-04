import sequelize from "../../config/dbConfig.js";
import { DataTypes } from "sequelize";

const ReferralCode = sequelize.define(
  "referral_code",
  {
    phone: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
    },
    referralCode: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    maxDays: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    expiresAt: {
      type: DataTypes.DATE,
    },
    usageCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    maxUsage: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    underscored: true,
  }
);

export default ReferralCode;
