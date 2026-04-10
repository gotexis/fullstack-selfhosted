#!/bin/bash
# setup-host-cli.sh — Register CLI globally on the host (outside Docker)
# Run this after cloning the repo to the host.
# Requires: Node.js 22+, pnpm
set -euo pipefail

DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$DIR"

# Detect CLI name from package.json bin field
CLI_NAME=$(node -e "const p=JSON.parse(require('fs').readFileSync('package.json'));console.log(Object.keys(p.bin)[0])")
CLI_PATH="$DIR/dist/cli/index.js"

echo "📦 Installing dependencies..."
pnpm install --frozen-lockfile 2>/dev/null || pnpm install

echo "🔨 Building server + CLI..."
pnpm build:server

echo "🔗 Registering CLI: $CLI_NAME → $CLI_PATH"
chmod +x "$CLI_PATH"
ln -sf "$CLI_PATH" "/usr/local/bin/$CLI_NAME"

echo "✅ Done. Test with: $CLI_NAME health"
$CLI_NAME --version
