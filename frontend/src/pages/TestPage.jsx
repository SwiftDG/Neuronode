import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import axios from "axios";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { python } from "@codemirror/lang-python";
import { java } from "@codemirror/lang-java";
import { oneDark } from "@codemirror/theme-one-dark";
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
  Play,
  Sparkles,
  Code2,
  ChevronDown,
} from "lucide-react";

const difficultyConfig = {
  Easy: { color: "#10B981", bg: "#ECFDF5", time: 15 * 60 },
  Medium: { color: "#F59E0B", bg: "#FFFBEB", time: 25 * 60 },
  Hard: { color: "#EF4444", bg: "#FEF2F2", time: 40 * 60 },
};

const categoryColors = {
  arrays: { color: "#2563EB", bg: "#EFF6FF", label: "Arrays" },
  hashmaps: { color: "#8B5CF6", bg: "#F5F3FF", label: "Hashmaps" },
  strings: { color: "#14B8A6", bg: "#F0FDFA", label: "Strings" },
};

const languages = ["javascript", "python", "java"];

export default function TestPage() {
  const [problems, setProblems] = useState([]);
  const [selected, setSelected] = useState(null);
  const [phase, setPhase] = useState("list");
  const [timeLeft, setTimeLeft] = useState(0);
  const [timeTaken, setTimeTaken] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("javascript");
  const [langDropdown, setLangDropdown] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [testResults, setTestResults] = useState(null);
  const [optimalSolution, setOptimalSolution] = useState("");
  const [mobileView, setMobileView] = useState("list");
  const [sessionResults, setSessionResults] = useState([]);
  const timerRef = useRef(null);
  const startTimeRef = useRef(null);

  useEffect(() => {
    axios
      .get("/api/problems")
      .then((res) => setProblems(Array.isArray(res.data) ? res.data : []))
      .catch((err) => console.error(err));

    const saved = JSON.parse(
      localStorage.getItem("neuronode_test_results") || "[]",
    );
    setSessionResults(saved);
  }, []);

  useEffect(() => {
    if (timerActive && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            setTimerActive(false);
            handleTimeUp();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [timerActive]);

  const handleTimeUp = async () => {
    clearInterval(timerRef.current);
    setTimerActive(false);
    await submitCode(true);
  };

  const selectProblem = (problem) => {
    const timeLimit = (
      difficultyConfig[problem.difficulty] || difficultyConfig.Easy
    ).time;
    setSelected(problem);
    setPhase("attempt");
    setTimeLeft(timeLimit);
    setTimeTaken(0);
    setTimerActive(true);
    setCode(problem.starterCode?.[language] || "");
    setTestResults(null);
    setOptimalSolution("");
    setMobileView("detail");
    startTimeRef.current = Date.now();
  };

  const submitCode = async (timedOut = false) => {
    if (!selected) return;
    clearInterval(timerRef.current);
    setTimerActive(false);
    setSubmitting(true);
    setPhase("submitting");

    const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
    setTimeTaken(elapsed);

    try {
      const [testsRes, optimalRes] = await Promise.all([
        axios.post("/api/run-tests", {
          code,
          problemId: selected.id,
          language,
          testCases: [
            ...(selected.testCases || []),
            ...(selected.hiddenTestCases || []),
          ],
        }),
        axios.post("/api/optimal", {
          code,
          problemId: selected.id,
          language,
        }),
      ]);

      const results = testsRes.data.results || [];
      const passed = results.filter((r) => r.passed).length;
      const total = results.length;
      const score = Math.round((passed / total) * 100);

      const resultEntry = {
        id: Date.now(),
        problemId: selected.id,
        problemTitle: selected.title,
        difficulty: selected.difficulty,
        score,
        passed,
        total,
        timeTaken: elapsed,
        timedOut,
        date: new Date().toISOString(),
      };

      const existing = JSON.parse(
        localStorage.getItem("neuronode_test_results") || "[]",
      );
      const updated = [resultEntry, ...existing].slice(0, 50);
      localStorage.setItem("neuronode_test_results", JSON.stringify(updated));
      setSessionResults(updated);

      setTestResults(results);
      setOptimalSolution(optimalRes.data.optimal || "");
      setPhase("results");
    } catch (err) {
      console.error(err);
      setPhase("results");
    } finally {
      setSubmitting(false);
    }
  };

  const resetProblem = () => {
    clearInterval(timerRef.current);
    setPhase("list");
    setSelected(null);
    setTimeLeft(0);
    setTimerActive(false);
    setTestResults(null);
    setOptimalSolution("");
    setMobileView("list");
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  const getTimerColor = () => {
    const diff =
      difficultyConfig[selected?.difficulty] || difficultyConfig.Easy;
    const ratio = timeLeft / diff.time;
    if (ratio > 0.5) return "#10B981";
    if (ratio > 0.2) return "#F59E0B";
    return "#EF4444";
  };

  const getLanguageExtension = () => {
    if (language === "python") return [python()];
    if (language === "java") return [java()];
    return [javascript()];
  };

  const passed = testResults ? testResults.filter((r) => r.passed).length : 0;
  const total = testResults ? testResults.length : 0;
  const score = total > 0 ? Math.round((passed / total) * 100) : 0;

  return (
    <div className="min-h-screen bg-[#0B1220] flex flex-col">
      <Navbar />

      <div className="flex-1 pt-20">
        {/* Header */}
        <div className="bg-[#111827] border-b border-white/10 px-6 py-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between flex-wrap gap-4">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <Zap className="w-5 h-5 text-[#14B8A6]" />
                <h1 className="text-2xl font-bold text-white tracking-tight">
                  Test Mode
                </h1>
              </div>
              <p className="text-[#64748B] text-sm">
                No hints. Timer running. Submit your solution.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Link
                to="/stats"
                className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-all"
              >
                <Trophy className="w-4 h-4" />
                My Stats
              </Link>
              <Link
                to="/learn"
                className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-all"
              >
                <BookOpen className="w-4 h-4" />
                Learn Mode
              </Link>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-6">
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
                <div className="divide-y divide-white/5 max-h-[calc(100vh-200px)] overflow-y-auto">
                  {problems.map((problem) => {
                    const diff =
                      difficultyConfig[problem.difficulty] ||
                      difficultyConfig.Easy;
                    const myResults = sessionResults.filter(
                      (r) => r.problemId === problem.id,
                    );
                    const bestScore =
                      myResults.length > 0
                        ? Math.max(...myResults.map((r) => r.score))
                        : null;
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
                          <div className="flex-shrink-0">
                            {bestScore === 100 ? (
                              <CheckCircle className="w-4 h-4 text-[#10B981]" />
                            ) : bestScore !== null ? (
                              <XCircle className="w-4 h-4 text-[#F59E0B]" />
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
                                {problem.difficulty}
                              </span>
                              <span className="text-xs text-[#64748B] font-mono">
                                {formatTime(diff.time)}
                              </span>
                            </div>
                            <p className="font-semibold text-white text-sm truncate">
                              {problem.title}
                            </p>
                            {bestScore !== null && (
                              <p className="text-xs text-[#64748B] mt-0.5">
                                Best: {bestScore}%
                              </p>
                            )}
                          </div>
                          <ChevronRight className="w-4 h-4 text-white/20 flex-shrink-0" />
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Main Area */}
            <div
              className={`lg:col-span-2 lg:block ${mobileView === "list" ? "hidden" : "block"}`}
            >
              <button
                onClick={() => setMobileView("list")}
                className="lg:hidden flex items-center gap-2 text-[#64748B] text-sm mb-4"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </button>

              {/* LIST PHASE */}
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
                      Timer starts when you select. No hints available.
                    </p>
                  </div>
                </div>
              )}

              {/* ATTEMPT PHASE */}
              {phase === "attempt" && selected && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4"
                >
                  {/* Timer */}
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
                        animate={{ opacity: timeLeft <= 60 ? [1, 0.3, 1] : 1 }}
                        transition={{ duration: 0.5, repeat: Infinity }}
                        className="font-mono font-bold text-2xl"
                        style={{ color: getTimerColor() }}
                      >
                        {formatTime(timeLeft)}
                      </motion.span>
                    </div>
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full rounded-full transition-all duration-1000"
                        style={{
                          width: `${(timeLeft / (difficultyConfig[selected.difficulty] || difficultyConfig.Easy).time) * 100}%`,
                          backgroundColor: getTimerColor(),
                        }}
                      />
                    </div>
                  </div>

                  {/* Problem */}
                  <div className="bg-[#111827] rounded-2xl border border-white/10 p-6">
                    <div className="flex items-start justify-between gap-4 mb-4">
                      <div>
                        <div className="flex items-center gap-2 mb-2 flex-wrap">
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
                            {selected.difficulty}
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

                    <div className="bg-white/5 rounded-xl p-4 border border-white/10 mb-4">
                      <p className="text-white/80 leading-relaxed text-sm">
                        {selected.description}
                      </p>
                    </div>

                    {/* Examples */}
                    {selected.examples?.slice(0, 2).map((ex, i) => (
                      <div
                        key={i}
                        className="border border-white/10 rounded-xl overflow-hidden mb-3"
                      >
                        <div className="bg-white/5 px-4 py-2 border-b border-white/10">
                          <span className="text-xs font-semibold text-[#64748B] uppercase tracking-widest">
                            Example {i + 1}
                          </span>
                        </div>
                        <div className="p-4 font-mono text-sm space-y-2">
                          <div>
                            <span className="text-[#64748B]">Input: </span>
                            <span className="text-white/80">{ex.input}</span>
                          </div>
                          <div>
                            <span className="text-[#64748B]">Output: </span>
                            <span className="text-[#10B981] font-semibold">
                              {ex.output}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}

                    <div className="flex items-center gap-2 text-[#64748B] text-sm">
                      <Zap className="w-4 h-4 text-[#F59E0B]" />
                      Test Mode — no hints. Submit when ready.
                    </div>
                  </div>

                  {/* Language Selector + Code Editor */}
                  <div className="bg-[#111827] rounded-2xl border border-white/10 overflow-hidden">
                    <div className="px-4 py-3 bg-[#0B1220] flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-[#EF4444]" />
                        <div className="w-3 h-3 rounded-full bg-[#F59E0B]" />
                        <div className="w-3 h-3 rounded-full bg-[#10B981]" />
                        <span className="ml-2 text-white/40 text-xs font-mono">
                          solution.
                          {language === "javascript"
                            ? "js"
                            : language === "python"
                              ? "py"
                              : "java"}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        {/* Language Dropdown */}
                        <div className="relative">
                          <button
                            onClick={() => setLangDropdown(!langDropdown)}
                            className="flex items-center gap-1.5 bg-white/10 text-white text-xs font-medium px-3 py-1.5 rounded-lg"
                          >
                            <Code2 className="w-3 h-3" />
                            {language.charAt(0).toUpperCase() +
                              language.slice(1)}
                            <ChevronDown className="w-3 h-3" />
                          </button>
                          <AnimatePresence>
                            {langDropdown && (
                              <motion.div
                                initial={{ opacity: 0, y: 4 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 4 }}
                                className="absolute right-0 top-full mt-1 w-32 bg-[#111827] rounded-xl border border-white/10 overflow-hidden z-10"
                              >
                                {languages.map((lang) => (
                                  <button
                                    key={lang}
                                    onClick={() => {
                                      setLanguage(lang);
                                      setLangDropdown(false);
                                      setCode(
                                        selected?.starterCode?.[lang] || "",
                                      );
                                    }}
                                    className={`w-full text-left px-3 py-2 text-xs transition-colors ${language === lang ? "text-[#14B8A6] bg-white/5" : "text-white/60 hover:bg-white/5"}`}
                                  >
                                    {lang.charAt(0).toUpperCase() +
                                      lang.slice(1)}
                                  </button>
                                ))}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>

                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => submitCode(false)}
                          disabled={
                            submitting ||
                            !code.trim() ||
                            code === selected.starterCode?.[language]
                          }
                          className="flex items-center gap-1.5 bg-[#2563EB] hover:bg-[#1D4ED8] disabled:opacity-50 text-white text-xs font-bold px-4 py-1.5 rounded-lg transition-all"
                        >
                          <Play className="w-3 h-3" />
                          Submit
                        </motion.button>
                      </div>
                    </div>
                    <CodeMirror
                      value={code}
                      height="350px"
                      theme={oneDark}
                      extensions={getLanguageExtension()}
                      onChange={(val) => setCode(val)}
                    />
                  </div>
                </motion.div>
              )}

              {/* SUBMITTING PHASE */}
              {phase === "submitting" && (
                <div className="bg-[#111827] rounded-2xl border border-white/10 h-96 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-16 h-16 border-4 border-[#2563EB]/20 border-t-[#2563EB] rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-white font-semibold mb-2">
                      Evaluating your solution...
                    </p>
                    <p className="text-[#64748B] text-sm">
                      Running test cases + analyzing your approach
                    </p>
                  </div>
                </div>
              )}

              {/* RESULTS PHASE */}
              {phase === "results" && selected && (
                <AnimatePresence>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-4"
                  >
                    {/* Score Banner */}
                    <div
                      className={`rounded-2xl p-6 border ${
                        score === 100
                          ? "bg-[#10B981]/10 border-[#10B981]/30"
                          : score >= 50
                            ? "bg-[#F59E0B]/10 border-[#F59E0B]/30"
                            : "bg-[#EF4444]/10 border-[#EF4444]/30"
                      }`}
                    >
                      <div className="flex items-center justify-between flex-wrap gap-4">
                        <div className="flex items-center gap-4">
                          <div
                            className={`w-16 h-16 rounded-2xl flex items-center justify-center ${
                              score === 100
                                ? "bg-[#10B981]/20"
                                : score >= 50
                                  ? "bg-[#F59E0B]/20"
                                  : "bg-[#EF4444]/20"
                            }`}
                          >
                            {score === 100 ? (
                              <Trophy className="w-8 h-8 text-[#10B981]" />
                            ) : (
                              <Zap className="w-8 h-8 text-[#F59E0B]" />
                            )}
                          </div>
                          <div>
                            <p
                              className={`text-3xl font-bold ${
                                score === 100
                                  ? "text-[#10B981]"
                                  : score >= 50
                                    ? "text-[#F59E0B]"
                                    : "text-[#EF4444]"
                              }`}
                            >
                              {score}%
                            </p>
                            <p className="text-white/60 text-sm">
                              {passed}/{total} test cases passed
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-white font-semibold font-mono">
                            {formatTime(timeTaken)}
                          </p>
                          <p className="text-[#64748B] text-xs">time taken</p>
                        </div>
                      </div>
                    </div>

                    {/* Test Results */}
                    {testResults && (
                      <div className="bg-[#111827] rounded-2xl border border-white/10 p-6">
                        <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                          <Play className="w-4 h-4 text-[#10B981]" />
                          Test Results
                        </h3>
                        <div className="space-y-3">
                          {testResults.map((result, i) => (
                            <motion.div
                              key={i}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: i * 0.05 }}
                              className={`border rounded-xl overflow-hidden ${
                                result.passed
                                  ? "border-[#10B981]/30"
                                  : "border-[#EF4444]/30"
                              }`}
                            >
                              <div
                                className={`px-4 py-2 flex items-center justify-between ${
                                  result.passed
                                    ? "bg-[#10B981]/10"
                                    : "bg-[#EF4444]/10"
                                }`}
                              >
                                <span className="text-xs font-semibold text-[#64748B]">
                                  {i < (selected.testCases?.length || 0)
                                    ? `Case ${i + 1}`
                                    : `Hidden Case ${i - (selected.testCases?.length || 0) + 1}`}
                                </span>
                                <span
                                  className={`text-xs font-bold ${result.passed ? "text-[#10B981]" : "text-[#EF4444]"}`}
                                >
                                  {result.passed ? "✓ PASS" : "✗ FAIL"}
                                </span>
                              </div>
                              <div className="p-4 font-mono text-xs space-y-1">
                                <div>
                                  <span className="text-[#64748B]">
                                    Input:{" "}
                                  </span>
                                  <span className="text-white/70">
                                    {JSON.stringify(result.input)}
                                  </span>
                                </div>
                                <div>
                                  <span className="text-[#64748B]">
                                    Expected:{" "}
                                  </span>
                                  <span className="text-[#10B981]">
                                    {JSON.stringify(result.expected)}
                                  </span>
                                </div>
                                {result.feedback && (
                                  <p className="text-white/50 pt-1 border-t border-white/10 mt-1">
                                    {result.feedback}
                                  </p>
                                )}
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Optimal Solution — only shows after submission */}
                    {optimalSolution && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="bg-gradient-to-br from-[#0B1220] to-[#111827] rounded-2xl border border-[#8B5CF6]/30 p-6"
                      >
                        <div className="flex items-center gap-2 mb-4">
                          <Sparkles className="w-5 h-5 text-[#8B5CF6]" />
                          <h3 className="font-semibold text-white">
                            Optimal Approach
                          </h3>
                          <span className="text-xs text-[#8B5CF6] bg-[#8B5CF6]/10 px-2 py-0.5 rounded-full border border-[#8B5CF6]/20">
                            AI Analysis
                          </span>
                        </div>
                        <p className="text-white/70 text-sm leading-relaxed whitespace-pre-line">
                          {optimalSolution}
                        </p>
                      </motion.div>
                    )}

                    {/* Actions */}
                    <div className="grid grid-cols-2 gap-4">
                      <button
                        onClick={resetProblem}
                        className="py-3 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl transition-all flex items-center justify-center gap-2"
                      >
                        <RotateCcw className="w-4 h-4" />
                        Try Another
                      </button>
                      <Link
                        to="/learn"
                        className="py-3 bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-semibold rounded-xl transition-all flex items-center justify-center gap-2"
                      >
                        <BookOpen className="w-4 h-4" />
                        Study with Hints
                      </Link>
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
