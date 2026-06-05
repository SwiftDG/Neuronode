import { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import {
  createUserWithEmailAndPassword,
  signInWithPopup,
  updateProfile,
} from "firebase/auth";
import { auth, googleProvider } from "../firebase/config";
import { Brain, Mail, Lock, Eye, EyeOff, User, ArrowRight } from "lucide-react";

export default function SignUpPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    try {
      const result = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );
      await updateProfile(result.user, { displayName: name });
      navigate("/learn");
    } catch (err) {
      setError(getErrorMessage(err.code));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setError("");
    setGoogleLoading(true);
    try {
      await signInWithPopup(auth, googleProvider);
      navigate("/learn");
    } catch (err) {
      setError(getErrorMessage(err.code));
    } finally {
      setGoogleLoading(false);
    }
  };

  const getErrorMessage = (code) => {
    switch (code) {
      case "auth/email-already-in-use":
        return "An account with this email already exists.";
      case "auth/invalid-email":
        return "Invalid email address.";
      case "auth/weak-password":
        return "Password must be at least 6 characters.";
      case "auth/too-many-requests":
        return "Too many attempts. Try again later.";
      default:
        return "Something went wrong. Try again.";
    }
  };

  const passwordStrength = () => {
    if (password.length === 0) return null;
    if (password.length < 6)
      return { label: "Too short", color: "#EF4444", width: "25%" };
    if (password.length < 8)
      return { label: "Weak", color: "#F59E0B", width: "50%" };
    if (!/[A-Z]/.test(password) || !/[0-9]/.test(password))
      return { label: "Fair", color: "#F59E0B", width: "75%" };
    return { label: "Strong", color: "#10B981", width: "100%" };
  };

  const strength = passwordStrength();

  return (
    <div className="min-h-screen bg-[#0B1220] flex items-center justify-center px-6 py-12">
      {/* Background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#8B5CF6] rounded-full blur-3xl opacity-5 pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 justify-center mb-8">
          <div className="w-8 h-8 rounded-lg bg-[#2563EB] flex items-center justify-center">
            <Brain className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold text-white tracking-tight">
            Neuro<span className="text-[#2563EB]">node</span>
          </span>
        </Link>

        {/* Card */}
        <div className="bg-[#111827] border border-white/10 rounded-3xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-white mb-2">
              Start thinking differently
            </h1>
            <p className="text-[#64748B] text-sm">
              Free forever for core features
            </p>
          </div>

          {/* Google Sign Up */}
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            onClick={handleGoogle}
            disabled={googleLoading}
            className="w-full flex items-center justify-center gap-3 bg-white hover:bg-gray-50 text-[#1E2937] font-semibold py-3 rounded-xl transition-all duration-200 mb-6 disabled:opacity-50"
          >
            {googleLoading ? (
              <div className="w-5 h-5 border-2 border-[#1E2937]/20 border-t-[#1E2937] rounded-full animate-spin" />
            ) : (
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
            )}
            Continue with Google
          </motion.button>

          {/* Divider */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-[#64748B] text-xs uppercase tracking-widest">
              or
            </span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          {/* Error */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-[#EF4444]/10 border border-[#EF4444]/30 text-[#EF4444] text-sm px-4 py-3 rounded-xl mb-6"
            >
              {error}
            </motion.div>
          )}

          {/* Form */}
          <form onSubmit={handleSignUp} className="space-y-4">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-[#94A3B8] mb-2">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748B]" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="David Gilbert"
                  className="w-full bg-white/5 border border-white/10 text-white placeholder-[#64748B] rounded-xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:border-[#2563EB] focus:bg-white/10 transition-all duration-200"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-[#94A3B8] mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748B]" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="you@example.com"
                  className="w-full bg-white/5 border border-white/10 text-white placeholder-[#64748B] rounded-xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:border-[#2563EB] focus:bg-white/10 transition-all duration-200"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-[#94A3B8] mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748B]" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full bg-white/5 border border-white/10 text-white placeholder-[#64748B] rounded-xl py-3 pl-10 pr-10 text-sm focus:outline-none focus:border-[#2563EB] focus:bg-white/10 transition-all duration-200"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#64748B] hover:text-white transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>

              {/* Password Strength */}
              {strength && (
                <div className="mt-2">
                  <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                      animate={{ width: strength.width }}
                      transition={{ duration: 0.3 }}
                      className="h-full rounded-full"
                      style={{ backgroundColor: strength.color }}
                    />
                  </div>
                  <p className="text-xs mt-1" style={{ color: strength.color }}>
                    {strength.label}
                  </p>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-[#94A3B8] mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748B]" />
                <input
                  type={showConfirm ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className={`w-full bg-white/5 border text-white placeholder-[#64748B] rounded-xl py-3 pl-10 pr-10 text-sm focus:outline-none focus:bg-white/10 transition-all duration-200 ${
                    confirmPassword && confirmPassword !== password
                      ? "border-[#EF4444]/50 focus:border-[#EF4444]"
                      : confirmPassword && confirmPassword === password
                        ? "border-[#10B981]/50 focus:border-[#10B981]"
                        : "border-white/10 focus:border-[#2563EB]"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#64748B] hover:text-white transition-colors"
                >
                  {showConfirm ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit */}
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              type="submit"
              disabled={loading}
              className="w-full bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-semibold py-3 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Create account
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </motion.button>

            {/* Terms */}
            <p className="text-center text-[#64748B] text-xs">
              By signing up, you agree to our{" "}
              <span className="text-[#2563EB]">Terms of Service</span> and{" "}
              <span className="text-[#2563EB]">Privacy Policy</span>
            </p>
          </form>

          {/* Login link */}
          <p className="text-center text-[#64748B] text-sm mt-6">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-[#2563EB] hover:text-[#1D4ED8] font-semibold transition-colors"
            >
              Sign in
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
