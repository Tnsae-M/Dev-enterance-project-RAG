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


type SignUpFormProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: (user: AuthUser) => void;
};

export function SignUpForm({ open, onOpenChange, onSuccess }: SignUpFormProps) {
  const { toast } = useToast();
  const [name, setName] = useState("");

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"user" | "admin">("user");
  const [adminSecretKey, setAdminSecretKey] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const res = await apiPost<{ status: string; message: string; user?: AuthUser }>(
      "/api/auth/signup",
      {
        name: name.trim(),
        username: username.trim(),
        email: email.trim(),
        password,
        ...(role === "admin" && { role: "admin", admin_secret_key: adminSecretKey }),
      }
    );
    setLoading(false);
    if (!res.ok || res.error) {
      const errorMessage = res.error?.message ?? "Sign up failed.";
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
    setName("");
    setUsername("");
    setEmail("");
    setPassword("");
    setAdminSecretKey("");
    if (res.data?.user) onSuccess?.(res.data.user);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Sign Up</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="signup-name">Name</Label>
            <Input
              id="signup-name"
              value={name}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}

              placeholder="Your name"
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="signup-username">Username</Label>
            <Input
              id="signup-username"
              value={username}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)}

              placeholder="Username"
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="signup-email">Email</Label>
            <Input
              id="signup-email"
              type="email"
              value={email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}

              placeholder="you@example.com"
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="signup-password">Password</Label>
            <Input
              id="signup-password"
              type="password"
              value={password}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}

              placeholder="••••••••"
              required
            />
          </div>
          <div className="grid gap-2">
            <Label>Role</Label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="role"
                  checked={role === "user"}
              onChange={() => setRole("user")}

                />
                User
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="role"
                  checked={role === "admin"}
              onChange={() => setRole("admin")}

                />
                Admin
              </label>
            </div>
          </div>
          {role === "admin" && (
            <div className="grid gap-2">
              <Label htmlFor="signup-admin-key">Admin secret key</Label>
              <Input
                id="signup-admin-key"
                type="password"
                value={adminSecretKey}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAdminSecretKey(e.target.value)}

                placeholder="Admin key"
              />
            </div>
          )}
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
              {loading ? "Signing up…" : "Sign Up"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
