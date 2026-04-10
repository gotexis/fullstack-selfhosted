# fullstack-selfhosted

Self-hosted fullstack service template — CLI + API + GUI in one package.

## Tech Stack

| Layer | Choice |
|-------|--------|
| GUI | Vite + React + shadcn/ui + Tailwind |
| API | Express (serves SPA + REST) |
| CLI | Commander (shares core logic with API) |
| Deploy | Docker Compose → Dokploy |
| Expose | Tailscale `svc:xxx` |
| Package | pnpm |

## Architecture

```
GUI → fetch(/api/xxx) → API → core logic
CLI → core logic (direct import)
```

```
src/
├── core/       # Shared business logic (CLI + API both import)
├── server/     # Express API server + static file serving
├── cli/        # CLI entry point (commander)
└── web/        # Vite SPA (React + shadcn/ui)
```

## Development

```bash
# Install dependencies
pnpm install

# Start dev server (API + Vite HMR proxy)
pnpm dev           # API on :3900
# In another terminal:
npx vite           # Vite dev on :5173, proxies /api to :3900

# Build everything
pnpm build

# Start production server
pnpm start

# Use CLI
pnpm cli health
pnpm cli info
pnpm cli serve --port 3900
```

## Docker Deployment

```bash
docker compose up -d
```

## Tailscale Exposure

```bash
# Create service in Tailscale admin console first:
# https://login.tailscale.com/admin/services → Create "selfhosted-template"
tailscale serve --service=svc:selfhosted-template --bg --https 443 http://localhost:3900
```

## Global CLI Registration

```bash
pnpm build:server
npm link  # or: pnpm link --global
# Now available as: selfhosted-template-cli
```

## Using as a Template

1. Clone/fork this repo
2. Search-replace `selfhosted-template` with your service name
3. Replace `fullstack-selfhosted` with your package name
4. Add your business logic to `src/core/`
5. Add API routes to `src/server/routes/`
6. Build your GUI in `src/web/`
