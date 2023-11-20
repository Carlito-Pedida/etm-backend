import { Router } from "express";
import {
  getAllQaks,
  createQak,
  getOneQak,
  updateQak,
  deleteQak
} from "../controllers/qakController";

const router = Router();

router.get("/", getAllQaks);

router.post("/", createQak);

router.get("/:qak_id", getOneQak);

router.put("/:qak_id", updateQak);

router.delete("/:id", deleteQak);

export default router;
