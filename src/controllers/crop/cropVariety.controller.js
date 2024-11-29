import Crop from "../../models/crop/crop.model.js";
import Cropvariety from "../../models/crop/cropVariety.model.js";
import { catchError, catchWithSequelizeValidationError, conflictError, created, frontError, notFound, sequelizeValidationError, successOk, successOkWithData, validationError } from "../../utils/responses.js";
import { bodyReqFields, queryReqFields } from "../../utils/requiredFields.js";
import { convertToLowercase } from "../../utils/utils.js";
import Seed from "../../models/seed/seed.model.js";


// ============================================
//             CONTOLLERS
// ============================================

export async function addCropVariety(req, res) {
    try {
        const reqFields = [
            "variety_eng", "variety_urdu", "company", "variety_type", "crop_fk", "season",
            "crop_season", "seed_weight_mg", "germination_percentage", "maturity_percentage",
            "irrigation_source", "crop_min_days", "crop_max_days", "cwr_min_mm", "cwr_max_mm",
            "mad_percentage", "sand", "loamy_sand", "sandy_loam", "loam", "silt_loam", "silt",
            "silty_clay_loam", "silty_clay", "clay", "sandy_clay", "sandy_clay_loam", "clay_loam",
            "in_farmacie",
        ];
        const bodyFieldsReq = bodyReqFields(req, res, reqFields)
        if (bodyFieldsReq.error) return bodyFieldsReq.response
        const requiredData = convertToLowercase(req.body);

        await Cropvariety.create(requiredData);
        // IF SEED ALREADY ON FARMACIE THEN UPDATE SEED STATUS IN_SIMULATOR TO TRUE
        if (requiredData.in_farmacie) await Seed.update({ in_simulator: true }, { where: { seed_variety_name: requiredData.variety_eng } })
        return created(res, "Crop variety added successfully")
    } catch (error) {
        return catchWithSequelizeValidationError(res, error)
    }
}

// ================= getAllCropVarieties =======================

export async function getAllCropVarieties(req, res) {
    try {
        const cropVarieties = await Cropvariety.findAll({
            attributes: ["variety_eng", "variety_urdu", "crop_fk", "in_farmacie"]
        })
        return successOkWithData(res, "Data fetched successfully.", cropVarieties)
    } catch (error) {
        return catchError(res, error)
    }
}

// ================= getCropVarietiesList =======================

export async function getCropVarietiesList(req, res) {
    try {
        const cropVarietiesList = await Cropvariety.findAll({
            attributes: ["variety_eng", "crop_fk"]
        })
        return successOkWithData(res, "Data fetched successfully.", cropVarietiesList)
    } catch (error) {
        return catchError(res, error)
    }
}

// ================= getSingleCropVariety =======================

export async function getSingleCropVariety(req, res) {
    try {
        const queryField = queryReqFields(req, res, ["variety_eng"])

        if (queryField.error) return queryField.error;
        const variety_eng = req.query.variety_eng.toLowerCase();
        const cropVariety = await Cropvariety.findByPk(variety_eng);
        if (!cropVariety) return notFound(res, "Crop variety not found.")
        return successOkWithData(res, "Data fetched successfully.", cropVariety)
    } catch (error) {
        return catchError(res, error)
    }
}

// ================= updateCropVariety =======================

export async function updateCropVariety(req, res) {
    try {
        const queryField = queryReqFields(req, res, ["variety_eng"])
        if (queryField.error) return queryField.error;
        const variety_eng = req.query.variety_eng.toLowerCase();
        const cropVariety = await Cropvariety.findByPk(variety_eng);
        if (!cropVariety) return notFound(res, "Crop variety not found.")
        const updatedData = convertToLowercase(req.body);
        await Cropvariety.update(updatedData, { where: { variety_eng } });
        return successOk(res, "Crop variety updated successfully")
    } catch (error) {
        return catchWithSequelizeValidationError(res, error)
    }
}

// ================= deleteCropVariety =======================

export async function deleteCropVariety(req, res) {
    try {
        const queryField = queryReqFields(req, res, ["variety_eng"])
        if (queryField.error) return queryField.error;
        const variety_eng = req.query.variety_eng.toLowerCase();
        await Cropvariety.destroy({ where: { variety_eng } });
        return successOk(res, "Crop variety deleted successfully")
    } catch (error) {
        return catchError(res, error)
    }
}

// ================= alreadyOnFarmacie =======================

export async function alreadyOnFarmacie(req, res) {
    try {
        const reqFields = ["variety_eng"]
        const queryField = queryReqFields(req, res, reqFields)
        if (queryField.error) return queryField.error;

        const variety_eng = req.query.variety_eng.toLowerCase();
        const cropVarietie = await Cropvariety.findByPk(variety_eng)

        if (!cropVarietie) return notFound(res, "Crop variety not found.")
        if (cropVarietie.in_farmacie) return successOk(res, "Crop variety on farmacie status already set.")
        cropVarietie.in_farmacie = true;
        await cropVarietie.save();
        return successOk(res, "Crop variety on farmacie status updated successfully.")
    } catch (error) {
        return catchError(res, error)
    }
}