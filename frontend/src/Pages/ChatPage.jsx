import { useState, useEffect } from "react";
import useAuth from "../Hooks/useAuth";
import { useParams } from "react-router-dom";
import axiosInstance from "../lib/axios";
import toast from "react-hot-toast";
import "stream-chat-react/dist/css/v2/index.css";
import { StreamChat } from "stream-chat";
import {
  Channel,
  Chat,
  MessageList,
  ChannelHeader,
  MessageInput,
  Thread,
  Window,
} from "stream-chat-react";
import CallButton from "../Components/CallButton";
const ChatPage = () => {
  const { user, loading } = useAuth();
  const reciverId = useParams().chatId;
  const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY;
  const [channel, setChannel] = useState(null);
  const [client, setClient] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initChat = async () => {
      if (loading) return; // Wait until auth is ready

      try {
        const response = await axiosInstance.get("/chats/token");
        if (!user || !response.data.token) {
          throw new Error("Failed to get chat token");
        }
        const chatClient = StreamChat.getInstance(STREAM_API_KEY);
        chatClient.connectUser(
          {
            id: user._id,
            name: user.fullName,
            image: user.profilePicture,
          },
          response.data.token
        );
        setClient(chatClient);
        const channelID = [user._id, reciverId].sort().join("-");
        const channel = chatClient.channel("messaging", channelID, {
          members: [user._id, reciverId],
        });
        await channel.watch();
        setChannel(channel);
      } catch (error) {
        console.error("Error initializing chat:", error);
      } finally {
        setIsLoading(false);
      }
    };
    initChat();
  }, [user, reciverId, loading, client]);
  const handleVideoCall = () => {
    if (!channel) return;
    const callURL = `${window.location.origin}/video-call/${channel.id}`;
    channel.sendMessage({
      text: `Let's have a video call! ${callURL}`,
    });
    toast.success("Video call link sent!");
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="chat-container">
      <Chat client={client}>
        <Channel channel={channel}>
          <div className="chat">
            <CallButton handleVideoCall={handleVideoCall} />
            <Window>
              <ChannelHeader />

              <MessageList />
              <MessageInput focus />
            </Window>
          </div>
          <Thread />
        </Channel>
      </Chat>
    </div>
  );
};

export default ChatPage;
