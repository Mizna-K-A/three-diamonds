'use client';

import Header from '../../../app/components/Header';
import {
  TrendingUp, CheckCircle, ArrowRight, ChevronRight,
  DollarSign, Briefcase, Link2, BarChart2, Shield, Users, Layers, Zap,
} from 'lucide-react';
import Link from 'next/link';
import ServiceNavigation from '../ServiceNavigation';
import Image from 'next/image';
import { motion, useScroll, useTransform, useInView, animate } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';

// ─── Variants ───────────────────────────────────────────────────────────────

const fadeUp = {
  hidden: { opacity: 0, y: 48 },
  show: (d = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: d } }),
};
const fadeLeft = {
  hidden: { opacity: 0, x: -56 },
  show: (d = 0) => ({ opacity: 1, x: 0, transition: { duration: 0.85, ease: [0.22, 1, 0.36, 1], delay: d } }),
};
const fadeRight = {
  hidden: { opacity: 0, x: 56 },
  show: (d = 0) => ({ opacity: 1, x: 0, transition: { duration: 0.85, ease: [0.22, 1, 0.36, 1], delay: d } }),
};
const scaleIn = {
  hidden: { opacity: 0, scale: 0.83 },
  show: (d = 0) => ({ opacity: 1, scale: 1, transition: { duration: 0.78, ease: [0.22, 1, 0.36, 1], delay: d } }),
};
const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
};
const staggerItem = {
  hidden: { opacity: 0, y: 26 },
  show: { opacity: 1, y: 0, transition: { duration: 0.58, ease: [0.22, 1, 0.36, 1] } },
};
const clipReveal = {
  hidden: { clipPath: 'inset(0 100% 0 0)' },
  show: (d = 0) => ({
    clipPath: 'inset(0 0% 0 0)',
    transition: { duration: 1.1, ease: [0.76, 0, 0.24, 1], delay: d },
  }),
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

// Horizontal marquee
function Ticker({ items }) {
  return (
    <div className="overflow-hidden whitespace-nowrap">
      <motion.div className="inline-flex gap-10"
        animate={{ x: ['0%', '-50%'] }}
        transition={{ duration: 26, repeat: Infinity, ease: 'linear' }}>
        {[...items, ...items].map((t, i) => (
          <span key={i} className="text-[10px] font-black tracking-[0.28em] uppercase text-white/18 inline-flex items-center gap-3">
            {t} <span className="w-[3px] h-[3px] rounded-full bg-white/15 inline-block" />
          </span>
        ))}
      </motion.div>
    </div>
  );
}

// Animated counter
function Counter({ to, suffix = '', duration = 2 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: false });
  const [val, setVal] = useState(0);

  useEffect(() => {
    if (!inView) { setVal(0); return; }
    const controls = animate(0, to, {
      duration,
      ease: 'easeOut',
      onUpdate: v => setVal(Math.round(v)),
    });
    return controls.stop;
  }, [inView, to, duration]);

  return <span ref={ref}>{val}{suffix}</span>;
}

// ─── Page ───────────────────────────────────────────────────────────────────

export default function CapitalMarketsPage() {
  const features = [
    { label: 'Investment Banking',  icon: Briefcase,  desc: 'End-to-end advisory for complex investment banking transactions across all real estate asset classes.' },
    { label: 'Debt Advisory',       icon: DollarSign, desc: 'Structuring and sourcing optimal debt solutions from our extensive lender network.' },
    { label: 'Equity Placement',    icon: TrendingUp, desc: 'Connecting clients with institutional and private equity capital for growth initiatives.' },
    { label: 'M&A Advisory',        icon: Link2,      desc: 'Strategic guidance through acquisitions, mergers and portfolio consolidations.' },
    { label: 'Portfolio Analysis',  icon: BarChart2,  desc: 'Deep analytics and valuation modeling across diversified real estate portfolios.' },
    { label: 'Capital Raising',     icon: Layers,     desc: 'Full-spectrum fundraising from seed capital through to large institutional placements.' },
    { label: 'Structured Finance',  icon: Shield,     desc: 'Innovative financial structures optimized for risk-adjusted returns.' },
    { label: 'Joint Ventures',      icon: Users,      desc: 'Identifying and structuring strategic joint venture partnerships for maximum value.' },
  ];

  const benefits = [
    'Access to capital',
    'Strategic advisory',
    'Market expertise',
    'Deal structuring',
    'Network of investors',
  ];

  const ticker = ['Investment Banking', 'Debt Advisory', 'Equity Placement', 'M&A Advisory',
    'Capital Raising', 'Structured Finance', 'Joint Ventures', 'Portfolio Analysis'];

  return (
    <>
      <Header />
      <main className="min-h-screen bg-[#050608] text-white pb-32 overflow-x-hidden">

        {/* ══════════════════════════════════════════════════════
            HERO — full-height stacked image wall + bold type
        ══════════════════════════════════════════════════════ */}
        <section className="relative min-h-screen overflow-hidden">

          {/* Three-panel image mosaic — right 55% */}
          <div className="absolute top-0 right-0 w-[55%] h-full hidden lg:grid grid-rows-3 gap-1 z-0">
            {/* Top panel */}
            <motion.div className="relative row-span-2 overflow-hidden"
              initial={{ opacity: 0, scale: 1.06 }} animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.3, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}>
              <Parallax speed={0.06} className="absolute inset-0 w-full h-[115%] -top-[7%]">
                <Image src="/capitalmarketing-pics/capital-4.jpg" alt="Capital" fill priority className="object-cover" />
              </Parallax>
              <div className="absolute inset-0 bg-gradient-to-l from-transparent to-[#050608]" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#050608]/60 to-transparent" />
            </motion.div>

            {/* Bottom two micro panels side by side */}
            <div className="grid grid-cols-2 gap-1">
              <motion.div className="relative overflow-hidden"
                initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.95, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}>
                <Image src="/capitalmarketing-pics/capital-10.jpg" alt="" fill className="object-cover" />
                <div className="absolute inset-0 bg-[#050608]/50" />
              </motion.div>
              <motion.div className="relative overflow-hidden"
                initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.95, delay: 0.65, ease: [0.22, 1, 0.36, 1] }}>
                <Image src="/capitalmarketing-pics/capital-5.jpg" alt="" fill className="object-cover" />
                <div className="absolute inset-0 bg-[#050608]/50" />
              </motion.div>
            </div>
          </div>

          {/* Left gradient fade over image */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#050608] via-[#050608]/90 to-transparent z-[1] hidden lg:block" />

          {/* Text */}
          <div className="relative z-10 container mx-auto px-4 md:px-6 flex flex-col justify-center min-h-screen pt-32 pb-20">
            <ServiceNavigation />

            <motion.div className="mt-12 max-w-[520px]" initial="hidden" animate="show" variants={stagger}>

              {/* Eyebrow */}
              <motion.div variants={fadeUp} custom={0}
                className="flex items-center gap-3 mb-10">
                <div className="w-7 h-7 rounded-lg bg-white/[0.06] border border-white/[0.08] flex items-center justify-center">
                  <TrendingUp className="w-3 h-3 text-white/50" />
                </div>
                <span className="text-[10px] font-black tracking-[0.28em] uppercase text-white/35">Capital Markets</span>
              </motion.div>

              {/* Headline — clip-reveal animation per word */}
              <div className="mb-10 overflow-hidden">
                <motion.div variants={clipReveal} custom={0.05} className="overflow-hidden mb-1">
                  <h1 className="text-[clamp(3.5rem,7.5vw,6.5rem)] font-black leading-[0.92] tracking-[-0.04em] text-white">
                    Capital
                  </h1>
                </motion.div>
                <motion.div variants={clipReveal} custom={0.18} className="overflow-hidden mb-1">
                  <h1 className="text-[clamp(3.5rem,7.5vw,6.5rem)] font-black leading-[0.92] tracking-[-0.04em]"
                    style={{ WebkitTextStroke: '1.5px rgba(255,255,255,0.2)', color: 'transparent' }}>
                    Without
                  </h1>
                </motion.div>
                <motion.div variants={clipReveal} custom={0.31} className="overflow-hidden">
                  <h1 className="text-[clamp(3.5rem,7.5vw,6.5rem)] font-black leading-[0.92] tracking-[-0.04em] text-white">
                    Limits.
                  </h1>
                </motion.div>
              </div>

              <motion.p variants={fadeUp} custom={0.44}
                className="text-[13px] text-white/38 max-w-[310px] leading-[1.95] mb-11 pl-4 border-l-2 border-white/8">
                Strategic capital markets advisory for real estate investments, acquisitions,
                and portfolio management — connecting you to the capital you need.
              </motion.p>

              {/* CTA row */}
              <motion.div variants={fadeUp} custom={0.52} className="flex items-center gap-5 mb-16">
                <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
                  <Link href="/contact"
                    className="inline-flex items-center gap-2 bg-white text-black px-7 py-[14px] rounded-full font-black text-sm hover:bg-white/90 transition-colors">
                    Get Started <ArrowRight className="w-4 h-4" />
                  </Link>
                </motion.div>
                <motion.div whileHover={{ x: 4, transition: { duration: 0.18 } }}>
                  <Link href="#services"
                    className="text-[13px] text-white/28 hover:text-white/58 transition-colors flex items-center gap-1.5">
                    Our services <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </motion.div>
              </motion.div>

              {/* Animated counters */}
              <motion.div variants={fadeUp} custom={0.60}
                className="flex items-center gap-8 pt-8 border-t border-white/[0.06]">
                {[
                  { to: 5, suffix: 'B+', label: 'Capital Deployed' },
                  { to: 98, suffix: '%', label: 'Deal Success' },
                  { to: 150, suffix: '+', label: 'Transactions' },
                ].map(({ to, suffix, label }) => (
                  <div key={label}>
                    <p className="text-2xl font-black text-white">
                      $<Counter to={to} suffix={suffix} />
                    </p>
                    <p className="text-[10px] text-white/25 uppercase tracking-widest mt-0.5">{label}</p>
                  </div>
                ))}
              </motion.div>
            </motion.div>
          </div>

          {/* Floating data card */}
          <motion.div
            className="absolute bottom-16 right-[48%] bg-[#050608]/75 backdrop-blur-xl border border-white/10 rounded-2xl px-5 py-4 z-20 hidden lg:flex items-center gap-3.5"
            initial={{ opacity: 0, y: 24, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.75, delay: 1.1, ease: [0.22, 1, 0.36, 1] }}
            whileHover={{ scale: 1.06, transition: { duration: 0.2 } }}
          >
            <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center">
              <DollarSign className="w-4 h-4 text-white/70" />
            </div>
            <div>
              <p className="text-[10px] text-white/32 mb-0.5">Capital Deployed</p>
              <p className="text-lg font-black text-white">$5B+</p>
            </div>
          </motion.div>
        </section>

        {/* ══════════════════════════════════════════════════════
            TICKER
        ══════════════════════════════════════════════════════ */}
        <div className="border-t border-b border-white/[0.05] py-[14px] bg-[#080b0e]">
          <Ticker items={ticker} />
        </div>

        {/* ══════════════════════════════════════════════════════
            OVERVIEW — full-width image + text floating on top
        ══════════════════════════════════════════════════════ */}
        <section className="mt-28 relative">

          {/* Ghost number */}
          <motion.div
            className="absolute -top-8 right-0 text-[20vw] font-black text-white/[0.025] leading-none select-none pointer-events-none hidden lg:block"
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
            viewport={{ once: false }} transition={{ duration: 1.4 }}
          >01</motion.div>

          {/* Wide image — almost full width */}
          <Reveal variants={scaleIn} className="container mx-auto px-4 md:px-6">
            <div className="relative w-full h-[480px] rounded-3xl overflow-hidden shadow-[0_60px_140px_rgba(0,0,0,0.8)]">
              <Parallax speed={0.08} className="absolute inset-0 w-full h-[115%] -top-[7%]">
                <Image src="/capitalmarketing-pics/capital-6.jpg" alt="Overview" fill className="object-cover" />
              </Parallax>
              <div className="absolute inset-0 bg-gradient-to-r from-[#050608]/95 via-[#050608]/55 to-[#050608]/20" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#050608]/80 to-transparent" />

              {/* Text floating inside image */}
              <motion.div
                className="absolute inset-0 flex items-center px-10 md:px-16"
                initial="hidden" whileInView="show"
                viewport={{ once: false, margin: '-60px' }} variants={stagger}
              >
                <div className="max-w-lg">
                  <motion.p variants={staggerItem}
                    className="text-[10px] font-black tracking-[0.28em] uppercase text-white/25 mb-6 flex items-center gap-2">
                    <span className="w-5 h-px bg-white/15" /> Our Approach
                  </motion.p>
                  <motion.h2 variants={staggerItem}
                    className="text-4xl md:text-5xl font-black tracking-[-0.025em] text-white leading-[1.0] mb-7">
                    Advisory That Connects You to Capital
                  </motion.h2>
                  <motion.p variants={staggerItem}
                    className="text-[13px] text-white/45 leading-[1.9] mb-5">
                    Our capital markets team provides comprehensive advisory services for real estate
                    investments and transactions. We connect clients with capital sources and structure
                    deals that optimize returns.
                  </motion.p>
                  <motion.p variants={staggerItem}
                    className="text-[13px] text-white/45 leading-[1.9]">
                    From debt financing to equity placement, we guide you through the complex world
                    of real estate capital markets, ensuring you have the resources to execute your strategy.
                  </motion.p>
                </div>
              </motion.div>

              {/* Benefits list — right side floating inside image */}
              <motion.div
                className="absolute right-10 md:right-16 top-1/2 -translate-y-1/2 hidden xl:block"
                initial="hidden" whileInView="show"
                viewport={{ once: false }} variants={stagger}
              >
                <div className="bg-[#050608]/60 backdrop-blur-xl border border-white/10 rounded-2xl px-7 py-6 min-w-[200px]">
                  <p className="text-[10px] font-black tracking-[0.22em] uppercase text-white/28 mb-5">Why Choose Us</p>
                  <ul className="space-y-0">
                    {benefits.map((b, i) => (
                      <motion.li key={i} variants={staggerItem}
                        className="flex items-center gap-3 py-3 border-b border-white/[0.07] last:border-0 text-[12px] text-white/55 group cursor-default"
                        whileHover={{ x: 5, color: 'rgba(255,255,255,0.9)', transition: { duration: 0.16 } }}>
                        <motion.span className="w-1 h-1 rounded-full bg-white/25 flex-shrink-0"
                          initial={{ scale: 0 }} whileInView={{ scale: 1 }}
                          viewport={{ once: false }}
                          transition={{ duration: 0.28, delay: i * 0.07, ease: 'backOut' }} />
                        {b}
                      </motion.li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            </div>
          </Reveal>
        </section>

        {/* ══════════════════════════════════════════════════════
            SERVICES — layered asymmetric card layout
        ══════════════════════════════════════════════════════ */}
        <section id="services" className="container mx-auto px-4 md:px-6 mt-32 relative">

          <motion.div
            className="absolute -top-8 -left-4 text-[20vw] font-black text-white/[0.025] leading-none select-none pointer-events-none hidden lg:block"
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
            viewport={{ once: false }} transition={{ duration: 1.4 }}
          >02</motion.div>

          <Reveal variants={fadeUp} className="mb-14 relative z-10">
            <div className="flex items-end justify-between">
              <div>
                <p className="text-[10px] font-black tracking-[0.28em] uppercase text-white/22 mb-3 flex items-center gap-2">
                  <span className="w-5 h-px bg-white/12" /> Services
                </p>
                <h2 className="text-4xl md:text-5xl font-black tracking-[-0.025em] text-white">Our Services Include</h2>
              </div>
              <p className="text-xs text-white/18 hidden md:block text-right leading-relaxed">Full-spectrum<br />capital advisory</p>
            </div>
          </Reveal>

          {/* Row 1 — Two big feature cards with images inside */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {/* Card with image bg */}
            <motion.div
              className="relative rounded-3xl overflow-hidden min-h-[280px] shadow-[0_30px_80px_rgba(0,0,0,0.65)]"
              initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, margin: '-60px' }}
              transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ scale: 1.015, transition: { duration: 0.35 } }}
            >
              <Parallax speed={0.1} className="absolute inset-0 w-full h-[115%] -top-[7%]">
                <Image src="/capitalmarketing-pics/capital-3.jpg" alt="Investment Banking" fill className="object-cover" />
              </Parallax>
              <div className="absolute inset-0 bg-gradient-to-t from-[#050608]/92 via-[#050608]/40 to-transparent" />
              <motion.div className="absolute bottom-0 left-0 right-0 p-7"
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false }} transition={{ duration: 0.6, delay: 0.25 }}>
                <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center mb-4">
                  <Briefcase className="w-4 h-4 text-white/70" />
                </div>
                <h3 className="text-lg font-black text-white mb-1.5">Investment Banking</h3>
                <p className="text-[12px] text-white/40 leading-relaxed">End-to-end advisory for complex investment banking transactions across all real estate asset classes.</p>
              </motion.div>
            </motion.div>

            {/* Second image card */}
            <motion.div
              className="relative rounded-3xl overflow-hidden min-h-[280px] shadow-[0_30px_80px_rgba(0,0,0,0.65)]"
              initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, margin: '-60px' }}
              transition={{ duration: 0.85, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ scale: 1.015, transition: { duration: 0.35 } }}
            >
              <Parallax speed={0.1} className="absolute inset-0 w-full h-[115%] -top-[7%]">
                <Image src="/capitalmarketing-pics/capital-7.jpg" alt="M&A Advisory" fill className="object-cover" />
              </Parallax>
              <div className="absolute inset-0 bg-gradient-to-t from-[#050608]/92 via-[#050608]/40 to-transparent" />
              <motion.div className="absolute bottom-0 left-0 right-0 p-7"
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false }} transition={{ duration: 0.6, delay: 0.3 }}>
                <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center mb-4">
                  <Link2 className="w-4 h-4 text-white/70" />
                </div>
                <h3 className="text-lg font-black text-white mb-1.5">M&A Advisory</h3>
                <p className="text-[12px] text-white/40 leading-relaxed">Strategic guidance through acquisitions, mergers and portfolio consolidations.</p>
              </motion.div>
            </motion.div>
          </div>

          {/* Row 2 — 4 equal dark cards */}
          <motion.div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4"
            initial="hidden" whileInView="show"
            viewport={{ once: false, margin: '-60px' }} variants={stagger}>
            {[
              { label: 'Debt Advisory',      icon: DollarSign },
              { label: 'Equity Placement',   icon: TrendingUp },
              { label: 'Portfolio Analysis', icon: BarChart2 },
              { label: 'Capital Raising',    icon: Layers },
            ].map(({ label, icon: Icon }, i) => (
              <motion.div key={label} variants={staggerItem}
                className="group bg-[#0b0e12] border border-white/[0.05] rounded-2xl p-6 cursor-default relative overflow-hidden"
                whileHover={{ borderColor: 'rgba(255,255,255,0.13)', y: -5, transition: { duration: 0.2 } }}>
                <div className="absolute inset-0 bg-gradient-to-br from-white/[0.04] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />
                <motion.div
                  className="relative z-10 w-9 h-9 rounded-xl bg-white/[0.06] border border-white/[0.07] flex items-center justify-center mb-5"
                  initial={{ rotate: -90, scale: 0.5, opacity: 0 }}
                  whileInView={{ rotate: 0, scale: 1, opacity: 1 }}
                  viewport={{ once: false }}
                  transition={{ duration: 0.45, delay: i * 0.06, ease: 'backOut' }}>
                  <Icon className="w-4 h-4 text-white/40" />
                </motion.div>
                <h3 className="relative z-10 text-sm font-black text-white/60 group-hover:text-white/92 transition-colors">{label}</h3>
              </motion.div>
            ))}
          </motion.div>

          {/* Row 3 — wide description card + 2 narrow */}
          <motion.div className="grid grid-cols-12 gap-4"
            initial="hidden" whileInView="show"
            viewport={{ once: false, margin: '-60px' }} variants={stagger}>

            {/* Wide card with description */}
            <motion.div variants={staggerItem}
              className="col-span-12 md:col-span-6 group bg-[#0b0e12] border border-white/[0.05] rounded-3xl p-8 flex gap-6 cursor-default relative overflow-hidden"
              whileHover={{ borderColor: 'rgba(255,255,255,0.12)', y: -4, transition: { duration: 0.2 } }}>
              <div className="absolute inset-0 bg-gradient-to-br from-white/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-3xl" />
              <motion.div className="w-10 h-10 rounded-xl bg-white/[0.06] border border-white/[0.07] flex items-center justify-center flex-shrink-0 mt-0.5 relative z-10"
                initial={{ rotate: -90, opacity: 0 }} whileInView={{ rotate: 0, opacity: 1 }}
                viewport={{ once: false }} transition={{ duration: 0.4, ease: 'backOut' }}>
                <Shield className="w-4 h-4 text-white/40" />
              </motion.div>
              <div className="relative z-10">
                <h3 className="text-base font-black text-white/70 group-hover:text-white/95 transition-colors mb-2">Structured Finance</h3>
                <p className="text-[12px] text-white/32 leading-relaxed">Innovative financial structures optimized for risk-adjusted returns and maximum capital efficiency.</p>
              </div>
            </motion.div>

            {/* Two narrow */}
            <motion.div variants={staggerItem}
              className="col-span-6 md:col-span-3 group bg-[#0b0e12] border border-white/[0.05] rounded-3xl p-7 cursor-default relative overflow-hidden"
              whileHover={{ borderColor: 'rgba(255,255,255,0.12)', y: -4, transition: { duration: 0.2 } }}>
              <div className="absolute inset-0 bg-gradient-to-br from-white/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-3xl" />
              <motion.div className="w-9 h-9 rounded-xl bg-white/[0.06] border border-white/[0.07] flex items-center justify-center mb-5 relative z-10"
                initial={{ rotate: -90, opacity: 0 }} whileInView={{ rotate: 0, opacity: 1 }}
                viewport={{ once: false }} transition={{ duration: 0.4, delay: 0.08, ease: 'backOut' }}>
                <Users className="w-4 h-4 text-white/40" />
              </motion.div>
              <h3 className="relative z-10 text-sm font-black text-white/62 group-hover:text-white/90 transition-colors">Joint Ventures</h3>
            </motion.div>

            {/* Image mini card */}
            <motion.div variants={scaleIn}
              className="col-span-6 md:col-span-3 relative rounded-3xl overflow-hidden min-h-[160px]"
              whileHover={{ scale: 1.03, transition: { duration: 0.3 } }}>
              <Image src="/capitalmarketing-pics/capital-1.jpg" alt="" fill className="object-cover" />
              <div className="absolute inset-0 bg-[#050608]/55" />
              <motion.div className="absolute bottom-4 left-5"
                initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false }} transition={{ duration: 0.5, delay: 0.2 }}>
                <p className="text-white font-black text-sm">150+ Deals</p>
                <p className="text-white/35 text-[10px]">Closed</p>
              </motion.div>
            </motion.div>
          </motion.div>
        </section>

        {/* ══════════════════════════════════════════════════════
            NUMBER SHOWCASE — large animated counters strip
        ══════════════════════════════════════════════════════ */}
        <section className="mt-32 border-t border-b border-white/[0.05] bg-[#08090c]">
          <div className="container mx-auto px-4 md:px-6">
            <motion.div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-white/[0.05]"
              initial="hidden" whileInView="show"
              viewport={{ once: false, margin: '-60px' }} variants={stagger}>
              {[
                { to: 5,   suffix: 'B+', prefix: '$', label: 'Capital Deployed',    sub: 'across all strategies' },
                { to: 98,  suffix: '%',  prefix: '',  label: 'Deal Success Rate',   sub: 'verified & audited'    },
                { to: 150, suffix: '+',  prefix: '',  label: 'Transactions Closed', sub: 'last 10 years'         },
                { to: 80,  suffix: '+',  prefix: '',  label: 'Investor Network',    sub: 'global relationships'  },
              ].map(({ to, suffix, prefix, label, sub }, i) => (
                <motion.div key={label} variants={staggerItem}
                  className="py-12 px-8 group hover:bg-white/[0.02] transition-colors duration-300"
                  whileHover={{ y: -2, transition: { duration: 0.18 } }}>
                  <p className="text-[10px] font-black tracking-[0.22em] uppercase text-white/22 mb-3">{label}</p>
                  <p className="text-4xl md:text-5xl font-black text-white mb-1">
                    {prefix}<Counter to={to} suffix={suffix} duration={1.8} />
                  </p>
                  <p className="text-[11px] text-white/25">{sub}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════
            CTA — three-panel layout: image | text | image
        ══════════════════════════════════════════════════════ */}
        <section className="mt-32 container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch min-h-[440px]">

            {/* Left image */}
            <Reveal variants={fadeLeft} className="lg:col-span-3 relative rounded-3xl overflow-hidden min-h-[260px] lg:min-h-0">
              <Parallax speed={0.1} className="absolute inset-0 w-full h-[115%] -top-[7%]">
                <Image src="/capitalmarketing-pics/capital-9.jpg" alt="" fill className="object-cover" />
              </Parallax>
              <div className="absolute inset-0 bg-[#050608]/35" />
              <motion.div
                className="absolute top-5 left-5 bg-white text-black text-[10px] font-black px-3 py-1.5 rounded-full"
                initial={{ opacity: 0, scale: 0.7 }} whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: false }} transition={{ duration: 0.5, delay: 0.3, ease: 'backOut' }}
                whileHover={{ scale: 1.08, transition: { duration: 0.18 } }}>
                $5B+ Deployed
              </motion.div>
            </Reveal>

            {/* Centre text */}
            <motion.div
              className="lg:col-span-6 bg-[#0b0e12] border border-white/[0.06] rounded-3xl p-10 md:p-14 flex flex-col justify-between"
              initial="hidden" whileInView="show"
              viewport={{ once: false }} variants={stagger}>
              <div>
                <motion.p variants={staggerItem}
                  className="text-[10px] font-black tracking-[0.28em] uppercase text-white/22 mb-7 flex items-center gap-2">
                  <span className="w-5 h-px bg-white/12" /> Get In Touch
                </motion.p>
                <motion.h2 variants={staggerItem}
                  className="text-4xl md:text-5xl font-black leading-[0.97] tracking-[-0.03em] text-white mb-2">
                  Optimize Your
                </motion.h2>
                <motion.h2 variants={staggerItem}
                  className="text-4xl md:text-5xl font-black leading-[0.97] tracking-[-0.03em] text-white/18 mb-8">
                  Capital Structure.
                </motion.h2>
                <motion.p variants={staggerItem}
                  className="text-[13px] text-white/35 leading-[1.9] max-w-sm border-l-2 border-white/8 pl-4 mb-10">
                  Contact our capital markets team today for strategic advisory that unlocks access to the capital you need.
                </motion.p>
              </div>
              <motion.div variants={staggerItem} className="flex items-center gap-5">
                <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
                  <Link href="/contact"
                    className="inline-flex items-center gap-2 bg-white text-black px-7 py-[14px] rounded-full font-black text-sm hover:bg-white/90 transition-colors">
                    Get Started <ArrowRight className="w-4 h-4" />
                  </Link>
                </motion.div>
                <motion.div whileHover={{ x: 4, transition: { duration: 0.18 } }}>
                  <Link href="/contact"
                    className="text-[13px] text-white/25 hover:text-white/55 transition-colors flex items-center gap-1.5">
                    Call us now <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </motion.div>
              </motion.div>
            </motion.div>

            {/* Right image — stacked two mini */}
            <div className="lg:col-span-3 flex flex-col gap-5">
              <Reveal variants={fadeRight} className="relative rounded-3xl overflow-hidden flex-1 min-h-[160px]">
                <Parallax speed={0.09} className="absolute inset-0 w-full h-[115%] -top-[7%]">
                  <Image src="/capitalmarketing-pics/capital-2.jpg" alt="" fill className="object-cover" />
                </Parallax>
                <div className="absolute inset-0 bg-[#050608]/40" />
                <motion.div
                  className="absolute bottom-4 right-4 bg-[#050608]/65 backdrop-blur-xl border border-white/10 rounded-xl px-3 py-2.5"
                  initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: false }} transition={{ duration: 0.5, delay: 0.3, ease: 'backOut' }}>
                  <p className="text-base font-black text-white">150+</p>
                  <p className="text-[9px] text-white/32 tracking-widest uppercase">Deals</p>
                </motion.div>
              </Reveal>
              <Reveal variants={fadeRight} custom={0.15} className="relative rounded-3xl overflow-hidden flex-1 min-h-[160px]">
                <Parallax speed={0.09} className="absolute inset-0 w-full h-[115%] -top-[7%]">
                  <Image src="/capitalmarketing-pics/capital-8.jpg" alt="" fill className="object-cover" />
                </Parallax>
                <div className="absolute inset-0 bg-[#050608]/40" />
              </Reveal>
            </div>
          </div>
        </section>

      </main>
    </>
  );
}