import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import {
  ChevronRight,
  Lightbulb,
  RotateCcw,
  ArrowLeft,
  CheckCircle,
  Circle,
  Zap,
} from "lucide-react";

const categoryColors = {
  arrays: { color: "#2563EB", bg: "#EFF6FF", label: "Arrays" },
  hashmaps: { color: "#8B5CF6", bg: "#F5F3FF", label: "Hashmaps" },
  strings: { color: "#14B8A6", bg: "#F0FDFA", label: "Strings" },
  "two-pointers": { color: "#F59E0B", bg: "#FFFBEB", label: "Two Pointers" },
};

const difficultyConfig = {
  Easy: { color: "#10B981", bg: "#ECFDF5" },
  Medium: { color: "#F59E0B", bg: "#FFFBEB" },
  Hard: { color: "#EF4444", bg: "#FEF2F2" },
};

export default function LearnPage() {
  const [problems, setProblems] = useState([]);
  const [selected, setSelected] = useState(null);
  const [hintLevel, setHintLevel] = useState(0);
  const [hints, setHints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hintLoading, setHintLoading] = useState(false);
  const [completed, setCompleted] = useState([]);
  const [mobileView, setMobileView] = useState("list");

  useEffect(() => {
    axios
      .get("/api/problems")
      .then((res) => setProblems(Array.isArray(res.data) ? res.data : []))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const saved = JSON.parse(
      localStorage.getItem("neuronode_completed") || "[]",
    );
    setCompleted(saved);
  }, []);

  const selectProblem = (problem) => {
    setSelected(problem);
    setHintLevel(0);
    setHints([]);
    setMobileView("detail");
  };

  const getHint = async () => {
    if (!selected) return;
    setHintLoading(true);
    try {
      const res = await axios.post("/api/hint", {
        problemId: selected.id,
        hintLevel,
      });
      setHints([...hints, res.data.hint]);
      setHintLevel(hintLevel + 1);
    } catch (err) {
      console.error(err);
    } finally {
      setHintLoading(false);
    }
  };

  const markComplete = () => {
    if (!selected) return;
    const updated = completed.includes(selected.id)
      ? completed.filter((id) => id !== selected.id)
      : [...completed, selected.id];
    setCompleted(updated);
    localStorage.setItem("neuronode_completed", JSON.stringify(updated));
  };

  const reset = () => {
    setHintLevel(0);
    setHints([]);
  };

  const isCompleted = (id) => completed.includes(id);

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col">
      <Navbar />

      <div className="flex-1 pt-20">
        {/* Page Header */}
        <div className="bg-white border-b border-[#E2E8F0] px-6 py-6">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-[#1E2937] tracking-tight">
                Learn Mode
              </h1>
              <p className="text-[#64748B] text-sm mt-1">
                {problems.length} problems · {completed.length} completed
              </p>
            </div>
            <Link
              to="/test"
              className="flex items-center gap-2 bg-[#0B1220] text-white text-sm font-semibold px-4 py-2 rounded-xl hover:bg-[#1E2937] transition-all duration-200"
            >
              <Zap className="w-4 h-4" />
              Switch to Test Mode
            </Link>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
            {/* Problems List */}
            <div
              className={`lg:block ${mobileView === "detail" ? "hidden" : "block"}`}
            >
              <div className="bg-white rounded-2xl border border-[#E2E8F0] overflow-hidden">
                <div className="px-4 py-3 border-b border-[#E2E8F0] bg-[#F8FAFC]">
                  <p className="text-xs font-semibold text-[#64748B] uppercase tracking-widest">
                    Problems ({problems.length})
                  </p>
                </div>

                {loading ? (
                  <div className="p-6 space-y-3">
                    {[...Array(5)].map((_, i) => (
                      <div
                        key={i}
                        className="h-16 bg-[#F8FAFC] rounded-xl animate-pulse"
                      />
                    ))}
                  </div>
                ) : (
                  <div className="divide-y divide-[#F1F5F9]">
                    {problems.map((problem) => {
                      const cat =
                        categoryColors[problem.category] ||
                        categoryColors.arrays;
                      const diff =
                        difficultyConfig[problem.difficulty] ||
                        difficultyConfig.Easy;
                      const done = isCompleted(problem.id);
                      return (
                        <motion.button
                          key={problem.id}
                          onClick={() => selectProblem(problem)}
                          whileHover={{ backgroundColor: "#F8FAFC" }}
                          className={`w-full text-left px-4 py-4 transition-all duration-150 ${
                            selected?.id === problem.id
                              ? "bg-[#EFF6FF] border-l-2 border-[#2563EB]"
                              : "bg-white border-l-2 border-transparent"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            {/* Complete indicator */}
                            <div className="flex-shrink-0">
                              {done ? (
                                <CheckCircle className="w-4 h-4 text-[#10B981]" />
                              ) : (
                                <Circle className="w-4 h-4 text-[#E2E8F0]" />
                              )}
                            </div>

                            {/* Problem info */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-mono text-xs text-[#94A3B8]">
                                  #{String(problem.id).padStart(2, "0")}
                                </span>
                                <span
                                  className="text-xs px-2 py-0.5 rounded-full font-medium"
                                  style={{
                                    backgroundColor: diff.bg,
                                    color: diff.color,
                                  }}
                                >
                                  {problem.difficulty || "Easy"}
                                </span>
                              </div>
                              <p className="font-semibold text-[#1E2937] text-sm truncate">
                                {problem.title}
                              </p>
                              <span
                                className="text-xs px-2 py-0.5 rounded-full font-medium mt-1 inline-block"
                                style={{
                                  backgroundColor: cat.bg,
                                  color: cat.color,
                                }}
                              >
                                {cat.label}
                              </span>
                            </div>

                            <ChevronRight className="w-4 h-4 text-[#94A3B8] flex-shrink-0" />
                          </div>
                        </motion.button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Problem Detail */}
            <div
              className={`lg:col-span-2 lg:block ${mobileView === "list" ? "hidden" : "block"}`}
            >
              {/* Mobile back button */}
              <button
                onClick={() => setMobileView("list")}
                className="lg:hidden flex items-center gap-2 text-[#64748B] text-sm mb-4"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to problems
              </button>

              {!selected ? (
                <div className="bg-white rounded-2xl border border-[#E2E8F0] h-96 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-[#EFF6FF] rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <Lightbulb className="w-8 h-8 text-[#2563EB]" />
                    </div>
                    <p className="text-[#1E2937] font-semibold mb-2">
                      Select a problem to start
                    </p>
                    <p className="text-[#64748B] text-sm">
                      Choose from the list on the left
                    </p>
                  </div>
                </div>
              ) : (
                <AnimatePresence mode="wait">
                  <motion.div
                    key={selected.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-4"
                  >
                    {/* Problem Header Card */}
                    <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6">
                      <div className="flex items-start justify-between gap-4 mb-4">
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <span className="font-mono text-xs text-[#94A3B8]">
                              #{String(selected.id).padStart(2, "0")}
                            </span>
                            <span
                              className="text-xs px-2 py-0.5 rounded-full font-medium"
                              style={{
                                backgroundColor: (
                                  difficultyConfig[selected.difficulty] ||
                                  difficultyConfig.Easy
                                ).bg,
                                color: (
                                  difficultyConfig[selected.difficulty] ||
                                  difficultyConfig.Easy
                                ).color,
                              }}
                            >
                              {selected.difficulty || "Easy"}
                            </span>
                            <span
                              className="text-xs px-2 py-0.5 rounded-full font-medium"
                              style={{
                                backgroundColor: (
                                  categoryColors[selected.category] ||
                                  categoryColors.arrays
                                ).bg,
                                color: (
                                  categoryColors[selected.category] ||
                                  categoryColors.arrays
                                ).color,
                              }}
                            >
                              {
                                (
                                  categoryColors[selected.category] ||
                                  categoryColors.arrays
                                ).label
                              }
                            </span>
                          </div>
                          <h2 className="text-2xl font-bold text-[#1E2937] tracking-tight">
                            {selected.title}
                          </h2>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <button
                            onClick={reset}
                            className="w-9 h-9 rounded-xl border border-[#E2E8F0] flex items-center justify-center text-[#64748B] hover:border-[#2563EB] hover:text-[#2563EB] transition-all duration-200"
                            title="Reset hints"
                          >
                            <RotateCcw className="w-4 h-4" />
                          </button>
                          <button
                            onClick={markComplete}
                            className={`flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-xl transition-all duration-200 ${
                              isCompleted(selected.id)
                                ? "bg-[#ECFDF5] text-[#10B981] border border-[#10B981]/30"
                                : "bg-[#F8FAFC] text-[#64748B] border border-[#E2E8F0] hover:border-[#10B981] hover:text-[#10B981]"
                            }`}
                          >
                            <CheckCircle className="w-4 h-4" />
                            {isCompleted(selected.id)
                              ? "Completed"
                              : "Mark Complete"}
                          </button>
                        </div>
                      </div>

                      {/* Description */}
                      <div className="bg-[#F8FAFC] rounded-xl p-4 border border-[#E2E8F0]">
                        <p className="text-[#1E2937] leading-relaxed">
                          {selected.description}
                        </p>
                      </div>
                    </div>

                    {/* Hints Card */}
                    <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6">
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-2">
                          <Lightbulb className="w-5 h-5 text-[#2563EB]" />
                          <h3 className="font-semibold text-[#1E2937]">
                            Socratic Hints
                          </h3>
                        </div>
                        <span className="text-xs text-[#94A3B8] font-mono">
                          {hintLevel}/{selected.hints?.length || 3} revealed
                        </span>
                      </div>

                      {/* Revealed hints */}
                      {hints.length === 0 ? (
                        <div className="text-center py-8">
                          <p className="text-[#64748B] text-sm mb-2">
                            Try the problem yourself first.
                          </p>
                          <p className="text-[#94A3B8] text-xs">
                            Hints are here when you need them — not before.
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-3 mb-6">
                          {hints.map((hint, i) => (
                            <motion.div
                              key={i}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.3 }}
                              className={`flex items-start gap-3 p-4 rounded-xl ${
                                i === hints.length - 1
                                  ? "bg-[#EFF6FF] border border-[#2563EB]/20"
                                  : "bg-[#F8FAFC]"
                              }`}
                            >
                              <span className="text-xs font-mono font-bold text-[#2563EB] flex-shrink-0 mt-0.5">
                                {String(i + 1).padStart(2, "0")}
                              </span>
                              <p className="text-[#1E2937] text-sm leading-relaxed">
                                {hint}
                              </p>
                            </motion.div>
                          ))}
                        </div>
                      )}

                      {/* Get Hint Button */}
                      {hintLevel < (selected.hints?.length || 3) ? (
                        <motion.button
                          whileHover={{ scale: 1.01 }}
                          whileTap={{ scale: 0.99 }}
                          onClick={getHint}
                          disabled={hintLoading}
                          className="w-full py-3 bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-semibold rounded-xl transition-all duration-200 disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                          <Lightbulb className="w-4 h-4" />
                          {hintLoading
                            ? "Getting hint..."
                            : hints.length === 0
                              ? "Get First Hint"
                              : `Get Next Hint (${hintLevel + 1}/${selected.hints?.length || 3})`}
                        </motion.button>
                      ) : (
                        <div className="w-full py-3 bg-[#ECFDF5] border border-[#10B981]/30 text-[#10B981] font-semibold rounded-xl text-center text-sm">
                          ✓ All hints revealed — now solve it
                        </div>
                      )}
                    </div>
                  </motion.div>
                </AnimatePresence>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
