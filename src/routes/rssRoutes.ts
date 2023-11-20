import { Router } from "express";
import { getRssFeeds } from "../controllers/RssController";

const router = Router();

router.get("/feeds", getRssFeeds);

export default router;
