import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { LogIn } from "lucide-react";
import { Card } from "../components/ui/Card";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";
import { useToast } from "../components/ui/Toast";

export default function Login() {
  const { addToast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL?.replace(/\/$/, "")}/api/auth/login`,
        {
          email,
          password,
        },
      );
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data));
      addToast("Welcome back! Login successful.", "success");
      if (res.data.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } catch (err) {
      console.error(err);
      const statusCode = err.response?.status;
      const serverMsg = err.response?.data?.message;
      const displayMsg =
        serverMsg === "Invalid email or password"
          ? "Incorrect email or password."
          : statusCode === 503
            ? "Service unavailable. Please try again later."
            : "Sorry, login failed. Please try again.";

      setError(displayMsg);
      addToast(displayMsg, "error");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-bg">
      <div className="w-full max-w-md">
        <Card className="shadow-lg border-border/50">
          <div className="text-center mb-8">
            <div className="inline-flex p-3.5 rounded-full bg-primary/10 text-primary mb-4">
              <LogIn size={28} />
            </div>
            <h2 className="text-2xl font-bold text-text-primary">
              Welcome Back
            </h2>
            <p className="text-text-secondary mt-1 text-sm">
              Sign in to your account
            </p>
          </div>

          <form onSubmit={handleLogin} className="flex flex-col">
            {error && (
              <div className="p-3 bg-error/10 text-error rounded-md mb-6 text-sm font-medium border border-error/20">
                {error}
              </div>
            )}

            <Input
              label="Email Address"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <Button type="submit" fullWidth className="mt-2 text-base py-3">
              Sign In
            </Button>

            <div className="text-center mt-8 text-sm">
              <span className="text-text-secondary">
                Don't have an account?{" "}
              </span>
              <Link
                to="/register"
                className="text-primary font-semibold hover:underline"
              >
                Create one
              </Link>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
