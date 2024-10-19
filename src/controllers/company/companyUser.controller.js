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


// ====================================================
//            CONTOLLERS
// ====================================================

export async function getCompanyUsersList(req, res) {
    try {
        const allCompaniesUsers = await CompanyUser.findAll({
            attributes: ["uuid", "company_fk"],
            where: { verified: true, company_fk: { [Op.not]: null } }
        });
        return successOkWithData(res, "Company user list fetched successfully.", allCompaniesUsers)
    } catch (error) {
        console.log("error: ", error)

        return catchError(res, error)
    }
}


// ================= verifyCompanyUser =======================


export async function verifyCompanyUser(req, res) {
    try {
        const reqBodyFields = bodyReqFields(req, res, ["company", "uuid"]);
        if (reqBodyFields.error) return reqBodyFields.response;
        const excludedFields = ["uuid"];
        const requiredData = convertToLowercase(req.body, excludedFields);
        const { company, uuid } = requiredData;

        // DOES COMPANY EXIST WITH THE GIVEN NAME IN GLOBAL LIST
        const companyExists = await Company.findByPk(company);
        if (!companyExists) return notFound(res, "Company not found in company global list, First add it to the global list.");

        // DOES ANY COMPANY ALREADY REGISTERED AGAINST THE GIVEN COMPANY
        const companyUsersExist = await CompanyUser.findOne({ where: { company_fk: company } });
        if (companyUsersExist) {
            if (companyUsersExist.uuid === uuid) return conflictError(res, "Company already verified");
            else return validationError(res, "Another compmany is registered under this company name.");
        }
        // DOES COMPANY USER EXIST WITH THE GIVEN UUID
        const companyUser = await CompanyUser.findByPk(uuid);
        if (!companyUser) return frontError(res, "Invalid company uuid.")

        // REGISTER AND MAKE COMPANY VERIFIED
        companyUser.company_fk = company;
        companyUser.verified = true;
        await companyUser.save();
        return successOk(res, "Company verified successfully");
    } catch (error) {
        return catchError(res, error);
    }
}


// ================= deleteCompanyUser =======================


export async function deleteCompanyUser(req, res) {
    try {
        const reqQueryFields = queryReqFields(req, res, ["uuid"]);
        if (reqQueryFields.error) return reqQueryFields.response;
        const { uuid } = req.body;

        await CompanyUser.destroy({ where: { uuid } });
        return successOk(res, "Company user deleted successfully");
    } catch (error) {
        return catchError(res, error);
    }
}