'use client';

import Header from '../../../app/components/Header';
import {
  Users, CheckCircle, ArrowRight, ChevronRight,
  Home, FileText, MapPin, RefreshCw, Key, Layers, ArrowLeftRight, LogOut,
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
const rotateIn = {
  hidden: { opacity: 0, rotate: -6, scale: 0.88 },
  show: (d = 0) => ({ opacity: 1, rotate: 0, scale: 1, transition: { duration: 0.85, ease: [0.22, 1, 0.36, 1], delay: d } }),
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
        transition={{ duration: 24, repeat: Infinity, ease: 'linear' }}>
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

export default function TenantRepresentationPage() {
  const features = [
    { label: 'Space Selection',     icon: Home,           desc: 'Curated property search tailored to your exact space requirements and budget.' },
    { label: 'Lease Negotiation',   icon: FileText,       desc: 'Aggressive negotiation to secure the most favorable terms and conditions.' },
    { label: 'Market Analysis',     icon: MapPin,         desc: 'Deep-dive comparables and trend data to benchmark every opportunity.' },
    { label: 'Relocation Strategy', icon: ArrowLeftRight, desc: 'Seamless transition planning that minimises disruption to your operations.' },
    { label: 'Renewal Options',     icon: RefreshCw,      desc: 'Proactive renewal advisory to protect your position well before deadlines.' },
    { label: 'Tenant Improvement',  icon: Layers,         desc: 'Negotiating fit-out allowances and improvement packages from landlords.' },
    { label: 'Subleasing',          icon: Key,            desc: 'Maximising value from surplus space through strategic sublease placement.' },
    { label: 'Exit Strategies',     icon: LogOut,         desc: 'Planned exits that protect your interests and minimise penalties.' },
  ];

  const benefits = [
    'Favorable lease terms',
    'Cost savings',
    'Market insights',
    'Professional advocacy',
    'Stress-free process',
  ];

  const ticker = ['Space Selection', 'Lease Negotiation', 'Market Analysis', 'Relocation Strategy',
    'Renewal Options', 'Tenant Improvement', 'Subleasing', 'Exit Strategies'];

  return (
    <>
      <Header />
      <main className="min-h-screen bg-[#060708] text-white pb-32 overflow-x-hidden">

        {/* ══════════════════════════════════════════════════════
            HERO — full-height with image right, bold centred type
        ══════════════════════════════════════════════════════ */}
        <section className="relative min-h-screen overflow-hidden flex items-center">

          {/* Right image — tall, tilted inward */}
          <motion.div
            className="absolute top-0 right-[-30px] w-[48%] h-full hidden lg:block overflow-hidden"
            initial={{ opacity: 0, x: 80 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.2, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          >
            <Parallax speed={0.07} className="absolute inset-0 w-full h-[115%] -top-[7%]">
              <Image src="/tenentrepresentation-pics/tenent-9.jpg" alt="Tenant" fill priority className="object-cover" />
            </Parallax>
            <div className="absolute inset-0 bg-gradient-to-l from-transparent via-[#060708]/20 to-[#060708]" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#060708]/80 to-transparent" />
            {/* Tilt overlay line */}
            <div className="absolute inset-0 border-l-[3px] border-white/[0.04] left-0" />
          </motion.div>

          {/* Left text */}
          <div className="relative z-10 container mx-auto px-4 md:px-6 pt-32 pb-20">
            <ServiceNavigation />

            <motion.div className="mt-14 max-w-[500px]" initial="hidden" animate="show" variants={stagger}>

              {/* Eyebrow */}
              <motion.div variants={fadeUp} custom={0} className="flex items-center gap-3 mb-10">
                <div className="w-7 h-7 rounded-lg bg-white/[0.06] border border-white/[0.08] flex items-center justify-center">
                  <Users className="w-3 h-3 text-white/50" />
                </div>
                <span className="text-[10px] font-black tracking-[0.28em] uppercase text-white/35">Tenant Representation</span>
              </motion.div>

              {/* Headline */}
              <motion.h1 variants={fadeUp} custom={0.08}
                className="text-[clamp(3.4rem,7.5vw,6.2rem)] font-black leading-[0.93] tracking-[-0.035em] text-white mb-1">
                Your Space.
              </motion.h1>
              <motion.h1 variants={fadeUp} custom={0.17}
                className="text-[clamp(3.4rem,7.5vw,6.2rem)] font-black leading-[0.93] tracking-[-0.035em] mb-1"
                style={{ WebkitTextStroke: '1.5px rgba(255,255,255,0.18)', color: 'transparent' }}>
                Your Terms.
              </motion.h1>
              <motion.h1 variants={fadeUp} custom={0.26}
                className="text-[clamp(3.4rem,7.5vw,6.2rem)] font-black leading-[0.93] tracking-[-0.035em] text-white mb-10">
                Our Fight.
              </motion.h1>

              <motion.p variants={fadeUp} custom={0.35}
                className="text-[13px] text-white/38 max-w-[320px] leading-[1.95] mb-11 pl-4 border-l-2 border-white/8">
                Dedicated representation for tenants to find the perfect space and negotiate
                the most favorable lease terms — we advocate exclusively for you.
              </motion.p>

              <motion.div variants={fadeUp} custom={0.43} className="flex items-center gap-5 mb-16">
                <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
                  <Link href="/contact"
                    className="inline-flex items-center gap-2 bg-white text-black px-7 py-[14px] rounded-full font-black text-sm hover:bg-white/90 transition-colors">
                    Find My Space <ArrowRight className="w-4 h-4" />
                  </Link>
                </motion.div>
                <motion.div whileHover={{ x: 4, transition: { duration: 0.18 } }}>
                  <Link href="#services"
                    className="text-[13px] text-white/28 hover:text-white/58 transition-colors flex items-center gap-1.5">
                    Our services <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </motion.div>
              </motion.div>

              {/* Mini stats */}
              <motion.div variants={fadeUp} custom={0.51}
                className="flex items-center gap-8 pt-8 border-t border-white/[0.06]">
                {[
                  { n: '300+', l: 'Leases Signed' },
                  { n: '40%',  l: 'Avg. Savings'  },
                  { n: '10yr', l: 'Experience'     },
                ].map(({ n, l }) => (
                  <div key={l}>
                    <p className="text-2xl font-black text-white">{n}</p>
                    <p className="text-[10px] text-white/25 uppercase tracking-widest mt-0.5">{l}</p>
                  </div>
                ))}
              </motion.div>
            </motion.div>
          </div>

          {/* Floating glass pill — bottom-centre overlap */}
          <motion.div
            className="absolute bottom-12 right-[44%] bg-[#060708]/70 backdrop-blur-xl border border-white/10 rounded-2xl px-5 py-4 z-20 hidden lg:flex items-center gap-3.5"
            initial={{ opacity: 0, y: 28, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.75, delay: 1.05, ease: [0.22, 1, 0.36, 1] }}
            whileHover={{ scale: 1.06, transition: { duration: 0.2 } }}
          >
            <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center">
              <Key className="w-4 h-4 text-white/70" />
            </div>
            <div>
              <p className="text-[10px] text-white/32 mb-0.5">Avg. Cost Saved</p>
              <p className="text-lg font-black text-white">40% Per Lease</p>
            </div>
          </motion.div>

          {/* White chip */}
          <motion.div
            className="absolute top-[36%] right-[6%] bg-white text-black text-[11px] font-black px-4 py-2 rounded-full shadow-xl z-20 hidden lg:block"
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 1.2, ease: 'backOut' }}
            whileHover={{ scale: 1.08, transition: { duration: 0.18 } }}
          >
            300+ Leases Signed
          </motion.div>
        </section>

        {/* ══════════════════════════════════════════════════════
            TICKER
        ══════════════════════════════════════════════════════ */}
        <div className="border-t border-b border-white/[0.04] py-[13px] bg-[#09090c]">
          <Ticker items={ticker} />
        </div>

        {/* ══════════════════════════════════════════════════════
            OVERVIEW — horizontal scroll-feel, pinned image left,
            text + benefits right, small stacked images behind
        ══════════════════════════════════════════════════════ */}
        <section className="mt-28 container mx-auto px-4 md:px-6 relative">

          {/* Ghost number */}
          <motion.div
            className="absolute -top-10 -right-4 text-[20vw] font-black text-white/[0.022] leading-none select-none pointer-events-none hidden lg:block"
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
            viewport={{ once: false }} transition={{ duration: 1.4 }}
          >01</motion.div>

          <Reveal variants={fadeUp} className="mb-16">
            <p className="text-[10px] font-black tracking-[0.28em] uppercase text-white/22 flex items-center gap-2">
              <span className="w-5 h-px bg-white/12" /> Our Approach
            </p>
          </Reveal>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">

            {/* Left image stack — cols 1-5 */}
            <div className="lg:col-span-5 relative h-[520px]">

              {/* Main tall image */}
              <Reveal variants={fadeLeft} className="absolute top-0 left-0 w-[80%] h-[380px]">
                <div className="w-full h-full rounded-3xl overflow-hidden shadow-[0_50px_120px_rgba(0,0,0,0.8)]">
                  <Parallax speed={0.09} className="absolute inset-0 w-full h-[115%] -top-[7%]">
                    <Image src="/tenentrepresentation-pics/tenent-8.jpg" alt="Tenant representation" fill className="object-cover" />
                  </Parallax>
                  <div className="absolute inset-0 bg-gradient-to-t from-[#060708]/55 to-transparent" />
                </div>
              </Reveal>

              {/* Small overlapping card — bottom right */}
              <Reveal variants={rotateIn} custom={0.2} className="absolute bottom-0 right-0 w-[52%] h-[240px] z-10">
                <div className="w-full h-full rounded-2xl overflow-hidden shadow-[0_30px_80px_rgba(0,0,0,0.85)] border-[3px] border-[#060708]">
                  <Image src="/tenentrepresentation-pics/tenent-2.jpg" alt="Leasing" fill className="object-cover" />
                  <div className="absolute inset-0 bg-[#060708]/20" />
                </div>
              </Reveal>

              {/* Badge — top right of main image */}
              <Reveal variants={scaleIn} custom={0.35} className="absolute top-5 right-8 z-20">
                <motion.div
                  className="bg-[#060708]/65 backdrop-blur-xl border border-white/10 rounded-2xl px-5 py-4 text-center"
                  whileHover={{ scale: 1.07, rotate: -2, transition: { duration: 0.22 } }}
                >
                  <p className="text-2xl font-black text-white">300+</p>
                  <p className="text-[10px] text-white/35 mt-1 tracking-widest uppercase">Leases<br/>Secured</p>
                </motion.div>
              </Reveal>
            </div>

            {/* Right text — cols 6-12 */}
            <motion.div
              className="lg:col-span-7 lg:pl-10 lg:pt-6"
              initial="hidden" whileInView="show"
              viewport={{ once: false, margin: '-70px' }} variants={stagger}
            >
              <motion.h2 variants={si}
                className="text-4xl md:text-[2.8rem] font-black leading-[1.04] tracking-[-0.025em] text-white mb-7">
                We Advocate Exclusively for Tenants
              </motion.h2>
              <motion.p variants={si} className="text-[17px] text-white/80 leading-[1.95] mb-5">
                Our tenant representation services ensure you get the best possible space at the most
                favorable terms. We leverage market knowledge and negotiation expertise to secure
                optimal lease agreements on your behalf.
              </motion.p>
              <motion.p variants={si} className="text-[17px] text-white/80 leading-[1.95] mb-10">
                From initial space search to lease signing and beyond, we guide you through every step
                of the process, protecting your interests and maximizing value at every turn.
              </motion.p>

              {/* Benefits — horizontal pill tags */}
              <motion.div variants={si} className="flex flex-wrap gap-2 mb-10">
                {benefits.map((b, i) => (
                  <motion.span key={i}
                    className="text-[11px] font-semibold text-white/50 border border-white/[0.08] bg-white/[0.03] rounded-full px-4 py-1.5 cursor-default"
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: false }}
                    transition={{ duration: 0.4, delay: i * 0.07, ease: 'backOut' }}
                    whileHover={{ borderColor: 'rgba(255,255,255,0.22)', color: 'rgba(255,255,255,0.85)', scale: 1.04, transition: { duration: 0.18 } }}
                  >
                    {b}
                  </motion.span>
                ))}
              </motion.div>

              {/* Wide image strip below text */}
              <Reveal variants={fadeUp} custom={0.1} className="w-full">
                <div className="relative w-full h-[180px] rounded-2xl overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.7)]">
                  <Parallax speed={0.06} className="absolute inset-0 w-full h-[115%] -top-[7%]">
                    <Image src="/tenentrepresentation-pics/tenent-3.jpg" alt="Property" fill className="object-cover" />
                  </Parallax>
                  <div className="absolute inset-0 bg-gradient-to-r from-[#060708]/75 to-transparent" />
                  <motion.div className="absolute left-6 top-1/2 -translate-y-1/2"
                    initial={{ opacity: 0, x: -16 }} whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: false }} transition={{ duration: 0.6, delay: 0.2 }}>
                    <p className="text-white font-black text-base">Advocating for you.</p>
                    <p className="text-white/35 text-xs mt-0.5">Every step of the way.</p>
                  </motion.div>
                </div>
              </Reveal>
            </motion.div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════
            SERVICES — asymmetric mixed grid
        ══════════════════════════════════════════════════════ */}
        <section id="services" className="container mx-auto px-4 md:px-6 mt-32 relative">

          <motion.div
            className="absolute -top-10 -left-4 text-[20vw] font-black text-white/[0.022] leading-none select-none pointer-events-none hidden lg:block"
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
              <p className="text-xs text-white/18 hidden md:block text-right leading-relaxed">Tenant-first<br />advisory</p>
            </div>
          </Reveal>

          {/* Row 1 — image card (wide) + two stacked small cards */}
          <div className="grid grid-cols-12 gap-4 mb-4">

            {/* Big image feature card */}
            <motion.div
              className="col-span-12 md:col-span-7 relative rounded-3xl overflow-hidden min-h-[300px] shadow-[0_30px_80px_rgba(0,0,0,0.65)]"
              initial={{ opacity: 0, y: 36 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, margin: '-60px' }}
              transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ scale: 1.015, transition: { duration: 0.35 } }}
            >
              <Parallax speed={0.09} className="absolute inset-0 w-full h-[115%] -top-[7%]">
                <Image src="/tenentrepresentation-pics/tenent-5.jpg" alt="Space Selection" fill className="object-cover" />
              </Parallax>
              <div className="absolute inset-0 bg-gradient-to-t from-[#060708]/92 via-[#060708]/35 to-transparent" />
              <motion.div className="absolute bottom-0 left-0 right-0 p-8"
                initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false }} transition={{ duration: 0.6, delay: 0.25 }}>
                <motion.div
                  className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center mb-4"
                  initial={{ rotate: -90, scale: 0.5 }} whileInView={{ rotate: 0, scale: 1 }}
                  viewport={{ once: false }} transition={{ duration: 0.45, delay: 0.3, ease: 'backOut' }}>
                  <Home className="w-4 h-4 text-white/80" />
                </motion.div>
                <h3 className="text-xl font-black text-white mb-2">Space Selection</h3>
                <p className="text-[12px] text-white/42 leading-relaxed max-w-sm">Curated property search tailored to your exact space requirements, location preferences, and budget constraints.</p>
              </motion.div>
            </motion.div>

            {/* Two stacked narrow cards */}
            <div className="col-span-12 md:col-span-5 flex flex-col gap-4">
              {[
                { label: 'Lease Negotiation', icon: FileText, desc: 'Aggressive negotiation to secure the most favorable terms and conditions for your lease.' },
                { label: 'Market Analysis',   icon: MapPin,   desc: 'Deep-dive comparables and trend data to benchmark every opportunity against the market.' },
              ].map(({ label, icon: Icon, desc }, i) => (
                <motion.div key={label}
                  className="flex-1 group bg-[#0c0e12] border border-white/[0.05] rounded-3xl p-7 flex gap-5 cursor-default relative overflow-hidden"
                  initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: false, margin: '-60px' }}
                  transition={{ duration: 0.8, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }}
                  whileHover={{ borderColor: 'rgba(255,255,255,0.13)', y: -4, transition: { duration: 0.2 } }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-white/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-3xl" />
                  <motion.div
                    className="relative z-10 w-9 h-9 rounded-xl bg-white/[0.06] border border-white/[0.07] flex items-center justify-center flex-shrink-0 mt-0.5"
                    initial={{ rotate: -90, opacity: 0 }} whileInView={{ rotate: 0, opacity: 1 }}
                    viewport={{ once: false }} transition={{ duration: 0.42, delay: i * 0.1, ease: 'backOut' }}>
                    <Icon className="w-4 h-4 text-white/40" />
                  </motion.div>
                  <div className="relative z-10">
                    <h3 className="text-sm font-black text-white/68 group-hover:text-white/92 transition-colors mb-1.5">{label}</h3>
                    <p className="text-[11px] text-white/30 leading-relaxed">{desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Row 2 — 4 equal cards */}
          <motion.div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4"
            initial="hidden" whileInView="show"
            viewport={{ once: false, margin: '-60px' }} variants={stagger}>
            {[
              { label: 'Relocation Strategy', icon: ArrowLeftRight },
              { label: 'Renewal Options',     icon: RefreshCw      },
              { label: 'Tenant Improvement',  icon: Layers         },
              { label: 'Subleasing',          icon: Key            },
            ].map(({ label, icon: Icon }, i) => (
              <motion.div key={label} variants={si}
                className="group bg-[#0c0e12] border border-white/[0.05] rounded-2xl p-6 cursor-default relative overflow-hidden"
                whileHover={{ borderColor: 'rgba(255,255,255,0.13)', y: -5, transition: { duration: 0.2 } }}>
                <div className="absolute inset-0 bg-gradient-to-br from-white/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />
                <motion.div
                  className="relative z-10 w-9 h-9 rounded-xl bg-white/[0.06] border border-white/[0.07] flex items-center justify-center mb-5"
                  initial={{ rotate: -90, scale: 0.5, opacity: 0 }}
                  whileInView={{ rotate: 0, scale: 1, opacity: 1 }}
                  viewport={{ once: false }}
                  transition={{ duration: 0.45, delay: i * 0.07, ease: 'backOut' }}>
                  <Icon className="w-4 h-4 text-white/40" />
                </motion.div>
                <h3 className="relative z-10 text-sm font-black text-white/60 group-hover:text-white/90 transition-colors">{label}</h3>
              </motion.div>
            ))}
          </motion.div>

          {/* Row 3 — wide text card + image card + narrow */}
          <motion.div className="grid grid-cols-12 gap-4"
            initial="hidden" whileInView="show"
            viewport={{ once: false, margin: '-60px' }} variants={stagger}>

            <motion.div variants={si}
              className="col-span-12 md:col-span-5 group bg-[#0c0e12] border border-white/[0.05] rounded-3xl p-8 flex gap-6 cursor-default relative overflow-hidden"
              whileHover={{ borderColor: 'rgba(255,255,255,0.12)', y: -4, transition: { duration: 0.2 } }}>
              <div className="absolute inset-0 bg-gradient-to-br from-white/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-3xl" />
              <motion.div
                className="w-10 h-10 rounded-xl bg-white/[0.06] border border-white/[0.07] flex items-center justify-center flex-shrink-0 mt-0.5 relative z-10"
                initial={{ rotate: -90, opacity: 0 }} whileInView={{ rotate: 0, opacity: 1 }}
                viewport={{ once: false }} transition={{ duration: 0.42, ease: 'backOut' }}>
                <LogOut className="w-4 h-4 text-white/40" />
              </motion.div>
              <div className="relative z-10">
                <h3 className="text-base font-black text-white/68 group-hover:text-white/92 transition-colors mb-2">Exit Strategies</h3>
                <p className="text-[12px] text-white/30 leading-relaxed">Planned exits that protect your interests, minimise penalties and preserve your business continuity.</p>
              </div>
            </motion.div>

            {/* Image mini card */}
            <motion.div variants={scaleIn}
              className="col-span-12 md:col-span-4 relative rounded-3xl overflow-hidden min-h-[180px] shadow-[0_20px_60px_rgba(0,0,0,0.6)]"
              whileHover={{ scale: 1.02, transition: { duration: 0.3 } }}>
              <Image src="/tenentrepresentation-pics/tenent-7.jpg" alt="" fill className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#060708]/80 via-[#060708]/20 to-transparent" />
              <motion.div className="absolute bottom-5 left-6"
                initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false }} transition={{ duration: 0.55, delay: 0.25 }}>
                <p className="text-white font-black text-base">Your Interests First.</p>
                <p className="text-white/35 text-xs mt-0.5">Always exclusive to tenants.</p>
              </motion.div>
            </motion.div>

            {/* Stat card */}
            <motion.div variants={si}
              className="col-span-12 md:col-span-3 bg-[#0c0e12] border border-white/[0.05] rounded-3xl p-7 flex flex-col justify-between cursor-default"
              whileHover={{ borderColor: 'rgba(255,255,255,0.12)', y: -4, transition: { duration: 0.2 } }}>
              <p className="text-[10px] font-black tracking-[0.22em] uppercase text-white/22">Avg. Savings</p>
              <div>
                <p className="text-5xl font-black text-white mb-1">40<span className="text-2xl">%</span></p>
                <p className="text-[11px] text-white/28">per lease negotiated</p>
              </div>
            </motion.div>
          </motion.div>
        </section>

        {/* ══════════════════════════════════════════════════════
            STATS STRIP
        ══════════════════════════════════════════════════════ */}
        <section className="mt-24 border-t border-b border-white/[0.04] bg-[#09090c]">
          <div className="container mx-auto px-4 md:px-6">
            <motion.div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-white/[0.04]"
              initial="hidden" whileInView="show"
              viewport={{ once: false, margin: '-60px' }} variants={stagger}>
              {[
                { val: '300+', label: 'Leases Signed',     sub: 'across all sectors'   },
                { val: '40%',  label: 'Average Savings',   sub: 'per lease negotiated' },
                { val: '10yr', label: 'Experience',        sub: 'tenant-only focus'    },
                { val: '98%',  label: 'Client Retention',  sub: 'repeat clients'       },
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
            CTA — immersive full-bleed with images & centred copy
        ══════════════════════════════════════════════════════ */}
        <section className="mt-32 relative overflow-hidden">

          {/* Full-bleed bg image */}
          <div className="absolute inset-0 z-0">
            <Parallax speed={0.07} className="absolute inset-0 w-full h-[115%] -top-[7%]">
              <Image src="/tenentrepresentation-pics/tenent-1.jpg" alt="" fill className="object-cover" />
            </Parallax>
            <div className="absolute inset-0 bg-[#060708]/88" />
          </div>

          {/* Floating image cards — left & right */}
          <motion.div
            className="absolute top-8 left-8 w-[200px] h-[140px] rounded-2xl overflow-hidden shadow-[0_30px_80px_rgba(0,0,0,0.85)] border border-white/[0.06] hidden lg:block z-10"
            initial={{ opacity: 0, x: -40, rotate: -3 }}
            whileInView={{ opacity: 1, x: 0, rotate: -1.5 }}
            viewport={{ once: false }}
            transition={{ duration: 0.9, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            whileHover={{ scale: 1.05, rotate: 0, transition: { duration: 0.3 } }}
          >
            <Image src="/tenentrepresentation-pics/tenent-10.jpg" alt="" fill className="object-cover" />
            <div className="absolute inset-0 bg-[#060708]/25" />
          </motion.div>

          <motion.div
            className="absolute bottom-8 right-8 w-[200px] h-[140px] rounded-2xl overflow-hidden shadow-[0_30px_80px_rgba(0,0,0,0.85)] border border-white/[0.06] hidden lg:block z-10"
            initial={{ opacity: 0, x: 40, rotate: 3 }}
            whileInView={{ opacity: 1, x: 0, rotate: 1.5 }}
            viewport={{ once: false }}
            transition={{ duration: 0.9, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
            whileHover={{ scale: 1.05, rotate: 0, transition: { duration: 0.3 } }}
          >
            <Image src="/tenentrepresentation-pics/tenent-11.jpg" alt="" fill className="object-cover" />
            <div className="absolute inset-0 bg-[#060708]/25" />
          </motion.div>

          {/* Centred copy */}
          <div className="relative z-10 container mx-auto px-4 md:px-6 py-28 flex flex-col items-center text-center">
            <motion.div
              initial="hidden" whileInView="show"
              viewport={{ once: false }} variants={stagger}
              className="max-w-xl"
            >
              <motion.p variants={si}
                className="text-[10px] font-black tracking-[0.28em] uppercase text-white/22 mb-7 flex items-center gap-2 justify-center">
                <span className="w-5 h-px bg-white/12" /> Get In Touch <span className="w-5 h-px bg-white/12" />
              </motion.p>
              <motion.h2 variants={si}
                className="text-5xl md:text-[4rem] font-black leading-[0.96] tracking-[-0.03em] text-white mb-2">
                Looking for Your
              </motion.h2>
              <motion.h2 variants={si}
                className="text-5xl md:text-[4rem] font-black leading-[0.96] tracking-[-0.03em] text-white/20 mb-8">
                Perfect Space?
              </motion.h2>
              <motion.p variants={si}
                className="text-[13px] text-white/38 leading-[1.9] mb-10">
                Let us represent your interests in finding the ideal property — exclusively advocating for you every step of the way.
              </motion.p>
              <motion.div variants={si} className="flex items-center gap-5 justify-center">
                <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
                  <Link href="/contact"
                    className="inline-flex items-center gap-2 bg-white text-black px-7 py-[14px] rounded-full font-black text-sm hover:bg-white/90 transition-colors">
                    Find My Space <ArrowRight className="w-4 h-4" />
                  </Link>
                </motion.div>
                <motion.div whileHover={{ x: 4, transition: { duration: 0.18 } }}>
                  <Link href="/contact"
                    className="text-[13px] text-white/28 hover:text-white/58 transition-colors flex items-center gap-1.5">
                    Call us now <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </motion.div>
              </motion.div>
            </motion.div>
          </div>
        </section>

      </main>
    </>
  );
}