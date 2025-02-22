import { catchError, catchWithSequelizeValidationError, conflictError, created, frontError, notFound, sequelizeValidationError, successOk, successOkWithData, validationError } from "../../utils/responses.js";
import Ingredient from "../../models/ingredient/ingredient.model.js";
import { bodyReqFields, queryReqFields } from "../../utils/requiredFields.js";
import { literal, Op } from "sequelize";
import { convertToLowercase } from "../../utils/utils.js";
import Product from "../../models/product/product.model.js";
import ActiveIngredient from "../../models/ingredient/activeIngredient.model.js";

// ========================================
//             CONTOLLERS
// ========================================


export async function addIngredientsToGlobalList(req, res) {
    try {
        const reqFields = ["ingredients"];
        const bodyFieldsReq = bodyReqFields(req, res, reqFields);
        if (bodyFieldsReq.error) return bodyFieldsReq.response;
        const { ingredients } = req.body;

        if (!Array.isArray(ingredients)) return frontError(res, "Field ingredients is of type array.", "ingredients")
        if (ingredients.length === 0) return frontError(res, "Field ingredients  cannot be empty", "ingredients")

        // COVERT INGREDIENTS TO LOWER CASE
        const ingredientsLowerCase = ingredients.map(ingredient => ingredient.toLowerCase());

        // FINDING ALL INGREDIENTS THAT ARE ALREADY ADDED
        const ingredientsExist = await Ingredient.findAll({
            where: { ingredient_name: { [Op.in]: ingredientsLowerCase } },
            attributes: ["ingredient_name"]
        });

        // MAKING AN ARRAY OF INGREDIENTS THAT ARE ALREADY ADDED
        const ingredientsExistArr = ingredientsExist.map(ingredient => ingredient.ingredient_name)

        let ingredientsToAdd = ingredientsLowerCase.filter(ingredient => !ingredientsExistArr.includes(ingredient));
        ingredientsToAdd = ingredientsToAdd.map(ingredient => ({ ingredient_name: ingredient }));
        await Ingredient.bulkCreate(ingredientsToAdd);
        return created(res, "Ingredients added successfully");
    } catch (error) {
        console.log("error while creating the company", error);
        return catchError(res, error);
    }
}

// ================= getGlobalListIngredients =======================

export async function getGlobalListIngredients(req, res) {
    try {
        const ingredients = await Ingredient.findAll({ attributes: ["ingredient_name"], order: [["ingredient_name", "ASC"]], });
        const count = ingredients.length;
        return successOkWithData(res, "Ingredients fetched successfully", { ingredients, count });
    } catch (error) {
        console.log("error while getting the ingredients", error);
        return catchError(res, error);
    }
}

// ================= deleteGlobalListIngredient =======================

export async function deleteGlobalListIngredient(req, res) {
    try {
        const reqQueryFields = queryReqFields(req, res, ["ingredient"]);
        if (reqQueryFields.error) return reqQueryFields.response;
        const requiredData = convertToLowercase(req.query);
        const { ingredient } = requiredData;

        // FINDING ALL PRODUCTS THAT HAVE THIS INGREDIENT AND BLACKLISTING THEM
        let activeIngredient = await ActiveIngredient.findAll({
            where: { ingredient_fk: ingredient },
            attributes: ["product_fk"],
        })
        if (activeIngredient.length > 0) {
            let productUids = activeIngredient.map(ingredient => ingredient.product_fk);
            productUids = [...new Set(productUids)];
            await Product.update(
                { blacklist: true, verified: false },
                { where: { uuid: productUids } }
            )
        }

        // DELETING THE INGREDIENT
        await Ingredient.destroy({ where: { ingredient_name: ingredient } });
        return successOk(res, "Ingredient deleted successfully");
    } catch (error) {
        console.log("error while deleting the Ingredient", error);
        return catchError(res, error);
    }
}

// ================= updateGlobalListIngredient =======================

export async function updateGlobalListIngredient(req, res) {
    try {
        const reqBodyFields = bodyReqFields(req, res, ["ingredient", "updatedIngredient"]);
        if (reqBodyFields.error) return reqBodyFields.response;
        const requiredData = convertToLowercase(req.body);
        const { ingredient, updatedIngredient } = requiredData;

        const ingredientExists = await Ingredient.findByPk(ingredient);
        if (!ingredientExists) return notFound(res, "Ingredient not found in company global list");
        await Ingredient.update({ ingredient_name: updatedIngredient }, { where: { ingredient_name: ingredient } });
        return successOk(res, "Ingredient updated successfully");
    } catch (error) {
        return catchWithSequelizeValidationError(res, error);
    }
}