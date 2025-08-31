import defImg from "../assets/default.jpeg";
import axiosInstance from "../lib/axios";
import toast from "react-hot-toast";
import { FaLocationDot } from "react-icons/fa6";
import { useState } from "react";
const FriendCard = ({ suggestions }) => {
  const [alreadySent, setAlreadySent] = useState({});
  const handleAddFriend = async (receiverId) => {
    try {
      const response = await axiosInstance.post(
        `/users/send-friend-request/${receiverId}`
      );
      toast.success("Friend request sent!");
      setAlreadySent((prev) => ({ ...prev, [receiverId]: true }));

      console.log("Friend request sent:", response.data);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to send friend request"
      );
      console.error("Error sending friend request:", error);
    }
  };
  return (
    <div className="suggested-friend-list">
      {Array.isArray(suggestions) &&
        suggestions.map((friend) => (
          <div className="friend-card" key={friend._id}>
            <div className="upper-f-card">
              <img src={friend?.profilePicture || defImg} alt={friend.name} />
              <div className="name-in-card">
                <h3>{friend.fullName}</h3>
                <p>{friend.username}</p>
              </div>
            </div>
            <div className="bio-in-card">
              <p>
                {friend.bio?.length > 40
                  ? friend.bio.slice(0, 40) + "..."
                  : friend.bio}
              </p>
            </div>

            <p>
              <FaLocationDot />
              {friend.location}
            </p>
            <button
              disabled={alreadySent[friend._id]}
              onClick={() => handleAddFriend(friend._id)}
            >
              {alreadySent[friend._id] ? "Request Sent" : "Add Friend"}
            </button>
          </div>
        ))}
    </div>
  );
};

export default FriendCard;
