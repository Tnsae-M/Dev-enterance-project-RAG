"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { apiPost } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import type { AuthUser } from "@/contexts/auth-context";


type LoginFormProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: (user: AuthUser) => void;
};

export function LoginForm({ open, onOpenChange, onSuccess }: LoginFormProps) {
  const { toast } = useToast();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);


  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const value = identifier.trim();
    const isEmail = value.includes("@");
    const body = isEmail
      ? { email: value, username: value, password }
      : { username: value, password };
    const res = await apiPost<{ status: string; message: string; user: AuthUser }>(
      "/api/auth/signin",
      body
    );
    setLoading(false);
    if (!res.ok || res.error) {
      const errorMessage = res.error?.message ?? "Login failed.";
      setError(errorMessage);
      if (res.status === 0) {
        toast({
          variant: "destructive",
          title: "Server Error",
          description: errorMessage,
        });
      }
      return;
    }

    onOpenChange(false);
    setIdentifier("");
    setPassword("");
    if (res.data?.user) onSuccess?.(res.data.user);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Log in</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="login-identifier">Email or username</Label>
            <Input
              id="login-identifier"
              type="text"
              autoComplete="username"
              value={identifier}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setIdentifier(e.target.value)}

              placeholder="Email or username"
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="login-password">Password</Label>
            <Input
              id="login-password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}

              placeholder="••••••••"
              required
            />
          </div>
          {error && (
            <p className="text-sm text-destructive" role="alert">
              {error}
            </p>
          )}
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Signing in…" : "Log in"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
