import { useState } from "react";
import axiosInstance from "../lib/axios";
import useAuth from "../Hooks/useAuth";
import defaultImg from "../assets/default.jpeg";
import { FaShuffle } from "react-icons/fa6";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
const ProfileCompletePage = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();
  const [imagePreview, setImagePreview] = useState(
    user?.profilePicture || null
  );
  const navigate = useNavigate();
  const [formState, setFormState] = useState({
    fullName: user?.fullName || "",
    profilePicture: imagePreview || "",
    bio: user?.bio || "",
    location: user?.location || "",
    gender: user?.gender || "",
  });
  const handleImageChange = () => {
    const randomId = Math.floor(Math.random() * 100) + 1;
    const newImageUrl = `https://avatar.iran.liara.run/public/${randomId}`;
    setFormState({ ...formState, profilePicture: newImageUrl });

    setImagePreview(newImageUrl);
    console.log("New image URL:", newImageUrl);
  };

  const completeProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axiosInstance.post(
        "/auth/profile-completion",
        formState
      );
      console.log("Profile completed:", response.data);
      toast.success("Profile completed successfully!");

      navigate("/");
    } catch (error) {
      console.error("Error completing profile:", error);
      toast.error(
        error.response?.data?.message || "Failed to complete profile"
      );
      setError("Failed to complete profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-complete-page">
      <div className="profileCompleteCard">
        <h1>Complete Your Profile</h1>

        <form className="profileCompleteForm" onSubmit={completeProfile}>
          <div className="proImg">
            <img
              src={
                imagePreview === null
                  ? user?.profilePicture
                  : imagePreview || defaultImg
              }
              alt="Profile"
            />
          </div>
          <button
            onClick={handleImageChange}
            type="button"
            className="shuffleBtn"
          >
            Change Avatar <FaShuffle />
          </button>
          <label htmlFor="fullName">Full Name</label>
          <input
            type="text"
            placeholder="ex. John Doe"
            id="fullName"
            value={formState.fullName}
            onChange={(e) =>
              setFormState({ ...formState, fullName: e.target.value })
            }
          />
          <label htmlFor="bio">Bio</label>
          <textarea
            id="bio"
            placeholder="Tell us about yourself"
            value={formState.bio}
            onChange={(e) =>
              setFormState({ ...formState, bio: e.target.value })
            }
          />
          <div className="Options">
            <label htmlFor="location">Location</label>
            <input
              type="text"
              id="location"
              placeholder="ex. New York"
              value={formState.location}
              onChange={(e) =>
                setFormState({ ...formState, location: e.target.value })
              }
            />

            <label htmlFor="gender">Gender</label>
            <select
              id="gender"
              value={formState.gender}
              onChange={(e) =>
                setFormState({ ...formState, gender: e.target.value })
              }
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>

          <button type="submit">Complete Profile</button>
        </form>
      </div>
    </div>
  );
};

export default ProfileCompletePage;
