import Crop from "../../models/crop/crop.model.js";
import Cropvariety from "../../models/crop/cropVariety.model.js";
import VarietyStage from "../../models/crop/varietyStages.model.js";
import { catchError, catchWithSequelizeValidationError, conflictError, created, frontError, notFound, sequelizeValidationError, successOk, successOkWithData, validationError } from "../../utils/responses.js";
import { bodyReqFields, queryReqFields } from "../../utils/requiredFields.js";
import { convertToLowercase } from "../../utils/utils.js";


// ============================================
//             CONTOLLERS
// ============================================

export async function addVarietyStage(req, res) {
    try {
        const reqFields = [
            "crop_variety_fk", "stage", "sub_stage", "bbch_scale", "kc", "start_gdd", "end_gdd", "base_temp", "min_temp", "max_temp"
        ];
        const bodyFieldsReq = bodyReqFields(req, res, reqFields)
        if (bodyFieldsReq.error) return bodyFieldsReq.response
        const requiredData = convertToLowercase(req.body);

        await VarietyStage.create(requiredData);
        return created(res, "Variety Stage added successfully")
    } catch (error) {
        if (error.name === "SequelizeUniqueConstraintError")
            return conflictError(res, "Principle stage already added against this variety.")
        return catchWithSequelizeValidationError(res, error)
    }
};

// ================= getAllVarietyStages =======================

export async function getAllVarietyStages(req, res) {
    try {
        const reqFields = ["variety_eng"];
        const queryFieldsReq = queryReqFields(req, res, reqFields)
        if (queryFieldsReq.error) return queryFieldsReq.response;
        const variety_eng = req.query.variety_eng.toLowerCase();

        const varietyStages = await VarietyStage.findAll({
            attributes: ["uid", "stage", "sub_stage", "bbch_scale", "kc", "start_gdd", "end_gdd",],
            order: [["bbch_scale", "ASC"]],
            where: { crop_variety_fk: variety_eng }
        })
        return successOkWithData(res, varietyStages)
    } catch (error) {
        return catchError(res, error)
    }
}

// ================= getSingleStage =======================

export async function getSingleStage(req, res) {
    try {
        const reqFields = ["uid"];
        const queryFieldsReq = queryReqFields(req, res, reqFields)
        if (queryFieldsReq.error) return queryFieldsReq.response;
        const { uid } = req.query;

        const varietyStage = await VarietyStage.findByPk(uid)
        if (!varietyStage) return notFound(res, "Variety Stage not found.")
        return successOkWithData(res, varietyStage)
    } catch (error) {
        return catchError(res, error)
    }
}

// ================= updateVarietyStage =======================

export async function updateVarietyStage(req, res) {
    try {
        const reqFields = ["uid"];
        const queryFieldsReq = queryReqFields(req, res, reqFields)
        if (queryFieldsReq.error) return queryFieldsReq.response;
        const { uid } = req.query;

        const varietyStage = await VarietyStage.findByPk(uid)
        if (!varietyStage) return notFound(res, "Variety Stage not found.")

        let requiredData = convertToLowercase(req.body);
        delete requiredData.crop_variety_fk;

        await VarietyStage.update(requiredData, { where: { uid } });
        return successOk(res, "Variety Stage updated successfully")
    } catch (error) {
        if (error.name === "SequelizeUniqueConstraintError")
            return conflictError(res, "Principle stage already added against this variety.")
        return catchWithSequelizeValidationError(res, error)
    }
}

// ================= deleteVarietyStage =======================

export async function deleteVarietyStage(req, res) {
    try {
        const reqFields = ["uid"];
        const queryFieldsReq = queryReqFields(req, res, reqFields)
        if (queryFieldsReq.error) return queryFieldsReq.response;
        const { uid } = req.query;

        await VarietyStage.destroy({ where: { uid } })
        return successOk(res, "Variety Stage deleted successfully")
    } catch (error) {
        return catchError(res, error)
    }
}

