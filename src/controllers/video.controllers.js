import mongoose, { isValidObjectId } from "mongoose";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Video } from "../models/video.models.js";
import { User } from "../models/user.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponce } from "../utils/ApiResponce.js";
import uploadOnCloudinary from "../utils/cloudinary.js";

const getAllVideos = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, query, sortBy, sortType } = req.query;
    //TODO: get all videos based on query, sort, pagination
    const userId = req.user._id;

    if (page < 1 || limit < 1) {
        throw new ApiError(400, "Invalid page or limit");
    }

    if (!isValidObjectId(userId)) {
        throw new ApiError(400, "Invalid user id");
    }

    const queryObject = {};
    if (query) {
        queryObject.title = { $regex: query, $options: "i" };
    }

    console.log("queryObject", queryObject);

    const AllVideos = await Video.find({
        owner: userId,
    });

    if (!AllVideos) {
        throw new ApiError(400, "videos not found or video not uploaded");
    }

    return res
        .status(200)
        .json(new ApiResponce(200, AllVideos, "all videos fetch successfully"));

    console.log(req.query);
});

const publishAVideo = asyncHandler(async (req, res) => {
    console.log("hello");
    const { title, description } = req.body;
    const { _id } = req.user;

    if (!isValidObjectId(_id)) {
        throw new ApiError(400, "Invalid user id");
    }

    if (!title && !description) {
        throw new ApiError(400, "Title and description are required");
    }

    const existedTitle = await Video.findOne({ title });
    if (existedTitle) {
        throw new ApiError(400, "Title already exists");
    }

    console.log(req);

    if (!req.files?.videoFile) {
        throw new ApiError(400, "video file is not uploaded");
    }

    const videoLocalPath = req.files?.videoFile[0]?.path;
    let thumbnailLocalPath;
    if (
        req.files &&
        Array.isArray(req.files.thumbnail) &&
        req.files.thumbnail.lenght > 0
    ) {
        thumbnailLocalPath = req.files?.thumbnail[0]?.path;
    }

    if (!videoLocalPath) {
        throw new ApiError(400, "Video is required");
    }

    console.log(req);

    const videoUpload = await uploadOnCloudinary(videoLocalPath);
    const thumbnailUpload = await uploadOnCloudinary(thumbnailLocalPath);

    if (!videoUpload) {
        throw new ApiError(400, "Video upload failed on cloudinary");
    }
    const videoFile = videoUpload.url;
    console.log(videoFile);
    const video = await Video.create({
        videoFile,
        thumbnail: thumbnailUpload?.url || "",
        title,
        description,
        owner: _id,
    });

    return res
        .status(200)
        .json(new ApiResponce(200, video, "Video published successfully"));
});

const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params;

    console.log(req.params);

    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video id");
    }

    const video = await Video.findById(videoId);
    if (!video) {
        throw new ApiError(404, "Video not found");
    }

    return res
        .status(200)
        .json(new ApiResponce(200, video, "Video found successfully"));
});

const updateVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    //TODO: update video details like title, description, thumbnail
    const { title, description } = req.body;
    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video id");
    }

    const thumbnailLocalPath = req.file.path;

    const thumbnailUpload = await uploadOnCloudinary(thumbnailLocalPath);
    if (!thumbnailUpload) {
        throw new ApiError(400, "Thumbnail upload failed on cloudinary");
    }

    const thumbnail = thumbnailUpload.url;

    console.log(req.file);
    console.log(thumbnail);
    const video = await Video.findById(videoId);
    if (!video) {
        throw new ApiError(404, "Video not found");
    }

    const updatedVideo = await Video.findByIdAndUpdate(
        videoId,
        {
            $set: {
                title,
                description,
                thumbnail,
            },
        },
        { new: true }
    );

    return res
        .status(200)
        .json(new ApiResponce(200, video, "video updated successfully"));
});

const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    //TODO: delete video

    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "invalid video id");
    }

    const video = await Video.findByIdAndDelete(videoId);

    if (!video) {
        throw new ApiError(404, "video not found");
    }

    return res
        .status(200)
        .json(new ApiResponce(200, video, "video deleted successfully"));
});

const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params;

    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "invalid video id");
    }

    const video = await Video.findById(videoId);
    if (!video) {
        throw new ApiError(404, "Video not found");
    }
    const updatedVideo = await Video.findByIdAndUpdate(videoId, {
        $set: {
            published: !video.published,
        },
    });
    return res
        .status(200)
        .json(new ApiResponce(200, updatedVideo, "video updated successfully"));
});

export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus,
};
