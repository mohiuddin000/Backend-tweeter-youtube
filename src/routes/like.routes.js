import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middlewares.js";
import {
    getLikedVideos,
    toggleCommentLike,
    toggleVideoLike,
    toggletweetLike,
} from "../controllers/like.controller.js";

const likeRouter = Router();

likeRouter.use(verifyJWT);

likeRouter.route("/toggle/v/:videoId").post(toggleVideoLike);
likeRouter.route("/toggle/t/:tweetId").post(toggletweetLike);
likeRouter.route("/toggle/c/:commentId").post(toggleCommentLike);
likeRouter.route("/all-liked-videos").get(getLikedVideos);

export default likeRouter;
