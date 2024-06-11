import { Like } from "../models/likes.models.js";
import { Video } from "../models/video.models.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponce } from "../utils/ApiResponce.js";
import { isValidObjectId } from "mongoose";
import { Comment } from "../models/comments.models.js";
import { Tweet } from "../models/tweets.models.js";

const toggleVideoLike = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    //TODO: toggle like on video

    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video id");
    }

    const video = await Video.findById(videoId);

    if (!video) {
        throw new ApiError(404, "Video not found");
    }

    const like = await Like.findOne({
        video: videoId,
        likedBy: req.user._id,
    });

    console.log(like);

    if (!like) {
        const newLike = new Like({
            video: videoId,
            likedBy: req.user._id,
        });

        await newLike.save();
        video.likes++;

        await video.save();

        return res.status(200).json(new ApiResponce(200, like, "Video liked"));
    } else {
        await like.deleteOne({ video: videoId, likedBy: req.user._id });
        video.likes--;

        await video.save();

        return res
            .status(200)
            .json(new ApiResponce(200, like, "Video disliked"));
    }
});

const toggleCommentLike = asyncHandler(async (req, res) => {
    const { commentId } = req.params;

    if (!isValidObjectId(commentId)) {
        throw new ApiError(400, "comment Id is not valid");
    }

    const comment = await Comment.findById(commentId);

    if (!comment) {
        throw new ApiError(400, "comment not found");
    }

    const like = await Like.findOne({
        commentId,
        likedBy: req.user._id,
    });

    if (!like) {
        const newLike = new Like({
            comment: commentId,
            likedBy: req.user._id,
        });
        await newLike.save();
        comment.likes++;
        await Comment.save();

        return res
            .status(200)
            .json(new ApiResponce(200, like, "comment like successfully"));
    } else {
        await Like.deleteOne({
            comment: commentId,
            likedBy: req.user._id,
        });
        comment.likes--;

        await Comment.save();
        return res
            .status(200)
            .json(new ApiResponce(200, like, "comment dislike successfully"));
    }
});

const toggletweetLike = asyncHandler(async (req, res) => {
    const { tweetId } = req.params;

    if (!isValidObjectId(tweetId)) {
        throw new ApiError(400, "Invlid tweetId");
    }

    const tweet = await Tweet.findById(tweetId);
    if (!tweet) {
        throw new ApiError(400, "tweet not found");
    }

    const like = await Like.findOne({
        tweet: tweetId,
        likedBy: req.user._id,
    });

    console.log(like);

    if (!like) {
        const newLike = new Like({
            tweet: tweetId,
            likedBy: req.user._id,
        });
        await newLike.save();

        return res
            .status(200)
            .json(new ApiResponce(200, like, "tweet like successfully"));
    } else {
        await Like.deleteOne({
            tweet: tweetId,
            likedBy: req.user._id,
        });

        return res
            .status(200)
            .json(new ApiResponce(200, like, "tweet dislike successfully"));
    }
});

const getLikedVideos = asyncHandler(async (req, res) => {
    //TODO: get all liked videos
    const user = req.user._id;

    if (!isValidObjectId(user)) {
        throw new ApiError(400, "user invalid");
    }

    const videoLike = await Like.find({
        likedBy: user,
    });

    const videoIds = videoLike.map((like) => like.video);

    const videos = await Video.find({
        _id: {
            $in: videoIds,
        },
    });
    console.log(videos);

    return res
        .status(200)
        .json(
            new ApiResponce(200, videos, "all liked videos fetch syccessfully")
        );
});

export { toggleVideoLike, toggleCommentLike, toggletweetLike, getLikedVideos };
