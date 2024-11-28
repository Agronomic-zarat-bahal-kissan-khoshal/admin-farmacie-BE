import QueriesTicket from "../../models/query/queriesTicket.model.js";
import TicketChat from "../../models/query/ticketChat.model.js";
import { catchError, catchWithSequelizeValidationError, conflictError, frontError, notFound, successOk, successOkWithData, validationError } from "../../utils/responses.js";
import { bodyReqFields, queryReqFields } from "../../utils/requiredFields.js";


// ================================================================
//                          CONTROLLERS
// ================================================================

export async function createNewQueryTicket(req, res) {
    try {
        const reqFields = ["query", "company_uuid"];
        const bodyFieldsReq = bodyReqFields(req, res, reqFields);
        if (bodyFieldsReq.error) return bodyFieldsReq.response;

        const { query, company_uuid } = req.body;
        const first_query = query.slice(0, 20) + "...";

        const ticket = await QueriesTicket.create({ first_query, company_user_fk: company_uuid, query_viewed: true, responded: true });
        await TicketChat.create({ message: query, ticket_fk: ticket.uuid, is_query: false });
        return successOk(res, "Query ticket created successfully");
    } catch (error) {
        return catchWithSequelizeValidationError(res, error);
    }
};


// ========================== getAllTickets ================================


export async function getAllTickets(req, res) {
    try {
        let tickets = await QueriesTicket.findAll({
            attributes: { exclude: ['response_viewed'] },
            order: [
                ['query_viewed', 'ASC'],
                ['responded', 'ASC'],
                ['updatedAt', 'DESC'],
            ],
        });

        if (!tickets || tickets.length === 0) return notFound(res, "No tickets found");
        return successOkWithData(res, "All tickets", tickets);
    } catch (error) {
        return catchWithSequelizeValidationError(res, error);
    }
};


// ========================== setQueryViewed =====================================


export async function setQueryViewed(req, res) {
    try {
        const reqFields = ["uuid"];
        const queryFieldsReq = queryReqFields(req, res, reqFields);
        if (queryFieldsReq.error) return queryFieldsReq.response;

        const { uuid } = req.query;
        let ticket = await QueriesTicket.findByPk(uuid);
        if (!ticket) return notFound(res, "Ticket not found");

        if (!ticket.query_viewed) {
            ticket.query_viewed = true;
            await ticket.save();
        }
        return successOk(res, "Query viewed");
    } catch (error) {
        return catchWithSequelizeValidationError(res, error);
    }
};


// ========================== respondToTicket ================================


export async function respondToTicket(req, res) {
    try {
        const reqFields = ["uuid", "response"];
        const bodyFieldsReq = bodyReqFields(req, res, reqFields);
        if (bodyFieldsReq.error) return bodyFieldsReq.response;

        const { uuid, response } = req.body;

        let ticket = await QueriesTicket.findByPk(uuid);
        if (!ticket) return notFound(res, "Ticket not found");

        await TicketChat.create({ message: response, ticket_fk: ticket.uuid, is_query: false });

        ticket.responded = true;
        ticket.query_viewed = true;
        ticket.response_viewed = false;
        await ticket.save();
        return successOk(res, "Ticket responded successfully");
    } catch (error) {
        return catchWithSequelizeValidationError(res, error);
    }
}

// ========================== getTicketChat ================================

export async function getTicketChat(req, res) {
    try {
        const queryFieldsReq = queryReqFields(req, res, ["uuid"]);
        if (queryFieldsReq.error) return queryFieldsReq.response;
        const { uuid } = req.query;

        let ticket = await QueriesTicket.findByPk(uuid);
        if (!ticket) return notFound(res, "Ticket not found");

        let chat = await TicketChat.findAll({ where: { ticket_fk: uuid }, order: [['createdAt', 'ASC']], attributes: { exclude: ['ticket_fk'] } });
        if (!chat) return notFound(res, "No chat found");

        return successOkWithData(res, "Ticket chat", chat);
    } catch (error) {
        return catchWithSequelizeValidationError(res, error);
    }
};

// ========================== newQueryStats ================================

export async function newQueryStats(req, res) {
    try {
        let newQueryCount = await QueriesTicket.count({ where: { responded: false } });
        return successOkWithData(res, "All tickets", { newQueryCount });
    } catch (error) {
        return catchWithSequelizeValidationError(res, error);
    }
}