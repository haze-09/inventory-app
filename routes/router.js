import { Router } from "express";
import { getTracks } from "../controllers/controllers.js";

const router = Router();

router.get("/", getTracks);

router.get("/add");
router.post("/add");

router.get("/filter/:type/:value");

export default router;
