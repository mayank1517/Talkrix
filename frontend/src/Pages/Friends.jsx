import axiosInstance from "../lib/axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Friends = () => {
  const [friends, setFriends] = useState([]);

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const response = await axiosInstance.get("/users/friends");
        setFriends(response.data.friends);
        console.log("Fetched friends:", response.data.friends);
      } catch (error) {
        console.error("Error fetching friends:", error);
      }
    };

    fetchFriends();
  }, []);

  return (
    <div className="friends-page">
      <h1>Friends :</h1>
      <ul>
        {friends.length > 0 ? (
          friends.map((friend) => (
            <li className="friend-item" key={friend._id}>
              <div className="friend-info">
                <img src={friend.profilePicture} alt={friend.fullName} />
                <p>{friend.fullName} </p>
              </div>
              <button className="chat-button">
                <Link className="chat-link" to={`/chat/${friend._id}`}>
                  Chat
                </Link>
              </button>
            </li>
          ))
        ) : (
          <li>No friends found</li>
        )}
      </ul>
    </div>
  );
};

export default Friends;
