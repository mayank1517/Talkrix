import { use, useState } from "react";
import regImg from "../assets/regImg.png";
import axiosInstance from "../lib/axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const RegisterPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
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
      const response = await axiosInstance.post("/auth/register", formData);
      response.data.success && toast.success("Successfully registered!");
      console.log(response.data);
      setLoading(false);
      navigate("/profile-complete");
    } catch (error) {
      console.error(error.response.data.message);
      setError("Registration failed. Please try again.", error);
      toast.error(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="registerContainer">
      <div className="regCard">
        <div className="regFormContainer">
          <h1>Talkrix</h1>
          <form className="registerForm" onSubmit={handleSubmit}>
            <h2>Register</h2>
            <p>Join the conversation on Talkrix!</p>
            <p>{error && <span className="error">{error}</span>}</p>
            <input
              type="text"
              name="fullName"
              placeholder="Full Name"
              value={formData.fullName}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
              required
            />
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
            <button type="submit">
              {loading ? "Creating..." : "Create Account"}
            </button>
            <p>
              already have an account? <a href="/login">Login</a>
            </p>
          </form>
        </div>
        <div className="registerImg">
          <img src={regImg} alt="Register" />
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
