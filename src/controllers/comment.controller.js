import mongoose, { isValidObjectId } from "mongoose";
import { Comment } from "../models/comments.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponce } from "../utils/ApiResponce.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Video } from "../models/video.models.js";

const getVideoComments = asyncHandler(async (req, res) => {
    //TODO: get all comments for a video
    const { videoId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "videoId is invalid");
    }

    const Allcomment = await Comment.find({ video: videoId });

    console.log(Allcomment);

    return res
        .status(200)
        .json(
            new ApiResponce(200, Allcomment, "all comment fetch successfully")
        );
});

const addComment = asyncHandler(async (req, res) => {
    // TODO: add a comment to a video
    const { videoId } = req.params;
    const { content } = req.body;

    if (!isValidObjectId(videoId)) {
        throw new ApiError(200, "invalid video ID");
    }

    if (!content) {
        throw new ApiError(200, "content is required");
    }

    try {
        const comment = new Comment({
            content,
            video: videoId,
            owner: req.user._id,
        });

        const commentSave = await comment.save();
        if (!commentSave) {
            throw new ApiError(400, "comment is not save in database");
        }

        const addCommentId = await Video.findByIdAndUpdate(videoId, {
            $push: {
                comments: comment._id,
            },
        });

        if (!addCommentId) {
            throw new ApiError(400, "commnet id is not save in database");
        }

        return res
            .status(200)
            .json(new ApiResponce(200, comment, "comment added"));
    } catch (error) {
        throw new ApiError(400, "comment not added");
    }
});

const updateComment = asyncHandler(async (req, res) => {
    // TODO: update a comment
    const { commentId } = req.params;
    const { content } = req.body;

    if (!isValidObjectId(commentId)) {
        throw new ApiError(400, "comment id not valid");
    }

    const comment = await Comment.findByIdAndUpdate(
        commentId,
        {
            $set: {
                content: content || comment.content,
            },
        },
        { new: true }
    );

    console.log(comment);

    return res
        .status(200)
        .json(new ApiResponce(200, comment, "comment update successfully"));
});

const deleteComment = asyncHandler(async (req, res) => {
    // TODO: delete a comment
    const { commentId } = req.params;

    if (!isValidObjectId(commentId)) {
        throw new ApiError(400, "comment id not valid");
    }

    const comment = await Comment.findByIdAndDelete(commentId);

    await Video.findByIdAndUpdate(comment.video, {
        $pull: {
            comments: comment._Id,
        },
    });

    return res.status(200).json(200, "comment remove successfully");
});

export { getVideoComments, addComment, updateComment, deleteComment };
