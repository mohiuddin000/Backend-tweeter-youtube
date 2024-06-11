import mongoose, { isValidObjectId } from "mongoose";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Tweet } from "../models/tweets.models.js";
import { ApiResponce } from "../utils/ApiResponce.js";

const createTweet = asyncHandler(async (req, res) => {
    //TODO: create tweet

    const { content } = req.body;
    const user = req.user._id;

    if (!content) {
        throw new ApiError(400, "content required");
    }

    const tweet = new Tweet({
        content,
        owner: user,
    });

    if (!tweet) {
        throw new ApiError(400, "tweet not created");
    }

    await tweet.save();

    return res
        .status(200)
        .json(new ApiResponce(200, tweet, "tweet created successfully"));
});

const updateTweet = asyncHandler(async (req, res) => {
    //TODO: update tweet

    const { tweetId } = req.params;
    const { content } = req.body;
    const user = req.user._id;
    if (!isValidObjectId(tweetId)) {
        throw new ApiError(400, "invalid tweetId");
    }

    const tweet = await Tweet.findByIdAndUpdate(
        tweetId,

        {
            $set: {
                content: content || tweets.content,
            },
        },
        {
            new: true,
        }
    );

    console.log(tweet.owner.toString() !== req.user._id.toString());

    if (tweet.owner.toString() !== user.toString()) {
        throw new ApiError(400, "your are not allow to change the tweet");
    }

    if (!tweet) {
        throw new ApiError(400, "tweet not update");
    }

    return res
        .status(200)
        .json(new ApiResponce(200, tweet, "tweet update successfully"));
});

const deleteTweet = asyncHandler(async (req, res) => {
    //TODO: delete tweet

    const { tweetId } = req.params;
    const user = req.user._id;

    if (!isValidObjectId(tweetId)) {
        throw new ApiError(400, "invalid tweetId");
    }

    const tweet = await Tweet.findById(tweetId);

    if (tweet.owner.toString() !== user.toString()) {
        throw new ApiError(400, "your are not allow to delete the tweet");
    }

    await Tweet.findByIdAndDelete(tweetId);

    return res
        .status(200)
        .json(new ApiResponce(200, "tweet deleted successfully"));
});

const getUserTweets = asyncHandler(async (req, res) => {
    // TODO: get user tweets

    const user = req.user._id;

    const tweets = await Tweet.find({ owner: user });

    if (!tweets) {
        throw new ApiError(400, "tweets not fetched");
    }

    console.log(tweets);

    return res
        .status(200)
        .json(new ApiResponce(200, tweets, "tweets fetched successfully"));
});

export { createTweet, updateTweet, deleteTweet, getUserTweets };
