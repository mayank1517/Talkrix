import { User } from "../Models/User.model.js";
import FriendRequest from "../Models/FriendRequest.model.js";

export const getFriendList = async (req, res) => {
  try {
    const userId = req.user._id;
    const friends = await User.find(userId).populate(
      "friends",
      "fullName profilePicture username"
    );
    res.status(200).json({ success: true, friends: friends[0].friends });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getSuggestedFriends = async (req, res) => {
  try {
    const userId = req.user._id;

    // Fetch the current user to get their friends list
    const currentUser = await User.findById(userId).select("friends");

    // Combine current user's ID and their friends' IDs
    const excludedIds = [...currentUser.friends, userId];

    // Find users who are not the current user or their friends
    const suggestedFriends = await User.find({
      _id: { $nin: excludedIds },
    });

    res.status(200).json({ success: true, suggestedFriends });
  } catch (error) {
    console.error("Error fetching suggested friends:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const sendFriendRequest = async (req, res) => {
  try {
    const { receiverId } = req.params;
    const senderId = req.user._id;

    // Check if the friend request already exists
    const existingRequest = await FriendRequest.findOne({
      $or: [
        { sender: senderId, receiver: receiverId },
        { sender: receiverId, receiver: senderId },
      ],
    });

    if (existingRequest) {
      return res.status(400).json({ message: "Friend request already exists" });
    }

    // Create a new friend request
    const friendRequest = await FriendRequest.create({
      sender: senderId,
      receiver: receiverId,
    });

    res.status(201).json({ success: true, friendRequest });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const acceptFriendRequest = async (req, res) => {
  try {
    const { receiverId } = req.params;
    const senderId = req.user._id;

    // Check if the friend request exists
    const friendRequest = await FriendRequest.findOne({
      sender: receiverId,
      receiver: senderId,
    });

    if (!friendRequest) {
      return res.status(404).json({ message: "Friend request not found" });
    }
    if (friendRequest.receiver.toString() !== senderId.toString()) {
      return res.status(403).json({ message: "Forbidden" });
    }

    // Add the users to each other's friend lists
    await User.findByIdAndUpdate(senderId, {
      $addToSet: { friends: receiverId },
    });
    await User.findByIdAndUpdate(receiverId, {
      $addToSet: { friends: senderId },
    });

    // Remove the friend request
    await FriendRequest.findByIdAndDelete(friendRequest._id);

    res.status(200).json({ success: true, message: "Friend request accepted" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};
export const getAllFriendRequests = async (req, res) => {
  try {
    const userId = req.user._id;
    const friendRequests = await FriendRequest.find({
      receiver: userId,
    }).populate("sender", "fullName profilePicture username");

    res.status(200).json({ success: true, friendRequests });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const rejectFriendRequest = async (req, res) => {
  try {
    const { requestId } = req.params;
    const userId = req.user._id;

    // Check if the friend request exists
    const friendRequest = await FriendRequest.findById(requestId);

    if (!friendRequest) {
      return res.status(404).json({ message: "Friend request not found" });
    }
    if (friendRequest.receiver.toString() !== userId.toString()) {
      return res.status(403).json({ message: "Forbidden" });
    }

    // Remove the friend request
    await FriendRequest.findByIdAndDelete(friendRequest._id);

    res.status(200).json({ success: true, message: "Friend request rejected" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};
