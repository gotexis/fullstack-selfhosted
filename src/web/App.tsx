import { useState, useEffect } from "react";

interface HealthData {
  status: string;
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

function StatusBadge({ status }: { status: string }) {
  const color =
    status === "ok"
      ? "bg-green-500/20 text-green-400 border-green-500/30"
      : status === "degraded"
        ? "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
        : "bg-red-500/20 text-red-400 border-red-500/30";

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${color}`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full ${status === "ok" ? "bg-green-400" : status === "degraded" ? "bg-yellow-400" : "bg-red-400"}`}
      />
      {status.toUpperCase()}
    </span>
  );
}

function Card({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-lg border border-border bg-card p-6">
      <h2 className="text-sm font-medium text-muted-foreground mb-4">
        {title}
      </h2>
      {children}
    </div>
  );
}

function formatUptime(seconds: number): string {
  const d = Math.floor(seconds / 86400);
  const h = Math.floor((seconds % 86400) / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  const parts = [];
  if (d > 0) parts.push(`${d}d`);
  if (h > 0) parts.push(`${h}h`);
  if (m > 0) parts.push(`${m}m`);
  parts.push(`${s}s`);
  return parts.join(" ");
}

export default function App() {
  const [health, setHealth] = useState<HealthData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchHealth = async () => {
    try {
      const res = await fetch("/api/health");
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setHealth(await res.json());
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unknown error");
    }
  };

  useEffect(() => {
    fetchHealth();
    const interval = setInterval(fetchHealth, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="dark min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b border-border">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold text-sm">
              FS
            </div>
            <div>
              <h1 className="text-lg font-semibold">
                fullstack-selfhosted
              </h1>
              <p className="text-xs text-muted-foreground">
                Self-hosted service template
              </p>
            </div>
          </div>
          {health && <StatusBadge status={health.status} />}
        </div>
      </header>

      {/* Main */}
      <main className="max-w-5xl mx-auto px-6 py-8">
        {error && (
          <div className="mb-6 rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-red-400 text-sm">
            ⚠️ Failed to connect: {error}
          </div>
        )}

        {health ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card title="Service">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Version</span>
                  <span className="font-mono">{health.version}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Hostname</span>
                  <span className="font-mono">{health.hostname}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Node</span>
                  <span className="font-mono">{health.node}</span>
                </div>
              </div>
            </Card>

            <Card title="Uptime">
              <div className="text-2xl font-mono font-semibold">
                {formatUptime(health.uptime)}
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Since{" "}
                {new Date(
                  Date.now() - health.uptime * 1000
                ).toLocaleString()}
              </p>
            </Card>

            <Card title="Memory">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Usage</span>
                  <span className="font-mono">
                    {health.memory.used}MB / {health.memory.total}MB
                  </span>
                </div>
                <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full transition-all"
                    style={{ width: `${health.memory.percent}%` }}
                  />
                </div>
                <p className="text-xs text-muted-foreground text-right">
                  {health.memory.percent}%
                </p>
              </div>
            </Card>
          </div>
        ) : !error ? (
          <div className="text-center py-12 text-muted-foreground">
            Loading...
          </div>
        ) : null}

        {/* API Quick Reference */}
        <div className="mt-8">
          <Card title="API Endpoints">
            <div className="space-y-2 font-mono text-sm">
              <div className="flex items-center gap-3">
                <span className="px-2 py-0.5 rounded bg-green-500/20 text-green-400 text-xs">
                  GET
                </span>
                <a
                  href="/api/health"
                  className="text-primary hover:underline"
                >
                  /api/health
                </a>
                <span className="text-muted-foreground">
                  — Health check
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="px-2 py-0.5 rounded bg-green-500/20 text-green-400 text-xs">
                  GET
                </span>
                <a
                  href="/api/info"
                  className="text-primary hover:underline"
                >
                  /api/info
                </a>
                <span className="text-muted-foreground">
                  — Service info
                </span>
              </div>
            </div>
          </Card>
        </div>

        {/* CLI Reference */}
        <div className="mt-4">
          <Card title="CLI Commands">
            <div className="space-y-2 font-mono text-sm text-muted-foreground">
              <div>
                <span className="text-foreground">
                  selfhosted-template-cli health
                </span>{" "}
                — Check health
              </div>
              <div>
                <span className="text-foreground">
                  selfhosted-template-cli info
                </span>{" "}
                — Service info
              </div>
              <div>
                <span className="text-foreground">
                  selfhosted-template-cli serve
                </span>{" "}
                — Start API + GUI server
              </div>
            </div>
          </Card>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border mt-8">
        <div className="max-w-5xl mx-auto px-6 py-4 text-xs text-muted-foreground text-center">
          fullstack-selfhosted template • Deployed via Dokploy •
          Tailscale svc:selfhosted-template
        </div>
      </footer>
    </div>
  );
}
