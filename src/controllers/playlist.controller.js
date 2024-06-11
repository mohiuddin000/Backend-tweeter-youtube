import { isValidObjectId } from "mongoose";
import { Playlist } from "../models/playlists.models.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponce } from "../utils/ApiResponce.js";

const createPlaylist = asyncHandler(async (req, res) => {
    //TODO: create playlist

    const { name, description } = req.body;

    if (!name || !description) {
        throw new ApiError(400, "name and description is required");
    }

    const playlist = Playlist.create({
        name,
        description,
    });

    await playlist.save();

    return res.status(200).json(200, playlist, "playlist created");
});

const getUserPlaylists = asyncHandler(async (req, res) => {
    const { userId } = req.params;
    //TODO: get user playlists

    if (!isValidObjectId(userId)) {
        throw new ApiError(400, "invalid userId");
    }

    const userPlaylist = await Playlist.find({
        owner: userId,
    });

    if (!userPlaylist) {
        throw new ApiError(400, "playlist not found");
    }

    return res
        .status(200)
        .json(
            new ApiResponce(
                200,
                userPlaylist,
                "user playlist fetch successfully"
            )
        );
});

const getPlaylistById = asyncHandler(async (req, res) => {
    const { playlistId } = req.params;
    //TODO: get playlist by id

    if (!isValidObjectId) {
        throw new ApiError(400, "invalid playlistId");
    }

    const playlist = await Playlist.findById(playlistId);

    if (!playlist) {
        throw new ApiError(400, "playlist not found");
    }

    return res
        .status(200)
        .json(new ApiResponce(200, playlist, "playlist found successfully"));
});

const addVideoToPlaylist = asyncHandler(async (req, res) => {
    const { playlistId, videoId } = req.params;

    if (!isValidObjectId(playlistId)) {
        throw new ApiError(400, "invalid playlistId");
    }
    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "invalid videoId");
    }

    const playlist = await Playlist.findById(playlistId);

    if (req.user._id.toString() !== playlist.owner.toString()) {
        throw new ApiError(400, "you are not allow to add video to playlist");
    }

    if (!playlist) {
        throw new ApiError(400, "playlist not found");
    }

    const video = await Playlist.findOne(playlist, {
        video: videoId,
    });

    if (video) {
        throw new ApiError(400, "this video already add in this playlist");
    }

    playlist.videos.push(videoId);
    await playlist.save();

    // playlist.push(
    //     video:videoId
    // )

    return res
        .status(200)
        .json(
            new ApiResponce(
                200,
                playlist,
                "video added in playlist successfully"
            )
        );
});

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
    const { playlistId, videoId } = req.params;
    // TODO: remove video from playlist

    if (!isValidObjectId(playlistId)) {
        throw new ApiError(400, "invalid playlistId");
    }
    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "invalid videoId");
    }

    const playlist = await Playlist.findById(playlistId);

    if (req.user._id.toString() !== playlist.owner.toString()) {
        throw new ApiError(
            400,
            "you are not allow to remove video from palylist"
        );
    }

    if (!Playlist) {
        throw new ApiError(400, "playlist not found");
    }

    playlist.videos.pull(videoId);
    await playlist.save();

    return res
        .status(200)
        .json(new ApiResponce(200, playlist, "Video removed from playlist"));
});

const deletePlaylist = asyncHandler(async (req, res) => {
    const { playlistId } = req.params;
    // TODO: delete playlist

    if (!isValidObjectId(playlistId)) {
        throw new ApiError(400, "invalid playlistId ");
    }

    const playlist = await Playlist.findById(playlistId);

    if (req.user._id.toString() !== playlist.owner.toString()) {
        throw new ApiError(
            400,
            "you are not allow to change or delete the playlist"
        );
    }

    await Playlist.findByIdAndDelete(playlistId);

    return res
        .status(200)
        .json(new ApiResponce(200, "playlist deleted successfully"));
});

const updatePlaylist = asyncHandler(async (req, res) => {
    const { playlistId } = req.params;
    const { name, description } = req.body;
    //TODO: update playlist

    if (!isValidObjectId(playlistId)) {
        throw new ApiError(400, "invalid playlistId ");
    }

    if (!name || !description) {
        throw new ApiError(400, "name and description is required");
    }

    const playlist = await Playlist.findById(playlistId);

    if (!playlist) {
        throw new ApiError(400, "playlist not found");
    }

    if (req.user._id.toString() !== playlist.owner.toString()) {
        throw new ApiError(
            400,
            "you are not allow to change or delete the playlist"
        );
    }

    playlist.name = name;
    playlist.description = description || playlist.description;
    await playlist.save();

    return res
        .status(200)
        .json(
            new ApiResponce(200, playlist, "user playlist update successfully")
        );
});

export {
    createPlaylist,
    getPlaylistById,
    getUserPlaylists,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
    updatePlaylist,
};
