// =========================================
//             Lbraries Import
// =========================================
import chalk from "chalk";
import cors from "cors";
import cookieParser from "cookie-parser";
import compression from "compression";
import express from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import morgan from "morgan";
import os from "os";
import { fileURLToPath } from "url";
import path from "path";

// =========================================
//             Code Import
// =========================================
import { nodeEnv, port } from "./config/initialConfig.js";
import { connectDB } from "./config/dbConfig.js";
import { getIPAddress } from "./utils/utils.js";
import "./models/models.js";
import authRoutes from "./routes/auth/auth.route.js";
import productRoutes from "./routes/product/product.route.js";
import seedRoutes from "./routes/seed/seed.route.js";
import seedTrialRoutes from "./routes/seedTrial/seedTrial.route.js";
import cropRoutes from "./routes/crop/crop.route.js";
import cropStagesRoutes from "./routes/crop/cropStage.route.js";
import cropVarietyRoutes from "./routes/crop/cropVariety.route.js";
import varietyStagesRoutes from "./routes/crop/varietyStages.route.js";
import ingredientRoutes from "./routes/ingredient/ingredient.route.js";
import companyRoutes from "./routes/company/company.route.js";
import companyUserRoutes from "./routes/company/companyUser.route.js";
import franchiseRoutes from "./routes/company/franchise.route.js";
import queryRoutes from "./routes/query/query.route.js";
import referralCode from "./routes/referralCode/referralCodeRoutes.js";
import { domain } from "./config/initialConfig.js";

// =========================================
//            Configurations
// =========================================
// Initializing the app
const app = express();
app.use(cookieParser());

// Essential security headers with Helmet
app.use(helmet());

// Enable CORS with default settings
const crosOptions = {
  origin: nodeEnv === "production" ? domain : "*", // allow requests from all ips in development, and use array for multiple domains
  // allowedHeaders: ['Content-Type', 'Authorization', 'x-token', 'y-token'],    // allow these custom headers only
};
app.use(cors(crosOptions));

// Logger middleware for development environment
if (nodeEnv !== "production") {
  app.use(morgan("dev"));
}

// Compress all routes
app.use(compression());

// Rate limiting to prevent brute-force attacks
const limiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Built-in middleware for parsing JSON
app.use(express.json());

// static directories
// Convert import.meta.url to a file path
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use("/static", express.static(path.join(__dirname, "../../", "static")));

// =========================================
//            Routes
// =========================================
// Route for root path
app.get("/", (req, res) => {
  res.send("Welcome to Farmacie Internal dashboard");
});

// routes
app.use("/api/auth", authRoutes);
app.use("/api/product", productRoutes);
app.use("/api/seed", seedRoutes);
app.use("/api/seed/trial", seedTrialRoutes);
app.use("/api/crop", cropRoutes);
app.use("/api/crop/stages", cropStagesRoutes);
app.use("/api/crop/variety", cropVarietyRoutes);
app.use("/api/crop/variety/stage", varietyStagesRoutes);
app.use("/api/ingredient", ingredientRoutes);
app.use("/api/company", companyRoutes);
app.use("/api/company/user", companyUserRoutes);
app.use("/api/company/franchise", franchiseRoutes);
app.use("/api/query", queryRoutes);
app.use("/api/referralcode", referralCode);

// =========================================
//            Global Error Handler
// =========================================
// Global error handler
app.use((err, req, res, next) => {
  console.error(chalk.red(err.stack));
  res.status(err.status || 500).json({
    message: err.message || "Internal Server Error",
    error: {},
  });
});

// Database connection
connectDB();

// Server running
app.listen(port, () => {
  console.log(
    chalk.bgYellow.bold(
      ` Server is listening at http://${getIPAddress()}:${port} `
    )
  );
});
