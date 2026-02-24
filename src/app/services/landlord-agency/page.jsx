'use client';

import Header from '../../../app/components/Header';
import {
  Key, CheckCircle, ArrowRight, ChevronRight,
  Search, Megaphone, TrendingUp, ClipboardList, Eye, UserCheck, RefreshCw, BarChart2,
} from 'lucide-react';
import Link from 'next/link';
import ServiceNavigation from '../ServiceNavigation';
import Image from 'next/image';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { useRef } from 'react';

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
const slideDown = {
  hidden: { opacity: 0, y: -40 },
  show: (d = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.82, ease: [0.22, 1, 0.36, 1], delay: d } }),
};
const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.04 } },
};
const si = {
  hidden: { opacity: 0, y: 26 },
  show: { opacity: 1, y: 0, transition: { duration: 0.58, ease: [0.22, 1, 0.36, 1] } },
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

function Ticker({ items }) {
  return (
    <div className="overflow-hidden whitespace-nowrap">
      <motion.div className="inline-flex gap-10"
        animate={{ x: ['0%', '-50%'] }}
        transition={{ duration: 28, repeat: Infinity, ease: 'linear' }}>
        {[...items, ...items].map((t, i) => (
          <span key={i} className="text-[10px] font-black tracking-[0.28em] uppercase text-white/18 inline-flex items-center gap-3">
            {t} <span className="w-[3px] h-[3px] rounded-full bg-white/15 inline-block" />
          </span>
        ))}
      </motion.div>
    </div>
  );
}

// ─── Page ───────────────────────────────────────────────────────────────────

export default function LandlordAgencyPage() {
  const features = [
    { label: 'Tenant Sourcing',     icon: Search,        desc: 'Extensive network reach to attract qualified, reliable tenants quickly.' },
    { label: 'Lease Marketing',     icon: Megaphone,     desc: 'Professional multi-channel marketing campaigns that maximise property exposure.' },
    { label: 'Rent Optimization',   icon: TrendingUp,    desc: 'Data-driven pricing strategies to secure the highest achievable market rent.' },
    { label: 'Lease Administration',icon: ClipboardList, desc: 'Meticulous documentation, compliance and administration throughout the lease lifecycle.' },
    { label: 'Market Analysis',     icon: BarChart2,     desc: 'Up-to-date comparable data benchmarking your property against the live market.' },
    { label: 'Property Showings',   icon: Eye,           desc: 'Professionally managed viewings that showcase your property at its best.' },
    { label: 'Tenant Screening',    icon: UserCheck,     desc: 'Thorough background, credit and reference checks to protect your investment.' },
    { label: 'Lease Renewals',      icon: RefreshCw,     desc: 'Proactive renewal management to retain quality tenants and eliminate void periods.' },
  ];

  const benefits = [
    'Quality tenants',
    'Maximum rental income',
    'Reduced vacancy',
    'Professional marketing',
    'Expert negotiation',
  ];

  const ticker = [
    'Tenant Sourcing', 'Lease Marketing', 'Rent Optimization', 'Lease Administration',
    'Market Analysis', 'Property Showings', 'Tenant Screening', 'Lease Renewals',
  ];

  return (
    <>
      <Header />
      <main className="min-h-screen bg-[#060709] text-white pb-32 overflow-x-hidden">

        {/* ══════════════════════════════════════════════════════
            HERO — split left text / right asymmetric image stack
        ══════════════════════════════════════════════════════ */}
        <section className="relative pt-32 pb-24 min-h-screen flex items-center overflow-hidden">

          {/* Subtle radial glow — top left atmosphere */}
          <div className="absolute top-0 left-0 w-[500px] h-[500px] rounded-full bg-white/[0.025] blur-[130px] pointer-events-none" />

          <div className="container mx-auto px-4 md:px-6 w-full">
            <ServiceNavigation />

            <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-0 items-center min-h-[76vh]">

              {/* ── LEFT — text column ── */}
              <motion.div
                className="lg:pr-12 pb-12 lg:pb-0"
                initial="hidden"
                animate="show"
                variants={stagger}
              >
                {/* Eyebrow — index style */}
                <motion.div variants={fadeUp} custom={0} className="flex items-center gap-3 mb-10">
                  <span className="text-[10px] font-black tracking-[0.3em] uppercase text-white/18">—</span>
                  <div className="w-7 h-7 rounded-lg bg-white/[0.06] border border-white/[0.08] flex items-center justify-center">
                    <Key className="w-3 h-3 text-white/50" />
                  </div>
                  <span className="text-[10px] font-black tracking-[0.28em] uppercase text-white/35">Landlord Agency Leasing</span>
                </motion.div>

                {/* Headline — word-by-word with size contrast */}
                <div className="mb-10 space-y-0">
                  <motion.div variants={fadeUp} custom={0.08} className="overflow-hidden">
                    <h1 className="text-[clamp(1rem,2.2vw,1.8rem)] font-black leading-tight tracking-[0.08em] uppercase text-white/30 mb-1">
                      Your Property.
                    </h1>
                  </motion.div>
                  <motion.div variants={fadeUp} custom={0.16} className="overflow-hidden">
                    <h1 className="text-[clamp(3.6rem,7.8vw,6.8rem)] font-black leading-[0.9] tracking-[-0.04em] text-white">
                      Maximum
                    </h1>
                  </motion.div>
                  <motion.div variants={fadeUp} custom={0.24} className="overflow-hidden">
                    <h1
                      className="text-[clamp(3.6rem,7.8vw,6.8rem)] font-black leading-[0.9] tracking-[-0.04em]"
                      style={{ WebkitTextStroke: '1.5px rgba(255,255,255,0.22)', color: 'transparent' }}
                    >
                      Returns.
                    </h1>
                  </motion.div>
                  <motion.div variants={fadeUp} custom={0.32} className="overflow-hidden">
                    <h1 className="text-[clamp(1rem,2.2vw,1.8rem)] font-black leading-tight tracking-[0.08em] uppercase text-white/30 mt-2">
                      Zero Compromise.
                    </h1>
                  </motion.div>
                </div>

                {/* Description */}
                <motion.p
                  variants={fadeUp} custom={0.40}
                  className="text-[13px] text-white/38 max-w-[330px] leading-[1.95] mb-12 border-l-2 border-white/8 pl-5"
                >
                  Professional leasing services for landlords to maximise property value,
                  eliminate vacancy and secure quality tenants — quickly and professionally.
                </motion.p>

                {/* CTAs */}
                <motion.div variants={fadeUp} custom={0.48} className="flex items-center gap-5 mb-14">
                  <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
                    <Link href="/contact"
                      className="inline-flex items-center gap-2 bg-white text-black px-7 py-[14px] rounded-full font-black text-sm hover:bg-white/90 transition-colors">
                      List My Property <ArrowRight className="w-4 h-4" />
                    </Link>
                  </motion.div>
                  <motion.div whileHover={{ x: 4, transition: { duration: 0.18 } }}>
                    <Link href="#services"
                      className="text-[13px] text-white/28 hover:text-white/58 transition-colors flex items-center gap-1.5">
                      Our services <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  </motion.div>
                </motion.div>

                {/* Stats row */}
                <motion.div
                  variants={fadeUp} custom={0.56}
                  className="flex items-center gap-8 pt-8 border-t border-white/[0.06]"
                >
                  {[
                    { n: '98%',  l: 'Occupancy Rate' },
                    { n: '21d',  l: 'Avg. Let Time'  },
                    { n: '500+', l: 'Properties Let'  },
                  ].map(({ n, l }) => (
                    <div key={l}>
                      <p className="text-2xl font-black text-white">{n}</p>
                      <p className="text-[10px] text-white/25 uppercase tracking-widest mt-0.5">{l}</p>
                    </div>
                  ))}
                </motion.div>
              </motion.div>

              {/* ── RIGHT — asymmetric image stack ── */}
              <div className="relative h-[580px] hidden lg:block">

                {/* Main large image — top right */}
                <motion.div
                  className="absolute top-0 right-0 w-[74%] h-[420px] rounded-3xl overflow-hidden shadow-[0_50px_130px_rgba(0,0,0,0.75)]"
                  initial={{ opacity: 0, y: 44, scale: 0.92 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 1.05, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                >
                  <Parallax speed={0.11} className="absolute inset-0 w-full h-[115%] -top-[7%]">
                    <Image src="/real-estate-5.jpg" alt="Property" fill priority className="object-cover" />
                  </Parallax>
                  <div className="absolute inset-0 bg-gradient-to-t from-[#060709]/55 via-transparent to-transparent" />
                  <div className="absolute inset-0 bg-gradient-to-l from-transparent to-[#060709]/10" />
                </motion.div>

                {/* Overlapping smaller card — bottom left */}
                <motion.div
                  className="absolute bottom-0 left-0 w-[50%] h-[255px] rounded-2xl overflow-hidden shadow-[0_30px_80px_rgba(0,0,0,0.85)] border-[3px] border-[#060709] z-10"
                  initial={{ opacity: 0, x: -38, y: 20 }}
                  animate={{ opacity: 1, x: 0, y: 0 }}
                  transition={{ duration: 0.95, delay: 0.52, ease: [0.22, 1, 0.36, 1] }}
                >
                  <Image src="/real-estate-2.jpg" alt="Leasing" fill className="object-cover" />
                  <div className="absolute inset-0 bg-[#060709]/20" />
                </motion.div>

                {/* Floating glass stat — top left of stack */}
                <motion.div
                  className="absolute top-6 left-2 bg-[#060709]/65 backdrop-blur-xl border border-white/10 rounded-2xl px-5 py-4 flex items-center gap-3.5 z-20"
                  initial={{ opacity: 0, y: -20, scale: 0.88 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.75, delay: 0.82, ease: [0.22, 1, 0.36, 1] }}
                  whileHover={{ scale: 1.06, transition: { duration: 0.2 } }}
                >
                  <div className="w-9 h-9 rounded-xl bg-white/10 border border-white/[0.08] flex items-center justify-center">
                    <TrendingUp className="w-4 h-4 text-white/70" />
                  </div>
                  <div>
                    <p className="text-[10px] text-white/32 leading-none mb-1">Occupancy Rate</p>
                    <p className="text-lg font-black text-white leading-none">98%</p>
                  </div>
                </motion.div>

                {/* White label chip — mid right edge */}
                <motion.div
                  className="absolute bottom-[195px] right-[-6px] bg-white text-black text-[11px] font-black px-4 py-2 rounded-full shadow-xl z-10"
                  initial={{ opacity: 0, x: 22 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.7, delay: 1.0, ease: [0.22, 1, 0.36, 1] }}
                  whileHover={{ scale: 1.07, transition: { duration: 0.18 } }}
                >
                  500+ Properties Let
                </motion.div>

                {/* Thin vertical decorative rule */}
                <motion.div
                  className="absolute right-[-26px] top-[14%] h-[54%] w-px bg-gradient-to-b from-transparent via-white/10 to-transparent hidden xl:block"
                  initial={{ scaleY: 0 }}
                  animate={{ scaleY: 1 }}
                  transition={{ duration: 1.2, delay: 1.1 }}
                />
              </div>

            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════
            TICKER
        ══════════════════════════════════════════════════════ */}
        <div className="border-t border-b border-white/[0.04] py-[13px] bg-[#09090d]">
          <Ticker items={ticker} />
        </div>

        {/* ══════════════════════════════════════════════════════
            OVERVIEW — large quote-style headline + side image wall
        ══════════════════════════════════════════════════════ */}
        <section className="mt-28 relative">

          {/* Ghost number — bleeds left */}
          <motion.div
            className="absolute -top-8 -left-4 text-[20vw] font-black text-white/[0.022] leading-none select-none pointer-events-none hidden lg:block"
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
            viewport={{ once: false }} transition={{ duration: 1.4 }}
          >01</motion.div>

          <div className="container mx-auto px-4 md:px-6">

            {/* Section label */}
            <Reveal variants={fadeUp} className="mb-14">
              <p className="text-[10px] font-black tracking-[0.28em] uppercase text-white/22 flex items-center gap-2">
                <span className="w-5 h-px bg-white/12" /> Our Approach
              </p>
            </Reveal>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

              {/* Left — editorial text, large */}
              <motion.div
                className="lg:col-span-5 lg:pr-6"
                initial="hidden" whileInView="show"
                viewport={{ once: false, margin: '-70px' }} variants={stagger}
              >
                <motion.h2 variants={si}
                  className="text-4xl md:text-[2.9rem] font-black leading-[1.04] tracking-[-0.028em] text-white mb-8">
                  Maximise Returns. Minimise Vacancy.
                </motion.h2>
                <motion.p variants={si} className="text-[13px] text-white/38 leading-[1.95] mb-5">
                  Our landlord agency services help property owners maximise investment returns
                  through strategic leasing. We market your property effectively, screen tenants
                  thoroughly, and negotiate leases that protect your interests.
                </motion.p>
                <motion.p variants={si} className="text-[13px] text-white/38 leading-[1.95] mb-10">
                  With our extensive network and market expertise, we minimise vacancy periods
                  and secure quality tenants who pay on time and care for your property.
                </motion.p>

                {/* Benefits list — numbered style */}
                <motion.ul className="space-y-0" variants={stagger}>
                  {benefits.map((b, i) => (
                    <motion.li key={i} variants={si}
                      className="flex items-center gap-4 py-4 border-b border-white/[0.05] text-[13px] text-white/48 group cursor-default"
                      whileHover={{ x: 7, color: 'rgba(255,255,255,0.88)', transition: { duration: 0.18 } }}>
                      <span className="text-[10px] font-black text-white/20 w-5 flex-shrink-0 tabular-nums">
                        0{i + 1}
                      </span>
                      {b}
                      <ChevronRight className="w-3 h-3 ml-auto opacity-0 group-hover:opacity-25 transition-opacity" />
                    </motion.li>
                  ))}
                </motion.ul>
              </motion.div>

              {/* Right — stacked image trio, offset heights */}
              <div className="lg:col-span-7 grid grid-cols-2 gap-4 relative">

                {/* Tall left image spanning 2 rows */}
                <Reveal variants={fadeRight} className="row-span-2">
                  <div className="relative h-[480px] rounded-3xl overflow-hidden shadow-[0_50px_120px_rgba(0,0,0,0.8)]">
                    <Parallax speed={0.09} className="absolute inset-0 w-full h-[115%] -top-[7%]">
                      <Image src="/real-estate-4.jpg" alt="Property" fill className="object-cover" />
                    </Parallax>
                    <div className="absolute inset-0 bg-gradient-to-t from-[#060709]/55 to-transparent" />
                    {/* Floating badge inside */}
                    <motion.div
                      className="absolute bottom-6 left-5 bg-[#060709]/65 backdrop-blur-xl border border-white/10 rounded-xl px-4 py-3"
                      initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: false }} transition={{ duration: 0.6, delay: 0.3 }}
                      whileHover={{ scale: 1.06, transition: { duration: 0.2 } }}
                    >
                      <p className="text-xl font-black text-white">21 days</p>
                      <p className="text-[10px] text-white/35 mt-0.5 tracking-widest uppercase">Avg. Let Time</p>
                    </motion.div>
                  </div>
                </Reveal>

                {/* Top right image */}
                <Reveal variants={slideDown} custom={0.15}>
                  <div className="relative h-[228px] rounded-2xl overflow-hidden shadow-[0_30px_70px_rgba(0,0,0,0.7)] border-[3px] border-[#060709]">
                    <Image src="/real-estate-3.jpg" alt="Lease" fill className="object-cover" />
                    <div className="absolute inset-0 bg-[#060709]/20" />
                  </div>
                </Reveal>

                {/* Bottom right image with chip */}
                <Reveal variants={fadeRight} custom={0.28}>
                  <div className="relative h-[228px] rounded-2xl overflow-hidden shadow-[0_30px_70px_rgba(0,0,0,0.7)] border-[3px] border-[#060709]">
                    <Image src="/real-estate-6.jpg" alt="Tenants" fill className="object-cover" />
                    <div className="absolute inset-0 bg-[#060709]/30" />
                    <motion.div
                      className="absolute top-4 right-4 bg-white text-black text-[10px] font-black px-3 py-1.5 rounded-full"
                      initial={{ opacity: 0, scale: 0.7 }} whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: false }} transition={{ duration: 0.45, delay: 0.3, ease: 'backOut' }}
                      whileHover={{ scale: 1.08, transition: { duration: 0.18 } }}>
                      500+ Let
                    </motion.div>
                  </div>
                </Reveal>
              </div>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════
            SERVICES — magazine-editorial card grid
        ══════════════════════════════════════════════════════ */}
        <section id="services" className="container mx-auto px-4 md:px-6 mt-32 relative">

          <motion.div
            className="absolute -top-8 right-0 text-[20vw] font-black text-white/[0.022] leading-none select-none pointer-events-none hidden lg:block"
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
              <p className="text-xs text-white/18 hidden md:block text-right leading-relaxed">Landlord-first<br />leasing</p>
            </div>
          </Reveal>

          {/* Row 1 — 3 col with a tall image spanning left */}
          <div className="grid grid-cols-12 gap-4 mb-4">

            {/* Tall image — 4 cols */}
            <motion.div
              className="col-span-12 md:col-span-4 relative rounded-3xl overflow-hidden min-h-[340px] md:row-span-2 shadow-[0_40px_100px_rgba(0,0,0,0.7)]"
              initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: false, margin: '-60px' }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ scale: 1.015, transition: { duration: 0.4 } }}
            >
              <Parallax speed={0.1} className="absolute inset-0 w-full h-[115%] -top-[7%]">
                <Image src="/real-estate.jpg" alt="Leasing" fill className="object-cover" />
              </Parallax>
              <div className="absolute inset-0 bg-gradient-to-t from-[#060709]/88 via-[#060709]/25 to-transparent" />
              <motion.div
                className="absolute bottom-7 left-6 right-6"
                initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false }} transition={{ duration: 0.6, delay: 0.3 }}>
                <p className="text-white font-black text-xl leading-tight mb-1">Listed. Leased. Done.</p>
                <p className="text-white/35 text-xs tracking-wide">Professional end-to-end service.</p>
              </motion.div>
            </motion.div>

            {/* Right 8 cols — 2 rows of feature cards */}
            <motion.div
              className="col-span-12 md:col-span-8 grid grid-cols-2 gap-4"
              initial="hidden" whileInView="show"
              viewport={{ once: false, margin: '-60px' }} variants={stagger}
            >
              {features.slice(0, 4).map(({ label, icon: Icon, desc }, i) => (
                <motion.div key={label} variants={si}
                  className="group bg-[#0c0e13] border border-white/[0.05] rounded-2xl p-6 cursor-default relative overflow-hidden"
                  whileHover={{ borderColor: 'rgba(255,255,255,0.13)', y: -5, transition: { duration: 0.2 } }}>
                  <div className="absolute inset-0 bg-gradient-to-br from-white/[0.04] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />
                  <motion.div
                    className="relative z-10 w-9 h-9 rounded-xl bg-white/[0.06] border border-white/[0.07] flex items-center justify-center mb-4"
                    initial={{ rotate: -90, scale: 0.5, opacity: 0 }}
                    whileInView={{ rotate: 0, scale: 1, opacity: 1 }}
                    viewport={{ once: false }}
                    transition={{ duration: 0.45, delay: i * 0.06, ease: 'backOut' }}>
                    <Icon className="w-4 h-4 text-white/40" />
                  </motion.div>
                  <h3 className="relative z-10 text-sm font-black text-white/62 group-hover:text-white/92 transition-colors mb-1.5">{label}</h3>
                  <p className="relative z-10 text-[11px] text-white/28 leading-relaxed">{desc}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Row 2 — wide card + 3 narrow cards */}
          <motion.div className="grid grid-cols-12 gap-4 mb-4"
            initial="hidden" whileInView="show"
            viewport={{ once: false, margin: '-60px' }} variants={stagger}>

            {/* Wide feature card with description */}
            <motion.div variants={si}
              className="col-span-12 md:col-span-6 group bg-[#0c0e13] border border-white/[0.05] rounded-3xl p-8 flex gap-6 cursor-default relative overflow-hidden"
              whileHover={{ borderColor: 'rgba(255,255,255,0.12)', y: -4, transition: { duration: 0.2 } }}>
              <div className="absolute inset-0 bg-gradient-to-br from-white/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-3xl" />
              <motion.div
                className="w-10 h-10 rounded-xl bg-white/[0.06] border border-white/[0.07] flex items-center justify-center flex-shrink-0 mt-0.5 relative z-10"
                initial={{ rotate: -90, opacity: 0 }} whileInView={{ rotate: 0, opacity: 1 }}
                viewport={{ once: false }} transition={{ duration: 0.45, ease: 'backOut' }}>
                <BarChart2 className="w-4 h-4 text-white/40" />
              </motion.div>
              <div className="relative z-10">
                <h3 className="text-base font-black text-white/68 group-hover:text-white/94 transition-colors mb-2">Market Analysis</h3>
                <p className="text-[12px] text-white/30 leading-relaxed">Up-to-date comparable data benchmarking your property against the live market to ensure optimal rent positioning.</p>
              </div>
            </motion.div>

            {features.slice(5, 8).map(({ label, icon: Icon }, i) => (
              <motion.div key={label} variants={si}
                className="col-span-6 md:col-span-2 group bg-[#0c0e13] border border-white/[0.05] rounded-2xl p-6 cursor-default relative overflow-hidden"
                whileHover={{ borderColor: 'rgba(255,255,255,0.13)', y: -5, transition: { duration: 0.2 } }}>
                <div className="absolute inset-0 bg-gradient-to-br from-white/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />
                <motion.div
                  className="relative z-10 w-8 h-8 rounded-lg bg-white/[0.06] border border-white/[0.07] flex items-center justify-center mb-4"
                  initial={{ rotate: -90, scale: 0.5, opacity: 0 }}
                  whileInView={{ rotate: 0, scale: 1, opacity: 1 }}
                  viewport={{ once: false }}
                  transition={{ duration: 0.45, delay: i * 0.07, ease: 'backOut' }}>
                  <Icon className="w-3.5 h-3.5 text-white/38" />
                </motion.div>
                <h3 className="relative z-10 text-xs font-black text-white/60 group-hover:text-white/90 transition-colors leading-snug">{label}</h3>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* ══════════════════════════════════════════════════════
            STATS STRIP — full width divided
        ══════════════════════════════════════════════════════ */}
        <section className="mt-24 border-t border-b border-white/[0.04] bg-[#09090d]">
          <div className="container mx-auto px-4 md:px-6">
            <motion.div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-white/[0.04]"
              initial="hidden" whileInView="show"
              viewport={{ once: false, margin: '-60px' }} variants={stagger}>
              {[
                { val: '98%',  label: 'Occupancy Rate',   sub: 'across managed portfolio' },
                { val: '21d',  label: 'Avg. Let Time',    sub: 'from listing to signing'  },
                { val: '500+', label: 'Properties Let',   sub: 'in the last 5 years'      },
                { val: '40%',  label: 'Rent Uplift',      sub: 'vs. self-managed average' },
              ].map(({ val, label, sub }, i) => (
                <motion.div key={label} variants={si}
                  className="py-10 px-8 hover:bg-white/[0.02] transition-colors duration-300"
                  whileHover={{ y: -2, transition: { duration: 0.18 } }}>
                  <p className="text-[10px] font-black tracking-[0.22em] uppercase text-white/22 mb-3">{label}</p>
                  <p className="text-4xl font-black text-white mb-1">{val}</p>
                  <p className="text-[11px] text-white/25">{sub}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════
            CTA — split: dark left panel + right full-image panel
            Unique: image on the RIGHT this time (vs previous pages)
        ══════════════════════════════════════════════════════ */}
        <section className="mt-32 container mx-auto px-4 md:px-6">

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 rounded-3xl overflow-hidden min-h-[480px]">

            {/* Left — dark text panel */}
            <motion.div
              className="lg:col-span-6 bg-[#0c0e13] border border-white/[0.06] rounded-3xl p-12 md:p-14 flex flex-col justify-between relative overflow-hidden"
              initial="hidden" whileInView="show"
              viewport={{ once: false }} variants={stagger}
            >
              {/* Ghost 03 */}
              <div className="absolute bottom-0 right-0 text-[14vw] font-black text-white/[0.025] leading-none select-none pointer-events-none">03</div>

              <div className="relative z-10">
                <motion.p variants={si}
                  className="text-[10px] font-black tracking-[0.28em] uppercase text-white/22 mb-7 flex items-center gap-2">
                  <span className="w-5 h-px bg-white/12" /> Get In Touch
                </motion.p>
                <motion.h2 variants={si}
                  className="text-4xl md:text-5xl font-black leading-[0.97] tracking-[-0.03em] text-white mb-2">
                  Ready to Lease
                </motion.h2>
                <motion.h2 variants={si}
                  className="text-4xl md:text-5xl font-black leading-[0.97] tracking-[-0.03em] text-white/18 mb-8">
                  Your Property?
                </motion.h2>
                <motion.p variants={si}
                  className="text-[13px] text-white/35 leading-[1.9] max-w-sm border-l-2 border-white/8 pl-4 mb-10">
                  Contact us today for professional landlord agency services that maximise your rental income and protect your asset.
                </motion.p>
              </div>

              <motion.div variants={si} className="flex items-center gap-5 relative z-10">
                <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
                  <Link href="/contact"
                    className="inline-flex items-center gap-2 bg-white text-black px-7 py-[14px] rounded-full font-black text-sm hover:bg-white/90 transition-colors">
                    List My Property <ArrowRight className="w-4 h-4" />
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

            {/* Right — stacked image panels */}
            <div className="lg:col-span-6 grid grid-rows-2 gap-5">

              {/* Top image */}
              <Reveal variants={fadeRight} className="relative rounded-3xl overflow-hidden min-h-[200px]">
                <Parallax speed={0.08} className="absolute inset-0 w-full h-[115%] -top-[7%]">
                  <Image src="/real-estate-2.jpg" alt="" fill className="object-cover" />
                </Parallax>
                <div className="absolute inset-0 bg-[#060709]/30" />
                {/* Floating chip */}
                <motion.div
                  className="absolute top-5 right-5 bg-[#060709]/65 backdrop-blur-xl border border-white/10 rounded-xl px-4 py-3"
                  initial={{ opacity: 0, y: -16 }} whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: false }} transition={{ duration: 0.6, delay: 0.25 }}
                  whileHover={{ scale: 1.06, transition: { duration: 0.2 } }}>
                  <p className="text-lg font-black text-white">98%</p>
                  <p className="text-[9px] text-white/35 tracking-widest uppercase">Occupancy</p>
                </motion.div>
              </Reveal>

              {/* Bottom image */}
              <Reveal variants={fadeRight} custom={0.18} className="relative rounded-3xl overflow-hidden min-h-[200px]">
                <Parallax speed={0.08} className="absolute inset-0 w-full h-[115%] -top-[7%]">
                  <Image src="/real-estate-5.jpg" alt="" fill className="object-cover" />
                </Parallax>
                <div className="absolute inset-0 bg-[#060709]/35" />
                <motion.div
                  className="absolute bottom-5 left-5 bg-white text-black text-[10px] font-black px-3 py-1.5 rounded-full"
                  initial={{ opacity: 0, x: -16 }} whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: false }} transition={{ duration: 0.6, delay: 0.35 }}
                  whileHover={{ scale: 1.07, transition: { duration: 0.18 } }}>
                  500+ Properties Let
                </motion.div>
              </Reveal>
            </div>
          </div>
        </section>

      </main>
    </>
  );
}