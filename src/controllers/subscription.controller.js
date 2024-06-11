import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponce } from "../utils/ApiResponce.js";
import { isValidObjectId } from "mongoose";
import { Subscription } from "../models/subscription.models.js";
import { User } from "../models/user.models.js";

const toggleSubscription = asyncHandler(async (req, res) => {
    const { channelId } = req.params;
    // TODO: toggle subscription
    const userId = req.user._id;

    if (!isValidObjectId(channelId)) {
        throw new ApiError(400, "invalid channel id");
    }

    const channel = await User.findById(channelId);
    if (!channel) {
        throw new ApiError(404, "Channel not found");
    }

    const user = await User.findById(req.user.id);
    if (!user) {
        throw new ApiError(404, "User not found");
    }

    const isSubscribe = await Subscription.findOne({
        channel: channelId,
        subscriber: userId,
    });

    if (!isSubscribe) {
        const newSubscriber = new Subscription({
            subscriber: userId,
            channel: channelId,
        });
        await newSubscriber.save();

        return res
            .status(200)
            .json(new ApiResponce(200, Subscription, " subscribed channel"));
    } else {
        await Subscription.deleteOne({
            subscriber: userId,
            channel: channelId,
        });

        return res
            .status(200)
            .json(new ApiResponce(200, Subscription, "unsubscribed channel"));
    }
});

// controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
    const { channelId } = req.params;

    if (!isValidObjectId(channelId)) {
        throw new ApiError(400, "invalid channel id");
    }

    const channel = await User.findById(channelId);

    if (!channel) {
        throw new ApiError(400, "channel not found");
    }

    const subscriberList = await Subscription.find({ channel: channelId });

    return res
        .status(200)
        .json(
            new ApiResponce(
                200,
                subscriberList,
                "channel subscribers list fetch successfully"
            )
        );
});

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
    //const { subscriberId } = req.params;
    const subscriberId = req.user._id;
    if (!isValidObjectId(subscriberId)) {
        throw new ApiError(400, "invalid subscriber id");
    }

    const subscribeChannelList = await Subscription.find({
        subscriber: subscriberId,
    });

    const channel = await Promise.all(
        subscribeChannelList.map(async (subscribeChannel) => {
            const Channeldetails = await User.findById(
                subscribeChannel.channel
            );
            return Channeldetails.username;
        })
    );

    console.log("channels", channel);

    return res
        .status(200)
        .json(
            new ApiResponce(
                200,
                subscribeChannelList,
                "user subscribe channel list fetch successfully"
            )
        );
});

export { toggleSubscription, getUserChannelSubscribers, getSubscribedChannels };
