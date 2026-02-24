'use client';

import Header from '../../../app/components/Header';
import { Search, CheckCircle, ArrowRight, BarChart2, Target, TrendingUp, ChevronRight, Layers, Zap, Globe } from 'lucide-react';
import Link from 'next/link';
import ServiceNavigation from '../ServiceNavigation';
import Image from 'next/image';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { useRef } from 'react';

// ─── Variants ───────────────────────────────────────────────────────────────

const fadeUp = {
  hidden: { opacity: 0, y: 44 },
  show: (d = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.78, ease: [0.22, 1, 0.36, 1], delay: d } }),
};
const fadeLeft = {
  hidden: { opacity: 0, x: -52 },
  show: (d = 0) => ({ opacity: 1, x: 0, transition: { duration: 0.82, ease: [0.22, 1, 0.36, 1], delay: d } }),
};
const fadeRight = {
  hidden: { opacity: 0, x: 52 },
  show: (d = 0) => ({ opacity: 1, x: 0, transition: { duration: 0.82, ease: [0.22, 1, 0.36, 1], delay: d } }),
};
const scaleIn = {
  hidden: { opacity: 0, scale: 0.84 },
  show: (d = 0) => ({ opacity: 1, scale: 1, transition: { duration: 0.76, ease: [0.22, 1, 0.36, 1], delay: d } }),
};
const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.04 } },
};
const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.56, ease: [0.22, 1, 0.36, 1] } },
};

// ─── Helpers ────────────────────────────────────────────────────────────────

function Reveal({ children, variants, custom, className }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: false, margin: '-70px' });
  return (
    <motion.div ref={ref} initial="hidden" animate={inView ? 'show' : 'hidden'}
      variants={variants} custom={custom} className={className}>
      {children}
    </motion.div>
  );
}

function Parallax({ children, speed = 0.12, className }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], [`${speed * -90}px`, `${speed * 90}px`]);
  return <motion.div ref={ref} style={{ y }} className={className}>{children}</motion.div>;
}

// Infinite marquee ticker
function Marquee({ items }) {
  return (
    <div className="overflow-hidden whitespace-nowrap">
      <motion.div
        className="inline-flex gap-12"
        animate={{ x: ['0%', '-50%'] }}
        transition={{ duration: 22, repeat: Infinity, ease: 'linear' }}
      >
        {[...items, ...items].map((t, i) => (
          <span key={i} className="text-[11px] font-bold tracking-[0.22em] uppercase text-white/20 inline-flex items-center gap-3">
            {t} <span className="w-1 h-1 rounded-full bg-white/15 inline-block" />
          </span>
        ))}
      </motion.div>
    </div>
  );
}

// ─── Page ───────────────────────────────────────────────────────────────────

export default function ResearchConsultancyPage() {
  const features = [
    { label: 'Market Analysis & Trends', icon: BarChart2 },
    { label: 'Investment Advisory',      icon: TrendingUp },
    { label: 'Feasibility Studies',      icon: Layers },
    { label: 'Property Valuation',       icon: Target },
    { label: 'Demographic Research',     icon: Globe },
    { label: 'Competitive Analysis',     icon: Search },
    { label: 'Risk Assessment',          icon: Zap },
    { label: 'ROI Projections',          icon: BarChart2 },
  ];

  const benefits = [
    'Data-driven decisions',
    'Market insights',
    'Risk mitigation',
    'Strategic planning',
    'Expert guidance',
  ];

  const marqueeItems = [
    'Market Analysis', 'Investment Advisory', 'Feasibility Studies',
    'Property Valuation', 'Risk Assessment', 'ROI Projections', 'Strategic Planning',
  ];

  return (
    <>
      <Header />
      <main className="min-h-screen bg-[#07090b] text-white pb-32 overflow-x-hidden">

        {/* ══════════════════════════════════════════════════════════
            HERO — diagonal split: text top-left, huge image right
            bleeding edge with a bold tilted accent band
        ══════════════════════════════════════════════════════════ */}
        <section className="relative min-h-screen overflow-hidden flex items-center">

          {/* Tilted dark accent band behind image */}
          <div className="absolute top-0 right-[-8%] w-[58%] h-full bg-[#0d1117] skew-x-[-4deg] origin-top-right z-0" />

          {/* Hero image — right side, clipped inside the band */}
          <div className="absolute top-0 right-0 w-[52%] h-full z-[1] hidden lg:block overflow-hidden">
            <Parallax speed={0.1} className="absolute inset-0 w-full h-[115%] -top-[7%]">
              <Image src="/research-pics/research-4.jpg" alt="Research" fill priority className="object-cover" />
            </Parallax>
            <div className="absolute inset-0 bg-gradient-to-r from-[#07090b] via-[#07090b]/30 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#07090b]/70 to-transparent" />
          </div>

          {/* Text column */}
          <div className="relative z-10 container mx-auto px-4 md:px-6 pt-32">
            <ServiceNavigation />

            <motion.div className="mt-14 max-w-lg" initial="hidden" animate="show" variants={stagger}>

              {/* Index chip */}
              <motion.div variants={fadeUp} custom={0}
                className="inline-flex items-center gap-2.5 mb-10">
                <span className="text-[10px] font-black tracking-[0.3em] uppercase text-white/20">01 —</span>
                <span className="text-[10px] font-black tracking-[0.3em] uppercase text-white/40">Research & Consultancy</span>
              </motion.div>

              {/* Headline */}
              <motion.h1 variants={fadeUp} custom={0.08}
                className="text-[clamp(3.4rem,7vw,6rem)] font-black leading-[0.95] tracking-[-0.035em] text-white mb-2">
                Know the
              </motion.h1>
              <motion.h1 variants={fadeUp} custom={0.16}
                className="text-[clamp(3.4rem,7vw,6rem)] font-black leading-[0.95] tracking-[-0.035em] mb-2"
                style={{ WebkitTextStroke: '1.5px rgba(255,255,255,0.18)', color: 'transparent' }}>
                Market.
              </motion.h1>
              <motion.h1 variants={fadeUp} custom={0.24}
                className="text-[clamp(3.4rem,7vw,6rem)] font-black leading-[0.95] tracking-[-0.035em] text-white mb-10">
                Win the Deal.
              </motion.h1>

              <motion.p variants={fadeUp} custom={0.32}
                className="text-[13px] text-white/38 leading-[1.95] mb-11 max-w-[320px] border-l-2 border-white/8 pl-4">
                Expert market research and consultancy to help you make informed,
                confident real estate investment decisions — backed by real data.
              </motion.p>

              <motion.div variants={fadeUp} custom={0.40} className="flex items-center gap-5 mb-16">
                <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
                  <Link href="/contact"
                    className="inline-flex items-center gap-2 bg-white text-black px-7 py-[14px] rounded-full font-black text-sm hover:bg-white/90 transition-colors">
                    Get Started <ArrowRight className="w-4 h-4" />
                  </Link>
                </motion.div>
                <motion.div whileHover={{ x: 4, transition: { duration: 0.18 } }}>
                  <Link href="#services"
                    className="text-[13px] text-white/30 hover:text-white/60 transition-colors flex items-center gap-1.5">
                    Explore services <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </motion.div>
              </motion.div>

              {/* Horizontal stat row */}
              <motion.div variants={fadeUp} custom={0.48}
                className="flex items-center gap-8 pt-8 border-t border-white/[0.06]">
                {[
                  { n: '200+', l: 'Reports' },
                  { n: '98%',  l: 'Accuracy' },
                  { n: '12yr', l: 'Experience' },
                ].map(({ n, l }) => (
                  <div key={l}>
                    <p className="text-2xl font-black text-white">{n}</p>
                    <p className="text-[10px] text-white/25 uppercase tracking-widest mt-0.5">{l}</p>
                  </div>
                ))}
              </motion.div>
            </motion.div>
          </div>

          {/* Floating glass card — bottom-right of hero */}
          <motion.div
            className="absolute bottom-14 right-8 bg-[#07090b]/70 backdrop-blur-xl border border-white/10 rounded-2xl px-5 py-4 z-20 hidden lg:flex items-center gap-3.5"
            initial={{ opacity: 0, y: 28, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.75, delay: 1, ease: [0.22, 1, 0.36, 1] }}
            whileHover={{ scale: 1.06, transition: { duration: 0.2 } }}
          >
            <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center">
              <BarChart2 className="w-4 h-4 text-white/70" />
            </div>
            <div>
              <p className="text-[10px] text-white/35 leading-none mb-1">Accuracy Rate</p>
              <p className="text-lg font-black text-white">98% Verified</p>
            </div>
          </motion.div>

          {/* White label chip — mid image */}
          <motion.div
            className="absolute top-[38%] right-[8%] bg-white text-black text-[11px] font-black px-4 py-2 rounded-full shadow-xl z-20 hidden lg:block"
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 1.15, ease: 'backOut' }}
            whileHover={{ scale: 1.08, transition: { duration: 0.18 } }}
          >
            200+ Reports Delivered
          </motion.div>
        </section>

        {/* ══════════════════════════════════════════════════════════
            MARQUEE TICKER — scrolling service names
        ══════════════════════════════════════════════════════════ */}
        <div className="border-t border-b border-white/[0.05] py-4 bg-[#0a0d10]">
          <Marquee items={marqueeItems} />
        </div>

        {/* ══════════════════════════════════════════════════════════
            OVERVIEW — pinned number + floating text blocks
            Full-width layout, text scattered at varying indents
        ══════════════════════════════════════════════════════════ */}
        <section className="container mx-auto px-4 md:px-6 mt-28 relative">

          {/* Ghost section index */}
          <motion.div
            className="absolute -top-8 left-0 text-[22vw] font-black text-white/[0.025] leading-none select-none pointer-events-none hidden lg:block"
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
            viewport={{ once: false }} transition={{ duration: 1.4 }}
          >
            01
          </motion.div>

          {/* Top label */}
          <Reveal variants={fadeUp} className="mb-20 relative z-10">
            <p className="text-[10px] font-bold tracking-[0.28em] uppercase text-white/22 flex items-center gap-2">
              <span className="w-5 h-px bg-white/15" /> Our Approach
            </p>
          </Reveal>

          {/* Two-row scattered layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-y-12 relative z-10">

            {/* Large image block — col 1-7, offset down */}
            <Reveal variants={fadeLeft} className="lg:col-span-7 lg:mt-0">
              <div className="relative h-[420px] rounded-3xl overflow-hidden shadow-[0_50px_120px_rgba(0,0,0,0.75)]">
                <Parallax speed={0.09} className="absolute inset-0 w-full h-[115%] -top-[7%]">
                  <Image src="/research-pics/research-6.jpg" alt="Market research" fill className="object-cover" />
                </Parallax>
                <div className="absolute inset-0 bg-gradient-to-t from-[#07090b]/60 to-transparent" />

                {/* Badge pinned bottom-left */}
                <motion.div
                  className="absolute bottom-6 left-6 bg-[#07090b]/65 backdrop-blur-xl border border-white/10 rounded-2xl px-5 py-4"
                  initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: false }} transition={{ duration: 0.65, delay: 0.3 }}
                  whileHover={{ scale: 1.06, transition: { duration: 0.2 } }}
                >
                  <p className="text-2xl font-black text-white">12+</p>
                  <p className="text-[10px] text-white/35 mt-0.5 tracking-widest uppercase">Years<br/>Expertise</p>
                </motion.div>

                {/* Chip — top right */}
                <motion.div
                  className="absolute top-5 right-5 bg-white text-black text-[10px] font-black px-3 py-1.5 rounded-full"
                  initial={{ opacity: 0, scale: 0.7 }} whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: false }} transition={{ duration: 0.5, delay: 0.45, ease: 'backOut' }}
                >
                  Data-Driven
                </motion.div>
              </div>
            </Reveal>

            {/* Text — col 8-12, offset top to create staggered feel */}
            <motion.div
              className="lg:col-span-5 lg:pl-12 lg:-mt-6 flex flex-col justify-center"
              initial="hidden" whileInView="show"
              viewport={{ once: false, margin: '-70px' }} variants={stagger}
            >
              <motion.h2 variants={item}
                className="text-3xl md:text-[2.6rem] font-black leading-[1.06] tracking-tight text-white mb-7">
                Intelligence That Drives Strategy
              </motion.h2>
              <motion.p variants={item} className="text-[13px] text-white/38 leading-[1.95] mb-5">
                Our research services give you the insights needed to make confident
                real estate decisions — combining deep market knowledge with advanced analytics.
              </motion.p>
              <motion.p variants={item} className="text-[13px] text-white/38 leading-[1.95] mb-10">
                Whether you're considering an investment, developing a property, or planning
                a strategic move, our team provides the research to guide your decisions.
              </motion.p>

              <motion.ul variants={stagger} className="space-y-0">
                {benefits.map((b, i) => (
                  <motion.li key={i} variants={item}
                    className="flex items-center gap-4 py-[14px] border-b border-white/[0.05] text-[13px] text-white/45 group cursor-default"
                    whileHover={{ x: 7, color: 'rgba(255,255,255,0.88)', transition: { duration: 0.18 } }}>
                    <motion.span className="w-[5px] h-[5px] rounded-full border border-white/25 flex-shrink-0"
                      initial={{ scale: 0 }} whileInView={{ scale: 1 }}
                      viewport={{ once: false }}
                      transition={{ duration: 0.3, delay: i * 0.07, ease: 'backOut' }} />
                    {b}
                    <ChevronRight className="w-3 h-3 ml-auto opacity-0 group-hover:opacity-25 transition-opacity" />
                  </motion.li>
                ))}
              </motion.ul>
            </motion.div>

            {/* Second image — col 5-9, offset right and down, crossing the grid line */}
            <div className="lg:col-span-12 flex justify-end lg:-mt-16 relative z-10">
              <Reveal variants={fadeRight} className="w-full lg:w-[55%]">
                <div className="relative h-[260px] rounded-2xl overflow-hidden shadow-[0_30px_80px_rgba(0,0,0,0.75)]">
                  <Parallax speed={0.07} className="absolute inset-0 w-full h-[115%] -top-[7%]">
                    <Image src="/research-pics/research-5.jpg" alt="Consultancy" fill className="object-cover object-center" />
                  </Parallax>
                  <div className="absolute inset-0 bg-gradient-to-r from-[#07090b]/50 to-transparent" />
                  <motion.div
                    className="absolute bottom-5 left-6"
                    initial={{ opacity: 0, x: -16 }} whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: false }} transition={{ duration: 0.6, delay: 0.25 }}
                  >
                    <p className="text-white font-black text-base">Proven track record.</p>
                    <p className="text-white/35 text-xs mt-0.5">200+ reports, 98% accuracy.</p>
                  </motion.div>
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════
            SERVICES — alternating wide/narrow card rows
        ══════════════════════════════════════════════════════════ */}
        <section id="services" className="container mx-auto px-4 md:px-6 mt-32 relative">

          <motion.div
            className="absolute -top-8 right-0 text-[22vw] font-black text-white/[0.025] leading-none select-none pointer-events-none hidden lg:block"
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
            viewport={{ once: false }} transition={{ duration: 1.4 }}
          >
            02
          </motion.div>

          <Reveal variants={fadeUp} className="mb-14 relative z-10">
            <div className="flex items-end justify-between">
              <div>
                <p className="text-[10px] font-bold tracking-[0.28em] uppercase text-white/22 mb-3 flex items-center gap-2">
                  <span className="w-5 h-px bg-white/12" /> Services
                </p>
                <h2 className="text-4xl md:text-5xl font-black tracking-[-0.025em] text-white">
                  Our Services Include
                </h2>
              </div>
              <p className="text-xs text-white/18 hidden md:block text-right leading-relaxed">
                Full-spectrum<br />intelligence
              </p>
            </div>
          </Reveal>

          {/* Row 1 — 1 wide + 1 narrow */}
          <motion.div className="grid grid-cols-12 gap-4 mb-4"
            initial="hidden" whileInView="show"
            viewport={{ once: false, margin: '-60px' }} variants={stagger}
          >
            {/* Wide card */}
            <motion.div variants={item}
              className="col-span-12 md:col-span-7 group bg-[#0c0f13] border border-white/[0.05] rounded-3xl p-8 flex items-start gap-6 cursor-default overflow-hidden relative"
              whileHover={{ borderColor: 'rgba(255,255,255,0.12)', y: -4, transition: { duration: 0.22 } }}>
              <div className="absolute inset-0 bg-gradient-to-br from-white/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-3xl" />
              <motion.div className="w-10 h-10 rounded-xl bg-white/[0.06] border border-white/[0.07] flex items-center justify-center flex-shrink-0 mt-0.5 relative z-10"
                initial={{ rotate: -90, opacity: 0 }} whileInView={{ rotate: 0, opacity: 1 }}
                viewport={{ once: false }} transition={{ duration: 0.4, ease: 'backOut' }}>
                <BarChart2 className="w-4 h-4 text-white/40" />
              </motion.div>
              <div className="relative z-10">
                <h3 className="text-base font-black text-white/70 group-hover:text-white/95 transition-colors mb-1.5">Market Analysis & Trends</h3>
                <p className="text-[12px] text-white/30 leading-relaxed">Deep market intelligence across residential, commercial, and mixed-use segments with actionable trend forecasting.</p>
              </div>
            </motion.div>

            {/* Narrow card */}
            <motion.div variants={item}
              className="col-span-12 md:col-span-5 group bg-[#0c0f13] border border-white/[0.05] rounded-3xl p-8 cursor-default overflow-hidden relative"
              whileHover={{ borderColor: 'rgba(255,255,255,0.12)', y: -4, transition: { duration: 0.22 } }}>
              <div className="absolute inset-0 bg-gradient-to-br from-white/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-3xl" />
              <motion.div className="w-10 h-10 rounded-xl bg-white/[0.06] border border-white/[0.07] flex items-center justify-center mb-5 relative z-10"
                initial={{ rotate: -90, opacity: 0 }} whileInView={{ rotate: 0, opacity: 1 }}
                viewport={{ once: false }} transition={{ duration: 0.4, delay: 0.08, ease: 'backOut' }}>
                <TrendingUp className="w-4 h-4 text-white/40" />
              </motion.div>
              <h3 className="text-base font-black text-white/70 group-hover:text-white/95 transition-colors relative z-10">Investment Advisory</h3>
            </motion.div>
          </motion.div>

          {/* Row 2 — 3 equal cards */}
          <motion.div className="grid grid-cols-12 gap-4 mb-4"
            initial="hidden" whileInView="show"
            viewport={{ once: false, margin: '-60px' }} variants={stagger}
          >
            {[
              { label: 'Feasibility Studies', icon: Layers },
              { label: 'Property Valuation',  icon: Target },
              { label: 'Demographic Research', icon: Globe },
            ].map(({ label, icon: Icon }, i) => (
              <motion.div key={label} variants={item}
                className="col-span-12 md:col-span-4 group bg-[#0c0f13] border border-white/[0.05] rounded-3xl p-7 cursor-default overflow-hidden relative"
                whileHover={{ borderColor: 'rgba(255,255,255,0.12)', y: -4, transition: { duration: 0.22 } }}>
                <div className="absolute inset-0 bg-gradient-to-br from-white/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-3xl" />
                <motion.div className="w-9 h-9 rounded-xl bg-white/[0.06] border border-white/[0.07] flex items-center justify-center mb-5 relative z-10"
                  initial={{ rotate: -90, opacity: 0 }} whileInView={{ rotate: 0, opacity: 1 }}
                  viewport={{ once: false }}
                  transition={{ duration: 0.4, delay: i * 0.07, ease: 'backOut' }}>
                  <Icon className="w-3.5 h-3.5 text-white/40" />
                </motion.div>
                <h3 className="text-sm font-black text-white/65 group-hover:text-white/92 transition-colors relative z-10">{label}</h3>
              </motion.div>
            ))}
          </motion.div>

          {/* Row 3 — image card + 2 narrow */}
          <motion.div className="grid grid-cols-12 gap-4"
            initial="hidden" whileInView="show"
            viewport={{ once: false, margin: '-60px' }} variants={stagger}
          >
            {/* Image card */}
            <motion.div variants={scaleIn}
              className="col-span-12 md:col-span-5 relative rounded-3xl overflow-hidden min-h-[200px] shadow-[0_30px_80px_rgba(0,0,0,0.7)]"
              whileHover={{ scale: 1.015, transition: { duration: 0.35 } }}>
              <Parallax speed={0.1} className="absolute inset-0 w-full h-[115%] -top-[7%]">
                <Image src="/research-pics/research-2.jpg" alt="Services" fill className="object-cover" />
              </Parallax>
              <div className="absolute inset-0 bg-gradient-to-t from-[#07090b]/85 via-[#07090b]/20 to-transparent" />
              <motion.div className="absolute bottom-6 left-6"
                initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false }} transition={{ duration: 0.6, delay: 0.3 }}>
                <p className="text-white font-black text-base">Intelligence First.</p>
                <p className="text-white/35 text-xs mt-0.5">Research before every decision.</p>
              </motion.div>
            </motion.div>

            {/* Two narrow cards */}
            <div className="col-span-12 md:col-span-7 grid grid-cols-2 gap-4">
              {[
                { label: 'Competitive Analysis', icon: Search },
                { label: 'Risk Assessment',      icon: Zap },
                { label: 'ROI Projections',      icon: BarChart2 },
                { label: 'Strategic Consulting', icon: Target },
              ].map(({ label, icon: Icon }, i) => (
                <motion.div key={label} variants={item}
                  className="group bg-[#0c0f13] border border-white/[0.05] rounded-3xl p-6 cursor-default overflow-hidden relative"
                  whileHover={{ borderColor: 'rgba(255,255,255,0.12)', y: -4, transition: { duration: 0.22 } }}>
                  <div className="absolute inset-0 bg-gradient-to-br from-white/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-3xl" />
                  <motion.div className="w-8 h-8 rounded-lg bg-white/[0.06] border border-white/[0.07] flex items-center justify-center mb-4 relative z-10"
                    initial={{ rotate: -90, opacity: 0 }} whileInView={{ rotate: 0, opacity: 1 }}
                    viewport={{ once: false }}
                    transition={{ duration: 0.4, delay: i * 0.06, ease: 'backOut' }}>
                    <Icon className="w-3.5 h-3.5 text-white/38" />
                  </motion.div>
                  <h3 className="text-sm font-black text-white/62 group-hover:text-white/90 transition-colors relative z-10 leading-snug">{label}</h3>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* ══════════════════════════════════════════════════════════
            CTA — full-width split panel (no container)
        ══════════════════════════════════════════════════════════ */}
        <section className="mt-36 grid grid-cols-1 lg:grid-cols-2 min-h-[520px]">

          {/* Left — dark text panel */}
          <motion.div
            className="bg-[#0a0d10] flex items-center px-10 md:px-20 py-20 relative overflow-hidden"
            initial="hidden" whileInView="show"
            viewport={{ once: false }} variants={stagger}
          >
            {/* Ghost number */}
            <div className="absolute bottom-0 left-0 text-[18vw] font-black text-white/[0.03] leading-none select-none pointer-events-none">03</div>

            <div className="relative z-10">
              <motion.p variants={item}
                className="text-[10px] font-bold tracking-[0.28em] uppercase text-white/22 mb-6 flex items-center gap-2">
                <span className="w-5 h-px bg-white/12" /> Get In Touch
              </motion.p>
              <motion.h2 variants={item}
                className="text-5xl md:text-6xl font-black leading-[0.97] tracking-[-0.03em] text-white mb-2">
                Ready to Make
              </motion.h2>
              <motion.h2 variants={item}
                className="text-5xl md:text-6xl font-black leading-[0.97] tracking-[-0.03em] text-white/18 mb-10">
                Informed Decisions?
              </motion.h2>
              <motion.p variants={item}
                className="text-[13px] text-white/35 max-w-sm leading-[1.9] mb-10 border-l-2 border-white/8 pl-4">
                Contact us for expert research and consultancy services that give
                you the competitive edge in every decision.
              </motion.p>
              <motion.div variants={item} className="flex items-center gap-5">
                <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
                  <Link href="/contact"
                    className="inline-flex items-center gap-2 bg-white text-black px-7 py-[14px] rounded-full font-black text-sm hover:bg-white/90 transition-colors">
                    Get Started <ArrowRight className="w-4 h-4" />
                  </Link>
                </motion.div>
                <motion.div whileHover={{ x: 4, transition: { duration: 0.18 } }}>
                  <Link href="/contact"
                    className="text-[13px] text-white/28 hover:text-white/58 transition-colors flex items-center gap-1.5">
                    Call us now <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </motion.div>
              </motion.div>
            </div>
          </motion.div>

          {/* Right — full image panel */}
          <div className="relative min-h-[360px] lg:min-h-0 overflow-hidden">
            <Parallax speed={0.08} className="absolute inset-0 w-full h-[115%] -top-[7%]">
              <Image src="/research-pics/research-3.jpg" alt="CTA" fill className="object-cover" />
            </Parallax>
            <div className="absolute inset-0 bg-[#07090b]/30" />

            {/* Floating cards over image */}
            <motion.div
              className="absolute top-10 right-8 bg-[#07090b]/65 backdrop-blur-xl border border-white/10 rounded-2xl px-5 py-4 z-10"
              initial={{ opacity: 0, y: -20 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false }} transition={{ duration: 0.75, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ scale: 1.06, transition: { duration: 0.2 } }}
            >
              <p className="text-2xl font-black text-white">200+</p>
              <p className="text-[10px] text-white/35 mt-0.5 tracking-widest uppercase">Reports Done</p>
            </motion.div>

            <motion.div
              className="absolute bottom-10 left-8 bg-white text-black text-[11px] font-black px-4 py-2 rounded-full shadow-xl z-10"
              initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: false }} transition={{ duration: 0.7, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ scale: 1.07, transition: { duration: 0.18 } }}
            >
              98% Accuracy Rate
            </motion.div>
          </div>
        </section>

      </main>
    </>
  );
}