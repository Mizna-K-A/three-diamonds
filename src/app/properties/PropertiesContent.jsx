"use client";

import Link from "next/link";
import { useState, useMemo, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Mail, MessageCircle, MapPin, Home, Star } from "lucide-react";

/* ─────────────────────────────────────────────────────────────
   DARK SOFT DROPDOWN
───────────────────────────────────────────────────────────── */
const STATUS_COLORS = [
  "bg-emerald-500",
  "bg-amber-500",
  "bg-red-500",
  "bg-blue-500",
  "bg-purple-500",
  "bg-pink-500",
];

function useDropdown() {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    function handle(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, []);
  return { open, setOpen, ref };
}

function SoftDropdown({ label, options, value, onChange, getLabel, getKey, dotMap }) {
  const { open, setOpen, ref } = useDropdown();
  const selected = options.find((o) => getKey(o) === value);
  const showDot = !!dotMap;

  return (
    <div ref={ref} className="relative flex-1 min-w-[160px]">
      <label className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2 block">
        {label}
      </label>
      <button
        onClick={() => setOpen(!open)}
        className={`w-full flex items-center justify-between gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
          open
            ? "bg-white/15 text-white"
            : "bg-white/8 text-gray-300 hover:bg-white/12 hover:text-white"
        }`}
      >
        <div className="flex items-center gap-2">
          {showDot && (
            <span className={`w-2 h-2 rounded-full shrink-0 ${dotMap[value] ?? "bg-gray-500"}`} />
          )}
          <span className="truncate">{getLabel(selected)}</span>
        </div>
        <svg
          className={`w-4 h-4 text-gray-500 shrink-0 transition-transform duration-200 ${open ? "rotate-180 text-gray-300" : ""}`}
          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="absolute z-50 top-full mt-2 w-full bg-[#1e1e1e] border border-white/10 rounded-2xl shadow-2xl shadow-black/60 overflow-hidden p-1.5 space-y-0.5">
          {options.map((opt) => {
            const val = getKey(opt);
            const isSel = val === value;
            return (
              <button
                key={val}
                onClick={() => { onChange(val); setOpen(false); }}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm transition-colors ${
                  isSel
                    ? "bg-white text-black font-medium"
                    : "text-gray-400 hover:bg-white/8 hover:text-white"
                }`}
              >
                {showDot && (
                  <span className={`w-2 h-2 rounded-full shrink-0 ${
                    isSel ? "bg-black/30" : dotMap[val] ?? "bg-gray-600"
                  }`} />
                )}
                {getLabel(opt)}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

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
export default function PropertiesContent({
  initialProperties = [],
  propertyTypes = [],
  statuses = [],
  tags = [],
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [properties] = useState(initialProperties);
  const [selectedType, setSelectedType] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedTags, setSelectedTags] = useState([]);

  // Build dot color map dynamically from statuses prop
  const statusDotMap = useMemo(() => {
    const map = { all: "bg-gray-500" };
    statuses.forEach((s, i) => {
      map[s._id] = STATUS_COLORS[i % STATUS_COLORS.length];
    });
    return map;
  }, [statuses]);

  useEffect(() => {
    const typeFromUrl = searchParams.get("type");
    if (typeFromUrl) {
      setSelectedType(typeFromUrl);
      setTimeout(() => {
        document.getElementById("filter-bar")?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    } else {
      setSelectedType("all");
    }
  }, [searchParams]);

  const handleTypeChange = (value) => {
    setSelectedType(value);
    const params = new URLSearchParams(searchParams.toString());
    if (value && value !== "all") params.set("type", value);
    else params.delete("type");
    router.push(`/properties?${params.toString()}`, { scroll: false });
  };

  const toggleTag = (id) =>
    setSelectedTags((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]
    );

  const categories = [
    { value: "all", label: "All Types" },
    ...propertyTypes.map((type) => ({ value: type.slug, label: type.name })),
  ];

  const statusOptions = [
    { _id: "all", name: "Any Status" },
    ...statuses,
  ];

  const filteredProperties = useMemo(() => {
    return properties.filter((property) => {
      if (!property) return false;
      const matchesType = selectedType === "all" || property.propertyType?.slug === selectedType;
      const matchesStatus = selectedStatus === "all" || property.status?._id === selectedStatus;
      const matchesTags = selectedTags.length === 0 || property.tags?.some((tag) => selectedTags.includes(tag._id));
      return matchesType && matchesStatus && matchesTags;
    });
  }, [properties, selectedType, selectedStatus, selectedTags]);

  const hasFilters = selectedType !== "all" || selectedStatus !== "all" || selectedTags.length > 0;

  const clearFilters = () => {
    setSelectedType("all");
    setSelectedStatus("all");
    setSelectedTags([]);
    router.push("/properties", { scroll: false });
  };

  const getPrimaryImageUrl = (property) => {
    if (!property.images?.length) return null;
    const primary = property.images.find((img) => img.isPrimary) || property.images[0];
    const raw = primary?.url || primary?.thumbnailUrl || null;
    if (!raw) return null;
    const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "";
    return raw.startsWith("http") ? raw : `${API_BASE}${raw}`;
  };

  return (
    <section className="bg-[#0c0c0c] min-h-screen py-20 px-5">
      <div className="">

        {/* HEADER */}
        <div className="text-center mb-8">
          <div className="inline-block mb-4">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-[0.2em]">
              Our Portfolio
            </span>
            <div className="h-px bg-white mt-2 mx-auto w-16" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-5 tracking-tight text-white">
            ALL PROPERTIES
          </h1>
          <p className="text-gray-400 max-w-xl mx-auto text-sm leading-relaxed">
            Browse our full collection of premium real estate listings.
          </p>
        </div>

        {/* FILTER BAR */}
        <div id="filter-bar" className="flex justify-center mb-10">
          <div className="p-6 w-full max-w-4xl">
            <div className="flex flex-wrap items-end gap-4">

              {/* Property Type */}
              <SoftDropdown
                label="Property Type"
                options={categories}
                value={selectedType}
                onChange={handleTypeChange}
                getKey={(o) => o.value}
                getLabel={(o) => o?.label}
              />

              {/* Status */}
              {statuses.length > 0 && (
                <SoftDropdown
                  label="Status"
                  options={statusOptions}
                  value={selectedStatus}
                  onChange={setSelectedStatus}
                  getKey={(o) => o._id}
                  getLabel={(o) => o?.name ?? o?.label}
                  dotMap={statusDotMap}
                />
              )}

              {/* Clear — only when filters active */}
              {/* {hasFilters && (
                <div className="pb-[2px]">
                  <button
                    onClick={clearFilters}
                    className="px-4 py-2.5 text-xs font-medium text-gray-400 hover:text-white transition-colors border border-white/10 rounded-xl hover:border-white/30 whitespace-nowrap"
                  >
                    Clear
                  </button>
                </div>
              )} */}
            </div>

            {/* Active Filters Summary */}
            {/* {hasFilters && (
              <div className="mt-4 pt-4 border-t border-white/8 flex items-center gap-2">
                <span className="text-xs text-gray-600">Active filters:</span>
                <div className="flex flex-wrap gap-2">
                  {selectedType !== "all" && (
                    <span className="bg-white/10 text-gray-300 text-xs px-2 py-1 rounded-full border border-white/10">
                      Type: {categories.find((c) => c.value === selectedType)?.label}
                    </span>
                  )}
                  {selectedStatus !== "all" && (
                    <span className="bg-white/10 text-gray-300 text-xs px-2 py-1 rounded-full border border-white/10">
                      Status: {statuses.find((s) => s._id === selectedStatus)?.name}
                    </span>
                  )}
                </div>
              </div>
            )} */}
          </div>
        </div>

        {/* Result count */}
        <p className="text-xs text-gray-500 mb-8 tracking-wide text-center">
          Showing <span className="font-semibold text-gray-300">{filteredProperties.length}</span> properties
        </p>

        {/* GRID */}
        {filteredProperties.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProperties.map((property) => {
              const imageUrl = getPrimaryImageUrl(property);
              const specs = [
                property.price != null ? `${formatPrice(property.price)}` : null,
                property.area != null ? `${Number(property.area).toLocaleString()} sqft` : null,
                property.NoOFCheck != null ? `${property.NoOFCheck} Checks` : null,
                property.RentalPeriod ? property.RentalPeriod : null,
              ].filter(Boolean);

              return (
                <div
                  key={property._id}
                  className="group bg-[#161616] rounded-2xl overflow-hidden border border-white/6 hover:border-white/15 hover:shadow-2xl hover:shadow-black/60 transition-all duration-300 cursor-pointer hover:-translate-y-1"
                  onClick={() => router.push(`/properties/${property.slug || property._id}`)}
                >
                  {/* IMAGE */}
                  <div className="relative h-52 overflow-hidden bg-[#1a1a1a]">
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt={property.title || "Property"}
                        className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full bg-[#1f1f1f]">
                        <Home size={36} className="text-gray-700" />
                      </div>
                    )}

                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    {property.tags?.length > 0 && (
                      <div className="absolute top-3 left-3">
                        <span
                          className="backdrop-blur-sm text-black px-3 py-1 text-[11px] font-bold rounded-full inline-block tracking-wide border border-white/20"
                          style={{ backgroundColor: property.tags[0].color || "#ffffff" }}
                        >
                          {property.tags[0].name}
                        </span>
                      </div>
                    )}

                    {property.status && (
                      <div
                        className="absolute top-3 right-3 backdrop-blur-sm text-white px-3 py-1 text-[11px] font-bold rounded-full border border-white/10"
                        style={{ backgroundColor: property.status.color || "#000000" }}
                      >
                        {property.status.name}
                      </div>
                    )}

                    {property.isFeatured && (
                      <div className="absolute bottom-3 left-3 bg-yellow-400 text-black px-2 py-0.5 text-[11px] font-bold rounded-md flex items-center gap-1">
                        <Star size={10} fill="currentColor" /> Featured
                      </div>
                    )}
                  </div>

                  {/* CONTENT */}
                  <div className="p-5">
                    <div className="mb-3">
                      <span className="text-[11px] text-gray-500 font-semibold uppercase tracking-widest">
                        {property.propertyType?.name ?? "Property"}
                      </span>
                      <h3 className="text-base font-bold mt-0.5 line-clamp-1 text-white">{property.title}</h3>
                      <div className="flex items-center text-gray-600 mt-1.5 gap-1">
                        <MapPin size={12} className="shrink-0 text-gray-600" />
                        <span className="text-xs line-clamp-1 text-gray-500">
                          {property.fullAddress || property.city || "No address"}
                        </span>
                      </div>
                    </div>

                    {specs.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-5">
                        {specs.map((spec, idx) => (
                          <span
                            key={idx}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/5 border border-white/8 text-[11px] text-gray-400 font-medium"
                          >
                            {spec}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="flex gap-2 pt-3 border-t border-white/5">
                      <Link
                        href={`/properties/${property.slug || property._id}`}
                        className="flex-1"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button className="w-full py-2.5 rounded-xl bg-white text-black text-xs font-semibold tracking-wide hover:bg-gray-100 transition-colors">
                          View Details
                        </button>
                      </Link>

                      <a
                        href="mailto:info@example.com"
                        onClick={(e) => e.stopPropagation()}
                        className="px-3 py-2.5 rounded-xl border border-white/10 text-gray-600 hover:border-white/30 hover:text-white transition-colors"
                      >
                        <Mail size={15} />
                      </a>

                      <a
                        href="https://wa.me/971XXXXXXXXX"
                        target="_blank" rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="px-3 py-2.5 rounded-xl border border-white/10 text-gray-600 hover:border-green-500/50 hover:text-green-400 transition-colors"
                      >
                        <MessageCircle size={15} />
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-24">
            <div className="w-16 h-16 rounded-full bg-white/4 border border-white/8 flex items-center justify-center mx-auto mb-4">
              <Home size={28} className="text-gray-700" />
            </div>
            <p className="text-gray-400 text-lg font-medium mb-2">No properties found</p>
            <p className="text-gray-600 text-sm mb-5">Try adjusting your filters</p>
            {hasFilters && (
              <button
                onClick={clearFilters}
                className="text-xs font-semibold text-gray-500 border border-white/10 px-4 py-2 rounded-full hover:border-white/30 hover:text-white transition-colors"
              >
                Clear all filters
              </button>
            )}
          </div>
        )}

      </div>
    </section>
  );
}