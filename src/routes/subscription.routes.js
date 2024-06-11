import { Router } from "express";
import {
    getSubscribedChannels,
    getUserChannelSubscribers,
    toggleSubscription,
} from "../controllers/subscription.controller.js";
import { verifyJWT } from "../middlewares/auth.middlewares.js";

const subscriptionRouter = Router();

subscriptionRouter.use(verifyJWT);

subscriptionRouter.route("/c/:channelId").post(toggleSubscription);
subscriptionRouter.route("/c/:channelId").get(getUserChannelSubscribers);
subscriptionRouter.route("/c/").get(getSubscribedChannels);

export default subscriptionRouter;
