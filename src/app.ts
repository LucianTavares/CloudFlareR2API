import express from "express";
import bucketRoutes from "./rotas/bucketsRoutes.js";
import { keycloak } from "./config/keycloak.js";
import { rateLimiterMiddleware } from "./middleware/rateLimiterMiddleware.js";

const app = express();

app.use(rateLimiterMiddleware)
app.use(keycloak.middleware());

app.use(bucketRoutes)

export default app;