import { Router } from "express";
import { addTrack, filterTracks, getTracks, search } from "../controllers/controllers.js";

const router = Router();

router.get("/", getTracks);

router.post("/add", addTrack);

router.get("/search", search)

router.get("/filter/:type/:value", filterTracks);

export default router;
