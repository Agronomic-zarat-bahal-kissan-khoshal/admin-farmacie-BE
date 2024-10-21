import DashboardUser from "./auth/dashboardUser.model.js";
import Cropvariety from "./crop/cropVariety.model.js";
import Crop from "./crop/crop.model.js";
import VarietyStage from "./crop/varietyStages.model.js";
import Seed from "./seed/seed.model.js";
import ActiveIngredient from "./ingredient/activeIngredient.model.js";
import Product from "./product/product.model.js";


// ============================================
//                Sync Database
// ============================================
// DashboardUser.sync({ alter: true });
// Cropvariety.sync({ alter: true });
// Crop.sync({ alter: true });
// VarietyStage.sync({ alter: true });
// Seed.sync({ alter: true });
Product.sync({ alter: true });
// ActiveIngredient.sync({ force: true });