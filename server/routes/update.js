import express from "express";
import * as NewsController from "../controllers/news.js";

const router = express.Router();

router.get("/", NewsController.dailyUpdate);

export default router;
