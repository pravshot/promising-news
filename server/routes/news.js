import express from "express";
import * as NewsController from "../controllers/news.js";

const router = express.Router();

router.get("/", NewsController.getNews);
router.get("/:id", NewsController.getNewsEntry);
router.post("/", NewsController.createNewsEntry);
router.put("/:id", NewsController.updateNewsEntry);
router.delete("/:id", NewsController.deleteNewsEntry);

export default router;
