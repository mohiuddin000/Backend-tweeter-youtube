import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middlewares.js";
import { getChannelStats } from "../controllers/dashboard.controller.js";

const dashboardRouter = Router();

dashboardRouter.use(verifyJWT);

dashboardRouter.route("/").post(getChannelStats);

export default dashboardRouter;
