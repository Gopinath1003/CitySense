import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock, User } from "lucide-react";

const LoginPage = () => {
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!login(username, password)) {
      setError("Invalid credentials. Use admin / admin123");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center grid-bg bg-background">
      <div className="w-full max-w-md p-8">
        <div className="flex flex-col items-center mb-8">
          <img
            src="/citysense-logo.jpeg"
            alt="CitySense Logo"
            className="h-28 w-28 object-contain mb-3 drop-shadow-md"
          />
          <h1 className="text-2xl font-bold text-slate-800">SmartCity Monitor</h1>
          <p className="text-slate-500 text-sm mt-1">Infrastructure Capacity &amp; Utilization System</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-5 bg-white border border-slate-200 rounded-2xl p-7 card-shadow"
        >
          <div className="space-y-2">
            <Label htmlFor="username" className="text-slate-500 text-xs uppercase tracking-wider font-semibold">
              Username
            </Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                id="username"
                value={username}
                onChange={e => setUsername(e.target.value)}
                placeholder="admin"
                className="pl-10 bg-slate-50 border-slate-200 text-slate-800 placeholder:text-slate-400 focus:border-blue-400 focus:ring-blue-100"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-slate-500 text-xs uppercase tracking-wider font-semibold">
              Password
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                id="password"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••"
                className="pl-10 bg-slate-50 border-slate-200 text-slate-800 placeholder:text-slate-400 focus:border-blue-400 focus:ring-blue-100"
              />
            </div>
          </div>

          {error && (
            <p className="text-red-500 text-sm bg-red-50 border border-red-200 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          <Button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg transition-all"
          >
            Sign In
          </Button>

          <p className="text-center text-xs text-slate-400 mt-4">
            Demo: <span className="font-mono text-blue-600 font-semibold">admin</span> /{" "}
            <span className="font-mono text-blue-600 font-semibold">admin123</span>
          </p>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
