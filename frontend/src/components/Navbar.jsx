import { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Brain,
  Menu,
  X,
  ChevronDown,
  LogOut,
  BookOpen,
  Zap,
} from "lucide-react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../firebase/config";

const getAcronym = (name) => {
  if (!name) return "??";
  const parts = name.trim().split(" ");
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  const navLinks = [
    { label: "Learn", path: "/learn" },
    { label: "Test Mode", path: "/test" },
    { label: "Opportunities", path: "/opportunities" },
  ];

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => setUser(u));
    return () => unsub();
  }, []);

  useEffect(() => {
    const handleClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleSignOut = async () => {
    await signOut(auth);
    setDropdownOpen(false);
    navigate("/");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-[#E2E8F0]">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#2563EB] flex items-center justify-center">
            <Brain className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold text-[#1E2937] tracking-tight">
            Neuro<span className="text-[#2563EB]">node</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`text-sm font-medium transition-colors duration-200 hover:text-[#2563EB] ${
                isActive(link.path) ? "text-[#2563EB]" : "text-[#64748B]"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Desktop Auth */}
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 hover:bg-[#F8FAFC] px-3 py-2 rounded-xl transition-all duration-200"
              >
                {/* Acronym Avatar */}
                <div className="w-8 h-8 rounded-full bg-[#2563EB] flex items-center justify-center">
                  <span className="text-white text-xs font-bold">
                    {getAcronym(user.displayName || user.email)}
                  </span>
                </div>
                <span className="text-sm font-medium text-[#1E2937]">
                  {user.displayName?.split(" ")[0] || "User"}
                </span>
                <ChevronDown
                  className={`w-4 h-4 text-[#64748B] transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`}
                />
              </button>

              {/* Dropdown */}
              <AnimatePresence>
                {dropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl border border-[#E2E8F0] shadow-xl shadow-slate-100 overflow-hidden"
                  >
                    {/* User info */}
                    <div className="px-4 py-3 border-b border-[#E2E8F0]">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#2563EB] flex items-center justify-center flex-shrink-0">
                          <span className="text-white text-sm font-bold">
                            {getAcronym(user.displayName || user.email)}
                          </span>
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-[#1E2937] text-sm truncate">
                            {user.displayName || "User"}
                          </p>
                          <p className="text-[#64748B] text-xs truncate">
                            {user.email}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Links */}
                    <div className="p-2">
                      <Link
                        to="/learn"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-[#64748B] hover:bg-[#F8FAFC] hover:text-[#1E2937] transition-all duration-150"
                      >
                        <BookOpen className="w-4 h-4" />
                        Learn Mode
                      </Link>
                      <Link
                        to="/test"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-[#64748B] hover:bg-[#F8FAFC] hover:text-[#1E2937] transition-all duration-150"
                      >
                        <Zap className="w-4 h-4" />
                        Test Mode
                      </Link>
                    </div>

                    {/* Sign out */}
                    <div className="p-2 border-t border-[#E2E8F0]">
                      <button
                        onClick={handleSignOut}
                        className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-[#EF4444] hover:bg-[#FEF2F2] transition-all duration-150"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign out
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <>
              <Link
                to="/login"
                className="text-sm font-medium text-[#64748B] hover:text-[#1E2937] transition-colors duration-200"
              >
                Sign in
              </Link>
              <Link
                to="/signup"
                className="text-sm font-semibold bg-[#2563EB] hover:bg-[#1D4ED8] text-white px-4 py-2 rounded-lg transition-all duration-200 hover:shadow-lg hover:shadow-blue-200"
              >
                Start for free
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-[#64748B]"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t border-[#E2E8F0] px-6 py-4 flex flex-col gap-4"
          >
            {user && (
              <div className="flex items-center gap-3 pb-3 border-b border-[#E2E8F0]">
                <div className="w-9 h-9 rounded-full bg-[#2563EB] flex items-center justify-center">
                  <span className="text-white text-xs font-bold">
                    {getAcronym(user.displayName || user.email)}
                  </span>
                </div>
                <div>
                  <p className="font-semibold text-[#1E2937] text-sm">
                    {user.displayName || "User"}
                  </p>
                  <p className="text-[#64748B] text-xs">{user.email}</p>
                </div>
              </div>
            )}

            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMenuOpen(false)}
                className={`text-sm font-medium ${
                  isActive(link.path) ? "text-[#2563EB]" : "text-[#64748B]"
                }`}
              >
                {link.label}
              </Link>
            ))}

            <hr className="border-[#E2E8F0]" />

            {user ? (
              <button
                onClick={handleSignOut}
                className="text-sm font-medium text-[#EF4444] text-left"
              >
                Sign out
              </button>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setMenuOpen(false)}
                  className="text-sm font-medium text-[#64748B]"
                >
                  Sign in
                </Link>
                <Link
                  to="/signup"
                  onClick={() => setMenuOpen(false)}
                  className="text-sm font-semibold bg-[#2563EB] text-white px-4 py-2 rounded-lg text-center"
                >
                  Start for free
                </Link>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
