import Crop from "../../models/crop/crop.model.js";
import CropStage from "../../models/crop/cropStage.model.js";
import { catchError, catchWithSequelizeValidationError, conflictError, created, frontError, notFound, sequelizeValidationError, successOk, successOkWithData, validationError } from "../../utils/responses.js";
import { bodyReqFields, queryReqFields } from "../../utils/requiredFields.js";
import Cropvariety from "../../models/crop/cropVariety.model.js";
import { convertToLowercase } from "../../utils/utils.js";
import Sequelize from "sequelize";
import sequelize from "../../config/dbConfig.js";



// ============================================
//             CONTOLLERS
// ============================================

export async function addCropStage(req, res) {
    try {
        const reqFields = ["stage", "sub_stage", "bbch_scale", "crop_fk"];
        const bodyFieldsReq = bodyReqFields(req, res, reqFields)
        if (bodyFieldsReq.error) return bodyFieldsReq.response
        const requiredData = convertToLowercase(req.body);

        const transaction = await sequelize.transaction();
        try {
            await CropStage.create(requiredData, { transaction });
            // INCREMENT THE STAGE COUNT IN CROP TABLE
            await Crop.increment('stage_count', {
                by: 1,
                where: { crop_name: requiredData.crop_fk },
                transaction
            });
            await transaction.commit();
        } catch (error) {
            await transaction.rollback();
            throw error;
        }

        return created(res, "Crop stage added successfully")
    } catch (error) {

        if (error instanceof Sequelize.UniqueConstraintError) return validationError(res, "A crop can not have two same principle stages.");
        return catchWithSequelizeValidationError(res, error)
    }
}

// ================= getCropStages =======================

export async function getCropStages(req, res) {
    try {

        const reqField = ["crop_name"];
        const queryField = queryReqFields(req, res, reqField)
        if (queryField.error) return queryField.error;

        const crop_name = req.query.crop_name.toLowerCase();
        const cropStages = await CropStage.findAll({
            where: { crop_fk: crop_name },
            attributes: ["uuid", "stage", "sub_stage", "bbch_scale"]
        })
        return successOkWithData(res, cropStages)
    } catch (error) {
        return catchError(res, error)
    }
}

// ================= updateCropStage =======================

export async function updateCropStage(req, res) {
    try {
        const reqField = ["uuid"];
        const queryFieldsReq = queryReqFields(req, res, reqField)
        if (queryFieldsReq.error) return queryFieldsReq.response
        const { uuid } = req.query;
        const cropStage = await CropStage.findByPk(uuid);
        if (!cropStage) return notFound(res, "Crop stage not found.")

        const requiredData = convertToLowercase(req.body);
        const { stage, sub_stage, bbch_scale } = requiredData;
        if (stage) cropStage.stage = stage;
        if (sub_stage) cropStage.sub_stage = sub_stage;
        if (bbch_scale) cropStage.bbch_scale = bbch_scale;
        await cropStage.save();
        return successOk(res, "Crop stage updated successfully")
    } catch (error) {
        return catchWithSequelizeValidationError(res, error)
    }
}

// ================= deleteCropStage =======================

export async function deleteCropStage(req, res) {
    try {
        const reqField = ["uuid"];
        const queryFieldsReq = queryReqFields(req, res, reqField)
        if (queryFieldsReq.error) return queryFieldsReq.response
        const { uuid } = req.query;

        const cropStage = await CropStage.findByPk(uuid);
        if (!cropStage) return successOk(res, "Crop stage already deleted.")


        const transaction = await sequelize.transaction();
        try {
            await CropStage.destroy({ where: { uuid }, transaction });
            // DECREMENT THE STAGE COUNT IN CROP TABLE
            await Crop.decrement('stage_count', {
                by: 1,
                where: { crop_name: cropStage.crop_fk },
                transaction
            });

            await transaction.commit();
        } catch (error) {
            await transaction.rollback();
            throw error;
        }

        return successOk(res, "Crop stage deleted successfully")
    } catch (error) {
        return catchError(res, error)
    }
}