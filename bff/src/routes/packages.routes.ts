import { Router } from "express";
import { getPackages } from "src/controllers/packages.controllers";

const router = Router();
router.get("/", getPackages);
export default router;
