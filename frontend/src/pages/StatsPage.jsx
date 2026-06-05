import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import {
  Trophy,
  Zap,
  Target,
  Clock,
  TrendingUp,
  RotateCcw,
  BookOpen,
  CheckCircle,
  XCircle,
} from "lucide-react";

const difficultyConfig = {
  Easy: { color: "#10B981", bg: "#ECFDF5" },
  Medium: { color: "#F59E0B", bg: "#FFFBEB" },
  Hard: { color: "#EF4444", bg: "#FEF2F2" },
};

const formatTime = (seconds) => {
  if (!seconds) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
};

const formatDate = (iso) => {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export default function StatsPage() {
  const [results, setResults] = useState([]);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    const saved = JSON.parse(
      localStorage.getItem("neuronode_test_results") || "[]",
    );
    setResults(saved);
  }, []);

  const clearStats = () => {
    if (window.confirm("Clear all test history?")) {
      localStorage.removeItem("neuronode_test_results");
      setResults([]);
    }
  };

  const filtered =
    filter === "all" ? results : results.filter((r) => r.difficulty === filter);

  const totalAttempts = results.length;
  const perfectScores = results.filter((r) => r.score === 100).length;
  const avgScore =
    results.length > 0
      ? Math.round(
          results.reduce((sum, r) => sum + r.score, 0) / results.length,
        )
      : 0;
  const avgTime =
    results.length > 0
      ? Math.round(
          results.reduce((sum, r) => sum + (r.timeTaken || 0), 0) /
            results.length,
        )
      : 0;
  const bestStreak = (() => {
    let streak = 0,
      best = 0;
    results.forEach((r) => {
      if (r.score === 100) {
        streak++;
        best = Math.max(best, streak);
      } else streak = 0;
    });
    return best;
  })();

  const stats = [
    {
      label: "Total Attempts",
      value: totalAttempts,
      icon: Target,
      color: "#2563EB",
    },
    {
      label: "Perfect Scores",
      value: perfectScores,
      icon: Trophy,
      color: "#10B981",
    },
    {
      label: "Avg Score",
      value: `${avgScore}%`,
      icon: TrendingUp,
      color: "#8B5CF6",
    },
    {
      label: "Avg Time",
      value: formatTime(avgTime),
      icon: Clock,
      color: "#F59E0B",
    },
    { label: "Best Streak", value: bestStreak, icon: Zap, color: "#14B8A6" },
  ];

  return (
    <div className="min-h-screen bg-[#0B1220] flex flex-col">
      <Navbar />

      <div className="flex-1 pt-20">
        {/* Header */}
        <div className="bg-[#111827] border-b border-white/10 px-6 py-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between flex-wrap gap-4">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <Trophy className="w-5 h-5 text-[#F59E0B]" />
                <h1 className="text-2xl font-bold text-white tracking-tight">
                  My Stats
                </h1>
              </div>
              <p className="text-[#64748B] text-sm">
                Your test history and performance over time
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Link
                to="/test"
                className="flex items-center gap-2 bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-sm font-semibold px-4 py-2 rounded-xl transition-all"
              >
                <Zap className="w-4 h-4" />
                Test Mode
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

        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
            {stats.map((stat, i) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-[#111827] rounded-2xl border border-white/10 p-4"
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
                    style={{ backgroundColor: `${stat.color}20` }}
                  >
                    <Icon className="w-5 h-5" style={{ color: stat.color }} />
                  </div>
                  <p className="text-2xl font-bold text-white mb-1">
                    {stat.value}
                  </p>
                  <p className="text-xs text-[#64748B]">{stat.label}</p>
                </motion.div>
              );
            })}
          </div>

          {/* History */}
          <div className="bg-[#111827] rounded-2xl border border-white/10 overflow-hidden">
            <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between flex-wrap gap-4">
              <h2 className="font-semibold text-white">Test History</h2>
              <div className="flex items-center gap-2">
                {/* Filter */}
                {["all", "Easy", "Medium", "Hard"].map((f) => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-all ${
                      filter === f
                        ? "bg-[#2563EB] text-white"
                        : "bg-white/5 text-[#64748B] hover:text-white"
                    }`}
                  >
                    {f === "all" ? "All" : f}
                  </button>
                ))}
                {results.length > 0 && (
                  <button
                    onClick={clearStats}
                    className="text-xs px-3 py-1.5 rounded-lg bg-[#EF4444]/10 text-[#EF4444] hover:bg-[#EF4444]/20 transition-all"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>

            {filtered.length === 0 ? (
              <div className="py-20 text-center">
                <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Trophy className="w-8 h-8 text-white/20" />
                </div>
                <p className="text-white/60 font-semibold mb-2">
                  No test history yet
                </p>
                <p className="text-[#64748B] text-sm mb-6">
                  {filter !== "all"
                    ? `No ${filter} problems attempted yet.`
                    : "Complete your first test to see results here."}
                </p>
                <Link
                  to="/test"
                  className="inline-flex items-center gap-2 bg-[#2563EB] text-white font-semibold px-6 py-3 rounded-xl hover:bg-[#1D4ED8] transition-all"
                >
                  <Zap className="w-4 h-4" />
                  Start Testing
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-white/5">
                {filtered.map((result, i) => {
                  const diff =
                    difficultyConfig[result.difficulty] ||
                    difficultyConfig.Easy;
                  return (
                    <motion.div
                      key={result.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.03 }}
                      className="px-6 py-4 flex items-center justify-between gap-4 hover:bg-white/5 transition-all"
                    >
                      <div className="flex items-center gap-4">
                        {/* Pass/Fail Icon */}
                        <div className="flex-shrink-0">
                          {result.score === 100 ? (
                            <CheckCircle className="w-5 h-5 text-[#10B981]" />
                          ) : result.score >= 50 ? (
                            <Zap className="w-5 h-5 text-[#F59E0B]" />
                          ) : (
                            <XCircle className="w-5 h-5 text-[#EF4444]" />
                          )}
                        </div>

                        <div>
                          <p className="font-semibold text-white text-sm">
                            {result.problemTitle}
                          </p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span
                              className="text-xs px-2 py-0.5 rounded-full font-medium"
                              style={{
                                backgroundColor: `${diff.color}20`,
                                color: diff.color,
                              }}
                            >
                              {result.difficulty}
                            </span>
                            <span className="text-xs text-[#64748B]">
                              {formatDate(result.date)}
                            </span>
                            {result.timedOut && (
                              <span className="text-xs text-[#EF4444] bg-[#EF4444]/10 px-2 py-0.5 rounded-full">
                                Timed out
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-6 text-right">
                        <div>
                          <p
                            className={`font-bold text-lg ${
                              result.score === 100
                                ? "text-[#10B981]"
                                : result.score >= 50
                                  ? "text-[#F59E0B]"
                                  : "text-[#EF4444]"
                            }`}
                          >
                            {result.score}%
                          </p>
                          <p className="text-xs text-[#64748B]">
                            {result.passed}/{result.total} passed
                          </p>
                        </div>
                        <div className="hidden md:block">
                          <p className="font-mono text-white text-sm">
                            {formatTime(result.timeTaken)}
                          </p>
                          <p className="text-xs text-[#64748B]">time taken</p>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
