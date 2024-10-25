import sequelize from "../../config/dbConfig.js";
import { DataTypes } from "sequelize";


const Cropvariety = sequelize.define(
    "crop_variety",
    {
        variety_eng: {
            type: DataTypes.STRING,
            allowNull: false,
            primaryKey: true,
            unique: {
                msg: 'Variety with the following name is already exist.'
            },
        },
        variety_urdu: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        company: {
            type: DataTypes.STRING,
            allowNull: true,
        },

        variety_type: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        crop_fk: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        season: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        crop_season: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        seed_weight_mg: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                isInt: {
                    msg: "Accepts only integer value.",
                },
            }
        },
        germination_percentage: {
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
                    args: [100],
                    msg: "Accept positive integer value less than equal to 100.",
                }
            }
        },
        maturity_percentage: {
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
                    args: [100],
                    msg: "Accept positive integer value less than equal to 100.",
                }
            }
        },
        irrigation_source: {
            type: DataTypes.ENUM("irrigated", "rainfed", "drought"),
            allowNull: false,
            defaultValue: "rainfed",
            validate: {
                isIn: {
                    args: [["irrigated", "rainfed", "drought"]],
                    msg: "Irrigation source must be either 'irrigated', 'rainfed', or 'drought'.",
                }
            }
        },
        crop_min_days: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                isInt: {
                    msg: "Accepts only integer value.",
                }
            }
        },
        crop_max_days: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                isInt: {
                    msg: "Accepts only integer value.",
                }
            }
        },
        cwr_min_mm: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                isInt: {
                    msg: "Accepts only integer value.",
                }
            }
        },
        cwr_max_mm: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                isInt: {
                    msg: "Accepts only integer value.",
                }
            }
        },
        mad_percentage: {
            type: DataTypes.FLOAT,
            validate: {
                isInt: {
                    msg: "Accepts only integer value.",
                },
                min: {
                    args: [0],
                    msg: "Accept positive integer value greater than equal to 0.",
                },
                max: {
                    args: [100],
                    msg: "Accept positive integer value less than equal to 100.",
                }
            }
        },
        height_class: {
            type: DataTypes.STRING,
            allowNull: true
        },

        nutrient_content: {
            type: DataTypes.STRING,
            allowNull: true
        },
        common_disease_tolerance: {
            type: DataTypes.STRING,
            allowNull: true
        },

        env_resilience_fators: {
            type: DataTypes.STRING,
            allowNull: true
        },
        unique_features: {
            type: DataTypes.STRING,
            allowNull: true
        },

        sand: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            // defaultValue: false,
        },
        loamy_sand: {
            type: DataTypes.BOOLEAN,
            allowNull: false,

            // defaultValue: false,
        },
        sandy_loam: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            // defaultValue: false,
        },
        loam: {
            type: DataTypes.BOOLEAN,
            // defaultValue: false,
            allowNull: false,
        },
        silt_loam: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            // defaultValue: false,
        },
        silt: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            // defaultValue: false,
        },
        silty_clay_loam: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            // defaultValue: false,
        },
        silty_clay: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            // defaultValue: false,
        },
        clay: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            // defaultValue: false,
        },
        sandy_clay: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            // defaultValue: false,
        },
        sandy_clay_loam: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            // defaultValue: false,
        },
        clay_loam: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            // defaultValue: false,
        },
        in_farmacie: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        }
    },
    {
        schema: "public",      // Change this to "crop" later --- when deploy
        timestamps: false,
        indexes: [
            {
                unique: true,
                fields: ['crop_fk', 'variety_eng']
            }
        ]
    }
);

export default Cropvariety;

// ===================================================================
//                               Relations
// ===================================================================
import Crop from "./crop.model.js";

Cropvariety.belongsTo(Crop, { foreignKey: "crop_fk", targetKey: "crop_name", onDelete: "CASCADE" });
Crop.hasMany(Cropvariety, { foreignKey: "crop_fk", sourceKey: 'crop_name', onDelete: "CASCADE" });

