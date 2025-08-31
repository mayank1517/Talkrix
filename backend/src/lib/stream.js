import { StreamChat } from "stream-chat";
import "dotenv/config.js";

const apiKey = process.env.STREAM_API_KEY;
const apiSecret = process.env.STREAM_API_SECRET;

const streamClient = StreamChat.getInstance(apiKey, apiSecret);

export const createStreamUser = async (userData) => {
  try {
    const response = await streamClient.upsertUser(userData);
    return response;
  } catch (error) {
    console.error("Error creating Stream user:", error);
    throw error;
  }
};

export const generateStreamToken = async (userId) => {
  try {
    const userIdStr = userId.toString();
    const response = streamClient.createToken(userIdStr);
    return response;
  } catch (error) {
    console.error("Error generating Stream token:", error);
    throw error;
  }
};
