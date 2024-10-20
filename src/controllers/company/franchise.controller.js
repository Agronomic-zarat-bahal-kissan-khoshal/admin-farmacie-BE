import { Op } from "sequelize";
import Company from "../../models/company/company.model.js";
import CompanyUser from "../../models/company/companyUser.model.js";
import { bodyReqFields, queryReqFields } from "../../utils/requiredFields.js";
import {
    created,
    frontError,
    catchError,
    validationError,
    successOk,
    successOkWithData,
    UnauthorizedError,
    sequelizeValidationError,
    notFound,
    conflictError
} from "../../utils/responses.js";
import { convertToLowercase } from "../../utils/utils.js";
import Franchise from "../../models/company/franchise.model.js";
import FranchiseManager from "../../models/company/franchiseManager.model.js";


// ====================================================
//                     CONTOLLERS
// ====================================================

export async function companyFranchisesStats(req, res) {
    try {
        const reqQueryFields = queryReqFields(req, res, ["company_fk"]);
        if (reqQueryFields.error) return reqQueryFields.response;

        const { company_fk } = req.query;
        const franchiseCount = await Franchise.count({ where: { company_fk: company_fk.toLowerCase() } });
        return successOkWithData(res, "Franchise stats fetched successfully", { franchiseCount });
    } catch (error) {
        catchError(res, error)
    }
}

// ================= viewCompanyFranchises =======================

export async function viewCompanyFranchises(req, res) {
    try {
        const reqQueryFields = queryReqFields(req, res, ["company_fk"]);
        if (reqQueryFields.error) return reqQueryFields.response;

        const { company_fk } = req.query;

        // Fetch all franchises without pagination
        const franchises = await Franchise.findAll({
            where: { company_fk: company_fk.toLowerCase() },
            attributes: ["uuid", "address", "tehsil", "district", "province", "active"],
            include: [
                {
                    required: false,
                    model: FranchiseManager,
                    as: "franchise_manager",
                    attributes: ["full_name", "contact"]
                }
            ]
        });

        // Return all fetched franchises without pagination info
        return successOkWithData(res, "Franchises fetched successfully", franchises);
    } catch (error) {
        catchError(res, error);
    }
}
