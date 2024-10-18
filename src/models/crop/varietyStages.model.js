import sequelize from "../../config/dbConfig.js";
import { DataTypes } from "sequelize";

const VarietyStage = sequelize.define(
    "variety_stage",
    {
        uid: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        crop_variety_fk: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        stage: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        sub_stage: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        bbch_scale: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        kc: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        start_gdd: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        end_gdd: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        base_temp: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        min_temp: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        max_temp: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
    },
    {
        schema: "public",    // Change this to "crop" later --- when deploy
        timestamps: false,
        indexes: [
            {
                unique: true,
                fields: ['crop_variety_fk', 'stage']
            }
        ]
    }
);

export default VarietyStage;

// =============================================================================
//                                   Relations
// =============================================================================
import CropVariety from "./cropVariety.model.js";

VarietyStage.belongsTo(CropVariety, { foreignKey: "crop_variety_fk", targetKey: "variety_eng", onDelete: "CASCADE" });
CropVariety.hasMany(VarietyStage, { foreignKey: "crop_variety_fk", sourceKey: 'variety_eng', onDelete: "CASCADE" });