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
            validate: {
                isInt: {
                    msg: "Accepts only integer value.",
                },
                min: {
                    args: [0],
                    msg: "Accept positive integer value greater than equal to 0.",
                },
                max: {
                    args: [20],
                    msg: "Accept positive integer value less than equal to 20.",
                }
            }
        },
        kc: {
            type: DataTypes.FLOAT,
            allowNull: false,
            validate: {
                isFloat: {
                    msg: "Accepts only numbers with or without decimal.",
                },
            },
        },
        start_gdd: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                isInt: {
                    msg: "Accepts only integer value.",
                },
            }
        },
        end_gdd: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                isInt: {
                    msg: "Accepts only integer value.",
                },
            }
        },
        base_temp: {
            type: DataTypes.FLOAT,
            allowNull: false,
            validate: {
                isInt: {
                    msg: "Accepts only numbers with or without decimal.",
                },
            }
        },
        min_temp: {
            type: DataTypes.FLOAT,
            allowNull: false,
            validate: {
                isInt: {
                    msg: "Accepts only numbers with or without decimal.",
                },
            }
        },
        max_temp: {
            type: DataTypes.FLOAT,
            allowNull: false,
            validate: {
                isInt: {
                    msg: "Accepts only numbers with or without decimal.",
                },
            }
        },
    },
    {
        schema: "public",    // Change this to "crop" later --- when deploy
        timestamps: false,
        indexes: [
            {
                unique: true,
                fields: ['crop_variety_fk', 'sub_stage']
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