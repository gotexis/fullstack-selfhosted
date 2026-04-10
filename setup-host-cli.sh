#!/bin/bash
# setup-host-cli.sh — Register CLI globally on the host (outside Docker)
# Run this after cloning the repo to the host.
# Requires: Node.js 22+, pnpm
set -euo pipefail

DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$DIR"

# Detect CLI name from package.json bin field
CLI_NAME=$(node -e "const p=JSON.parse(require('fs').readFileSync('package.json'));console.log(Object.keys(p.bin)[0])")

echo "📦 Installing dependencies..."
pnpm install --frozen-lockfile 2>/dev/null || pnpm install

# Create a wrapper script that uses tsx to run TS source directly
WRAPPER="$DIR/bin/$CLI_NAME"
mkdir -p "$DIR/bin"
cat > "$WRAPPER" << SCRIPT
#!/bin/bash
exec $(which npx) tsx "$DIR/src/cli/index.ts" "\$@"
SCRIPT
chmod +x "$WRAPPER"

echo "🔗 Registering CLI: $CLI_NAME → $WRAPPER"
ln -sf "$WRAPPER" "/usr/local/bin/$CLI_NAME"

echo "✅ Done. Test with: $CLI_NAME health"
$CLI_NAME --version
