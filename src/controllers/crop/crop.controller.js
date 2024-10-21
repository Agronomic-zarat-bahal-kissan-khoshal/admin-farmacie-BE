import Crop from "../../models/crop/crop.model.js";
import { catchError, catchWithSequelizeValidationError, conflictError, created, frontError, notFound, sequelizeValidationError, successOk, successOkWithData, validationError } from "../../utils/responses.js";
import { bodyReqFields, queryReqFields } from "../../utils/requiredFields.js";
import Cropvariety from "../../models/crop/cropVariety.model.js";
import { convertToLowercase } from "../../utils/utils.js";


// ============================================
//             CONTOLLERS
// ============================================

export async function addCrop(req, res) {
    try {
        const reqFields = ["crop_name", "crop_category", "source", "root_depth_max_m", "seed_sowing_depth_m"];
        const bodyFieldsReq = bodyReqFields(req, res, reqFields)
        if (bodyFieldsReq.error) return bodyFieldsReq.response
        const requiredData = convertToLowercase(req.body);

        await Crop.create(requiredData);
        return created(res, "Crop added successfully")
    } catch (error) {
        return catchWithSequelizeValidationError(res, error)
    }
}

// ================= getAllCrops =======================

export async function getAllCrops(req, res) {
    try {
        const crops = await Crop.findAll({
            attributes: ["crop_name", "crop_category", "source"]
        })
        return successOkWithData(res, crops)
    } catch (error) {
        return catchError(res, error)
    }
}

// ================= getCropslist =======================

export async function getCropsList(req, res) {
    try {
        const cropsList = await Crop.findAll({
            attributes: ["crop_name"]
        })
        return successOkWithData(res, cropsList)
    } catch (error) {
        return catchError(res, error)
    }
}

// ================= getSingleCrop =======================

export async function getSingleCrop(req, res) {
    try {
        const queryField = queryReqFields(req, res, ["crop_name"])
        if (queryField.error) return queryField.error;
        const crop_name = req.query.crop_name.toLowerCase();
        const cropsList = await Crop.findByPk(crop_name);
        if (!cropsList) return notFound(res, "Crop not found.")
        return successOkWithData(res, cropsList)
    } catch (error) {
        return catchError(res, error)
    }
}

// ================= updateCrop =======================

export async function updateCrop(req, res) {
    try {
        const queryField = queryReqFields(req, res, ["crop_name"])
        if (queryField.error) return queryField.error;

        const crop_name = req.query.crop_name.toLowerCase();
        const updatedData = convertToLowercase(req.body);

        const crop = await Crop.findByPk(crop_name)
        if (!crop) return notFound(res, "Crop not found.")
        await Crop.update(updatedData, { where: { crop_name } });
        return successOk(res, "Crop updated successfully.")
    } catch (error) {
        return catchWithSequelizeValidationError(res, error)
    }
}

// ================= deleteCrop =======================

export async function deleteCrop(req, res) {
    try {
        const queryField = queryReqFields(req, res, ["crop_name"]);
        if (queryField.error) return queryField.error;

        const crop_name = req.query.crop_name.toLowerCase();
        await Crop.destroy({ where: { crop_name } });
        return successOk(res, "Crop deleted successfully.");
    } catch (error) {
        return catchError(res, error);
    }
}

// ================= cropStats =======================

export async function cropStats(req, res) {
    try {
        const cropsCount = await Crop.count();
        const varietiesCount = await Cropvariety.count();
        return successOkWithData(res, "Crop deleted successfully.", { cropsCount, varietiesCount });
    } catch (error) {
        return catchError(res, error);
    }
}