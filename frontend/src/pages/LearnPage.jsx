import { useState, useEffect } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { python } from "@codemirror/lang-python";
import { java } from "@codemirror/lang-java";
import { oneDark } from "@codemirror/theme-one-dark";
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
  Code2,
  ChevronDown,
  Play,
  Sparkles,
  AlertCircle,
} from "lucide-react";

const YoutubeIcon = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
  </svg>
);

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

const languages = ["javascript", "python", "java"];

export default function LearnPage() {
  const [problems, setProblems] = useState([]);
  const [selected, setSelected] = useState(null);
  const [hintLevel, setHintLevel] = useState(0);
  const [hints, setHints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hintLoading, setHintLoading] = useState(false);
  const [completed, setCompleted] = useState([]);
  const [mobileView, setMobileView] = useState("list");
  const [language, setLanguage] = useState("javascript");
  const [code, setCode] = useState("");
  const [showVideo, setShowVideo] = useState(false);
  const [langDropdown, setLangDropdown] = useState(false);
  const [activeTab, setActiveTab] = useState("problem");
  const [analysis, setAnalysis] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [testResults, setTestResults] = useState([]);

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
    setShowVideo(false);
    setActiveTab("problem");
    setAnalysis("");
    setTestResults([]);
    setCode(problem.starterCode?.[language] || "");
  };

  useEffect(() => {
    if (selected) setCode(selected.starterCode?.[language] || "");
  }, [language, selected]);

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

  const analyzeCode = async () => {
    if (!code.trim() || code === selected.starterCode?.[language]) return;
    setAnalyzing(true);
    setAnalysis("");
    try {
      const res = await axios.post("/api/analyze", {
        code,
        problemId: selected.id,
        language,
      });
      setAnalysis(res.data.analysis);
    } catch (err) {
      setAnalysis(
        "Analysis unavailable right now. Keep going — your thinking is the real work.",
      );
    } finally {
      setAnalyzing(false);
    }
  };

  const runTestCases = () => {
    if (!selected?.testCases) return;
    const results = selected.testCases.map((tc, i) => ({
      id: i + 1,
      input: JSON.stringify(tc.input),
      expected: JSON.stringify(tc.output),
      status: "visible",
    }));
    setTestResults(results);
    setActiveTab("tests");
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
    setCode(selected?.starterCode?.[language] || "");
    setAnalysis("");
    setTestResults([]);
  };

  const isCompleted = (id) => completed.includes(id);

  const getLanguageExtension = () => {
    if (language === "python") return [python()];
    if (language === "java") return [java()];
    return [javascript()];
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col">
      <Navbar />

      <div className="flex-1 pt-20">
        {/* Page Header */}
        <div className="bg-white border-b border-[#E2E8F0] px-6 py-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-2xl font-bold text-[#1E2937] tracking-tight">
                Learn Mode
              </h1>
              <p className="text-[#64748B] text-sm mt-0.5">
                {problems.length} problems · {completed.length} completed
              </p>
            </div>
            <div className="flex items-center gap-3">
              {/* Language Selector */}
              <div className="relative">
                <button
                  onClick={() => setLangDropdown(!langDropdown)}
                  className="flex items-center gap-2 bg-[#F8FAFC] border border-[#E2E8F0] text-[#1E2937] text-sm font-medium px-3 py-2 rounded-xl hover:border-[#2563EB] transition-all duration-200"
                >
                  <Code2 className="w-4 h-4 text-[#64748B]" />
                  {language.charAt(0).toUpperCase() + language.slice(1)}
                  <ChevronDown className="w-3 h-3 text-[#64748B]" />
                </button>
                <AnimatePresence>
                  {langDropdown && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      className="absolute right-0 top-full mt-2 w-36 bg-white rounded-xl border border-[#E2E8F0] shadow-lg overflow-hidden z-10"
                    >
                      {languages.map((lang) => (
                        <button
                          key={lang}
                          onClick={() => {
                            setLanguage(lang);
                            setLangDropdown(false);
                          }}
                          className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                            language === lang
                              ? "bg-[#EFF6FF] text-[#2563EB] font-semibold"
                              : "text-[#64748B] hover:bg-[#F8FAFC]"
                          }`}
                        >
                          {lang.charAt(0).toUpperCase() + lang.slice(1)}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <Link
                to="/test"
                className="flex items-center gap-2 bg-[#0B1220] text-white text-sm font-semibold px-4 py-2 rounded-xl hover:bg-[#1E2937] transition-all duration-200"
              >
                <Zap className="w-4 h-4" />
                Test Mode
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
              <div className="bg-white rounded-2xl border border-[#E2E8F0] overflow-hidden sticky top-24">
                <div className="px-4 py-3 border-b border-[#E2E8F0] bg-[#F8FAFC]">
                  <p className="text-xs font-semibold text-[#64748B] uppercase tracking-widest">
                    Problems ({problems.length})
                  </p>
                </div>
                {loading ? (
                  <div className="p-4 space-y-3">
                    {[...Array(5)].map((_, i) => (
                      <div
                        key={i}
                        className="h-16 bg-[#F8FAFC] rounded-xl animate-pulse"
                      />
                    ))}
                  </div>
                ) : (
                  <div className="divide-y divide-[#F1F5F9] max-h-[calc(100vh-200px)] overflow-y-auto">
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
                          className={`w-full text-left px-4 py-3 transition-all duration-150 ${
                            selected?.id === problem.id
                              ? "bg-[#EFF6FF] border-l-2 border-[#2563EB]"
                              : "bg-white border-l-2 border-transparent"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className="flex-shrink-0">
                              {done ? (
                                <CheckCircle className="w-4 h-4 text-[#10B981]" />
                              ) : (
                                <Circle className="w-4 h-4 text-[#E2E8F0]" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-0.5">
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
                                  {problem.difficulty}
                                </span>
                              </div>
                              <p className="font-semibold text-[#1E2937] text-sm truncate">
                                {problem.title}
                              </p>
                              <div className="flex items-center gap-2 mt-0.5">
                                <span
                                  className="text-xs px-2 py-0.5 rounded-full font-medium"
                                  style={{
                                    backgroundColor: cat.bg,
                                    color: cat.color,
                                  }}
                                >
                                  {cat.label}
                                </span>
                                {problem.pattern && (
                                  <span className="text-xs text-[#94A3B8] truncate">
                                    {problem.pattern}
                                  </span>
                                )}
                              </div>
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
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-4"
                  >
                    {/* Problem Header */}
                    <div className="bg-white rounded-2xl border border-[#E2E8F0] overflow-hidden">
                      {/* Tabs */}
                      <div className="flex border-b border-[#E2E8F0]">
                        {["problem", "hints", "tests", "ai"].map((tab) => (
                          <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-4 py-3 text-sm font-medium capitalize transition-all duration-200 border-b-2 ${
                              activeTab === tab
                                ? "border-[#2563EB] text-[#2563EB]"
                                : "border-transparent text-[#64748B] hover:text-[#1E2937]"
                            }`}
                          >
                            {tab === "ai" ? "✨ AI Analysis" : tab}
                          </button>
                        ))}
                      </div>

                      {/* Problem Tab */}
                      {activeTab === "problem" && (
                        <div className="p-6">
                          {/* Title Row */}
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
                                  {selected.difficulty}
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
                                {selected.pattern && (
                                  <span className="text-xs text-[#94A3B8] bg-[#F8FAFC] px-2 py-0.5 rounded-full border border-[#E2E8F0]">
                                    {selected.pattern}
                                  </span>
                                )}
                              </div>
                              <h2 className="text-2xl font-bold text-[#1E2937] tracking-tight">
                                {selected.title}
                              </h2>
                            </div>
                            <div className="flex items-center gap-2 flex-shrink-0">
                              <button
                                onClick={reset}
                                className="w-9 h-9 rounded-xl border border-[#E2E8F0] flex items-center justify-center text-[#64748B] hover:border-[#2563EB] hover:text-[#2563EB] transition-all"
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
                          <div className="bg-[#F8FAFC] rounded-xl p-4 border border-[#E2E8F0] mb-4">
                            <p className="text-[#1E2937] leading-relaxed text-sm whitespace-pre-line">
                              {selected.description}
                            </p>
                          </div>

                          {/* Examples */}
                          {selected.examples && (
                            <div className="space-y-3 mb-4">
                              {selected.examples.map((ex, i) => (
                                <div
                                  key={i}
                                  className="border border-[#E2E8F0] rounded-xl overflow-hidden"
                                >
                                  <div className="bg-[#F8FAFC] px-4 py-2 border-b border-[#E2E8F0]">
                                    <span className="text-xs font-semibold text-[#64748B] uppercase tracking-widest">
                                      Example {i + 1}
                                    </span>
                                  </div>
                                  <div className="p-4 font-mono text-sm space-y-2">
                                    <div>
                                      <span className="text-[#64748B]">
                                        Input:{" "}
                                      </span>
                                      <span className="text-[#1E2937]">
                                        {ex.input}
                                      </span>
                                    </div>
                                    <div>
                                      <span className="text-[#64748B]">
                                        Output:{" "}
                                      </span>
                                      <span className="text-[#10B981] font-semibold">
                                        {ex.output}
                                      </span>
                                    </div>
                                    {ex.explanation && (
                                      <div className="text-[#64748B] text-xs pt-1 border-t border-[#F1F5F9]">
                                        <span className="font-semibold">
                                          Explanation:{" "}
                                        </span>
                                        {ex.explanation}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}

                          {/* Constraints */}
                          {selected.constraints && (
                            <div className="mb-4">
                              <p className="text-xs font-semibold text-[#64748B] uppercase tracking-widest mb-2">
                                Constraints
                              </p>
                              <ul className="space-y-1">
                                {selected.constraints.map((c, i) => (
                                  <li
                                    key={i}
                                    className="flex items-center gap-2 text-sm text-[#1E2937] font-mono"
                                  >
                                    <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB] flex-shrink-0" />
                                    {c}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {/* YouTube */}
                          {selected.youtubeId && (
                            <button
                              onClick={() => setShowVideo(!showVideo)}
                              className="flex items-center gap-2 text-sm font-medium text-[#EF4444] hover:text-[#DC2626] transition-colors"
                            >
                              <YoutubeIcon />
                              {showVideo ? "Hide" : "Watch"} explanation video
                            </button>
                          )}

                          {/* Video */}
                          <AnimatePresence>
                            {showVideo && selected.youtubeId && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                className="mt-4 rounded-xl overflow-hidden border border-[#E2E8F0]"
                              >
                                <div className="aspect-video">
                                  <iframe
                                    src={`https://www.youtube.com/embed/${selected.youtubeId}`}
                                    title="Explanation"
                                    className="w-full h-full"
                                    allowFullScreen
                                  />
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      )}

                      {/* Hints Tab */}
                      {activeTab === "hints" && (
                        <div className="p-6">
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

                          {hints.length === 0 ? (
                            <div className="text-center py-8 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0]">
                              <Lightbulb className="w-8 h-8 text-[#E2E8F0] mx-auto mb-3" />
                              <p className="text-[#64748B] text-sm mb-1">
                                Try the problem yourself first.
                              </p>
                              <p className="text-[#94A3B8] text-xs">
                                Hints guide your thinking — not the answer.
                              </p>
                            </div>
                          ) : (
                            <div className="space-y-3 mb-6">
                              {hints.map((hint, i) => (
                                <motion.div
                                  key={i}
                                  initial={{ opacity: 0, y: 10 }}
                                  animate={{ opacity: 1, y: 0 }}
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
                              ✓ All hints revealed — now code it up
                            </div>
                          )}
                        </div>
                      )}

                      {/* Tests Tab */}
                      {activeTab === "tests" && (
                        <div className="p-6">
                          <div className="flex items-center justify-between mb-4">
                            <h3 className="font-semibold text-[#1E2937] flex items-center gap-2">
                              <Play className="w-4 h-4 text-[#10B981]" />
                              Test Cases
                            </h3>
                            <span className="text-xs text-[#64748B] bg-[#F8FAFC] px-2 py-1 rounded-lg border border-[#E2E8F0]">
                              {selected.testCases?.length || 0} visible · hidden
                              in Test Mode
                            </span>
                          </div>

                          {selected.testCases?.map((tc, i) => (
                            <div
                              key={i}
                              className="border border-[#E2E8F0] rounded-xl overflow-hidden mb-3"
                            >
                              <div className="bg-[#F8FAFC] px-4 py-2 border-b border-[#E2E8F0] flex items-center justify-between">
                                <span className="text-xs font-semibold text-[#64748B]">
                                  Case {i + 1}
                                </span>
                                <span className="text-xs text-[#10B981] bg-[#ECFDF5] px-2 py-0.5 rounded-full">
                                  Visible
                                </span>
                              </div>
                              <div className="p-4 font-mono text-xs space-y-2">
                                <div>
                                  <span className="text-[#64748B]">
                                    Input:{" "}
                                  </span>
                                  <span className="text-[#1E2937]">
                                    {JSON.stringify(tc.input)}
                                  </span>
                                </div>
                                <div>
                                  <span className="text-[#64748B]">
                                    Expected:{" "}
                                  </span>
                                  <span className="text-[#10B981] font-semibold">
                                    {JSON.stringify(tc.output)}
                                  </span>
                                </div>
                              </div>
                            </div>
                          ))}

                          <div className="border border-dashed border-[#E2E8F0] rounded-xl p-4 text-center">
                            <AlertCircle className="w-5 h-5 text-[#94A3B8] mx-auto mb-2" />
                            <p className="text-xs text-[#94A3B8]">
                              Hidden test cases are only revealed in Test Mode
                            </p>
                          </div>
                        </div>
                      )}

                      {/* AI Analysis Tab */}
                      {activeTab === "ai" && (
                        <div className="p-6">
                          <div className="flex items-center gap-2 mb-4">
                            <Sparkles className="w-5 h-5 text-[#8B5CF6]" />
                            <h3 className="font-semibold text-[#1E2937]">
                              AI Code Analysis
                            </h3>
                          </div>
                          <p className="text-sm text-[#64748B] mb-4">
                            Write your solution in the code editor below, then
                            get AI-powered Socratic feedback on your approach.
                          </p>

                          {analysis ? (
                            <motion.div
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="bg-gradient-to-br from-[#F5F3FF] to-[#EFF6FF] border border-[#8B5CF6]/20 rounded-xl p-5 mb-4"
                            >
                              <div className="flex items-center gap-2 mb-3">
                                <Sparkles className="w-4 h-4 text-[#8B5CF6]" />
                                <span className="text-xs font-semibold text-[#8B5CF6] uppercase tracking-widest">
                                  Neuronode Analysis
                                </span>
                              </div>
                              <p className="text-[#1E2937] text-sm leading-relaxed whitespace-pre-line">
                                {analysis}
                              </p>
                            </motion.div>
                          ) : (
                            <div className="text-center py-8 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0] mb-4">
                              <Sparkles className="w-8 h-8 text-[#E2E8F0] mx-auto mb-3" />
                              <p className="text-[#64748B] text-sm">
                                Write your code below and click Analyze
                              </p>
                            </div>
                          )}

                          <motion.button
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.99 }}
                            onClick={analyzeCode}
                            disabled={
                              analyzing ||
                              !code.trim() ||
                              code === selected.starterCode?.[language]
                            }
                            className="w-full py-3 bg-[#8B5CF6] hover:bg-[#7C3AED] text-white font-semibold rounded-xl transition-all duration-200 disabled:opacity-50 flex items-center justify-center gap-2"
                          >
                            <Sparkles className="w-4 h-4" />
                            {analyzing
                              ? "Analyzing your code..."
                              : "Analyze My Code"}
                          </motion.button>
                          {(code === selected.starterCode?.[language] ||
                            !code.trim()) && (
                            <p className="text-center text-xs text-[#94A3B8] mt-2">
                              Write your solution first, then analyze
                            </p>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Code Editor */}
                    <div className="bg-white rounded-2xl border border-[#E2E8F0] overflow-hidden">
                      <div className="px-4 py-3 border-b border-[#E2E8F0] bg-[#0B1220] flex items-center justify-between">
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
                          <button
                            onClick={runTestCases}
                            className="flex items-center gap-1.5 bg-[#10B981] hover:bg-[#059669] text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-all duration-200"
                          >
                            <Play className="w-3 h-3" />
                            Run Tests
                          </button>
                          <button
                            onClick={() => setActiveTab("ai")}
                            className="flex items-center gap-1.5 bg-[#8B5CF6] hover:bg-[#7C3AED] text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-all duration-200"
                          >
                            <Sparkles className="w-3 h-3" />
                            Analyze
                          </button>
                        </div>
                      </div>
                      <CodeMirror
                        value={code}
                        height="300px"
                        theme={oneDark}
                        extensions={getLanguageExtension()}
                        onChange={(val) => setCode(val)}
                        className="text-sm"
                      />
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
