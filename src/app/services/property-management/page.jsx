'use client';

import Header from '../../../app/components/Header';
import { Building2, CheckCircle, ArrowRight, Home, TrendingUp, Shield } from 'lucide-react';
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
  hidden: { opacity: 0, y: 44 },
  show: (delay = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.78, ease: [0.22, 1, 0.36, 1], delay },
  }),
};
const fadeLeft = {
  hidden: { opacity: 0, x: -52 },
  show: (delay = 0) => ({
    opacity: 1, x: 0,
    transition: { duration: 0.82, ease: [0.22, 1, 0.36, 1], delay },
  }),
};
const fadeRight = {
  hidden: { opacity: 0, x: 52 },
  show: (delay = 0) => ({
    opacity: 1, x: 0,
    transition: { duration: 0.82, ease: [0.22, 1, 0.36, 1], delay },
  }),
};
const scaleIn = {
  hidden: { opacity: 0, scale: 0.86 },
  show: (delay = 0) => ({
    opacity: 1, scale: 1,
    transition: { duration: 0.76, ease: [0.22, 1, 0.36, 1], delay },
  }),
};
const staggerContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
};
const staggerItem = {
  hidden: { opacity: 0, y: 26 },
  show: { opacity: 1, y: 0, transition: { duration: 0.56, ease: [0.22, 1, 0.36, 1] } },
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
  const y = useTransform(scrollYProgress, [0, 1], [`${speed * -80}px`, `${speed * 80}px`]);
  return <motion.div ref={ref} style={{ y }} className={className}>{children}</motion.div>;
}

// ─── Main Page ──────────────────────────────────────────────────────────────

export default function PropertyManagementPage() {
  const features = [
    'Tenant Screening and Selection',
    'Rent Collection and Financial Reporting',
    '24/7 Maintenance Coordination',
    'Property Inspections',
    'Lease Administration',
    'Eviction Processing',
    'Vendor Management',
    'Budget Planning',
  ];

  const benefits = [
    'Maximized rental income',
    'Reduced vacancy rates',
    'Professional tenant management',
    'Legal compliance assurance',
    'Stress-free ownership',
  ];

  const stats = [
    { icon: Home,       value: '500+', label: 'Properties Managed' },
    { icon: TrendingUp, value: '98%',  label: 'Occupancy Rate'     },
    { icon: Shield,     value: '15+',  label: 'Years Experience'   },
  ];

  return (
    <>
      <Header />
      <main className="min-h-screen bg-[#07080a] text-white pb-24 overflow-x-hidden">

        {/* ─── HERO ─── */}
        <section className="pt-32 pb-0 container mx-auto px-4 md:px-6">
          <ServiceNavigation />

          <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-0 items-start">

            {/* Left — headline */}
            <motion.div
              className="lg:pr-16 pb-12"
              initial="hidden"
              animate="show"
              variants={staggerContainer}
            >
              {/* Eyebrow */}
              <motion.div variants={fadeUp} custom={0} className="flex items-center gap-2.5 mb-9">
                <div className="w-7 h-7 rounded-lg bg-white/[0.06] border border-white/[0.08] flex items-center justify-center">
                  <Building2 className="w-3 h-3 text-white/50" />
                </div>
                <span className="text-[10px] font-black tracking-[0.28em] uppercase text-white/35">
                  Property Management
                </span>
              </motion.div>

              {/* Headline */}
              <motion.h1 variants={fadeUp} custom={0.1}
                className="text-[clamp(3.2rem,6.5vw,5.5rem)] font-black leading-[0.96] tracking-[-0.035em] text-white mb-2">
                Your Property.
              </motion.h1>
              <motion.h1 variants={fadeUp} custom={0.2}
                className="text-[clamp(3.2rem,6.5vw,5.5rem)] font-black leading-[0.96] tracking-[-0.035em] mb-10"
                style={{ WebkitTextStroke: '1.5px rgba(255,255,255,0.2)', color: 'transparent' }}>
                Our Priority.
              </motion.h1>

              <motion.p variants={fadeUp} custom={0.3}
                className="text-[13px] text-white/38 max-w-[340px] leading-[1.95] mb-11 pl-4 border-l-2 border-white/8">
                Comprehensive management solutions that maximize your investment returns
                while giving you total peace of mind.
              </motion.p>

              <motion.div variants={fadeUp} custom={0.4} whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
                <Link href="/contact"
                  className="inline-flex items-center gap-2 bg-white text-black px-7 py-[14px] rounded-full font-black text-sm hover:bg-white/90 transition-colors">
                  Get Started <ArrowRight className="w-4 h-4" />
                </Link>
              </motion.div>
            </motion.div>

            {/* Right — floating image stack */}
            <div className="relative h-[480px] hidden lg:block">

              {/* Main large image */}
              <motion.div
                className="absolute top-0 right-0 w-[75%] h-[380px] rounded-3xl overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,0.7)]"
                initial={{ opacity: 0, scale: 0.9, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.9, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              >
                <ParallaxImage speed={0.12} className="absolute inset-0 w-full h-[110%] -top-[5%]">
                  <Image src="/propertymangement-pics/real-estate-4.jpg" alt="Featured property" fill priority className="object-cover" />
                </ParallaxImage>
                <div className="absolute inset-0 bg-gradient-to-t from-[#07080a]/40 to-transparent" />
              </motion.div>

              {/* Floating small card — bottom left */}
              <motion.div
                className="absolute bottom-0 left-0 w-[52%] h-[260px] rounded-2xl overflow-hidden shadow-[0_30px_80px_rgba(0,0,0,0.8)] border-4 border-[#07080a]"
                initial={{ opacity: 0, x: -40, y: 20 }}
                animate={{ opacity: 1, x: 0, y: 0 }}
                transition={{ duration: 0.9, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
              >
                <Image src="/propertymangement-pics/real-estate-2.jpg" alt="Interior property" fill className="object-cover object-center" />
              </motion.div>

              {/* Floating stat pill */}
              <motion.div
                className="absolute top-6 left-4 bg-[#07080a]/70 backdrop-blur-xl border border-white/10 rounded-2xl shadow-xl px-5 py-4 flex items-center gap-3"
                initial={{ opacity: 0, y: -20, scale: 0.85 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.7, delay: 0.75, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ scale: 1.06, transition: { duration: 0.22 } }}
              >
                <div className="w-9 h-9 bg-white/10 border border-white/[0.08] rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 text-white/70" />
                </div>
                <div>
                  <p className="text-[10px] text-white/32 leading-none mb-1 tracking-wide">Avg. Occupancy</p>
                  <p className="text-lg font-black text-white leading-none">98%</p>
                </div>
              </motion.div>

              {/* Floating label pill */}
              <motion.div
                className="absolute bottom-4 right-0 bg-white text-black text-[11px] font-black px-4 py-2 rounded-full shadow-xl"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7, delay: 0.85, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ scale: 1.08, transition: { duration: 0.2 } }}
              >
                500+ Properties
              </motion.div>
            </div>
          </div>
        </section>

        {/* ─── STATS ROW ─── */}
        <section className="border-t border-b border-white/[0.05] mt-12 bg-[#09090d]">
          <div className="container mx-auto px-4 md:px-6">
            <motion.div
              className="grid grid-cols-3 divide-x divide-white/[0.05]"
              initial="hidden"
              whileInView="show"
              viewport={{ once: false, margin: '-60px' }}
              variants={staggerContainer}
            >
              {stats.map(({ icon: Icon, value, label }) => (
                <motion.div
                  key={label}
                  variants={staggerItem}
                  className="py-9 px-8 hover:bg-white/[0.02] transition-colors duration-300"
                  whileHover={{ y: -2, transition: { duration: 0.2 } }}
                >
                  <motion.div
                    initial={{ scale: 0.4, rotate: -45, opacity: 0 }}
                    whileInView={{ scale: 1, rotate: 0, opacity: 1 }}
                    viewport={{ once: false }}
                    transition={{ duration: 0.5, ease: 'backOut' }}
                  >
                    <Icon className="w-5 h-5 text-white/25 mb-3" />
                  </motion.div>
                  <p className="text-[10px] font-black tracking-[0.22em] uppercase text-white/22 mb-2">{label}</p>
                  <p className="text-4xl font-black text-white">{value}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ─── OVERVIEW ─── */}
        <section className="container mx-auto px-4 md:px-6 mt-28 relative">

          {/* Ghost number */}
          <motion.div
            className="absolute -top-10 -right-4 text-[18vw] font-black text-white/[0.022] leading-none select-none pointer-events-none hidden lg:block"
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
            viewport={{ once: false }} transition={{ duration: 1.3 }}
          >01</motion.div>

          <RevealOnScroll variants={fadeUp} className="mb-16">
            <p className="text-[10px] font-black tracking-[0.28em] uppercase text-white/22 flex items-center gap-2">
              <span className="w-5 h-px bg-white/12" /> Our Approach
            </p>
          </RevealOnScroll>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

            {/* Overlapping image block */}
            <div className="relative h-[460px]">
              <RevealOnScroll variants={fadeLeft} className="absolute top-0 left-0 w-[80%] h-[340px]">
                <div className="w-full h-full rounded-3xl overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,0.75)]">
                  <ParallaxImage speed={0.1} className="absolute inset-0 w-full h-[115%] -top-[7%]">
                    <Image src="/propertymangement-pics/real-estate-3.jpg" alt="Property exterior" fill className="object-cover" />
                  </ParallaxImage>
                  <div className="absolute inset-0 bg-gradient-to-t from-[#07080a]/30 to-transparent" />
                </div>
              </RevealOnScroll>

              <RevealOnScroll variants={fadeRight} custom={0.2} className="absolute bottom-0 right-0 w-[58%] h-[240px]">
                <div className="w-full h-full rounded-2xl overflow-hidden shadow-[0_30px_80px_rgba(0,0,0,0.85)] border-4 border-[#07080a]">
                  <Image src="/propertymangement-pics/real-estate-1.jpg" alt="Property interior" fill className="object-cover object-bottom" />
                </div>
              </RevealOnScroll>

              <RevealOnScroll variants={scaleIn} custom={0.35} className="absolute top-4 right-4 z-10">
                <motion.div
                  className="bg-[#07080a]/65 backdrop-blur-xl border border-white/10 rounded-2xl shadow-xl p-5 text-center"
                  whileHover={{ scale: 1.08, rotate: -2, transition: { duration: 0.25 } }}
                >
                  <p className="text-3xl font-black text-white">15+</p>
                  <p className="text-[10px] text-white/35 mt-1 tracking-widest uppercase">Years<br />Experience</p>
                </motion.div>
              </RevealOnScroll>
            </div>

            {/* Text */}
            <motion.div
              initial="hidden"
              whileInView="show"
              viewport={{ once: false, margin: '-80px' }}
              variants={staggerContainer}
            >
              <motion.h2 variants={staggerItem}
                className="text-4xl md:text-[2.8rem] font-black leading-[1.05] tracking-[-0.025em] text-white mb-7">
                Built Around Your Investment
              </motion.h2>
              <motion.p variants={staggerItem} className="text-[13px] text-white/38 leading-[1.95] mb-5">
                Our property management services are designed to protect and enhance the value of
                your real estate investments. We handle every aspect of property operations, from
                tenant screening to maintenance coordination.
              </motion.p>
              <motion.p variants={staggerItem} className="text-[13px] text-white/38 leading-[1.95] mb-10">
                We combine local market expertise with professional management practices to
                deliver exceptional, measurable results for every owner we serve.
              </motion.p>

              <motion.ul className="space-y-0" variants={staggerContainer}>
                {benefits.map((benefit, index) => (
                  <motion.li
                    key={index}
                    variants={staggerItem}
                    className="flex items-center gap-4 py-4 border-b border-white/[0.05] text-[13px] text-white/48 group cursor-default"
                    whileHover={{ x: 6, color: 'rgba(255,255,255,0.88)', transition: { duration: 0.18 } }}
                  >
                    <motion.span
                      className="w-1 h-1 rounded-full bg-white/25 flex-shrink-0"
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      viewport={{ once: false }}
                      transition={{ duration: 0.3, delay: index * 0.07, ease: 'backOut' }}
                    />
                    {benefit}
                  </motion.li>
                ))}
              </motion.ul>
            </motion.div>
          </div>
        </section>

        {/* ─── FEATURES ─── */}
        <section className="container mx-auto px-4 md:px-6 mt-28 relative">

          <motion.div
            className="absolute -top-10 -left-4 text-[18vw] font-black text-white/[0.022] leading-none select-none pointer-events-none hidden lg:block"
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
            viewport={{ once: false }} transition={{ duration: 1.3 }}
          >02</motion.div>

          <RevealOnScroll variants={fadeUp} className="flex items-end justify-between mb-14">
            <div>
              <p className="text-[10px] font-black tracking-[0.28em] uppercase text-white/22 mb-3 flex items-center gap-2">
                <span className="w-5 h-px bg-white/12" /> Services
              </p>
              <h2 className="text-4xl md:text-5xl font-black tracking-[-0.025em] text-white">
                Our Services Include
              </h2>
            </div>
            <p className="text-xs text-white/18 hidden md:block text-right leading-relaxed">
              Full-service<br />property operations
            </p>
          </RevealOnScroll>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
            initial="hidden"
            whileInView="show"
            viewport={{ once: false, margin: '-60px' }}
            variants={staggerContainer}
          >
            {/* Image anchor card */}
            <motion.div
              className="relative rounded-3xl overflow-hidden h-48 md:col-span-2 lg:col-span-1 lg:row-span-2 lg:h-auto min-h-[260px] shadow-[0_40px_100px_rgba(0,0,0,0.7)]"
              variants={scaleIn}
              whileHover={{ scale: 1.015, transition: { duration: 0.35 } }}
            >
              <ParallaxImage speed={0.1} className="absolute inset-0 w-full h-[115%] -top-[7%]">
                <Image src="/propertymangement-pics/real-estate-5.jpg" alt="Services" fill className="object-cover" />
              </ParallaxImage>
              <div className="absolute inset-0 bg-gradient-to-t from-[#07080a]/85 via-[#07080a]/20 to-transparent" />
              <motion.div
                className="absolute bottom-6 left-6"
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <p className="text-white font-black text-lg">Everything Handled.</p>
                <p className="text-white/38 text-xs mt-0.5">So you don't have to.</p>
              </motion.div>
            </motion.div>

            {features.map((feature, index) => (
              <motion.div
                key={index}
                variants={staggerItem}
                whileHover={{ y: -5, borderColor: 'rgba(255,255,255,0.13)', transition: { duration: 0.22 } }}
                className="group relative bg-[#0c0e12] rounded-2xl p-6 border border-white/[0.05] transition-colors duration-300 cursor-default overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />
                <motion.div
                  className="relative z-10 w-8 h-8 rounded-lg bg-white/[0.06] border border-white/[0.07] flex items-center justify-center mb-4"
                  initial={{ rotate: -90, opacity: 0 }}
                  whileInView={{ rotate: 0, opacity: 1 }}
                  viewport={{ once: false }}
                  transition={{ duration: 0.4, delay: index * 0.05, ease: 'backOut' }}
                >
                  <CheckCircle className="w-3.5 h-3.5 text-white/38" />
                </motion.div>
                <h3 className="relative z-10 text-sm font-black text-white/62 group-hover:text-white/90 transition-colors">
                  {feature}
                </h3>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* ─── CTA ─── */}
        <section className="container mx-auto px-4 md:px-6 mt-28">
          <RevealOnScroll variants={scaleIn}>
            <div className="relative rounded-3xl overflow-hidden bg-[#0c0e12] border border-white/[0.06] p-12 md:p-16">

              {/* Ghost image bleeding from right */}
              <motion.div
                className="absolute right-0 bottom-0 w-[42%] h-full"
                initial={{ x: 60, opacity: 0 }}
                whileInView={{ x: 0, opacity: 0.12 }}
                viewport={{ once: false }}
                transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
              >
                <Image src="/propertymangement-pics/real-estate-6.jpg" alt="" fill className="object-cover object-left" />
              </motion.div>

              {/* Floating image card — top right */}
              <motion.div
                className="absolute top-8 right-8 w-[220px] h-[140px] rounded-2xl overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.8)] border border-white/[0.08] hidden md:block"
                initial={{ opacity: 0, y: -24, rotate: 3 }}
                whileInView={{ opacity: 1, y: 0, rotate: 0 }}
                viewport={{ once: false }}
                transition={{ duration: 0.85, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ scale: 1.05, rotate: -1.5, transition: { duration: 0.3 } }}
              >
                <Image src="/propertymangement-pics/real-estate-7.jpg" alt="Property" fill className="object-cover" />
                <div className="absolute inset-0 bg-[#07080a]/30" />
              </motion.div>

              {/* Copy */}
              <motion.div
                className="relative z-10 max-w-xl"
                initial="hidden"
                whileInView="show"
                viewport={{ once: false }}
                variants={staggerContainer}
              >
                <motion.p variants={staggerItem}
                  className="text-[10px] font-black tracking-[0.28em] uppercase text-white/22 mb-7 flex items-center gap-2">
                  <span className="w-5 h-px bg-white/12" /> Get In Touch
                </motion.p>
                <motion.h2 variants={staggerItem}
                  className="text-4xl md:text-5xl font-black tracking-[-0.025em] text-white leading-[0.97] mb-2">
                  Ready to Maximize Your
                </motion.h2>
                <motion.h2 variants={staggerItem}
                  className="text-4xl md:text-5xl font-black tracking-[-0.025em] text-white/20 leading-[0.97] mb-8">
                  Property's Potential?
                </motion.h2>
                <motion.p variants={staggerItem}
                  className="text-[13px] text-white/35 mb-10 max-w-sm leading-[1.9] border-l-2 border-white/8 pl-4">
                  Contact us today to discuss your property management needs.
                </motion.p>
                <motion.div variants={staggerItem} whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
                  <Link href="/contact"
                    className="inline-flex items-center gap-2 bg-white text-black px-7 py-[14px] rounded-full font-black text-sm hover:bg-white/90 transition-colors">
                    Get Started <ArrowRight className="w-4 h-4" />
                  </Link>
                </motion.div>
              </motion.div>
            </div>
          </RevealOnScroll>
        </section>

      </main>
    </>
  );
}