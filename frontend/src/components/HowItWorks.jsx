import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const words = [
  "Stop",
  "grinding",
  "problems",
  "blindly.",
  "Start",
  "understanding",
  "why",
  "they",
  "work.",
];

const steps = [
  {
    number: "01",
    title: "Pick a Problem",
    description:
      "Browse by category. Each problem shows the pattern family it belongs to — so you know exactly what skill you are training.",
    color: "#2563EB",
  },
  {
    number: "02",
    title: "Think First",
    description:
      "No hints yet. Attempt it. The struggle phase is where real pattern recognition develops. Sit with it.",
    color: "#14B8A6",
  },
  {
    number: "03",
    title: "Get Guided",
    description:
      "Stuck? Each hint is a Socratic question — not the answer. You are always one insight away, never completely lost.",
    color: "#8B5CF6",
  },
  {
    number: "04",
    title: "Master the Pattern",
    description:
      "See the optimal solution. Learn the pattern name. Understand where else it appears. Own it permanently.",
    color: "#F59E0B",
  },
];

export default function HowItWorks() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  const y = useTransform(scrollYProgress, [0, 0.2], [60, 0]);

  return (
    <>
      {/* Atmospheric Gradient Transition */}
      <div className="h-40 bg-gradient-to-b from-[#F8FAFC] to-[#0B1220]" />

      {/* Dark Immersive Section */}
      <section
        ref={ref}
        className="bg-[#0B1220] py-32 relative overflow-hidden"
      >
        {/* Particle dots background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(40)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-px h-px bg-white rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                opacity: Math.random() * 0.4 + 0.1,
              }}
              animate={{
                opacity: [0.1, 0.5, 0.1],
                scale: [1, 1.5, 1],
              }}
              transition={{
                duration: Math.random() * 4 + 3,
                repeat: Infinity,
                delay: Math.random() * 3,
              }}
            />
          ))}
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          {/* Massive Animated Text */}
          <motion.div style={{ opacity, y }} className="mb-24 max-w-5xl">
            <div className="flex flex-wrap gap-x-4 gap-y-2 mb-6">
              {words.map((word, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08, duration: 0.5 }}
                  whileHover={{ color: "#14B8A6", scale: 1.05 }}
                  className="text-4xl md:text-6xl font-bold text-white leading-tight cursor-default transition-colors duration-200"
                >
                  {word}
                </motion.span>
              ))}
            </div>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.8 }}
              className="text-[#64748B] text-lg max-w-xl"
            >
              Four steps that separate engineers who understand DSA from those
              who just memorize it.
            </motion.p>
          </motion.div>

          {/* Steps Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-white/5 rounded-2xl overflow-hidden">
            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                whileHover={{ backgroundColor: "rgba(255,255,255,0.05)" }}
                className="bg-[#0B1220] p-8 transition-colors duration-300"
              >
                {/* Number */}
                <div
                  className="text-5xl font-bold mb-6 font-mono"
                  style={{ color: step.color, opacity: 0.3 }}
                >
                  {step.number}
                </div>

                {/* Accent line */}
                <div
                  className="w-8 h-0.5 mb-6 rounded-full"
                  style={{ backgroundColor: step.color }}
                />

                {/* Content */}
                <h3 className="text-xl font-bold text-white mb-3">
                  {step.title}
                </h3>
                <p className="text-[#64748B] text-sm leading-relaxed">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>

          {/* Teal Gradient Scene — like HackerRank's atmospheric divider */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="mt-32 relative rounded-3xl overflow-hidden"
          >
            {/* Gradient background */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#14B8A6]/20 via-[#2563EB]/20 to-[#8B5CF6]/20" />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#0B1220]" />

            {/* Atmospheric glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-32 bg-[#14B8A6] rounded-full blur-3xl opacity-10" />

            <div className="relative z-10 py-20 px-12 text-center">
              <motion.h3
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight"
              >
                Ready to think{" "}
                <span className="text-[#14B8A6]">differently?</span>
              </motion.h3>
              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="text-[#64748B] text-lg mb-8 max-w-xl mx-auto"
              >
                Join engineers who stopped grinding LeetCode blindly and started
                actually understanding algorithms.
              </motion.p>
              <motion.a
                href="/signup"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                whileHover={{ scale: 1.05 }}
                className="inline-flex items-center gap-2 bg-white text-[#0B1220] font-bold px-8 py-4 rounded-xl hover:shadow-2xl hover:shadow-teal-500/20 transition-all duration-300"
              >
                Start for free
              </motion.a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Transition back to light */}
      <div className="h-40 bg-gradient-to-b from-[#0B1220] to-[#F8FAFC]" />
    </>
  );
}
