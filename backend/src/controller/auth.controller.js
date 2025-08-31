import { User } from "../Models/User.model.js";
import { createStreamUser } from "../lib/stream.js";
import jwt from "jsonwebtoken";
export const register = async (req, res) => {
  const { fullName, email, password, username } = req.body;
  try {
    if (!fullName || !email || !password || !username) {
      return res.status(400).json({ message: "All fields are required" });
    }
    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters long" });
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }
    const usernameRegex = /^[a-zA-Z0-9._-]+$/;
    if (!usernameRegex.test(username)) {
      return res.status(400).json({ message: "Invalid username format" });
    }
    const alreadyExists = await User.findOne({ username });
    if (alreadyExists) {
      return res.status(400).json({ message: "Username already taken" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "User with this email already exists" });
    }
    const avatarID = Math.floor(Math.random() * 100) + 1;
    const profilePicture = `https://avatar.iran.liara.run/public/${avatarID}`;

    const newUser = new User({
      fullName,
      email,
      password,
      profilePicture,
      username,
    });
    await newUser.save();

    await createStreamUser({
      id: newUser._id.toString(),
      name: newUser.fullName,
      username: newUser.username,
      email: newUser.email,
      image: newUser.profilePicture || "",
    });

    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.status(201).json({ success: true, user: newUser });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.status(200).json({ success: true, user });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const logout = async (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });
  res.status(200).json({ message: "Logged out successfully" });
};

export const profileCompletion = async (req, res) => {
  try {
    const userId = req.user._id;
    const { fullName, bio, location, gender, profilePicture } = req.body;
    if (!fullName || !bio || !location || !gender) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        fullName,
        bio,
        location,
        gender,
        profilePicture: profilePicture,
        isProfileComplete: true,
      },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    try {
      await createStreamUser({
        id: updatedUser._id.toString(),
        name: updatedUser.fullName,
        email: updatedUser.email,
        image: updatedUser.profilePicture || "",
      });
      console.log("Stream user created/updated successfully");
    } catch (error) {
      console.error("Error creating stream user:", error);
    }

    res.status(200).json({ success: true, user: updatedUser });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};
export const getUserProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ success: true, user });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};
