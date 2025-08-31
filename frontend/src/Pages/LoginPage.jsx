import React, { useState } from "react";
import { useNavigate } from "react-router";
import regImg from "../assets/regImg.png";
import axiosInstance from "../lib/axios";
import toast from "react-hot-toast";

const LoginPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await axiosInstance
        .post("/auth/login", formData)
        .then(() => window.location.reload());
      response.data.success && toast.success("Login successful!");
      console.log(response.data);
      setLoading(false);
    } catch (error) {
      console.error(error.response.data.message);
      toast.error(error.response.data.message);
      setError("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="registerContainer">
      <div className="regCard">
        <div className="registerImg">
          <img src={regImg} alt="Register" />
        </div>
        <div className="regFormContainer">
          <h1>Talkrix</h1>
          <form className="registerForm" onSubmit={handleSubmit}>
            <h2>Login</h2>
            <p>Join the conversation on Talkrix!</p>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <button type="submit">{loading ? "logging in..." : "Login"}</button>
            <p>
              Don't have an account? <a href="/register">Register</a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
