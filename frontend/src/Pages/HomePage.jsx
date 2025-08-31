import axiosInstance from "../lib/axios";
import { useEffect, useState } from "react";
import FriendCard from "../Components/FriendCard";
const HomePage = () => {
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        const response = await axiosInstance.get("/users/suggested-friends");
        setSuggestions(response.data.suggestedFriends);
        console.log("Suggestions data:", response.data);
      } catch (error) {
        console.error("Error fetching suggestions:", error);
      }
    };

    fetchSuggestions();
  }, []);

  return (
    <div className="home-page">
      <h1>Suggestions :</h1>
      <FriendCard suggestions={suggestions} />
    </div>
  );
};

export default HomePage;
