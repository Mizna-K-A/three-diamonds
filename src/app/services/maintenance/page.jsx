'use client';

import Header from '../../../app/components/Header';
import { Wrench, CheckCircle, ArrowRight, Clock, Star, Zap, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import ServiceNavigation from '../ServiceNavigation';
import Image from 'next/image';
import {
  motion,
  useScroll,
  useTransform,
  useInView,
} from 'framer-motion';
import { useRef } from 'react';

// ─── Animation variants ─────────────────────────────────────────────────────

const fadeUp = {
  hidden: { opacity: 0, y: 50 },
  show: (delay = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.85, ease: [0.22, 1, 0.36, 1], delay },
  }),
};

const fadeLeft = {
  hidden: { opacity: 0, x: -60 },
  show: (delay = 0) => ({
    opacity: 1, x: 0,
    transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1], delay },
  }),
};

const fadeRight = {
  hidden: { opacity: 0, x: 60 },
  show: (delay = 0) => ({
    opacity: 1, x: 0,
    transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1], delay },
  }),
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.85 },
  show: (delay = 0) => ({
    opacity: 1, scale: 1,
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1], delay },
  }),
};

const staggerContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.05 } },
};

const staggerItem = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

// ─── Helpers ────────────────────────────────────────────────────────────────

function RevealOnScroll({ children, variants, custom, className }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: false, margin: '-80px' });
  return (
    <motion.div ref={ref} initial="hidden" animate={inView ? 'show' : 'hidden'}
      variants={variants} custom={custom} className={className}>
      {children}
    </motion.div>
  );
}

function ParallaxImage({ children, speed = 0.15, className }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], [`${speed * -100}px`, `${speed * 100}px`]);
  return <motion.div ref={ref} style={{ y }} className={className}>{children}</motion.div>;
}

// ─── Page ───────────────────────────────────────────────────────────────────

export default function MaintenancePage() {
  const features = [
    'Repairs & Renovations',
    'Preventive Maintenance Programs',
    'Emergency Repair Services',
    'HVAC Maintenance',
    'Plumbing & Electrical',
    'Painting & Drywall',
    'Roofing & Exterior',
    'Landscaping & Groundskeeping',
  ];

  const benefits = [
    'Extended property lifespan',
    'Reduced emergency repairs',
    'Cost-effective maintenance',
    'Professional vendor network',
    '24/7 emergency response',
  ];

  const stats = [
    { icon: Clock, value: '24/7', label: 'Emergency Response' },
    { icon: Star, value: '4.9★', label: 'Client Satisfaction' },
    { icon: Zap, value: '2hr', label: 'Avg. Response Time' },
  ];

  return (
    <>
      <Header />
      <main className="min-h-screen bg-[#080808] text-white pb-32 overflow-x-hidden">

        {/* ─── HERO — split left text / right image stack ─── */}
        <section className="relative pt-32 pb-24 overflow-hidden">

          {/* Subtle noise texture bg accent */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_70%_40%,rgba(255,255,255,0.03)_0%,transparent_70%)] pointer-events-none" />

          <div className="container mx-auto px-4 md:px-6">
            <ServiceNavigation />

            <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-0 items-center min-h-[78vh]">

              {/* ── LEFT — Typography-forward text column ── */}
              <motion.div
                className="lg:pr-14 py-8"
                initial="hidden"
                animate="show"
                variants={staggerContainer}
              >
                {/* Eyebrow */}
                <motion.div variants={fadeUp} custom={0} className="flex items-center gap-3 mb-10">
                  <div className="w-8 h-8 rounded-lg bg-white/[0.06] border border-white/[0.09] flex items-center justify-center">
                    <Wrench className="w-3.5 h-3.5 text-white/50" />
                  </div>
                  <span className="text-[11px] font-bold tracking-[0.28em] uppercase text-white/35">
                    Property Maintenance
                  </span>
                </motion.div>

                {/* Headline — mixed weight editorial style */}
                <div className="mb-10 overflow-hidden">
                  <motion.p
                    variants={fadeUp} custom={0.08}
                    className="text-[13px] font-medium tracking-[0.18em] uppercase text-white/25 mb-3"
                  >
                    We keep your property
                  </motion.p>

                  <motion.h1
                    variants={fadeUp} custom={0.16}
                    className="text-[clamp(3.2rem,7vw,5.8rem)] font-black leading-[1] tracking-[-0.03em] text-white"
                  >
                    Always
                  </motion.h1>

                  {/* Outline / stroke headline line */}
                  <motion.h1
                    variants={fadeUp} custom={0.24}
                    className="text-[clamp(3.2rem,7vw,5.8rem)] font-black leading-[1] tracking-[-0.03em]"
                    style={{
                      WebkitTextStroke: '1.5px rgba(255,255,255,0.22)',
                      color: 'transparent',
                    }}
                  >
                    In Peak
                  </motion.h1>

                  <motion.h1
                    variants={fadeUp} custom={0.32}
                    className="text-[clamp(3.2rem,7vw,5.8rem)] font-black leading-[1] tracking-[-0.03em] text-white"
                  >
                    Condition.
                  </motion.h1>
                </div>

                {/* Descriptor — right-indented, italic accent */}
                <motion.p
                  variants={fadeUp} custom={0.4}
                  className="text-sm text-white/40 max-w-[340px] leading-[1.85] mb-12 ml-1 italic"
                >
                  Professional maintenance services that preserve your property's value
                  and keep tenants satisfied — year round, around the clock.
                </motion.p>

                {/* CTAs */}
                <motion.div variants={fadeUp} custom={0.48} className="flex items-center gap-5">
                  <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
                    <Link
                      href="/contact"
                      className="inline-flex items-center gap-2.5 bg-white text-black px-7 py-[14px] rounded-full font-bold text-sm hover:bg-white/90 transition-colors"
                    >
                      Get Started <ArrowRight className="w-4 h-4" />
                    </Link>
                  </motion.div>
                  <motion.div whileHover={{ x: 4, transition: { duration: 0.2 } }}>
                    <Link
                      href="#services"
                      className="text-[13px] text-white/35 hover:text-white/65 transition-colors flex items-center gap-1.5 font-medium"
                    >
                      View services <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  </motion.div>
                </motion.div>

                {/* Inline mini stats row */}
                <motion.div
                  variants={fadeUp} custom={0.56}
                  className="flex items-center gap-6 mt-14 pt-8 border-t border-white/[0.07]"
                >
                  {[{ value: '24/7', label: 'Response' }, { value: '4.9★', label: 'Rating' }, { value: '500+', label: 'Jobs Done' }].map(({ value, label }) => (
                    <div key={label}>
                      <p className="text-xl font-black text-white">{value}</p>
                      <p className="text-[10px] text-white/30 tracking-widest uppercase mt-0.5">{label}</p>
                    </div>
                  ))}
                </motion.div>
              </motion.div>

              {/* ── RIGHT — asymmetric image stack ── */}
              <div className="relative h-[580px] hidden lg:block">

                {/* Main tall image — right-anchored */}
                <motion.div
                  className="absolute top-0 right-0 w-[72%] h-[440px] rounded-3xl overflow-hidden shadow-[0_40px_120px_rgba(0,0,0,0.75)]"
                  initial={{ opacity: 0, y: 40, scale: 0.93 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 1, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
                >
                  <ParallaxImage speed={0.12} className="absolute inset-0 w-full h-[115%] -top-[7%]">
                    <Image src="/maintainance-pics/maintaninance-3.jpg" alt="Property" fill priority className="object-cover" />
                  </ParallaxImage>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                </motion.div>

                {/* Overlapping small card — bottom left */}
                <motion.div
                  className="absolute bottom-0 left-0 w-[48%] h-[260px] rounded-2xl overflow-hidden shadow-[0_30px_80px_rgba(0,0,0,0.85)] border-[3px] border-[#080808]"
                  initial={{ opacity: 0, x: -40, y: 20 }}
                  animate={{ opacity: 1, x: 0, y: 0 }}
                  transition={{ duration: 0.95, delay: 0.55, ease: [0.22, 1, 0.36, 1] }}
                >
                  <Image src="/maintainance-pics/maintaninance-2.jpg" alt="Interior" fill className="object-cover object-center" />
                  <div className="absolute inset-0 bg-black/20" />
                </motion.div>

                {/* Floating glass stat pill — top left of image stack */}
                <motion.div
                  className="absolute top-5 left-3 bg-black/55 backdrop-blur-xl border border-white/10 rounded-2xl px-5 py-4 flex items-center gap-3.5 z-10"
                  initial={{ opacity: 0, y: -18, scale: 0.88 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.75, delay: 0.85, ease: [0.22, 1, 0.36, 1] }}
                  whileHover={{ scale: 1.06, transition: { duration: 0.22 } }}
                >
                  <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center">
                    <Clock className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="text-xs text-white/40 leading-none mb-1">Response Time</p>
                    <p className="text-lg font-black text-white leading-none">24 / 7</p>
                  </div>
                </motion.div>

                {/* Floating label pill — bottom right of main image */}
                <motion.div
                  className="absolute bottom-[180px] right-0 bg-white text-black text-xs font-bold px-4 py-2 rounded-full shadow-xl z-10"
                  initial={{ opacity: 0, x: 24 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.7, delay: 1, ease: [0.22, 1, 0.36, 1] }}
                  whileHover={{ scale: 1.07, transition: { duration: 0.2 } }}
                >
                  2hr Avg. Response
                </motion.div>

                {/* Thin decorative vertical rule */}
                <motion.div
                  className="absolute right-[-24px] top-[15%] h-[55%] w-px bg-gradient-to-b from-transparent via-white/10 to-transparent hidden xl:block"
                  initial={{ scaleY: 0 }}
                  animate={{ scaleY: 1 }}
                  transition={{ duration: 1.2, delay: 1, ease: [0.22, 1, 0.36, 1] }}
                />
              </div>

            </div>
          </div>
        </section>

        {/* ─── STATS ─── */}
        <section className="container mx-auto px-4 md:px-6 -mt-2">
          <motion.div
            className="grid grid-cols-3 gap-px bg-white/5 rounded-2xl overflow-hidden border border-white/5"
            initial="hidden" whileInView="show"
            viewport={{ once: false, margin: '-60px' }}
            variants={staggerContainer}
          >
            {stats.map(({ icon: Icon, value, label }, i) => (
              <motion.div key={label} variants={staggerItem}
                className="bg-[#0e0e0e] px-8 py-8 flex items-center gap-5 hover:bg-[#131313] transition-colors duration-300"
                whileHover={{ y: -2, transition: { duration: 0.2 } }}
              >
                <motion.div
                  className="w-10 h-10 rounded-xl bg-white/5 border border-white/[0.08] flex items-center justify-center flex-shrink-0"
                  initial={{ scale: 0, rotate: -45 }}
                  whileInView={{ scale: 1, rotate: 0 }}
                  viewport={{ once: false }}
                  transition={{ duration: 0.5, delay: i * 0.1, ease: 'backOut' }}
                >
                  <Icon className="w-4 h-4 text-white/60" />
                </motion.div>
                <div>
                  <p className="text-2xl font-bold text-white">{value}</p>
                  <p className="text-xs text-white/35 mt-0.5">{label}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* ─── OVERVIEW — 12-col asymmetric ─── */}
        <section className="container mx-auto px-4 md:px-6 mt-32 relative">

          {/* Ghost section number */}
          <motion.div
            className="absolute -top-10 -left-8 text-[180px] font-black text-white/[0.02] leading-none select-none pointer-events-none hidden lg:block"
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
            viewport={{ once: false }} transition={{ duration: 1.2 }}
          >
            01
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 items-start">

            {/* Left text */}
            <motion.div
              className="lg:col-span-5 lg:pt-20 lg:pr-10 mb-16 lg:mb-0"
              initial="hidden" whileInView="show"
              viewport={{ once: false, margin: '-80px' }}
              variants={staggerContainer}
            >
              <motion.p variants={staggerItem}
                className="text-[11px] font-bold tracking-[0.22em] uppercase text-white/30 mb-6 flex items-center gap-2">
                <span className="w-6 h-px bg-white/20" /> Our Approach
              </motion.p>
              <motion.h2 variants={staggerItem}
                className="text-4xl md:text-5xl font-black leading-tight text-white mb-8 tracking-tight">
                Maintenance Built Around Your Property
              </motion.h2>
              <motion.p variants={staggerItem} className="text-white/45 leading-relaxed mb-5 text-sm">
                Our maintenance services ensure your investment remains in peak condition year-round.
                From routine preventive care to emergency repairs, we deliver comprehensive solutions
                that protect value and keep tenants happy.
              </motion.p>
              <motion.p variants={staggerItem} className="text-white/45 leading-relaxed mb-10 text-sm">
                We coordinate with licensed and insured vendors, oversee all work quality,
                and provide transparent reporting so you always know your property's status.
              </motion.p>

              <motion.ul className="space-y-0" variants={staggerContainer}>
                {benefits.map((benefit, index) => (
                  <motion.li key={index} variants={staggerItem}
                    className="flex items-center gap-4 py-4 border-b border-white/[0.06] text-white/55 text-sm group cursor-default"
                    whileHover={{ x: 6, color: 'rgba(255,255,255,0.9)', transition: { duration: 0.2 } }}
                  >
                    <motion.span
                      className="w-1 h-1 rounded-full bg-white/25 flex-shrink-0"
                      initial={{ scale: 0 }} whileInView={{ scale: 1 }}
                      viewport={{ once: false }}
                      transition={{ duration: 0.3, delay: index * 0.06, ease: 'backOut' }}
                    />
                    {benefit}
                    <ChevronRight className="w-3 h-3 ml-auto opacity-0 group-hover:opacity-30 transition-opacity" />
                  </motion.li>
                ))}
              </motion.ul>
            </motion.div>

            {/* Right — image collage */}
            <div className="lg:col-span-7 relative h-[560px]">

              {/* Large image — top right */}
              <RevealOnScroll variants={fadeRight} className="absolute top-0 right-0 w-[78%] h-[400px]">
                <div className="w-full h-full rounded-3xl overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,0.8)]">
                  <ParallaxImage speed={0.1} className="absolute inset-0 w-full h-[115%] -top-[7%]">
                    <Image src="/maintainance-pics/maintaninance-5.jpg" alt="Property" fill className="object-cover" />
                  </ParallaxImage>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                </div>
              </RevealOnScroll>

              {/* Overlapping small image — bottom left */}
              <RevealOnScroll variants={fadeLeft} custom={0.25} className="absolute bottom-0 left-0 w-[50%] h-[270px] z-10">
                <div className="w-full h-full rounded-2xl overflow-hidden shadow-[0_30px_80px_rgba(0,0,0,0.9)] border-[3px] border-[#080808]">
                  <Image src="/maintainance-pics/maintaninance-1.jpg" alt="Interior" fill className="object-cover" />
                  <div className="absolute inset-0 bg-black/20" />
                </div>
              </RevealOnScroll>

              {/* Glass badge */}
              <RevealOnScroll variants={scaleIn} custom={0.4} className="absolute top-6 left-4 z-20">
                <motion.div
                  className="bg-black/60 backdrop-blur-xl border border-white/10 rounded-2xl px-5 py-4 text-center"
                  whileHover={{ scale: 1.07, transition: { duration: 0.25 } }}
                >
                  <p className="text-3xl font-black text-white">500+</p>
                  <p className="text-[10px] text-white/40 mt-1 tracking-widest uppercase">Jobs Done</p>
                </motion.div>
              </RevealOnScroll>

              {/* Vertical text strip */}
              <motion.div
                className="absolute right-[-28px] top-1/2 -translate-y-1/2 hidden xl:flex flex-col items-center gap-3"
                initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
                viewport={{ once: false }} transition={{ duration: 1, delay: 0.5 }}
              >
                <div className="w-px h-16 bg-white/8" />
                <p className="text-[9px] tracking-[0.3em] uppercase text-white/15 [writing-mode:vertical-rl]">
                  Maintenance Excellence
                </p>
                <div className="w-px h-16 bg-white/8" />
              </motion.div>
            </div>
          </div>
        </section>

        {/* ─── SERVICES ─── */}
        <section id="services" className="container mx-auto px-4 md:px-6 mt-36 relative">

          <motion.div
            className="absolute -top-10 -left-8 text-[180px] font-black text-white/[0.02] leading-none select-none pointer-events-none hidden lg:block"
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
            viewport={{ once: false }} transition={{ duration: 1.2 }}
          >
            02
          </motion.div>

          <RevealOnScroll variants={fadeUp} className="mb-14">
            <div className="flex items-end justify-between">
              <div>
                <p className="text-[11px] font-bold tracking-[0.22em] uppercase text-white/30 mb-4 flex items-center gap-2">
                  <span className="w-6 h-px bg-white/20" /> Services
                </p>
                <h2 className="text-4xl md:text-5xl font-black tracking-tight text-white">Our Services Include</h2>
              </div>
              <p className="text-xs text-white/25 hidden md:block text-right leading-relaxed">
                Full-spectrum<br />maintenance
              </p>
            </div>
          </RevealOnScroll>

          <div className="grid grid-cols-12 gap-4">

            {/* Tall image anchor card */}
            <motion.div
              className="col-span-12 md:col-span-4 relative rounded-3xl overflow-hidden min-h-[360px] md:min-h-[520px] shadow-[0_40px_100px_rgba(0,0,0,0.7)]"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, margin: '-60px' }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ scale: 1.015, transition: { duration: 0.4 } }}
            >
              <ParallaxImage speed={0.12} className="absolute inset-0 w-full h-[115%] -top-[7%]">
                <Image src="/maintainance-pics/maintaninance-4.jpg" alt="Services" fill className="object-cover" />
              </ParallaxImage>
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
              <motion.div
                className="absolute bottom-8 left-7 right-7"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false }}
                transition={{ duration: 0.7, delay: 0.3 }}
              >
                <p className="text-white font-black text-xl leading-tight mb-1">Every Detail Covered.</p>
                <p className="text-white/40 text-xs tracking-wide">Inside and out, top to bottom.</p>
              </motion.div>
            </motion.div>

            {/* Feature cards */}
            <motion.div
              className="col-span-12 md:col-span-8 grid grid-cols-2 gap-4 content-start"
              initial="hidden" whileInView="show"
              viewport={{ once: false, margin: '-60px' }}
              variants={staggerContainer}
            >
              {features.map((feature, index) => (
                <motion.div key={index} variants={staggerItem}
                  className="group relative bg-[#0e0e0e] border border-white/[0.06] rounded-2xl p-6 overflow-hidden cursor-default"
                  whileHover={{
                    borderColor: 'rgba(255,255,255,0.14)',
                    backgroundColor: '#111111',
                    y: -4,
                    transition: { duration: 0.25 },
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-white/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />
                  <motion.div
                    className="relative z-10"
                    initial={{ rotate: -90, opacity: 0 }}
                    whileInView={{ rotate: 0, opacity: 1 }}
                    viewport={{ once: false }}
                    transition={{ duration: 0.45, delay: index * 0.04, ease: 'backOut' }}
                  >
                    <div className="w-7 h-7 rounded-lg bg-white/[0.06] border border-white/[0.08] flex items-center justify-center mb-4">
                      <CheckCircle className="w-3.5 h-3.5 text-white/40" />
                    </div>
                  </motion.div>
                  <h3 className="relative z-10 text-sm font-semibold text-white/65 group-hover:text-white/90 transition-colors leading-snug">
                    {feature}
                  </h3>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ─── CTA — full cinematic banner ─── */}
        <section className="mt-36 relative overflow-hidden">

          <div className="absolute inset-0 z-0">
            <ParallaxImage speed={0.08} className="absolute inset-0 w-full h-[115%] -top-[7%]">
              <Image src="/maintainance-pics/maintaninance-6.jpg" alt="" fill className="object-cover" />
            </ParallaxImage>
            <div className="absolute inset-0 bg-gradient-to-r from-[#080808] via-[#080808]/85 to-[#080808]/50" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#080808] via-transparent to-[#080808]/40" />
          </div>

          {/* Floating image — top right overlapping */}
          <motion.div
            className="absolute top-[-30px] right-16 w-[260px] h-[175px] rounded-2xl overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,0.8)] border border-white/5 hidden lg:block z-10"
            initial={{ opacity: 0, y: -40, rotate: -3 }}
            whileInView={{ opacity: 1, y: 0, rotate: -1.5 }}
            viewport={{ once: false }}
            transition={{ duration: 0.95, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            whileHover={{ scale: 1.05, rotate: 0, transition: { duration: 0.35 } }}
          >
            <Image src="/maintainance-pics/maintaninance-7.jpg" alt="Property" fill className="object-cover" />
            <div className="absolute inset-0 bg-black/25" />
          </motion.div>

          {/* Second floating card — bottom right */}
          <motion.div
            className="absolute bottom-[-20px] right-72 w-[175px] h-[125px] rounded-2xl overflow-hidden shadow-[0_30px_80px_rgba(0,0,0,0.9)] border border-white/5 hidden xl:block z-10"
            initial={{ opacity: 0, y: 40, rotate: 2 }}
            whileInView={{ opacity: 1, y: 0, rotate: 1 }}
            viewport={{ once: false }}
            transition={{ duration: 0.9, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
            whileHover={{ scale: 1.05, rotate: 0, transition: { duration: 0.35 } }}
          >
            <Image src="/maintainance-pics/maintaninance-2.jpg" alt="Property" fill className="object-cover" />
            <div className="absolute inset-0 bg-black/35" />
          </motion.div>

          <div className="relative z-10 container mx-auto px-4 md:px-6 py-28">
            <motion.div
              className="max-w-2xl"
              initial="hidden" whileInView="show"
              viewport={{ once: false }}
              variants={staggerContainer}
            >
              <motion.p variants={staggerItem}
                className="text-[11px] font-bold tracking-[0.22em] uppercase text-white/30 mb-6 flex items-center gap-2">
                <span className="w-6 h-px bg-white/20" /> Get In Touch
              </motion.p>
              <motion.h2 variants={staggerItem}
                className="text-5xl md:text-7xl font-black leading-[0.95] tracking-tight text-white mb-2">
                Need Property
              </motion.h2>
              <motion.h2 variants={staggerItem}
                className="text-5xl md:text-7xl font-black leading-[0.95] tracking-tight text-white/25 mb-10">
                Maintenance?
              </motion.h2>
              <motion.p variants={staggerItem}
                className="text-white/45 text-sm mb-10 max-w-sm leading-relaxed border-l-2 border-white/10 pl-5">
                Contact us today for professional, reliable maintenance services that protect your investment.
              </motion.p>
              <motion.div variants={staggerItem} className="flex items-center gap-5">
                <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
                  <Link href="/contact"
                    className="inline-flex items-center gap-2 bg-white text-black px-8 py-4 rounded-full font-bold hover:bg-white/90 transition-colors text-sm">
                    Get Started <ArrowRight className="w-4 h-4" />
                  </Link>
                </motion.div>
                <motion.div whileHover={{ x: 4, transition: { duration: 0.2 } }}>
                  <Link href="/contact" className="text-sm text-white/35 hover:text-white/60 transition-colors flex items-center gap-1">
                    Or call us now <ChevronRight className="w-3 h-3" />
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