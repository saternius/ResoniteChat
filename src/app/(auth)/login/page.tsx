"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Button, Input } from "@/components/ui";
import { Eye, EyeOff, Lock, User, Shield } from "lucide-react";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [totp, setTotp] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [needsTotp, setNeedsTotp] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { handleLogin } = useAuth();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await handleLogin(
      username,
      password,
      needsTotp ? totp : undefined,
    );

    if (result.needsTotp) {
      setNeedsTotp(true);
      setLoading(false);
      return;
    }

    if (!result.success) {
      setError(result.error || "Login failed");
    }

    setLoading(false);
  };

  return (
    <div className="w-full max-w-md animate-fade-in">
      <div className="glass rounded-2xl p-8 space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <img src="/resonite-logo.png" alt="Resonite" className="h-16 w-16 rounded-2xl mx-auto animate-pulse-glow" />
          <h1 className="font-heading text-3xl font-bold text-text-primary">
            Resonite <span className="text-primary-light">Dash</span>
          </h1>
          <p className="text-sm text-text-muted">
            Sign in with your Resonite account
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 text-sm text-red-400">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={onSubmit} className="space-y-4">
          <Input
            label="Username"
            placeholder="Enter your Resonite username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            icon={<User className="h-4 w-4" />}
            required
            autoComplete="username"
          />

          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1.5">
              Password
            </label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted">
                <Lock className="h-4 w-4" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                className="w-full rounded-lg bg-base-dark border border-surface-border px-4 py-2.5 text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-colors duration-200 pl-10 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center p-0 text-text-muted hover:text-text-secondary"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          {needsTotp && (
            <Input
              label="2FA Code"
              placeholder="Enter your TOTP code"
              value={totp}
              onChange={(e) => setTotp(e.target.value)}
              icon={<Shield className="h-4 w-4" />}
              maxLength={6}
              autoFocus
            />
          )}

          <Button
            type="submit"
            className="w-full"
            size="lg"
            loading={loading}
          >
            {needsTotp ? "Verify & Sign In" : "Sign In"}
          </Button>
        </form>

        <p className="text-center text-xs text-text-muted">
          Don&apos;t have an account?{" "}
          <a
            href="https://resonite.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary-light hover:text-primary underline"
          >
            Create one at resonite.com
          </a>
        </p>
      </div>
    </div>
  );
}
