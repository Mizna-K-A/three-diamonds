"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useState, useMemo, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Mail,
  MessageCircle,
  MapPin,
  Home,
  Star,
  Search,
  X,
} from "lucide-react";
import Image from "next/image";
import * as LucideIcons from "lucide-react";

/* ------------------ Dynamic Lucide Icon ------------------ */

function LucideIcon({ name, size = 14, className = "" }) {
  if (!name) return null;

  const pascalName = name
    .split("-")
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
    .join("");

  const Icon = LucideIcons[pascalName];
  if (!Icon) return null;

  return <Icon size={size} className={className} />;
}

/* ------------------ Component ------------------ */

export default function PropertiesContent({
  initialProperties = [],
  propertyTypes = [],
  statuses = [],
  tags = [],
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [properties] = useState(initialProperties);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedTags, setSelectedTags] = useState([]);

  /* ------------------ Sync URL ?type= param on mount & change ------------------ */

  useEffect(() => {
    const typeFromUrl = searchParams.get("type");
    if (typeFromUrl) {
      setSelectedType(typeFromUrl);
      // Scroll down past hero so filter bar is visible
      setTimeout(() => {
        const filterBar = document.getElementById("filter-bar");
        if (filterBar) {
          filterBar.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 100);
    } else {
      setSelectedType("all");
    }
  }, [searchParams]);

  /* ------------------ Update URL when filter changes ------------------ */

  const handleTypeChange = (value) => {
    setSelectedType(value);
    const params = new URLSearchParams(searchParams.toString());
    if (value && value !== "all") {
      params.set("type", value);
    } else {
      params.delete("type");
    }
    router.push(`/properties?${params.toString()}`, { scroll: false });
  };

  /* ------------------ Tag toggle ------------------ */

  const toggleTag = (id) =>
    setSelectedTags((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]
    );

  /* ------------------ Filters ------------------ */

  const categories = [
    { value: "all", label: "All Types" },
    ...propertyTypes.map((type) => ({
      value: type.slug,
      label: type.name,
    })),
  ];

  const filteredProperties = useMemo(() => {
    return properties.filter((property) => {
      if (!property) return false;

      const search = searchTerm.toLowerCase();

      const matchesSearch =
        searchTerm === "" ||
        property.title?.toLowerCase().includes(search) ||
        property.fullAddress?.toLowerCase().includes(search) ||
        property.city?.toLowerCase().includes(search) ||
        property.description?.toLowerCase().includes(search);

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
    });
  }, [properties, searchTerm, selectedType, selectedStatus, selectedTags]);

  /* ------------------ Helpers ------------------ */

  const formatPrice = (price) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(price);

  const getStatusColor = (status) => {
    const colors = {
      gray:   "bg-gray-900 text-gray-300",
      red:    "bg-red-900 text-red-300",
      green:  "bg-green-900 text-green-300",
      blue:   "bg-blue-900 text-blue-300",
      yellow: "bg-yellow-900 text-yellow-300",
      purple: "bg-purple-900 text-purple-300",
      orange: "bg-orange-900 text-orange-300",
    };
    return colors[status?.color] || colors.gray;
  };

  const hasFilters =
    searchTerm ||
    selectedType !== "all" ||
    selectedStatus !== "all" ||
    selectedTags.length > 0;

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedType("all");
    setSelectedStatus("all");
    setSelectedTags([]);
    router.push("/properties", { scroll: false });
  };

  /* ------------------ UI ------------------ */

  return (
    <div className="p-10">

      {/* HERO */}

      <section className="py-16 text-center">
        <h1 className="text-5xl font-bold text-white mb-4">
          All Properties
        </h1>
        <p className="text-gray-400">
          Discover our premium real estate collection
        </p>
      </section>

      {/* FILTER BAR */}

      <div id="filter-bar" className="flex flex-col lg:flex-row gap-4 mb-4">

        {/* SEARCH */}

        <div className="relative flex-1">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
          />
          <input
            type="text"
            placeholder="Search properties..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-10 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-100"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute right-3 top-1/2 -translate-y-1/2"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* TYPE FILTER — now synced with URL */}

        <select
          value={selectedType}
          onChange={(e) => handleTypeChange(e.target.value)}
          className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-300"
        >
          {categories.map((cat) => (
            <option key={cat.value} value={cat.value}>
              {cat.label}
            </option>
          ))}
        </select>

        {/* STATUS FILTER */}

        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-300"
        >
          <option value="all">All Status</option>
          {statuses.map((s) => (
            <option key={s._id} value={s._id}>
              {s.label}
            </option>
          ))}
        </select>

        {hasFilters && (
          <button
            onClick={clearFilters}
            className="px-4 py-2 bg-gray-700 rounded-lg text-white"
          >
            Clear
          </button>
        )}
      </div>

      {/* ACTIVE FILTER BADGE — shows which type is selected from header */}

      {selectedType !== "all" && (
        <div className="flex items-center gap-2 mb-4">
          <span className="text-gray-400 text-sm">Filtered by:</span>
          <span className="flex items-center gap-1 px-3 py-1 bg-white text-black text-xs font-medium rounded-full">
            {categories.find((c) => c.value === selectedType)?.label || selectedType}
            <button
              onClick={() => handleTypeChange("all")}
              className="ml-1 hover:opacity-70"
            >
              <X size={12} />
            </button>
          </span>
        </div>
      )}

      {/* TAG PILLS */}

      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-6">
          {tags.map((tag) => {
            const active = selectedTags.includes(tag._id);
            return (
              <button
                key={tag._id}
                onClick={() => toggleTag(tag._id)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all duration-200 ${
                  active
                    ? "bg-white text-gray-900 border-white"
                    : "bg-transparent text-gray-400 border-gray-700 hover:border-gray-400 hover:text-gray-200"
                }`}
              >
                {active && <span className="mr-1">✓</span>}
                {tag.name}
              </button>
            );
          })}
        </div>
      )}

      {/* RESULTS COUNT */}

      <div className="text-gray-400 mb-6">
        Showing {filteredProperties.length} properties
      </div>

      {/* GRID */}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProperties.map((property) => {

          const primaryImage =
            property.images?.find((img) => img.isPrimary) ||
            property.images?.[0];

          const imageUrl =
            primaryImage?.webp?.medium?.url ||
            primaryImage?.webp?.original?.url ||
            primaryImage?.original?.url ||
            null;

          return (
            <motion.div
              key={property._id}
              whileHover={{ y: -6 }}
              className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700 hover:border-gray-500 cursor-pointer"
              onClick={() => router.push(`/properties/${property._id}`)}
            >

              {/* IMAGE */}

              <div className="relative h-48">
                {imageUrl ? (
                  <Image
                    src={imageUrl}
                    alt={property.title || "Property image"}
                    fill
                    className="object-cover"
                    sizes="(max-width:768px) 100vw, (max-width:1200px) 50vw, 33vw"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full bg-gray-900">
                    <Home size={40} className="text-gray-600" />
                  </div>
                )}

                {/* STATUS */}

                {property.status && (
                  <div
                    className={`absolute top-3 left-3 px-3 py-1 text-xs rounded-full ${getStatusColor(
                      property.status
                    )}`}
                  >
                    {property.status.label}
                  </div>
                )}

                {/* PRICE */}

                <div className="absolute top-3 right-3 bg-black text-white px-3 py-1 rounded-full text-sm">
                  {formatPrice(property.price)}
                </div>

                {/* FEATURED */}

                {property.isFeatured && (
                  <div className="absolute bottom-3 left-3 bg-yellow-400 text-black px-2 py-1 text-xs rounded flex items-center gap-1">
                    <Star size={12} /> Featured
                  </div>
                )}
              </div>

              {/* CONTENT */}

              <div className="p-5">

                <h3 className="text-lg font-bold text-white mb-1 line-clamp-1">
                  {property.title}
                </h3>

                <div className="flex items-center text-gray-400 text-sm mb-3">
                  <MapPin size={14} className="mr-1" />
                  {property.fullAddress || "No address"}
                </div>

                <p className="text-gray-400 text-sm line-clamp-2 mb-4">
                  {property.description}
                </p>

                {/* DETAILS */}

                <div className="grid grid-cols-3 gap-2 text-center text-sm mb-4">
                  <div className="bg-gray-900 p-2 rounded">
                    {property.bedrooms || 0} Beds
                  </div>
                  <div className="bg-gray-900 p-2 rounded">
                    {property.bathrooms || 0} Baths
                  </div>
                  <div className="bg-gray-900 p-2 rounded">
                    {property.area || 0} sqft
                  </div>
                </div>

                {/* TAGS */}

                {property.tags?.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-4">
                    {property.tags.map((tag) => (
                      <span
                        key={tag._id}
                        className={`px-2 py-0.5 rounded-full text-xs border transition-colors cursor-pointer ${
                          selectedTags.includes(tag._id)
                            ? "bg-white text-gray-900 border-white"
                            : "bg-transparent text-gray-500 border-gray-700"
                        }`}
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleTag(tag._id);
                        }}
                      >
                        {tag.name}
                      </span>
                    ))}
                  </div>
                )}

                {/* ACTIONS */}

                <div className="flex gap-2">
                  <Link
                    href={`/properties/${property._id}`}
                    className="flex-1"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button className="w-full bg-white text-black py-2 rounded-lg text-sm">
                      View Details
                    </button>
                  </Link>

                  <a
                    href={`mailto:info@example.com`}
                    onClick={(e) => e.stopPropagation()}
                    className="px-3 py-2 bg-black text-white rounded-lg"
                  >
                    <Mail size={16} />
                  </a>

                  <a
                    href={`https://wa.me/971XXXXXXXXX`}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="px-3 py-2 bg-black text-white rounded-lg"
                  >
                    <MessageCircle size={16} />
                  </a>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* NO RESULTS */}

      {filteredProperties.length === 0 && (
        <div className="text-center py-20">
          <Home size={48} className="mx-auto text-gray-700 mb-3" />
          <p className="text-gray-400 text-xl mb-3">No properties found</p>
          {hasFilters && (
            <button
              onClick={clearFilters}
              className="text-sm text-gray-500 underline hover:text-white transition-colors"
            >
              Clear filters
            </button>
          )}
        </div>
      )}
    </div>
  );
}