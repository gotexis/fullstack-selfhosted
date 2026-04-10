import { Router } from "express";
import { getHealth, getServiceInfo } from "../../core/index.ts";

const router = Router();

router.get("/health", (_req, res) => {
  const health = getHealth();
  res.json(health);
});

router.get("/info", (_req, res) => {
  const info = getServiceInfo();
  res.json(info);
});

export default router;
