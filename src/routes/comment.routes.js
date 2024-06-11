import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middlewares.js";
import {
    addComment,
    deleteComment,
    getVideoComments,
    updateComment,
} from "../controllers/comment.controller.js";

const commentRouter = Router();

commentRouter.use(verifyJWT);

commentRouter.route("/:videoId").post(addComment);
commentRouter.route("/c/update/:commentId").patch(updateComment);
commentRouter.route("/all-comments/:videoId").post(getVideoComments);
commentRouter.route("/c/delete/:commentId").delete(deleteComment);

export default commentRouter;
