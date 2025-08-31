// lib/streamClient.js
import { StreamVideoClient } from "@stream-io/video-react-sdk";

let clientInstance = null;
let lastUserId = null;

export const getStreamClient = ({ apiKey, user, token }) => {
  if (!clientInstance || user.id !== lastUserId) {
    console.log("Initializing Stream client...");
    clientInstance = StreamVideoClient.getOrCreateInstance({
      apiKey,
      user,
      token,
    });
    lastUserId = user.id;
  } else {
    console.log("Reusing existing Stream client...");
  }
  return clientInstance;
};
