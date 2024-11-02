import { Router } from "express";
import { filterTracks, getTracks } from "../controllers/controllers.js";

const router = Router();

router.get("/", getTracks);

router.get("/add");
router.post("/add");

router.get("/filter/:type/:value", filterTracks);

export default router;
