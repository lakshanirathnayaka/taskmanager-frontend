import { useState } from "react";
import { Mail, Lock, Eye, EyeOff, ArrowRight, ArrowLeft } from "lucide-react";
import Card from "./card";


function Login({ onLoginSuccess, onSwitchToSignup }) {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to login");
      }

      const data = await res.json();
      alert("Login successful!");
      onLoginSuccess?.({ ...data.user, token: data.token });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  

  const handleResetSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (newPassword !== confirmNewPassword) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/reset-password`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: resetEmail, new_password: newPassword }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to reset password");
      }

      alert("Password reset successful! Please login with your new password.");
      setIsForgotPassword(false);
      setResetEmail("");
      setNewPassword("");
      setConfirmNewPassword("");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
  <div className="min-h-screen flex items-center justify-center bg-blue-50 px-4 sm:px-6 lg:px-8 py-12">
      <Card className="w-full max-w-md">
        
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="bg-blue-600 text-white p-4 rounded-full">
            <ArrowRight className="w-6 h-6" />
          </div>
        </div>

        <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-900">
          {isForgotPassword ? "Reset Password" : "Task Manager"}
        </h2>
        <p className="text-center text-sm text-gray-500 mb-8">
          {isForgotPassword
            ? "Enter your email and new password"
            : "Sign in to continue to your account"}
        </p>

        {error && (
          <p className="text-red-500 text-sm text-center mb-4">{error}</p>
        )}

        {isForgotPassword ? (
          <form onSubmit={handleResetSubmit} className="space-y-5">
            {/* Reset Email */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 text-left">Email Address</label>
              <div className="relative mt-2">
                <Mail className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                <input
                  type="email"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full pl-10 pr-3 py-2.5 rounded-lg bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white text-gray-900 text-sm placeholder:text-xs"
                  required
                />
              </div>
            </div>

            {/* New Password */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 text-left">New Password</label>
              <div className="relative mt-2">
                <Lock className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                  className="w-full pl-10 pr-10 py-2.5 rounded-lg bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white text-gray-900 text-sm placeholder:text-xs"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 focus:outline-none"
                >
                  {showPassword ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Confirm New Password */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 text-left">Confirm New Password</label>
              <div className="relative mt-2">
                <Lock className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  placeholder="Confirm new password"
                  className="w-full pl-10 pr-10 py-2.5 rounded-lg bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white text-gray-900 text-sm placeholder:text-xs"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 focus:outline-none"
                >
                  {showPassword ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg bg-black text-white font-semibold hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              {loading ? "Resetting..." : "Reset Password"}
            </button>

            <button
              type="button"
              onClick={() => setIsForgotPassword(false)}
              className="w-full flex items-center justify-center gap-2 text-sm text-gray-600 hover:text-gray-900 font-medium"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Login
            </button>
          </form>
        ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* Email */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 text-left">Email Address</label>
            <div className="relative mt-2">
              <Mail className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                className="w-full pl-10 pr-3 py-2.5 rounded-lg bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white text-gray-900 text-sm placeholder:text-xs"
                required
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 text-left">Password</label>
            <div className="relative mt-2">
              <Lock className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                className="w-full pl-10 pr-10 py-2.5 rounded-lg bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white text-gray-900 text-sm placeholder:text-xs"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 focus:outline-none"
              >
                {showPassword ? (
                  <Eye className="w-5 h-5" />
                ) : (
                  <EyeOff className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          {/* Remember & Forgot */}
          <div className="flex justify-between items-center text-sm">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" className="rounded w-4 h-4" />
              <span className="text-gray-900">Remember me</span>
            </label>
            <button
              type="button"
              onClick={() => {
                setResetEmail(formData.email);
                setIsForgotPassword(true);
              }}
              className="text-blue-600 hover:underline font-medium bg-transparent border-none cursor-pointer p-0"
            >
              Forgot password?
            </button>
          </div>

          {/* Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg bg-black text-white font-semibold hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
        )}

        {/* Footer */}
        <p className="text-center text-sm mt-8 text-gray-600">
          Don't have an account?{" "}
          <button
            type="button"
            onClick={() => {
              onSwitchToSignup();
            }}
            className="text-blue-600 font-semibold hover:underline bg-transparent border-none cursor-pointer p-0"
          >
            Sign up
          </button>
        </p>

        {/* Copyright */}
        <p className="text-center text-xs text-gray-400 mt-6">
          © 2026 Task App. All rights reserved.
        </p>
      </Card>
    </div>
  );
}

export default Login;