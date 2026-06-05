import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Lightbulb } from "lucide-react";

const problems = [
  {
    id: 1,
    title: "Two Sum",
    category: "Arrays",
    difficulty: "Easy",
    difficultyColor: "#10B981",
    description:
      "Given an array of integers, find two numbers that add to target.",
    hints: [
      "What data structure lets you check if a value exists in O(1)?",
      "Could you iterate once and store values you have seen?",
      "For each number, check if (target - number) exists in what you stored.",
    ],
    accent: "#2563EB",
  },
  {
    id: 2,
    title: "Valid Anagram",
    category: "Arrays",
    difficulty: "Easy",
    difficultyColor: "#10B981",
    description: "Check if two strings are anagrams of each other.",
    hints: [
      "What do anagrams have in common structurally?",
      "What if you counted the frequency of each character?",
      "Build a frequency map for both strings and compare them.",
    ],
    accent: "#8B5CF6",
  },
  {
    id: 3,
    title: "Maximum Subarray",
    category: "Arrays",
    difficulty: "Medium",
    difficultyColor: "#F59E0B",
    description: "Find the contiguous subarray with the largest sum.",
    hints: [
      "Should you include the current element or start fresh?",
      "What happens when your running sum goes negative?",
      "Track both current sum and maximum seen so far — reset when sum goes negative.",
    ],
    accent: "#14B8A6",
  },
  {
    id: 4,
    title: "Group Anagrams",
    category: "Arrays",
    difficulty: "Medium",
    difficultyColor: "#F59E0B",
    description: "Group strings that are anagrams of each other together.",
    hints: [
      "What property do all anagrams in a group share?",
      "Could you use that shared property as a key?",
      "Sort each string — anagrams produce the same sorted string. Use it as a hashmap key.",
    ],
    accent: "#F59E0B",
  },
  {
    id: 5,
    title: "Contains Duplicate",
    category: "Arrays",
    difficulty: "Easy",
    difficultyColor: "#10B981",
    description: "Determine if any value appears at least twice in an array.",
    hints: [
      "How would you track what you have already seen?",
      "What structure gives you O(1) lookup and no duplicates?",
      "Add each element to a Set — if it already exists, you found a duplicate.",
    ],
    accent: "#EF4444",
  },
];

export default function Carousel() {
  const [current, setCurrent] = useState(0);
  const [activeHint, setActiveHint] = useState(0);
  const [direction, setDirection] = useState(1);

  useEffect(() => {
    const timer = setInterval(() => {
      setDirection(1);
      setCurrent((prev) => (prev + 1) % problems.length);
      setActiveHint(0);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const goTo = (index) => {
    setDirection(index > current ? 1 : -1);
    setCurrent(index);
    setActiveHint(0);
  };

  const prev = () => {
    setDirection(-1);
    setCurrent((prev) => (prev - 1 + problems.length) % problems.length);
    setActiveHint(0);
  };

  const next = () => {
    setDirection(1);
    setCurrent((prev) => (prev + 1) % problems.length);
    setActiveHint(0);
  };

  const getNextHint = () => {
    if (activeHint < problems[current].hints.length - 1) {
      setActiveHint(activeHint + 1);
    }
  };

  const variants = {
    enter: (dir) => ({ x: dir > 0 ? 80 : -80, opacity: 0 }),
    center: {
      x: 0,
      opacity: 1,
      transition: { duration: 0.4, ease: "easeOut" },
    },
    exit: (dir) => ({
      x: dir > 0 ? -80 : 80,
      opacity: 0,
      transition: { duration: 0.3 },
    }),
  };

  const p = problems[current];

  return (
    <section className="bg-[#0B1220] py-32 relative overflow-hidden">
      {/* Atmospheric glow */}
      <motion.div
        animate={{ opacity: [0.03, 0.07, 0.03] }}
        transition={{ duration: 4, repeat: Infinity }}
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-48 rounded-full blur-3xl pointer-events-none"
        style={{ backgroundColor: p.accent }}
      />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-block text-[#14B8A6] text-sm font-semibold uppercase tracking-widest mb-4">
            Live Preview
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
            See Neuronode <span className="text-[#14B8A6]">in action</span>
          </h2>
          <p className="text-[#64748B] mt-4 text-lg max-w-xl mx-auto">
            Real problems. Real hints. This is exactly what you get inside.
          </p>
        </motion.div>

        {/* Problem Card */}
        <div className="max-w-3xl mx-auto">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={current}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden"
            >
              {/* Card Header */}
              <div className="px-8 pt-8 pb-6 border-b border-white/10">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <span
                      className="text-xs font-semibold px-3 py-1 rounded-full font-mono uppercase tracking-widest"
                      style={{
                        backgroundColor: `${p.accent}20`,
                        color: p.accent,
                      }}
                    >
                      {p.category}
                    </span>
                    <span
                      className="text-xs font-semibold px-3 py-1 rounded-full font-mono"
                      style={{
                        backgroundColor: `${p.difficultyColor}20`,
                        color: p.difficultyColor,
                      }}
                    >
                      {p.difficulty}
                    </span>
                  </div>
                  <span className="text-white/20 font-mono text-sm">
                    #{String(p.id).padStart(2, "0")}
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">
                  {p.title}
                </h3>
                <p className="text-[#64748B] leading-relaxed">
                  {p.description}
                </p>
              </div>

              {/* Hints Section */}
              <div className="px-8 py-6">
                <div className="flex items-center gap-2 mb-4">
                  <Lightbulb className="w-4 h-4 text-[#14B8A6]" />
                  <span className="text-[#14B8A6] text-sm font-semibold uppercase tracking-widest">
                    Socratic Hints
                  </span>
                </div>

                <div className="space-y-3 mb-6">
                  {p.hints.map((hint, i) => (
                    <AnimatePresence key={i}>
                      {i <= activeHint && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3 }}
                          className="flex items-start gap-3 p-4 rounded-xl"
                          style={{
                            backgroundColor:
                              i === activeHint
                                ? `${p.accent}15`
                                : "rgba(255,255,255,0.03)",
                            borderLeft: `2px solid ${i === activeHint ? p.accent : "transparent"}`,
                          }}
                        >
                          <span
                            className="text-xs font-mono font-bold flex-shrink-0 mt-0.5"
                            style={{ color: p.accent }}
                          >
                            {String(i + 1).padStart(2, "0")}
                          </span>
                          <span className="text-white/70 text-sm leading-relaxed">
                            {hint}
                          </span>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  ))}
                </div>

                {/* Get Hint Button */}
                {activeHint < p.hints.length - 1 ? (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={getNextHint}
                    className="w-full py-3 rounded-xl border font-semibold text-sm transition-all duration-200"
                    style={{
                      borderColor: `${p.accent}40`,
                      color: p.accent,
                      backgroundColor: `${p.accent}10`,
                    }}
                  >
                    Get Next Hint ({activeHint + 1}/{p.hints.length})
                  </motion.button>
                ) : (
                  <div
                    className="w-full py-3 rounded-xl text-center text-sm font-semibold"
                    style={{
                      backgroundColor: `${p.accent}15`,
                      color: p.accent,
                    }}
                  >
                    ✓ All hints revealed — now try to solve it
                  </div>
                )}
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8">
            <div className="flex gap-2">
              {problems.map((prob, i) => (
                <button key={i} onClick={() => goTo(i)}>
                  <motion.div
                    animate={{
                      width: i === current ? 32 : 8,
                      backgroundColor: i === current ? p.accent : "#1F2937",
                    }}
                    transition={{ duration: 0.3 }}
                    className="h-2 rounded-full"
                  />
                </button>
              ))}
            </div>

            <div className="flex gap-2">
              <button
                onClick={prev}
                className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-[#64748B] hover:border-white/30 hover:text-white transition-all duration-200"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={next}
                className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-[#64748B] hover:border-white/30 hover:text-white transition-all duration-200"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* CTA below carousel */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mt-12 text-center"
          >
            <p className="text-[#64748B] mb-4">Ready to try it yourself?</p>

            <a
              href="/signup"
              className="inline-flex items-center gap-2 bg-white text-[#0B1220] font-bold px-8 py-4 rounded-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-0.5"
            >
              Start for free
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
