"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, useState, useMemo } from "react";
import Link from "next/link";

/* ─────────────────────────────────────────────────────────────
   ANIMATION VARIANTS
───────────────────────────────────────────────────────────── */
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.2 },
  },
};

const headerVariants = {
  hidden: { opacity: 0, y: -30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

const getCardVariants = (index) => {
  const variants = [
    {
      hidden: { opacity: 0, x: -100, rotateY: -15 },
      visible: { opacity: 1, x: 0, rotateY: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
    },
    {
      hidden: { opacity: 0, x: 100, scale: 0.8 },
      visible: { opacity: 1, x: 0, scale: 1, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
    },
    {
      hidden: { opacity: 0, y: 100 },
      visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.34, 1.56, 0.64, 1] } },
    },
    {
      hidden: { opacity: 0, scale: 0.5, rotate: -10 },
      visible: { opacity: 1, scale: 1, rotate: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
    },
  ];
  return variants[index % variants.length];
};

/* ─────────────────────────────────────────────────────────────
   HELPERS
───────────────────────────────────────────────────────────── */
const formatPrice = (price) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(price);

/* ─────────────────────────────────────────────────────────────
   COMPONENT
───────────────────────────────────────────────────────────── */
export default function FeaturedProperties({
  initialProperties = [],
  propertyTypes = [],
  statuses = [],
  tags = [],
}) {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { amount: 0.2 });
  const [isFilterOpen, setIsFilterOpen] = useState(true); // Set to true by default
  const filterRef = useRef(null);

  const [selectedType, setSelectedType] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedTags, setSelectedTags] = useState([]);

  const toggleTag = (id) =>
    setSelectedTags((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]
    );

  const categories = [
    { value: "all", label: "All Types" },
    ...propertyTypes.map((t) => ({ value: t.slug, label: t.name })),
  ];

  const filteredProperties = useMemo(() => {
    return initialProperties
      .filter((property) => {
        if (!property) return false;

        const matchesType =
          selectedType === "all" ||
          property.propertyType?.slug === selectedType;

        const matchesStatus =
          selectedStatus === "all" ||
          property.status?._id === selectedStatus;

        const matchesTags =
          selectedTags.length === 0 ||
          property.tags?.some((tag) => selectedTags.includes(tag._id));

        return matchesType && matchesStatus && matchesTags;
      })
      .slice(0, 4);
  }, [initialProperties, selectedType, selectedStatus, selectedTags]);

  const hasFilters = selectedType !== "all" || selectedStatus !== "all" || selectedTags.length > 0;

  const clearFilters = () => {
    setSelectedType("all");
    setSelectedStatus("all");
    setSelectedTags([]);
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (selectedType !== "all") count++;
    if (selectedStatus !== "all") count++;
    count += selectedTags.length;
    return count;
  };


  return (
    <section id="properties" className="section-padding bg-white py-20 px-10" ref={sectionRef}>
      <div className="container-custom max-w-7xl mx-auto">

        {/* ── HEADER ── */}
        <div className="flex flex-col items-center mb-8 relative">
          {/* Header content with filter positioned absolutely */}
          <div className="relative w-full flex justify-center">
            <motion.div
              className="text-center"
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              variants={headerVariants}
            >
              <motion.div
                className="inline-block mb-4"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.5 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-[0.2em]">
                  Featured Listings
                </span>
                <motion.div
                  className="h-px bg-black mx-auto mt-2"
                  initial={{ width: 0 }}
                  animate={isInView ? { width: 64 } : { width: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                />
              </motion.div>

              <motion.h2
                className="text-4xl md:text-5xl font-bold mb-5 tracking-tight"
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                FEATURED PROPERTIES
              </motion.h2>

              <motion.p
                className="text-gray-500 max-w-xl text-sm leading-relaxed mx-auto"
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : { opacity: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
              >
                Discover our handpicked selection of premium properties across Dubai.
              </motion.p>
            </motion.div>

            {/* ── FILTER DROPDOWN (Positioned absolutely to the right) ── */}
            <motion.div
              className="absolute right-0 top-1/2 -translate-y-1/2"
              initial={{ opacity: 0, x: 20 }}
              animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
              transition={{ duration: 0.5, delay: 0.55 }}
            >
             
              {/* Dropdown Panel */}
              <AnimatePresence>
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className=" right-0 bg-white overflow-hidden z-50"
                  >
                    <div className="flex items-end gap-6">
                      {/* Property Type */}
                      <div className="flex-1">
                        <label className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2 block">
                          Property Type
                        </label>
                        <select
                          value={selectedType}
                          onChange={(e) => setSelectedType(e.target.value)}
                          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black bg-white"
                        >
                          {categories.map((cat) => (
                            <option key={cat.value} value={cat.value}>
                              {cat.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Status */}
                      {statuses.length > 0 && (
                        <div className="flex-1">
                          <label className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2 block">
                            Status
                          </label>
                          <select
                            value={selectedStatus}
                            onChange={(e) => setSelectedStatus(e.target.value)}
                            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black bg-white"
                          >
                            <option value="all">Any Status</option>
                            {statuses.map((s) => (
                              <option key={s._id} value={s._id}>
                                {s.name ?? s.label}
                              </option>
                            ))}
                          </select>
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="flex items-center gap-3 pb-[2px]">
                        <button
                          onClick={clearFilters}
                          className="px-4 py-2.5 text-xs font-medium text-gray-600 hover:text-black transition-colors border border-gray-200 rounded-xl hover:border-gray-400"
                        >
                          Clear
                        </button>
                      </div>
                    </div>


                  </motion.div>
              </AnimatePresence>
            </motion.div>
          </div>
        </div>



        {/* Result count */}
        <motion.p
          className="text-xs text-gray-400 mb-8 tracking-wide text-center"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.4, delay: 0.6 }}
        >
          Showing <span className="font-semibold text-gray-600">{filteredProperties.length}</span> properties
        </motion.p>

        {/* ── GRID ── */}
        <AnimatePresence mode="wait">
          {filteredProperties.length > 0 ? (
            <motion.div
              key="grid"
              className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
              variants={containerVariants}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
            >
              {filteredProperties.map((property, index) => {
                const primaryImage =
                  property.images?.find((img) => img.isPrimary) ||
                  property.images?.[0];

                const rawUrl =
                  primaryImage?.url ||
                  primaryImage?.webp?.medium?.url ||
                  primaryImage?.webp?.original?.url ||
                  primaryImage?.original?.url ||
                  null;

                // Prepend API base for relative paths like /uploads/...
                const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "";
                const imageUrl = rawUrl
                  ? rawUrl.startsWith("http") ? rawUrl : `${API_BASE}${rawUrl}`
                  : null;

                const specs = [
                  property.price != null ? `${formatPrice(property.price).toLocaleString()}` : null,
                  property.area != null ? `${Number(property.area).toLocaleString()} sqft` : null,
                  property.NoOFCheck != null ? `${property.NoOFCheck} Checks` : null,
                  property.RentalPeriod ? property.RentalPeriod : null,
                ].filter(Boolean);

                return (
                  <motion.div
                    key={property.id ?? property._id}
                    className="group bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-shadow duration-300"
                    variants={getCardVariants(index)}
                    whileHover={{ y: -8, transition: { duration: 0.3 } }}
                  >
                    {/* IMAGE */}
                    <div className="relative h-52 overflow-hidden bg-gray-50">
                      {imageUrl ? (
                        <img
                          src={imageUrl}
                          alt={property.title || "Property image"}
                          className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full bg-gray-100">
                          <svg className="w-10 h-10 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 9.75L12 3l9 6.75V21H3V9.75z" />
                          </svg>
                        </div>
                      )}

                      {/* Hover gradient */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                      {/* Status badge */}
                      <motion.div
                        className="absolute top-3 left-3"
                        initial={{ x: -50, opacity: 0 }}
                        animate={isInView ? { x: 0, opacity: 1 } : { x: -50, opacity: 0 }}
                        transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                      >
                        <motion.span
                          className="bg-black/80 backdrop-blur-sm text-white px-3 py-1 text-[11px] font-bold rounded-full inline-block tracking-wide"
                          whileHover={{ scale: 1.08, backgroundColor: "rgba(0,0,0,0.95)" }}
                          transition={{ duration: 0.2 }}
                        >
                          {property.tags[0]?.name}
                        </motion.span>
                      </motion.div>

                      {/* Price badge */}
                      {property.status != null && (
                        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-gray-900 px-3 py-1 text-[11px] font-bold rounded-full shadow-sm">
                          {property.status.name}
                        </div>
                      )}
                    </div>

                    {/* DETAILS */}
                    <div className="p-5">
                      <motion.div
                        className="mb-3"
                        initial={{ opacity: 0, y: 10 }}
                        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
                        transition={{ duration: 0.4, delay: 0.7 + index * 0.1 }}
                      >
                        <span className="text-[11px] text-gray-400 font-semibold uppercase tracking-widest">
                          {property.propertyType?.name ?? "Property"}
                        </span>
                        <h3 className="text-base font-bold mt-0.5 line-clamp-1 text-gray-900">{property.title}</h3>
                        <div className="flex items-center text-gray-500 mt-1.5 gap-1">
                          <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          <span className="text-xs line-clamp-1">{property.fullAddress || property.city || "No address"}</span>
                        </div>
                      </motion.div>
                      {/* Specs row */}
                      {specs.length > 0 && (
                        <motion.div
                          className="flex flex-wrap gap-1.5 mb-5"
                          initial={{ opacity: 0, y: 10 }}
                          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
                          transition={{ duration: 0.4, delay: 0.9 + index * 0.1 }}
                        >
                          {specs.map((spec, idx) => (
                            <motion.span
                              key={idx}
                              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-gray-50 border border-gray-100 text-[11px] text-gray-600 font-medium"
                              initial={{ opacity: 0, scale: 0.85 }}
                              animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.85 }}
                              transition={{ duration: 0.3, delay: 1 + index * 0.1 + idx * 0.05 }}
                            >
                              {spec}
                            </motion.span>
                          ))}
                        </motion.div>
                      )}

                      {/* CTAs */}
                      <motion.div
                        className="flex gap-2"
                        initial={{ opacity: 0, y: 10 }}
                        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
                        transition={{ duration: 0.4, delay: 1.1 + index * 0.1 }}
                      >
                        <Link href={`/properties/${property.id ?? property._id}`} className="flex-1">
                          <motion.button
                            className="w-full py-2.5 rounded-xl bg-black text-white text-xs font-semibold tracking-wide hover:bg-gray-800 transition-colors"
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            transition={{ duration: 0.2 }}
                          >
                            View Details
                          </motion.button>
                        </Link>

                      </motion.div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="text-center py-24"
            >
              <div className="w-16 h-16 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center mx-auto mb-4">
                <svg className="w-7 h-7 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 9.75L12 3l9 6.75V21H3V9.75z" />
                </svg>
              </div>
              <p className="text-gray-400 text-lg font-medium mb-2">No properties found</p>
              <p className="text-gray-300 text-sm mb-5">Try adjusting your filters</p>
              {hasFilters && (
                <button
                  onClick={clearFilters}
                  className="text-xs font-semibold text-gray-500 border border-gray-200 px-4 py-2 rounded-full hover:border-black hover:text-black transition-colors"
                >
                  Clear all filters
                </button>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── CTA ── */}
        <motion.div
          className="text-center mt-14"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6, delay: 1.5 }}
        >
          <Link
            href="/properties"
            className="inline-flex items-center gap-2 border border-gray-900 text-gray-900 px-8 py-3 rounded-full text-sm font-semibold hover:bg-black hover:text-white transition-all duration-300"
          >
            <motion.span
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              transition={{ duration: 0.2 }}
              className="inline-block"
            >
              View All Properties →
            </motion.span>
          </Link>
        </motion.div>

      </div>
    </section>
  );
}