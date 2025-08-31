import { useState, useEffect } from "react";
import useAuth from "../Hooks/useAuth";
import axiosInstance from "../lib/axios";
import { useNavigate, useParams } from "react-router-dom";
import { getStreamClient } from "../lib/StreamClient";
import {
  StreamCall,
  StreamVideo,
  StreamVideoClient,
  CallControls,
  SpeakerLayout,
  useCallStateHooks,
  CallingState,
  StreamTheme,
} from "@stream-io/video-react-sdk";
import "@stream-io/video-react-sdk/dist/css/styles.css";
import { useRef } from "react";

const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY;
const VideoChatPage = () => {
  const { callId } = useParams();
  const [client, setClient] = useState(null);
  const [isConnecting, setIsConnecting] = useState(true);
  const [call, setCall] = useState(null);
  const { user, loading } = useAuth();

  useEffect(() => {
    if (loading || client) return;

    const initCall = async () => {
      try {
        const response = await axiosInstance.get("/chats/token");
        if (!user || !response.data.token)
          throw new Error("Failed to get chat token");

        const callingUser = {
          id: user._id,
          name: user.fullName,
          image: user.profilePicture,
        };

        const videoClient = getStreamClient({
          apiKey: STREAM_API_KEY,
          user: callingUser,
          token: response.data.token,
        });

        const callInstance = videoClient.call("default", callId);
        await callInstance.join({ create: true });

        setClient(videoClient);
        setCall(callInstance);
      } catch (error) {
        console.error("Error initializing chat:", error);
      } finally {
        setIsConnecting(false);
      }
    };

    initCall();
  }, [loading, callId]);

  useEffect(() => {
    return () => {
      if (client) {
        client.disconnectUser();
      }
    };
  }, [client]);

  {
    {
      isConnecting && <div>Connecting to video call...</div>;
    }
  }
  return (
    <div>
      {call && (
        <StreamVideo client={client}>
          <StreamCall call={call}>
            <CallContent />
          </StreamCall>
        </StreamVideo>
      )}
    </div>
  );
};
const CallContent = () => {
  const { useCallCallingState } = useCallStateHooks();
  const navigate = useNavigate();
  const callingState = useCallCallingState();
  if (callingState === CallingState.LEFT) return navigate("/");

  return (
    <StreamTheme>
      <SpeakerLayout />
      <CallControls />
    </StreamTheme>
  );
};

export default VideoChatPage;
