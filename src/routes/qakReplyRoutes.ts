import { Router } from "express";
import {
  createQakReply,
  getOneQakReply,
  updateQakReply,
  deleteQakReply
} from "../controllers/qakReplyController";

const router = Router();

router.post("/", createQakReply);

router.get("/:qakReply_id", getOneQakReply);

router.put("/:qakReply_id", updateQakReply);

router.delete("/:id", deleteQakReply);

export default router;
