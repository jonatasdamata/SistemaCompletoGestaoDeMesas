import express from "express";
import { addMesa, getMesas } from "../controllers/mesa.js";

const router = express.Router();

router.get("/", getMesas);
router.post("/", addMesa);

export default router;
