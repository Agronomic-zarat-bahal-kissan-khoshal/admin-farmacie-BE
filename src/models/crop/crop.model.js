import sequelize from "../../config/dbConfig.js";
import { DataTypes } from "sequelize";


const Crop = sequelize.define(
    "crop",
    {
        crop_name: {
            type: DataTypes.STRING,
            allowNull: false,
            primaryKey: true,
        },
        crop_category: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        source: {
            type: DataTypes.STRING,
        },
        root_depth_max_m: {
            type: DataTypes.FLOAT,
        },
        seed_sowing_depth_m: {
            type: DataTypes.FLOAT,
        },
    },
    {
        schema: "public",       // Change this to "crop" later --- when deploy
        timestamps: false,
    }
);

export default Crop;