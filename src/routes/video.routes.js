import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middlewares.js";
import { upload } from "../middlewares/multer.middleware.js";
import {
    deleteVideo,
    getAllVideos,
    getVideoById,
    publishAVideo,
    togglePublishStatus,
    updateVideo,
} from "../controllers/video.controllers.js";

const videoRouter = Router();

videoRouter.use(verifyJWT); // Apply verifyJWT middleware to all routes in this file

videoRouter.route("/publish-video").post(
    upload.fields([
        {
            name: "videoFile",
            maxCount: 1,
        },
        {
            name: "thumbnail",
            maxCount: 1,
        },
    ]),
    publishAVideo
);

videoRouter.route("/:videoId").get(getVideoById);
videoRouter
    .route("/:videoId/update-video")
    .patch(upload.single("thumbnail"), updateVideo);

videoRouter.route("/:videoId/delete-video").get(deleteVideo);

videoRouter.route("/:videoId/isPublished").patch(togglePublishStatus);
videoRouter.route("/all-videos").post(getAllVideos);
export default videoRouter;
