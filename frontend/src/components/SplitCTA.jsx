import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, BookOpen, Zap } from "lucide-react";

const panels = [
  {
    tag: "For Students",
    icon: BookOpen,
    title: "Learn to think,\nnot memorize.",
    description:
      "Pick a problem. Struggle with it. Get guided by Socratic hints. Walk away understanding the pattern — not just the solution. Free forever for core features.",
    cta: "Start Learning",
    href: "/signup",
    accent: "#2563EB",
    bg: "bg-[#F8FAFC]",
    text: "text-[#1E2937]",
    muted: "text-[#64748B]",
    border: "border-[#E2E8F0]",
    tagBg: "bg-[#EFF6FF]",
    tagColor: "text-[#2563EB]",
    visual: (
      <div className="mt-8 bg-white rounded-2xl border border-[#E2E8F0] shadow-xl shadow-slate-100 p-6 font-mono text-sm">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-2 h-2 rounded-full bg-[#EF4444]" />
          <div className="w-2 h-2 rounded-full bg-[#F59E0B]" />
          <div className="w-2 h-2 rounded-full bg-[#10B981]" />
          <span className="ml-2 text-[#94A3B8] text-xs">
            neuronode — learn mode
          </span>
        </div>
        <div className="space-y-3">
          <div className="text-[#1E2937] font-semibold">Two Sum</div>
          <div className="text-[#64748B] text-xs leading-relaxed">
            Given an array of integers, find two numbers that add to target.
          </div>
          <div className="h-px bg-[#E2E8F0]" />
          <div className="space-y-2">
            <div className="flex items-start gap-2">
              <span className="text-[#2563EB] flex-shrink-0 text-xs mt-0.5">
                Hint 1
              </span>
              <span className="text-[#64748B] text-xs">
                What data structure lets you check if a value exists in O(1)?
              </span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-[#94A3B8] flex-shrink-0 text-xs mt-0.5">
                Hint 2
              </span>
              <span className="text-[#94A3B8] text-xs opacity-50">
                Unlock next hint...
              </span>
            </div>
          </div>
        </div>
      </div>
    ),
  },
  {
    tag: "Test Mode",
    icon: Zap,
    title: "Pressure makes\npatterns permanent.",
    description:
      "No hints. Timer running. Real interview pressure. Solve it or don't — then see the optimal solution and the faster way to code it. This is where mastery happens.",
    cta: "Enter Test Mode",
    href: "/test",
    accent: "#0B1220",
    bg: "bg-[#0B1220]",
    text: "text-white",
    muted: "text-[#64748B]",
    border: "border-white/10",
    tagBg: "bg-white/10",
    tagColor: "text-[#14B8A6]",
    visual: (
      <div className="mt-8 bg-white/5 rounded-2xl border border-white/10 p-6 font-mono text-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-white/20" />
            <div className="w-2 h-2 rounded-full bg-white/20" />
            <div className="w-2 h-2 rounded-full bg-white/20" />
            <span className="ml-2 text-white/30 text-xs">
              neuronode — test mode
            </span>
          </div>
          <motion.span
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="text-[#EF4444] font-bold text-sm"
          >
            08:23
          </motion.span>
        </div>
        <div className="space-y-3">
          <div className="text-white font-semibold">Maximum Subarray</div>
          <div className="text-white/40 text-xs leading-relaxed">
            Find the contiguous subarray with the largest sum.
          </div>
          <div className="h-px bg-white/10" />
          <div className="bg-white/5 rounded-lg p-3 text-white/60 text-xs">
            Input: [-2,1,-3,4,-1,2,1,-5,4]
            <br />
            Output: 6
          </div>
          <div className="flex gap-2">
            <div className="flex-1 h-8 bg-white/5 rounded border border-white/10 flex items-center px-3">
              <motion.span
                animate={{ opacity: [1, 0] }}
                transition={{ duration: 0.8, repeat: Infinity }}
                className="w-px h-3 bg-[#14B8A6]"
              />
            </div>
            <button className="bg-[#2563EB] text-white text-xs px-3 rounded font-semibold">
              Submit
            </button>
          </div>
          <div className="text-center text-white/20 text-xs">
            No hints available in test mode
          </div>
        </div>
      </div>
    ),
  },
];

export default function SplitCTA() {
  return (
    <section className="bg-[#F8FAFC]">
      <div className="max-w-7xl mx-auto px-6 py-24">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-block text-[#2563EB] text-sm font-semibold uppercase tracking-widest mb-4">
            Two Modes
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-[#1E2937] tracking-tight">
            One platform. <span className="text-[#2563EB]">Two paths.</span>
          </h2>
        </motion.div>

        {/* Split Panels */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {panels.map((panel, index) => {
            const Icon = panel.icon;
            return (
              <motion.div
                key={panel.tag}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                whileHover={{ scale: 1.01 }}
                className={`${panel.bg} rounded-3xl border ${panel.border} p-10 transition-all duration-300`}
              >
                {/* Tag */}
                <div
                  className={`inline-flex items-center gap-2 ${panel.tagBg} ${panel.tagColor} px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-widest mb-6`}
                >
                  <Icon className="w-3 h-3" />
                  {panel.tag}
                </div>

                {/* Title */}
                <h3
                  className={`text-3xl md:text-4xl font-bold ${panel.text} leading-tight tracking-tight mb-4 whitespace-pre-line`}
                >
                  {panel.title}
                </h3>

                {/* Description */}
                <p className={`${panel.muted} text-base leading-relaxed mb-6`}>
                  {panel.description}
                </p>

                {/* CTA */}
                <Link
                  to={panel.href}
                  className="group inline-flex items-center gap-2 font-semibold text-sm transition-all duration-200"
                  style={{
                    color: panel.tag === "Test Mode" ? "#14B8A6" : panel.accent,
                  }}
                >
                  {panel.cta}
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>

                {/* Visual */}
                {panel.visual}
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
