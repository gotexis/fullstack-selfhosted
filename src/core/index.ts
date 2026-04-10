/**
 * Core business logic — shared by CLI, API, and GUI.
 * All domain logic lives here. CLI and API are thin wrappers.
 */

import os from "node:os";

export interface HealthStatus {
  status: "ok" | "degraded" | "error";
  version: string;
  uptime: number;
  timestamp: string;
  hostname: string;
  node: string;
  memory: {
    used: number;
    total: number;
    percent: number;
  };
}

const startTime = Date.now();

export function getVersion(): string {
  return "0.1.0";
}

export function getHealth(): HealthStatus {
  const mem = process.memoryUsage();
  const totalMem = os.totalmem();
  const freeMem = os.freemem();
  const usedMem = totalMem - freeMem;

  return {
    status: "ok",
    version: getVersion(),
    uptime: Math.floor((Date.now() - startTime) / 1000),
    timestamp: new Date().toISOString(),
    hostname: os.hostname(),
    node: process.version,
    memory: {
      used: Math.round(usedMem / 1024 / 1024),
      total: Math.round(totalMem / 1024 / 1024),
      percent: Math.round((usedMem / totalMem) * 100),
    },
  };
}

export interface ServiceInfo {
  name: string;
  description: string;
  version: string;
  endpoints: string[];
}

export function getServiceInfo(): ServiceInfo {
  return {
    name: "fullstack-selfhosted",
    description:
      "Self-hosted fullstack service template — CLI + API + GUI in one package",
    version: getVersion(),
    endpoints: [
      "GET  /api/health     — Health check",
      "GET  /api/info        — Service info",
      "GET  /                — Web GUI",
    ],
  };
}
