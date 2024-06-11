import mongoose from "mongoose";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponce } from "../utils/ApiResponce.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Like } from "../models/likes.models.js";
import { Video } from "../models/video.models.js";
import { Subscription } from "../models/subscription.models.js";

const getChannelStats = asyncHandler(async (req, res) => {
    // TODO: Get the channel stats like total video views, total subscribers, total videos, total likes etc.

    const userId = req.user._id;

    const totalVideos = await Video.find({
        owner: userId,
    }).select("_id");

    const subscribers = await Subscription.find({
        channel: userId,
    });

    // const Totallike = await Like.countDocuments({
    //     video: totalVideos._id,
    // });

    const totalLikeCounts = await Promise.all(
        totalVideos.map(async (video) => {
            const likes = await Like.find({
                video: video._id,
            });
            return likes.length; // Count the number of likes for each video
        })
    );

    let totalLike = 0;
    totalLikeCounts.forEach((num) => {
        totalLike = totalLike + num;
    });
    console.log(totalLike);

    const data = {
        totalLike: totalLike,
        totalVideos: totalVideos.length,
        totalsubscribers: subscribers.length,
    };

    console.log(data);

    return res
        .status(200)
        .json(
            new ApiResponce(
                200,
                data,
                "like , view , subscriber and total video fetch successfully"
            )
        );
});

const getChannelVideos = asyncHandler(async (req, res) => {
    // TODO: Get all the videos uploaded by the channel

    const videos = await Video.find({
        owner: req.user._id,
    });

    if (!videos) {
        throw new ApiError(400, "no video found");
    }

    return res
        .status(200)
        .json(
            new ApiResponce(200, videos, "user all videos fetch successfully")
        );
});

export { getChannelStats, getChannelVideos };
