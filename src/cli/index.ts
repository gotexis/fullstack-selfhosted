#!/usr/bin/env node
/**
 * CLI entry point — selfhosted-template-cli
 * Shares core logic with API server.
 */

import { Command } from "commander";
import { getHealth, getServiceInfo, getVersion } from "../core/index.js";

const program = new Command();

program
  .name("selfhosted-template-cli")
  .description("Self-hosted fullstack service template CLI")
  .version(getVersion());

program
  .command("health")
  .description("Check service health")
  .action(() => {
    const health = getHealth();
    console.log(`Status:   ${health.status}`);
    console.log(`Version:  ${health.version}`);
    console.log(`Uptime:   ${health.uptime}s`);
    console.log(`Hostname: ${health.hostname}`);
    console.log(`Node:     ${health.node}`);
    console.log(
      `Memory:   ${health.memory.used}MB / ${health.memory.total}MB (${health.memory.percent}%)`
    );
  });

program
  .command("info")
  .description("Show service info")
  .action(() => {
    const info = getServiceInfo();
    console.log(`${info.name} v${info.version}`);
    console.log(`${info.description}\n`);
    console.log("Endpoints:");
    info.endpoints.forEach((e) => console.log(`  ${e}`));
  });

program
  .command("serve")
  .description("Start the API + GUI server")
  .option("-p, --port <port>", "Port to listen on", "3900")
  .option("-h, --host <host>", "Host to bind to", "0.0.0.0")
  .action(async (opts) => {
    process.env.PORT = opts.port;
    process.env.HOST = opts.host;
    // Dynamic import to start the server
    await import("../server/index.js");
  });

program.parse();
