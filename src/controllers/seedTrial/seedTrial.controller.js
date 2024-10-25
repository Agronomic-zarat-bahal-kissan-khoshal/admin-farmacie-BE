import Seed from "../../models/seed/seed.model.js";
import SeedTrial from "../../models/seedTrial/seedTrial.model.js";
import SeedTrialData from "../../models/seedTrial/seedTrialData.model.js";
import { bodyReqFields, queryReqFields } from "../../utils/requiredFields.js";
import { catchError, catchWithSequelizeValidationError, conflictError, frontError, notFound, successOk, successOkWithData, validationError } from "../../utils/responses.js";


// ================================================================
//                          CONTROLLERS
// ================================================================


// ========================== getAllTrials ================================

export async function getAllTrials(req, res) {
    try {
        const trials = await SeedTrial.findAll({
            include: [
                {
                    required: false,
                    model: Seed,
                    as: 'seed',
                    attributes: ['seed_variety_name'],
                }
            ],
            attributes: { exclude: ["createdAt", "updatedAt", "seed_variety"] }
        });
        return successOkWithData(res, "All seed trials", trials);
    } catch (error) {
        return catchError(res, error);
    }
}

// ========================== getTrialData ================================

export async function getTrialData(req, res) {
    try {
        const queryFieldsReq = queryReqFields(req, res, ["uuid"]);
        if (queryFieldsReq.error) return queryFieldsReq.response;
        const { uuid } = req.query

        const trialData = await SeedTrialData.findAll({
            where: { seed_trial_fk: uuid },
            order: [["bbch_scale", 'ASC']],
        });
        return successOkWithData(res, "Seed trial data", trialData);
    } catch (error) {
        return catchError(res, error);
    }
}