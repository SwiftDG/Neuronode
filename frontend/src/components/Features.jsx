import { motion } from "framer-motion";
import { Brain, Target, Zap, BookOpen, TrendingUp, Code2 } from "lucide-react";

const features = [
  {
    icon: Brain,
    tag: "Core Method",
    title: "Socratic Guidance",
    description:
      "Neuronode never hands you the answer. It asks the question that leads you there. Each hint is a carefully crafted prompt that pushes your reasoning one layer deeper — until the solution clicks on its own.",
    color: "#2563EB",
    bg: "#EFF6FF",
    visual: (
      <div className="bg-[#0B1220] rounded-2xl p-6 font-mono text-sm space-y-3">
        <div className="text-[#64748B]">// Two Sum — Arrays</div>
        <div className="text-[#94A3B8]">
          Given nums = [2,7,11,15], target = 9
        </div>
        <div className="h-px bg-white/10 my-2" />
        <div className="flex items-start gap-2">
          <span className="text-[#14B8A6] flex-shrink-0">→</span>
          <span className="text-white/80">
            What data structure gives you O(1) lookup?
          </span>
        </div>
        <div className="flex items-start gap-2">
          <span className="text-[#14B8A6] flex-shrink-0">→</span>
          <span className="text-white/60">
            Could you check for the complement as you iterate?
          </span>
        </div>
        <div className="flex items-start gap-2">
          <span className="text-[#14B8A6] flex-shrink-0">→</span>
          <span className="text-white/40">
            For each num, does (target - num) exist in what you've stored?
          </span>
        </div>
      </div>
    ),
  },
  {
    icon: Target,
    tag: "Pattern System",
    title: "Recognition Over Memorization",
    description:
      "Every DSA problem belongs to a pattern family. Once you see the pattern, every problem in that family becomes solvable. Neuronode teaches the 15 core patterns that cover 90% of all interview problems.",
    color: "#8B5CF6",
    bg: "#F5F3FF",
    visual: (
      <div className="bg-[#0B1220] rounded-2xl p-6 space-y-3">
        {[
          { name: "Hashmap / Two Pointers", count: 7, color: "#2563EB" },
          { name: "Sliding Window", count: 5, color: "#8B5CF6" },
          { name: "Binary Search", count: 4, color: "#14B8A6" },
          { name: "Dynamic Programming", count: 3, color: "#F59E0B" },
        ].map((p) => (
          <div key={p.name}>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-white/70 font-mono">{p.name}</span>
              <span className="text-white/40 font-mono">
                {p.count} problems
              </span>
            </div>
            <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: `${(p.count / 7) * 100}%` }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: 0.3 }}
                className="h-full rounded-full"
                style={{ backgroundColor: p.color }}
              />
            </div>
          </div>
        ))}
      </div>
    ),
  },
  {
    icon: Zap,
    tag: "Test Mode",
    title: "Pressure Makes Patterns Permanent",
    description:
      "No hints. Timer running. Pure problem solving. Test Mode replicates the interview environment exactly — then shows you the optimal solution with a faster coding approach when time is up.",
    color: "#F59E0B",
    bg: "#FFFBEB",
    visual: (
      <div className="bg-[#0B1220] rounded-2xl p-6 font-mono text-sm">
        <div className="flex justify-between items-center mb-4">
          <span className="text-white/60 text-xs uppercase tracking-widest">
            Test Mode
          </span>
          <span className="text-[#EF4444] font-bold">12:47</span>
        </div>
        <div className="text-white/80 mb-4">Maximum Subarray</div>
        <div className="bg-white/5 rounded-lg p-3 text-[#94A3B8] text-xs leading-relaxed">
          Find the contiguous subarray with the largest sum.
          <br />
          <br />
          Input: [-2,1,-3,4,-1,2,1,-5,4]
          <br />
          Output: 6
        </div>
        <div className="mt-4 flex gap-2">
          <div className="flex-1 h-8 bg-white/5 rounded border border-white/10 flex items-center px-3">
            <span className="text-white/20 text-xs">Your solution...</span>
          </div>
          <button className="bg-[#2563EB] text-white text-xs px-3 rounded">
            Submit
          </button>
        </div>
      </div>
    ),
  },
];

export default function Features() {
  return (
    <section className="py-32 bg-[#F8FAFC]">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl mb-24"
        >
          <span className="inline-block text-[#2563EB] text-sm font-semibold uppercase tracking-widest mb-4">
            Why Neuronode
          </span>
          <h2 className="text-5xl font-bold text-[#1E2937] mb-6 leading-tight tracking-tight">
            Built different.
            <br />
            <span className="text-[#2563EB]">By design.</span>
          </h2>
          <p className="text-[#64748B] text-lg leading-relaxed">
            Every other platform gives you problems and expects you to figure it
            out. Neuronode teaches you how to think — permanently.
          </p>
        </motion.div>

        {/* Alternating Features */}
        <div className="space-y-32">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            const isReversed = index % 2 !== 0;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
                className={`grid grid-cols-1 lg:grid-cols-2 gap-16 items-center ${
                  isReversed ? "lg:[direction:rtl]" : ""
                }`}
              >
                {/* Text Side */}
                <div className="lg:[direction:ltr]">
                  <div
                    className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-widest mb-6"
                    style={{
                      backgroundColor: feature.bg,
                      color: feature.color,
                    }}
                  >
                    <Icon className="w-3 h-3" />
                    {feature.tag}
                  </div>
                  <h3 className="text-4xl font-bold text-[#1E2937] mb-4 leading-tight tracking-tight">
                    {feature.title}
                  </h3>
                  <p className="text-[#64748B] text-lg leading-relaxed">
                    {feature.description}
                  </p>
                </div>

                {/* Visual Side */}
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                  className="lg:[direction:ltr] shadow-2xl shadow-slate-200 rounded-2xl overflow-hidden"
                >
                  {feature.visual}
                </motion.div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
