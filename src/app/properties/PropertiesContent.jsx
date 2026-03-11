"use client";

import Link from "next/link";
import { useState, useMemo, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Mail, MessageCircle, MapPin, Home, Star, X } from "lucide-react";
import * as LucideIcons from "lucide-react";

const formatPrice = (price) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(price);

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
      <div className="max-w-7xl mx-auto">

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

        {/* FILTER BAR - Below Heading */}
        <div id="filter-bar" className="flex justify-center mb-10">
          <div className="overflow-hidden p-6 w-full max-w-4xl">
            <div className="flex flex-wrap items-end gap-4">
              {/* Property Type */}
              <div className="flex-1 min-w-[200px]">
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2 block">
                  Property Type
                </label>
                <select
                  value={selectedType}
                  onChange={(e) => handleTypeChange(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black bg-white text-black"
                >
                  {categories.map((cat) => (
                    <option key={cat.value} value={cat.value} className="text-black">
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Status */}
              {statuses.length > 0 && (
                <div className="flex-1 min-w-[180px]">
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2 block">
                    Status
                  </label>
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black bg-white text-black"
                  >
                    <option value="all">Any Status</option>
                    {statuses.map((s) => (
                      <option key={s._id} value={s._id} className="text-black">
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
                  className="px-4 py-2.5 text-xs font-medium text-white hover:text-black transition-colors border border-gray-200 rounded-xl hover:border-gray-400"
                >
                  Clear
                </button>
              </div>
            </div>

            {/* Active Filters Summary (optional) */}
            {hasFilters && (
              <div className="mt-4 pt-4 border-t border-gray-100 flex items-center gap-2">
                <span className="text-xs text-gray-500">Active filters:</span>
                <div className="flex flex-wrap gap-2">
                  {selectedType !== "all" && (
                    <span className="bg-black text-white text-xs px-2 py-1 rounded-full">
                      Type: {categories.find(c => c.value === selectedType)?.label}
                    </span>
                  )}
                  {selectedStatus !== "all" && (
                    <span className="bg-black text-white text-xs px-2 py-1 rounded-full">
                      Status: {statuses.find(s => s._id === selectedStatus)?.name}
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Result count */}
        <p className="text-xs text-gray-500 mb-8 tracking-wide text-center">
          Showing <span className="font-semibold text-gray-300">{filteredProperties.length}</span> properties
        </p>

        {/* GRID */}
        {filteredProperties.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProperties.map((property, index) => {
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
                  onClick={() => router.push(`/properties/${property._id}`)}
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

                    {/* Tags */}
                    {property.tags && property.tags.length > 0 && (
                      <div className="absolute top-3 left-3">
                        <span
                          className="backdrop-blur-sm text-black px-3 py-1 text-[11px] font-bold rounded-full inline-block tracking-wide border border-white/20"
                          style={{ backgroundColor: property.tags[0].color || '#ffffff' }}
                        >
                          {property.tags[0].name}
                        </span>
                      </div>
                    )}

                    {/* Status */}
                    {property.status && (
                      <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-sm text-white px-3 py-1 text-[11px] font-bold rounded-full border border-white/10"
                        style={{ backgroundColor: property.status.color || '#000000' }}>
                        {property.status.name}
                      </div>
                    )}

                    {/* Featured */}
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
                        <span className="text-xs line-clamp-1 text-gray-500">{property.fullAddress || property.city || "No address"}</span>
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

                    {/* Actions */}
                    <div className="flex gap-2 pt-3 border-t border-white/5">
                      <Link
                        href={`/properties/${property._id}`}
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