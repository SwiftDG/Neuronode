import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Brain, Menu, X } from "lucide-react";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { label: "Learn", path: "/learn" },
    { label: "Test Mode", path: "/test" },
    { label: "Opportunities", path: "/opportunities" },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-[#E2E8F0]">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
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
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-[#64748B] hover:text-[#1E2937]"
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
            transition={{ duration: 0.2 }}
            className="md:hidden bg-white border-t border-[#E2E8F0] px-6 py-4 flex flex-col gap-4"
          >
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMenuOpen(false)}
                className={`text-sm font-medium transition-colors ${
                  isActive(link.path) ? "text-[#2563EB]" : "text-[#64748B]"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <hr className="border-[#E2E8F0]" />
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
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
