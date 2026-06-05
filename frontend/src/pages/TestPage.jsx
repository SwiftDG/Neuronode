import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import {
  Timer,
  ArrowLeft,
  ChevronRight,
  Circle,
  CheckCircle,
  XCircle,
  Zap,
  BookOpen,
  RotateCcw,
  Trophy,
} from "lucide-react";

const difficultyConfig = {
  Easy: { color: "#10B981", bg: "#ECFDF5" },
  Medium: { color: "#F59E0B", bg: "#FFFBEB" },
  Hard: { color: "#EF4444", bg: "#FEF2F2" },
};

const categoryColors = {
  arrays: { color: "#2563EB", bg: "#EFF6FF", label: "Arrays" },
  hashmaps: { color: "#8B5CF6", bg: "#F5F3FF", label: "Hashmaps" },
  strings: { color: "#14B8A6", bg: "#F0FDFA", label: "Strings" },
};

const TIME_LIMIT = 15 * 60; // 15 minutes in seconds

export default function TestPage() {
  const [problems, setProblems] = useState([]);
  const [selected, setSelected] = useState(null);
  const [phase, setPhase] = useState("list"); // list | attempt | revealed
  const [timeLeft, setTimeLeft] = useState(TIME_LIMIT);
  const [timerActive, setTimerActive] = useState(false);
  const [results, setResults] = useState({}); // { problemId: 'solved' | 'failed' }
  const [mobileView, setMobileView] = useState("list");
  const timerRef = useRef(null);

  useEffect(() => {
    axios
      .get("/api/problems")
      .then((res) => setProblems(Array.isArray(res.data) ? res.data : []))
      .catch((err) => console.error(err));
  }, []);

  useEffect(() => {
    if (timerActive && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            setTimerActive(false);
            setPhase("revealed");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [timerActive]);

  const selectProblem = (problem) => {
    setSelected(problem);
    setPhase("attempt");
    setTimeLeft(TIME_LIMIT);
    setTimerActive(true);
    setMobileView("detail");
  };

  const revealSolution = (outcome) => {
    clearInterval(timerRef.current);
    setTimerActive(false);
    setResults((prev) => ({ ...prev, [selected.id]: outcome }));
    setPhase("revealed");
  };

  const resetProblem = () => {
    setPhase("list");
    setSelected(null);
    setTimeLeft(TIME_LIMIT);
    setTimerActive(false);
    setMobileView("list");
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  const getTimerColor = () => {
    if (timeLeft > 300) return "#10B981";
    if (timeLeft > 120) return "#F59E0B";
    return "#EF4444";
  };

  const solvedCount = Object.values(results).filter(
    (r) => r === "solved",
  ).length;
  const failedCount = Object.values(results).filter(
    (r) => r === "failed",
  ).length;

  return (
    <div className="min-h-screen bg-[#0B1220] flex flex-col">
      <Navbar />

      <div className="flex-1 pt-20">
        {/* Page Header */}
        <div className="bg-[#111827] border-b border-white/10 px-6 py-6">
          <div className="max-w-7xl mx-auto flex items-center justify-between flex-wrap gap-4">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <Zap className="w-5 h-5 text-[#14B8A6]" />
                <h1 className="text-2xl font-bold text-white tracking-tight">
                  Test Mode
                </h1>
              </div>
              <p className="text-[#64748B] text-sm">
                No hints. No shortcuts. Pure pattern recognition.
              </p>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-[#10B981]" />
                <span className="text-white font-semibold">{solvedCount}</span>
                <span className="text-[#64748B] text-sm">solved</span>
              </div>
              <div className="w-px h-4 bg-white/10" />
              <div className="flex items-center gap-2">
                <XCircle className="w-4 h-4 text-[#EF4444]" />
                <span className="text-white font-semibold">{failedCount}</span>
                <span className="text-[#64748B] text-sm">failed</span>
              </div>
              <div className="w-px h-4 bg-white/10" />
              <Link
                to="/learn"
                className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-all duration-200"
              >
                <BookOpen className="w-4 h-4" />
                Switch to Learn
              </Link>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Problems List */}
            <div
              className={`lg:block ${mobileView === "detail" ? "hidden" : "block"}`}
            >
              <div className="bg-[#111827] rounded-2xl border border-white/10 overflow-hidden">
                <div className="px-4 py-3 border-b border-white/10">
                  <p className="text-xs font-semibold text-[#64748B] uppercase tracking-widest">
                    Problems ({problems.length})
                  </p>
                </div>

                <div className="divide-y divide-white/5">
                  {problems.map((problem) => {
                    const diff =
                      difficultyConfig[problem.difficulty] ||
                      difficultyConfig.Easy;
                    const result = results[problem.id];
                    return (
                      <motion.button
                        key={problem.id}
                        onClick={() => selectProblem(problem)}
                        whileHover={{
                          backgroundColor: "rgba(255,255,255,0.05)",
                        }}
                        className={`w-full text-left px-4 py-4 transition-all duration-150 ${
                          selected?.id === problem.id
                            ? "bg-white/10 border-l-2 border-[#14B8A6]"
                            : "border-l-2 border-transparent"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          {/* Result indicator */}
                          <div className="flex-shrink-0">
                            {result === "solved" ? (
                              <CheckCircle className="w-4 h-4 text-[#10B981]" />
                            ) : result === "failed" ? (
                              <XCircle className="w-4 h-4 text-[#EF4444]" />
                            ) : (
                              <Circle className="w-4 h-4 text-white/20" />
                            )}
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-mono text-xs text-[#64748B]">
                                #{String(problem.id).padStart(2, "0")}
                              </span>
                              <span
                                className="text-xs px-2 py-0.5 rounded-full font-medium"
                                style={{
                                  backgroundColor: `${diff.color}20`,
                                  color: diff.color,
                                }}
                              >
                                {problem.difficulty || "Easy"}
                              </span>
                            </div>
                            <p className="font-semibold text-white text-sm truncate">
                              {problem.title}
                            </p>
                          </div>

                          <ChevronRight className="w-4 h-4 text-white/20 flex-shrink-0" />
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Problem Detail */}
            <div
              className={`lg:col-span-2 lg:block ${mobileView === "list" ? "hidden" : "block"}`}
            >
              {/* Mobile back */}
              <button
                onClick={() => setMobileView("list")}
                className="lg:hidden flex items-center gap-2 text-[#64748B] text-sm mb-4"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to problems
              </button>

              {phase === "list" && (
                <div className="bg-[#111827] rounded-2xl border border-white/10 h-96 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <Zap className="w-8 h-8 text-[#14B8A6]" />
                    </div>
                    <p className="text-white font-semibold mb-2">
                      Select a problem to begin
                    </p>
                    <p className="text-[#64748B] text-sm">
                      Timer starts when you select a problem
                    </p>
                  </div>
                </div>
              )}

              {(phase === "attempt" || phase === "revealed") && selected && (
                <AnimatePresence mode="wait">
                  <motion.div
                    key={selected.id + phase}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="space-y-4"
                  >
                    {/* Timer Bar */}
                    {phase === "attempt" && (
                      <div className="bg-[#111827] rounded-2xl border border-white/10 p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <Timer
                              className="w-4 h-4"
                              style={{ color: getTimerColor() }}
                            />
                            <span className="text-white/60 text-sm">
                              Time remaining
                            </span>
                          </div>
                          <motion.span
                            animate={{
                              opacity: timeLeft <= 60 ? [1, 0.3, 1] : 1,
                            }}
                            transition={{ duration: 0.5, repeat: Infinity }}
                            className="font-mono font-bold text-xl"
                            style={{ color: getTimerColor() }}
                          >
                            {formatTime(timeLeft)}
                          </motion.span>
                        </div>
                        <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                          <motion.div
                            className="h-full rounded-full transition-all duration-1000"
                            style={{
                              width: `${(timeLeft / TIME_LIMIT) * 100}%`,
                              backgroundColor: getTimerColor(),
                            }}
                          />
                        </div>
                      </div>
                    )}

                    {/* Problem Card */}
                    <div className="bg-[#111827] rounded-2xl border border-white/10 p-6">
                      <div className="flex items-start justify-between gap-4 mb-4">
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <span className="font-mono text-xs text-[#64748B]">
                              #{String(selected.id).padStart(2, "0")}
                            </span>
                            <span
                              className="text-xs px-2 py-0.5 rounded-full font-medium"
                              style={{
                                backgroundColor: `${(difficultyConfig[selected.difficulty] || difficultyConfig.Easy).color}20`,
                                color: (
                                  difficultyConfig[selected.difficulty] ||
                                  difficultyConfig.Easy
                                ).color,
                              }}
                            >
                              {selected.difficulty || "Easy"}
                            </span>
                          </div>
                          <h2 className="text-2xl font-bold text-white tracking-tight">
                            {selected.title}
                          </h2>
                        </div>

                        <button
                          onClick={resetProblem}
                          className="w-9 h-9 rounded-xl border border-white/10 flex items-center justify-center text-[#64748B] hover:border-white/30 hover:text-white transition-all"
                        >
                          <RotateCcw className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                        <p className="text-white/80 leading-relaxed">
                          {selected.description}
                        </p>
                      </div>

                      {/* No hints warning */}
                      {phase === "attempt" && (
                        <div className="mt-4 flex items-center gap-2 text-[#64748B] text-sm">
                          <Zap className="w-4 h-4 text-[#F59E0B]" />
                          Test Mode — no hints available. Solve it yourself.
                        </div>
                      )}
                    </div>

                    {/* Action Buttons (attempt phase) */}
                    {phase === "attempt" && (
                      <div className="grid grid-cols-2 gap-4">
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => revealSolution("solved")}
                          className="py-4 bg-[#10B981] hover:bg-[#059669] text-white font-bold rounded-2xl transition-all duration-200 flex items-center justify-center gap-2"
                        >
                          <CheckCircle className="w-5 h-5" />I Solved It
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => revealSolution("failed")}
                          className="py-4 bg-white/10 hover:bg-white/20 text-white font-bold rounded-2xl transition-all duration-200 flex items-center justify-center gap-2 border border-white/10"
                        >
                          <BookOpen className="w-5 h-5" />
                          Show Solution
                        </motion.button>
                      </div>
                    )}

                    {/* Solution Reveal */}
                    {phase === "revealed" && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-4"
                      >
                        {/* Result Banner */}
                        <div
                          className="rounded-2xl p-4 border flex items-center gap-3"
                          style={{
                            backgroundColor:
                              results[selected.id] === "solved"
                                ? "#10B98115"
                                : "#EF444415",
                            borderColor:
                              results[selected.id] === "solved"
                                ? "#10B98130"
                                : "#EF444430",
                          }}
                        >
                          {results[selected.id] === "solved" ? (
                            <Trophy className="w-5 h-5 text-[#10B981]" />
                          ) : (
                            <BookOpen className="w-5 h-5 text-[#EF4444]" />
                          )}
                          <div>
                            <p
                              className="font-semibold"
                              style={{
                                color:
                                  results[selected.id] === "solved"
                                    ? "#10B981"
                                    : "#EF4444",
                              }}
                            >
                              {results[selected.id] === "solved"
                                ? "Pattern mastered! You solved it."
                                : "Study the solution — recognize this pattern next time."}
                            </p>
                          </div>
                        </div>

                        {/* Hints as Solution */}
                        <div className="bg-[#111827] rounded-2xl border border-white/10 p-6">
                          <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                            <BookOpen className="w-4 h-4 text-[#14B8A6]" />
                            Solution Walkthrough
                          </h3>
                          <div className="space-y-3">
                            {selected.hints?.map((hint, i) => (
                              <motion.div
                                key={i}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="flex items-start gap-3 p-3 bg-white/5 rounded-xl"
                              >
                                <span className="text-xs font-mono font-bold text-[#14B8A6] flex-shrink-0 mt-0.5">
                                  {String(i + 1).padStart(2, "0")}
                                </span>
                                <p className="text-white/70 text-sm leading-relaxed">
                                  {hint}
                                </p>
                              </motion.div>
                            ))}
                          </div>
                        </div>

                        {/* Next actions */}
                        <div className="grid grid-cols-2 gap-4">
                          <button
                            onClick={resetProblem}
                            className="py-3 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl transition-all duration-200 flex items-center justify-center gap-2"
                          >
                            <RotateCcw className="w-4 h-4" />
                            Next Problem
                          </button>
                          <Link
                            to="/learn"
                            className="py-3 bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-semibold rounded-xl transition-all duration-200 flex items-center justify-center gap-2"
                          >
                            <BookOpen className="w-4 h-4" />
                            Study with Hints
                          </Link>
                        </div>
                      </motion.div>
                    )}
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
