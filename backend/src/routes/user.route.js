import express from "express";
import {
  getFriendList,
  getSuggestedFriends,
  sendFriendRequest,
  acceptFriendRequest,
  getAllFriendRequests,
  rejectFriendRequest,
} from "../controller/user.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/suggested-friends", authMiddleware, getSuggestedFriends);
router.get("/friends", authMiddleware, getFriendList);
router.post(
  "/send-friend-request/:receiverId",
  authMiddleware,
  sendFriendRequest
);
router.put(
  "/accept-friend-request/:receiverId",
  authMiddleware,
  acceptFriendRequest
);
router.get("/all-friend-requests", authMiddleware, getAllFriendRequests);
router.put(
  "/reject-friend-request/:requestId",
  authMiddleware,
  rejectFriendRequest
);

export default router;
