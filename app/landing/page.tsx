"use client";

import { useState } from "react";

export default function LandingPage() {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const endpoint =
      mode === "login" ? "/api/auth/login" : "/api/auth/register";

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.message || "Something went wrong");
        return;
      }

      setMessage(data.message || "Success");

      localStorage.setItem("walkieUser", JSON.stringify(data.user));

      // For now, no JWT. Just redirect after login/register.
      window.location.href = "/dashboard";
    } catch (error) {
      console.error(error);
      setMessage("Network error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-100 via-white to-yellow-100 px-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-8">
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">🐶</div>
          <h1 className="text-3xl font-bold text-gray-900">Walkie Puppie</h1>
          <p className="text-gray-500 mt-2">
            Raise your AR puppy by walking together.
          </p>
        </div>

        <div className="flex bg-gray-100 rounded-full p-1 mb-6">
          <button
            onClick={() => setMode("login")}
            className={`w-1/2 py-2 rounded-full font-medium transition ${
              mode === "login"
                ? "bg-orange-500 text-white shadow"
                : "text-gray-600"
            }`}
          >
            Login
          </button>

          <button
            onClick={() => setMode("register")}
            className={`w-1/2 py-2 rounded-full font-medium transition ${
              mode === "register"
                ? "bg-orange-500 text-white shadow"
                : "text-gray-600"
            }`}
          >
            Register
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>

            <input
              type="email"
              className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-orange-400"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>

            <input
              type="password"
              className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-orange-400"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {message && (
            <p className="text-sm text-center text-gray-700 bg-gray-100 rounded-xl py-2">
              {message}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white font-semibold py-3 rounded-xl transition"
          >
            {loading
              ? "Please wait..."
              : mode === "login"
              ? "Login"
              : "Create Account"}
          </button>
        </form>
      </div>
    </main>
  );
}