import { useState, useEffect } from "react";
import axiosInstance from "../lib/axios";
const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    try {
      const response = await axiosInstance.post("/auth/me");
      const authuser = response.data.user;
      setUser(authuser);
    } catch (error) {
      console.error("Error fetching user:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return { user, loading };
};

export default useAuth;
