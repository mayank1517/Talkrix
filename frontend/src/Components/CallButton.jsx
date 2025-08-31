import { IoVideocam } from "react-icons/io5";

const CallButton = ({ handleVideoCall }) => {
  return (
    <div className="call-button">
      <button onClick={handleVideoCall}>
        <IoVideocam />
      </button>
    </div>
  );
};

export default CallButton;
