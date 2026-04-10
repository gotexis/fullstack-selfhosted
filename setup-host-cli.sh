#!/bin/bash
# setup-host-cli.sh — Register CLI globally on the host (outside Docker)
# Run this after cloning the repo to the host.
# Requires: Node.js 24+ (native TS) or Node.js 22.6+ (--experimental-strip-types), pnpm
set -euo pipefail

DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$DIR"

# Detect CLI name from package.json bin field
CLI_NAME=$(node -e "const p=JSON.parse(require('fs').readFileSync('package.json'));console.log(Object.keys(p.bin)[0])")

echo "📦 Installing dependencies..."
pnpm install --frozen-lockfile 2>/dev/null || pnpm install

# Detect Node version to decide flags
NODE_MAJOR=$(node -e 'console.log(process.versions.node.split(".")[0])')
if [ "$NODE_MAJOR" -ge 24 ]; then
  NODE_FLAGS=""
else
  NODE_FLAGS="--experimental-strip-types"
fi

# Create a wrapper script — runs TS source directly via native Node
WRAPPER="$DIR/bin/$CLI_NAME"
mkdir -p "$DIR/bin"
cat > "$WRAPPER" << SCRIPT
#!/bin/bash
exec $(which node) $NODE_FLAGS "$DIR/src/cli/index.ts" "\$@"
SCRIPT
chmod +x "$WRAPPER"

echo "🔗 Registering CLI: $CLI_NAME → $WRAPPER (Node $NODE_MAJOR, flags: ${NODE_FLAGS:-none})"
ln -sf "$WRAPPER" "/usr/local/bin/$CLI_NAME"

echo "✅ Done. Test with: $CLI_NAME health"
$CLI_NAME --version
