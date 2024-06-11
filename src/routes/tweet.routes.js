import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middlewares.js";
import {
    createTweet,
    deleteTweet,
    getUserTweets,
    updateTweet,
} from "../controllers/tweet.controller.js";

const tweetRouter = Router();

tweetRouter.use(verifyJWT);

tweetRouter.route("/add-tweet").post(createTweet);
tweetRouter.route("/t/update/:tweetId").patch(updateTweet);
tweetRouter.route("/t/remove/:tweetId").delete(deleteTweet);
tweetRouter.route("/user/:userId").get(getUserTweets);

export default tweetRouter;
