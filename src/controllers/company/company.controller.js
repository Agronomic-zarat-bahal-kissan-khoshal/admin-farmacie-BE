import { Op } from "sequelize";
import Company from "../../models/company/company.model.js";
import CompanyUser from "../../models/company/companyUser.model.js";
import { catchError, catchWithSequelizeValidationError, conflictError, created, frontError, notFound, sequelizeValidationError, successOk, successOkWithData, validationError } from "../../utils/responses.js";
import { bodyReqFields, queryReqFields } from "../../utils/requiredFields.js";
import { convertToLowercase } from "../../utils/utils.js";



// ========================================
//             CONTOLLERS
// ========================================
export async function addCompniestoGlobalList(req, res) {
    try {
        const reqFields = ["companies"];
        const bodyFieldsReq = bodyReqFields(req, res, reqFields);
        if (bodyFieldsReq.error) return bodyFieldsReq.response;
        const { companies } = req.body;

        if (!Array.isArray(companies)) return frontError(res, "Field companies is of type array.", "companies")
        if (companies.length === 0) return frontError(res, "Field companies  cannot be empty", "companies")

        // COVERT COMPANIES TO LOWER CASE
        const companiesLowerCase = companies.map(company => company.toLowerCase());

        // FINDING ALL COMPANIES THAT ARE ALREADY ADDED
        const companiesExist = await Company.findAll({
            where: { company: { [Op.in]: companiesLowerCase } },
            attributes: ["company"]
        });

        // MAKING AN ARRAY OF COMPANIES THAT ARE ALREADY ADDED
        const companiesExistArr = companiesExist.map(company => company.company)

        let companiesToAdd = companiesLowerCase.filter(company => !companiesExistArr.includes(company));
        companiesToAdd = companiesToAdd.map(company => ({ company }));
        await Company.bulkCreate(companiesToAdd);
        return created(res, "Company added successfully");
    } catch (error) {
        return catchError(res, error);
    }
}

// ================= getCompanies =======================

export async function getGlobalListCompanies(req, res) {
    try {
        const companies = await Company.findAll({ attributes: ["company"] });
        const count = companies.length;
        return successOkWithData(res, "Companies fetched successfully", { companies, count });
    } catch (error) {
        console.log("error while getting the companies", error);
        return catchError(res, error);
    }
}

// ================= deleteCompany =======================
export async function deleteGlobalListCompanies(req, res) {
    try {
        const reqQueryFields = queryReqFields(req, res, ["company"]);
        if (reqQueryFields.error) return reqQueryFields.response;
        const requiredData = convertToLowercase(req.query);
        const { company } = requiredData;


        await Company.destroy({ where: { company } });
        return successOk(res, "Company deleted successfully");
    } catch (error) {
        return catchError(res, error);
    }
}

// ================= updateCompany =======================
export async function updateGlobalListCompanies(req, res) {
    try {
        const reqBodyFields = bodyReqFields(req, res, ["company", "updatedCompany"]);
        if (reqBodyFields.error) return reqBodyFields.response;
        const requiredData = convertToLowercase(req.body);
        const { company, updatedCompany } = requiredData;

        const companyExists = await Company.findByPk(company);
        if (!companyExists) return notFound(res, "Company not found in company global list");
        await Company.update({ company: updatedCompany }, { where: { company } });
        return successOk(res, "Company updated successfully");
    } catch (error) {
        return catchWithSequelizeValidationError(res, error);
    }
}

// ================= getAllCompanyUsers =======================
export async function getAllCompanyUsers(req, res) {
    try {
        const companyUsers = await CompanyUser.findAll();
        return successOkWithData(res, "Company users fetched successfully", { companyUsers, count });
    } catch (error) {
        console.log("error while getting the company users", error);
        return catchError(res, error);
    }
}


// ================= companyStats =======================
export async function getCompaniesStats(req, res) {
    try {
        const globalListCompanies = await Company.count();
        const registeredCompanies = await CompanyUser.count();
        const verifiedCompanies = await CompanyUser.count({ where: { verified: true } });
        return successOkWithData(res, "Company stats fetched successfully", { globalListCompanies, registeredCompanies, verifiedCompanies });
    } catch (error) {
        console.log("error while getting the company stats", error);
        return catchError(res, error);
    }
}