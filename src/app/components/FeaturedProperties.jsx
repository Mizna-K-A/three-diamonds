"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search, X } from "lucide-react";

/* ─────────────────────────────────────────────────────────────
   ANIMATION VARIANTS  (unchanged from original)
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
   HELPERS  (from PropertiesContent)
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
  initialProperties = [],   // same prop shape as PropertiesContent
  propertyTypes = [],        // [{ slug, name }]
  statuses = [],             // [{ _id, label, color }]
  tags = [],                 // [{ _id, name }]
}) {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { amount: 0.2 });

  /* ── filter state (same logic as PropertiesContent) ── */
  const [searchTerm, setSearchTerm]         = useState("");
  const [selectedType, setSelectedType]     = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedTags, setSelectedTags]     = useState([]);

  const toggleTag = (id) =>
    setSelectedTags((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]
    );

  const categories = [
    { value: "all", label: "All Types" },
    ...propertyTypes.map((t) => ({ value: t.slug, label: t.name })),
  ];

  /* filtered + capped at 4 */
  const filteredProperties = useMemo(() => {
    const q = searchTerm.toLowerCase();
    return initialProperties
      .filter((property) => {
        if (!property) return false;

        const matchesSearch =
          searchTerm === "" ||
          property.title?.toLowerCase().includes(q) ||
          property.fullAddress?.toLowerCase().includes(q) ||
          property.city?.toLowerCase().includes(q) ||
          property.description?.toLowerCase().includes(q);

        const matchesType =
          selectedType === "all" ||
          property.propertyType?.slug === selectedType;

        const matchesStatus =
          selectedStatus === "all" ||
          property.status?._id === selectedStatus;

        const matchesTags =
          selectedTags.length === 0 ||
          property.tags?.some((tag) => selectedTags.includes(tag._id));

        return matchesSearch && matchesType && matchesStatus && matchesTags;
      })
      .slice(0, 4);
  }, [initialProperties, searchTerm, selectedType, selectedStatus, selectedTags]);

  const hasFilters = searchTerm || selectedType !== "all" || selectedStatus !== "all" || selectedTags.length > 0;

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedType("all");
    setSelectedStatus("all");
    setSelectedTags([]);
  };

  return (
    <section id="properties" className="section-padding bg-white p-5" ref={sectionRef}>
      <div className="container-custom">

        {/* ── HEADER (unchanged) ── */}
        <motion.div
          className="text-center mb-12"
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
            <span className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
              Featured Listings
            </span>
            <motion.div
              className="w-16 h-0.5 bg-black mt-2 mx-auto"
              initial={{ width: 0 }}
              animate={isInView ? { width: 64 } : { width: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            />
          </motion.div>

          <motion.h2
            className="text-4xl md:text-5xl font-bold mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            FEATURED PROPERTIES
          </motion.h2>

          <motion.p
            className="text-gray-600 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            Discover our handpicked selection of premium properties across Dubai.
          </motion.p>
        </motion.div>

        {/* ── SEARCH & FILTER BAR ── */}
        <motion.div
          className="flex flex-col sm:flex-row gap-3 mb-3"
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
          transition={{ duration: 0.5, delay: 0.55 }}
        >
          {/* Search */}
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search properties..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-9 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-black transition-colors"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black transition-colors"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Type filter */}
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-4 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:border-black transition-colors bg-white"
          >
            {categories.map((cat) => (
              <option key={cat.value} value={cat.value}>{cat.label}</option>
            ))}
          </select>

          {/* Status filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-4 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:border-black transition-colors bg-white"
          >
            <option value="all">All Status</option>
            {statuses.map((s) => (
              <option key={s._id} value={s._id}>{s.label}</option>
            ))}
          </select>

          {/* Clear */}
          {hasFilters && (
            <button
              onClick={clearFilters}
              className="px-4 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-600 hover:border-black hover:text-black transition-colors bg-white"
            >
              Clear
            </button>
          )}
        </motion.div>

        {/* ── TAG PILLS ── */}
        {tags.length > 0 && (
          <motion.div
            className="flex flex-wrap gap-2 mb-4"
            initial={{ opacity: 0, y: 10 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
            transition={{ duration: 0.4, delay: 0.6 }}
          >
            {tags.map((tag) => {
              const active = selectedTags.includes(tag._id);
              return (
                <button
                  key={tag._id}
                  onClick={() => toggleTag(tag._id)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all duration-200 ${
                    active
                      ? "bg-black text-white border-black"
                      : "bg-white text-gray-600 border-gray-200 hover:border-black hover:text-black"
                  }`}
                >
                  {active && <span className="mr-1">✓</span>}
                  {tag.name}
                </button>
              );
            })}
          </motion.div>
        )}

        {/* Result count */}
        <motion.p
          className="text-sm text-gray-400 mb-8"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.4, delay: 0.6 }}
        >
          Showing {filteredProperties.length} properties
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

                /* ── resolve image (same as PropertiesContent) ── */
                const primaryImage =
                  property.images?.find((img) => img.isPrimary) ||
                  property.images?.[0];
                const imageUrl =
                  primaryImage?.webp?.medium?.url ||
                  primaryImage?.webp?.original?.url ||
                  primaryImage?.original?.url ||
                  null;

                /* ── specs array built from real fields ── */
                const specs = [
                  property.bedrooms  != null ? `${property.bedrooms} Bedrooms`  : null,
                  property.bathrooms != null ? `${property.bathrooms} Bathrooms` : null,
                  property.area      != null ? `${property.area.toLocaleString()} sq.ft.` : null,
                  property.propertyType?.name ?? null,
                ].filter(Boolean);

                return (
                  <motion.div
                    key={property._id}
                    className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-2xl transition-shadow duration-300"
                    variants={getCardVariants(index)}
                    whileHover={{ y: -10, transition: { duration: 0.3 } }}
                  >
                    {/* IMAGE */}
                    <div className="relative h-48 overflow-hidden">
                      {imageUrl ? (
                        <Image
                          src={imageUrl}
                          alt={property.title || "Property image"}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                          className="object-cover transition-transform duration-500 group-hover:scale-110"
                          priority={index < 2}
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full bg-gray-100">
                          <svg className="w-10 h-10 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 9.75L12 3l9 6.75V21H3V9.75z" />
                          </svg>
                        </div>
                      )}

                      {/* Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                      {/* Badge — status label (same role as original "badge") */}
                      <motion.div
                        className="absolute top-4 left-4"
                        initial={{ x: -50, opacity: 0 }}
                        animate={isInView ? { x: 0, opacity: 1 } : { x: -50, opacity: 0 }}
                        transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                      >
                        <motion.span
                          className="bg-black text-white px-3 py-1 text-xs font-bold rounded-full inline-block"
                          whileHover={{ scale: 1.1, backgroundColor: "#333" }}
                          transition={{ duration: 0.2 }}
                        >
                          {property.status?.label ?? property.propertyType?.name ?? "Property"}
                        </motion.span>
                      </motion.div>

                      {/* Price (top-right) */}
                      {property.price != null && (
                        <div className="absolute top-4 right-4 bg-black/70 text-white px-3 py-1 text-xs font-semibold rounded-full backdrop-blur-sm">
                          {formatPrice(property.price)}
                        </div>
                      )}

                      <motion.div
                        className="absolute inset-0 bg-black/0 group-hover:bg-black/10"
                        initial={{ opacity: 0 }}
                        whileHover={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                      />
                    </div>

                    {/* DETAILS */}
                    <div className="p-6">
                      <motion.div
                        className="mb-3"
                        initial={{ opacity: 0, y: 10 }}
                        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
                        transition={{ duration: 0.4, delay: 0.7 + index * 0.1 }}
                      >
                        <span className="text-sm text-gray-500 font-medium">
                          {property.propertyType?.name ?? "Property"}
                        </span>
                        <h3 className="text-xl font-bold mt-1 line-clamp-1">{property.title}</h3>
                        <div className="flex items-center text-gray-600 mt-2">
                          <svg className="w-4 h-4 mr-1 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          <span className="text-sm line-clamp-1">{property.fullAddress || property.city || "No address"}</span>
                        </div>
                      </motion.div>

                      <motion.p
                        className="text-gray-600 text-sm mb-4 line-clamp-2"
                        initial={{ opacity: 0 }}
                        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
                        transition={{ duration: 0.4, delay: 0.8 + index * 0.1 }}
                      >
                        {property.description}
                      </motion.p>

                      <motion.div
                        className="grid grid-cols-2 gap-2 mb-6"
                        initial={{ opacity: 0, y: 10 }}
                        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
                        transition={{ duration: 0.4, delay: 0.9 + index * 0.1 }}
                      >
                        {specs.map((spec, idx) => (
                          <motion.div
                            key={idx}
                            className="text-xs text-gray-500"
                            initial={{ opacity: 0, x: -10 }}
                            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -10 }}
                            transition={{ duration: 0.3, delay: 1 + index * 0.1 + idx * 0.05 }}
                          >
                            <span className="font-medium">✓</span> {spec}
                          </motion.div>
                        ))}
                      </motion.div>

                      <motion.div
                        className="flex justify-between items-center gap-2"
                        initial={{ opacity: 0, y: 10 }}
                        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
                        transition={{ duration: 0.4, delay: 1.1 + index * 0.1 }}
                      >
                        <Link href={`/properties/${property._id}`} className="flex-1">
                          <motion.button
                            className="btn-primary text-sm px-4 py-2 w-full"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            transition={{ duration: 0.2 }}
                          >
                            View Details
                          </motion.button>
                        </Link>
                        <motion.a
                          href={`mailto:info@example.com?subject=Enquiry: ${property.title}`}
                          className="btn-outline text-sm px-4 py-2"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          transition={{ duration: 0.2 }}
                        >
                          Enquire
                        </motion.a>
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
              className="text-center py-20"
            >
              <p className="text-gray-400 text-xl mb-3">No properties found</p>
              {hasFilters && (
                <button
                  onClick={clearFilters}
                  className="text-sm text-gray-500 underline hover:text-black transition-colors"
                >
                  Clear filters
                </button>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── CTA (unchanged) ── */}
        <motion.div
          className="text-center mt-12"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6, delay: 1.5 }}
        >
          <Link href="/properties" className="btn-outline px-8 py-3 inline-block">
            <motion.span
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="inline-block"
            >
              View All Properties -&gt;
            </motion.span>
          </Link>
        </motion.div>

      </div>
    </section>
  );
}