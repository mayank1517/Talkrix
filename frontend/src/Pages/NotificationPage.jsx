import axiosInstance from "../lib/axios";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
const NotificationPage = () => {
  const [notifications, setNotifications] = useState([]);

  const fetchNotifications = async () => {
    try {
      const response = await axiosInstance.get("/users/all-friend-requests");
      setNotifications(response.data.friendRequests);
      console.log(response.data);
    } catch (error) {
      toast.error("Error fetching notifications");
      console.error("Error fetching notifications:", error);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  return (
    <div className="notification-page">
      <h1>Notifications :</h1>
      <div className="notifications-container">
        {notifications.length === 0 ? (
          <p>No new notifications</p>
        ) : (
          notifications?.map((notification) => (
            <div key={notification._id} className="notification-card">
              <img
                src={notification.sender.profilePicture}
                alt={`${notification.sender.name}'s profile`}
                className="notification-profile-picture"
              />
              <p>
                <strong>{notification.sender.name}</strong> sent you a friend
                request.
              </p>
              <div className="notification-actions">
                <button
                  onClick={async () => {
                    try {
                      await axiosInstance.put(
                        `/users/accept-friend-request/${notification.sender._id}`
                      );
                      toast.success("Friend request accepted");
                      fetchNotifications();
                    } catch (error) {
                      toast.error("Error accepting friend request");
                      console.error("Error accepting friend request:", error);
                    }
                  }}
                >
                  Accept
                </button>
                <button
                  onClick={async () => {
                    try {
                      await axiosInstance.put(
                        `/users/reject-friend-request/${notification._id}`
                      );
                      toast.success("Friend request rejected");
                      fetchNotifications();
                    } catch (error) {
                      toast.error("Error rejecting friend request");
                      console.error("Error rejecting friend request:", error);
                    }
                  }}
                >
                  Reject
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default NotificationPage;
