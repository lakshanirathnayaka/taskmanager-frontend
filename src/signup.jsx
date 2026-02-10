import { useState } from "react";
import { User, Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";
import Card from "./card";


function Signup({ onSwitchToLogin, onLoginSuccess }) {
  const [formData, setFormData] = useState({
    user_name: "",
    email: "",
    password: "",
  });
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

    if (formData.user_name.trim().length < 5) {
      setError("Username must be at least 5 characters long");
      setLoading(false);
      return;
    }
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setError("Please enter a valid email address");
      setLoading(false);
      return;
    }
    if (formData.password.length < 10) {
      setError("Password must be at least 10 characters long");
      setLoading(false);
      return;
    }
    if (!/[A-Z]/.test(formData.password)) {
      setError("Password must contain at least one capital letter");
      setLoading(false);
      return;
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(formData.password)) {
      setError("Password must contain at least one symbol");
      setLoading(false);
      return;
    }

    try {
      // Assuming the backend has a /signup endpoint
      const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const contentType = res.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          const errorData = await res.json();
          throw new Error(errorData.error || "Failed to sign up");
        } else {
          throw new Error("Failed to sign up");
        }
      }

      alert("Sign up successful!");
      setFormData({ user_name: "", email: "", password: "" });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  


  return (
    <div className="min-h-screen flex items-center justify-center sm:px-6 lg:px-8">
      <Card className="w-full max-w-md min-h-screen sm:min-h-0">
        
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="bg-blue-600 text-white p-4 rounded-full">
            <ArrowRight className="w-6 h-6" />
          </div>
        </div>

        <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-900">Create Account</h2>
        <p className="text-center text-sm text-gray-500 mb-8">
          Sign up to get started
        </p>

        {error && (
          <p className="text-red-500 text-sm text-center mb-4">{error}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* Username */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 text-left">Username</label>
            <div className="relative mt-2">
              <User className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
              <input
                type="text"
                name="user_name"
                value={formData.user_name}
                onChange={handleChange}
                placeholder="Enter your username"
                className="w-full pl-10 pr-3 py-2.5 rounded-lg bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white text-gray-900 text-sm placeholder:text-xs"
                required
              />
            </div>
          </div>

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
                placeholder="Create a password"
                className="w-full pl-10 pr-10 py-2.5 rounded-lg bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white text-gray-900 text-sm placeholder:text-xs"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 focus:outline-none"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          {/* Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg bg-black text-white font-semibold hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
          >
            {loading ? "Signing up..." : "Sign Up"}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center my-6">
          <div className="flex-grow border-t border-gray-200" />
          <span className="mx-4 text-sm text-gray-400">Or continue with</span>
          <div className="flex-grow border-t border-gray-200" />
        </div>

        

        {/* Footer */}
        <p className="text-center text-sm mt-8 text-gray-600">
          Already have an account?{" "}
          <button
            type="button"
            onClick={() => {
              onSwitchToLogin();
            }}
            className="text-blue-600 font-semibold hover:underline bg-transparent border-none cursor-pointer p-0"
          >
            Log in
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

export default Signup;