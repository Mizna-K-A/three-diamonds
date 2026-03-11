// app/properties/[id]/page.jsx
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  ArrowLeft,
  BedDouble,
  Bath,
  Maximize2,
  MapPin,
  CalendarDays,
  RefreshCw,
  Clock,
  Star,
  Globe,
  Phone,
  Mail,
  User,
  ExternalLink,
  Building,
  Check,
  Eye,
  EyeOff,
  DollarSign,
  Tag,
  Grid,
  Users,
  Calendar,
  AlertCircle,
  Info,
  CheckCheck,
  Download,
} from 'lucide-react';
import ImageGallery from './ImageGallery';
import DownloadProposalButton from './DownloadProposalButton';
import mongoose from 'mongoose';
import connectDB from '../../../../lib/mongodb';
import Property from '../../../../lib/models/Property';
import PropertyStatus from '../../../../lib/models/PropertyStatus';
import PropertyType from '../../../../lib/models/PropertyType';
import TagModel from '../../../../lib/models/Tag';
import Header from '../../components/Header';

// ─── Data fetching ────────────────────────────────────────────────────────────

async function getProperty(slugOrId) {
  try {
    await connectDB();

    // Try to find by slug first, then fallback to ID
    let property = await Property.findOne({ slug: slugOrId })
      .populate('statusId', 'name label color icon')
      .populate('propertyTypeId', 'name slug icon')
      .populate('tagIds', 'name label color icon category')
      .populate('purposeTagId', 'name label color icon')
      .lean();

    const isObjectId = slugOrId && slugOrId.length === 24 && /^[0-9a-fA-F]{24}$/.test(slugOrId);

    if (!property && isObjectId) {
      property = await Property.findById(slugOrId)
        .populate('statusId', 'name label color icon')
        .populate('propertyTypeId', 'name slug icon')
        .populate('tagIds', 'name label color icon category')
        .populate('purposeTagId', 'name label color icon')
        .lean();
    }

    if (!property) return null;

    // Helper function to get image URL
    const getImageUrl = (image) => {
      // Try to get URL from different possible paths
      if (image.webp?.medium?.url) return image.webp.medium.url;
      if (image.webp?.small?.url) return image.webp.small.url;
      if (image.webp?.thumbnail?.url) return image.webp.thumbnail.url;
      if (image.webp?.original?.url) return image.webp.original.url;
      if (image.original?.url) return image.original.url;
      if (image.url) return image.url;
      return null;
    };

    return {
      ...property,
      _id: property._id.toString(),
      id: property._id.toString(),
      NoOFCheck: property.NoOFCheck || property.NoOFCheck || '0', // Map NoOFCheck to NoOFCheck
      status: property.statusId
        ? { ...property.statusId, _id: property.statusId._id.toString() }
        : null,
      propertyType: property.propertyTypeId
        ? { ...property.propertyTypeId, _id: property.propertyTypeId._id.toString() }
        : null,
      tags: property.tagIds?.map((tag) => ({ ...tag, _id: tag._id.toString() })) || [],
      purposeTag: property.purposeTagId
        ? { ...property.purposeTagId, _id: property.purposeTagId._id.toString() }
        : null,
      images: (property.images || []).map((image, index) => {
        const imageUrl = getImageUrl(image);

        return {
          ...image,
          _id: image._id?.toString() || `img-${index}`,
          url: imageUrl,
          thumbnailUrl: image.webp?.thumbnail?.url || imageUrl,
          isPrimary: image.isPrimary || false,
          caption: image.caption || '',
          alt: image.alt || image.caption || property.title || 'Property image',
        };
      }),
      features: (property.features || []).map(feature => {
        if (typeof feature === 'object') {
          return feature.value || feature.name || JSON.stringify(feature);
        }
        return feature;
      }),
      amenities: property.amenities || [],
      nearby: property.nearby || [],
      agent: property.agent || {
        name: property.agentName || 'Property Agent',
        phone: property.agentPhone || '+971 50 123 4567',
        email: property.agentEmail || 'agent@example.com',
        image: property.agentImage || null
      },
      specs: property.specs || [],
      priceDetails: {
        paymentPlan: property.paymentPlan || property.priceDetails?.paymentPlan || '70/30 payment plan available',
        maintenance: property.maintenanceFee || property.priceDetails?.maintenance || 'AED 25/sq.ft. annually',
        handover: property.handoverDate || property.priceDetails?.handover || 'Ready to move'
      },
      rentalPeriod: property.RentalPeriod || null,
      createdAt: property.createdAt ? new Date(property.createdAt).toISOString().split('T')[0] : null,
      updatedAt: property.updatedAt ? new Date(property.updatedAt).toISOString().split('T')[0] : null,
      expiresAt: property.expiresAt ? new Date(property.expiresAt).toISOString().split('T')[0] : null,
    };
  } catch (error) {
    console.error('Error fetching property:', error);
    return null;
  }
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const formatPrice = (price) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'AED',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price).replace('AED', 'AED ');

// Icon mapping helper
const getIconComponent = (iconName, defaultIcon = Info) => {
  if (!iconName) return defaultIcon;

  const iconMap = {
    'home': Building,
    'building': Building,
    'apartment': Building,
    'warehouse': Building,
    'villa': Building,
    'house': Building,
    'star': Star,
    'tag': Tag,
    'grid': Grid,
    'users': Users,
    'calendar': Calendar,
    'clock': Clock,
    'map-pin': MapPin,
    'dollar-sign': DollarSign,
    'check': Check,
    'eye': Eye,
    'eye-off': EyeOff,
    'alert-circle': AlertCircle,
    'info': Info,
    'No-of-check': CheckCheck,
    'bath': Bath,
    'maximize-2': Maximize2,
    'phone': Phone,
    'mail': Mail,
    'user': User,
    'globe': Globe,
    'airventicon': Building, // Map AirVentIcon to Building as fallback
  };

  const normalizedName = iconName.toLowerCase();
  return iconMap[normalizedName] || defaultIcon;
};

// Extract coordinates from Google Maps URL
const extractCoordinatesFromMapLink = (mapLink) => {
  if (!mapLink) return null;

  const atCoordinatesRegex = /@(-?\d+\.\d+),(-?\d+\.\d+)/;
  const atMatch = mapLink.match(atCoordinatesRegex);
  if (atMatch) {
    return {
      lat: parseFloat(atMatch[1]),
      lng: parseFloat(atMatch[2]),
    };
  }

  const qCoordinatesRegex = /[?&]q=(-?\d+\.\d+),(-?\d+\.\d+)/;
  const qMatch = mapLink.match(qCoordinatesRegex);
  if (qMatch) {
    return {
      lat: parseFloat(qMatch[1]),
      lng: parseFloat(qMatch[2]),
    };
  }

  return null;
};

// Generate embed URL for iframe
const getEmbedMapUrl = (mapLink) => {
  if (!mapLink) return null;

  if (mapLink.includes('google.com/maps')) {
    const coordinates = extractCoordinatesFromMapLink(mapLink);
    if (coordinates) {
      return `https://www.google.com/maps/embed/v1/place?key=${process.env.GOOGLE_MAPS_API_KEY || 'YOUR_API_KEY'}&q=${coordinates.lat},${coordinates.lng}`;
    }

    const placeMatch = mapLink.match(/place\/([^/]+)/);
    if (placeMatch) {
      return `https://www.google.com/maps/embed/v1/place?key=${process.env.GOOGLE_MAPS_API_KEY || 'YOUR_API_KEY'}&q=${placeMatch[1]}`;
    }
  }

  return mapLink;
};

// ─── Server-safe sub-components ───────────────────────────────────────────────

function StatusBadge({ status }) {
  if (!status) return null;

  const IconComponent = status.icon ? getIconComponent(status.icon) : null;

  return (
    <span
      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium"
      style={{
        backgroundColor: `${status.color}20`,
        color: status.color,
      }}
    >
      {IconComponent && <IconComponent size={12} />}
      {status.label || status.name}
    </span>
  );
}

function TagPill({ tag }) {
  if (!tag) return null;

  const IconComponent = tag.icon ? getIconComponent(tag.icon) : null;

  return (
    <span
      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs"
      style={{
        backgroundColor: `${tag.color}15`,
        color: tag.color,
      }}
    >
      {IconComponent && <IconComponent size={12} />}
      {tag.label || tag.name}
    </span>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function PropertyDetailsPage({ params }) {
  const { slug } = await params;
  const property = await getProperty(slug);

  if (!property) notFound();

  const pricePerSqft = property.area ? Math.round(property.price / property.area).toLocaleString() : null;
  const coordinates = property.mapLink ? extractCoordinatesFromMapLink(property.mapLink) : null;
  const embedMapUrl = property.mapLink ? getEmbedMapUrl(property.mapLink) : null;

  const availableTimes = ['10:00 AM', '11:00 AM', '12:00 PM', '2:00 PM', '3:00 PM', '4:00 PM'];

  return (
    <>
      {/* Header - Fixed positioning with proper z-index and layout */}
      <Header />

      {/* Main content with proper padding to account for fixed header */}
      <main className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-gray-100 pt-16">
        {/* Sub-header - Now properly positioned below the main header */}
        <div className="sticky top-16 z-40 bg-gray-950/95 backdrop-blur-md border-b border-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
            <Link
              href="/properties"
              className="inline-flex items-center gap-2 px-3 py-2 text-gray-400 hover:text-white text-sm font-medium rounded-lg border border-gray-800 hover:bg-gray-900 transition-colors"
            >
              <ArrowLeft size={16} />
              Back to Properties
            </Link>

            <div className="flex-1 min-w-0">
              <h1 className="text-white font-semibold text-base truncate">
                {property.title}
              </h1>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col lg:grid lg:grid-cols-3 gap-6 md:gap-8">

            {/* Left Column - Main Content */}
            <div className="lg:col-span-2 order-1 space-y-6">

              {/* Image Gallery */}
              {property.images?.length > 0 && (
                <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
                  <ImageGallery images={property.images} title={property.title} />
                </div>
              )}

              {/* Price & Status */}
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                  <div>
                    <div className="text-3xl font-bold text-white">
                      {formatPrice(property.price)}
                    </div>
                    {pricePerSqft && (
                      <div className="text-sm text-gray-400 mt-1">
                        <DollarSign size={12} className="inline mr-0.5" />
                        {pricePerSqft}/sq ft
                      </div>
                    )}
                    {property.rentalPeriod && (
                      <div className="text-sm text-blue-400 mt-1">
                        Rental Period: {property.rentalPeriod}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {property.purposeTag && <TagPill tag={property.purposeTag} />}
                    <StatusBadge status={property.status} />
                    {property.isFeatured && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-yellow-500/20 text-yellow-500">
                        <Star size={12} />
                        Featured
                      </span>
                    )}
                  </div>
                </div>

                <p className="text-gray-300 text-sm mb-4">{property.description}</p>

                {/* Key Stats */}
                <div className="grid grid-cols-4 gap-4 py-4 border-t border-b border-gray-800">
                  <div>
                    <div className="flex items-center gap-2 text-gray-400 text-sm mb-1">
                      <CheckCheck size={16} />
                      No of Check
                    </div>
                    <div className="text-2xl font-semibold text-white">
                      {property.NoOFCheck ?? '0'}
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 text-gray-400 text-sm mb-1">
                      <Maximize2 size={16} />
                      Area
                    </div>
                    <div className="text-2xl font-semibold text-white">
                      {property.area?.toLocaleString() ?? '0'}
                      <span className="text-sm font-normal text-gray-500 ml-1">ft²</span>
                    </div>
                  </div>
                </div>

                {/* Location */}
                {(property.address || property.city) && (
                  <div className="flex items-start gap-3 pt-4">
                    <MapPin size={18} className="text-gray-500 mt-0.5 flex-shrink-0" />
                    <div>
                      {property.address && (
                        <div className="text-white font-medium">
                          {property.address}
                        </div>
                      )}
                      <div className="text-sm text-gray-400">
                        {[property.city, property.state, property.zipCode].filter(Boolean).join(', ')}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Full Description */}
              {property.fullDescription && (
                <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                  <h2 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-4">
                    Detailed Description
                  </h2>
                  <p className="text-gray-300 leading-relaxed">
                    {property.fullDescription}
                  </p>
                </div>
              )}

              {/* Features */}
              {property.features?.length > 0 && (
                <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                  <h2 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-4">
                    Key Features
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {property.features.map((feature, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <Check size={16} className="text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-gray-300">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Amenities */}
              {property.amenities?.length > 0 && (
                <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                  <h2 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-4">
                    Amenities
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {property.amenities.map((amenity, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <span className="text-blue-400 text-lg flex-shrink-0">•</span>
                        <span className="text-sm text-gray-300">{amenity}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Nearby Places */}
              {property.nearby?.length > 0 && (
                <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                  <h2 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-4">
                    Nearby Locations
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {property.nearby.map((place, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <span className="text-gray-400 text-lg">📍</span>
                        <span className="text-sm text-gray-300">{place}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tags */}
              {property.tags?.length > 0 && (
                <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                  <h2 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-4">
                    Tags
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {property.tags.map((tag) => (
                      <TagPill key={tag._id} tag={tag} />
                    ))}
                  </div>
                </div>
              )}

              {/* Map */}
              {property.mapLink && (
                <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <MapPin size={18} className="text-blue-500" />
                      <h2 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">
                        Location Map
                      </h2>
                    </div>
                    <a
                      href={property.mapLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors"
                    >
                      <ExternalLink size={12} />
                      Open in Maps
                    </a>
                  </div>

                  {embedMapUrl && (
                    <div className="relative w-full h-64 rounded-lg overflow-hidden border border-gray-700">
                      <iframe
                        src={embedMapUrl}
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        allowFullScreen
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        title={`Map location for ${property.title}`}
                        className="absolute inset-0"
                      />
                    </div>
                  )}

                  {coordinates && (
                    <div className="mt-3 text-xs text-gray-500 flex items-center gap-2">
                      <span>Lat: {coordinates.lat.toFixed(6)}</span>
                      <span>Lng: {coordinates.lng.toFixed(6)}</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Right Column - Sidebar */}
            <div className="lg:col-span-1 order-2 space-y-6">

              {/* Property Type */}
              {property.propertyType && (
                <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                  <h2 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-4">
                    Property Type
                  </h2>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gray-800 border border-gray-700 flex items-center justify-center">
                      {property.propertyType.icon ? (
                        (() => {
                          const IconComponent = getIconComponent(property.propertyType.icon, Building);
                          return <IconComponent size={20} className="text-gray-300" />;
                        })()
                      ) : (
                        <Building size={20} className="text-gray-400" />
                      )}
                    </div>
                    <div>
                      <div className="text-white font-medium">
                        {property.propertyType.name}
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {/* Agent Information */}
              {(property.agent?.name || property.agent?.phone || property.agent?.email) && (
                <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                  <h2 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-4">
                    Agent Information
                  </h2>
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-gray-800 border border-gray-700 flex items-center justify-center flex-shrink-0">
                      {property.agent.image ? (
                        <img
                          src={property.agent.image}
                          alt={property.agent.name}
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        <User size={20} className="text-gray-400" />
                      )}
                    </div>
                    <div className="flex-1">
                      {property.agent.name && (
                        <div className="text-white font-medium mb-1">
                          {property.agent.name}
                        </div>
                      )}
                      {property.agent.phone && (
                        <a href={`tel:${property.agent.phone}`} className="flex items-center gap-2 text-sm text-gray-400 hover:text-white mb-1">
                          <Phone size={14} />
                          {property.agent.phone}
                        </a>
                      )}
                      {property.agent.email && (
                        <a href={`mailto:${property.agent.email}`} className="flex items-center gap-2 text-sm text-gray-400 hover:text-white">
                          <Mail size={14} />
                          {property.agent.email}
                        </a>
                      )}
                    </div>
                  </div>
                  {/* <h2 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <Download size={16} className="text-blue-400" />
                  Property Documents
                </h2> */}
                  <DownloadProposalButton
                    propertyId={property._id}
                    propertyTitle={property.title}
                  />
                  <p className="mt-3 text-[10px] text-center text-gray-500">
                    By clicking download, you agree to our terms and privacy policy.
                  </p>
                </div>
              )}

              {/* Specs */}
              {property.specs?.length > 0 && (
                <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                  <h2 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-4">
                    Property Specs
                  </h2>
                  <div className="space-y-2">
                    {property.specs.map((spec, index) => (
                      <div key={index} className="flex justify-between text-sm">
                        <span className="text-gray-400">{spec.split(':')[0]}</span>
                        <span className="text-white font-medium">{spec.split(':')[1] || spec}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Quick Summary */}
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                <h2 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-4">
                  Quick Summary
                </h2>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-gray-400">
                      <BedDouble size={16} />
                      <span className="text-sm">No of Check</span>
                    </div>
                    <span className="text-sm text-white">{property.NoOFCheck || '—'}</span>
                  </div>

                  {property.area && (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-gray-400">
                        <Maximize2 size={16} />
                        <span className="text-sm">Area</span>
                      </div>
                      <span className="text-sm text-white">{property.area.toLocaleString()} ft²</span>
                    </div>
                  )}
                  {pricePerSqft && (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-gray-400">
                        <DollarSign size={16} />
                        <span className="text-sm">Price/sq ft</span>
                      </div>
                      <span className="text-sm text-white">AED {pricePerSqft}</span>
                    </div>
                  )}
                </div>

                <div className="mt-4 pt-4 border-t border-gray-800">
                  <div className="text-sm text-gray-400 mb-1">Total Price</div>
                  <div className="text-2xl font-bold text-white">
                    {formatPrice(property.price)}
                  </div>
                </div>
              </div>

              {/* Download Proposal */}
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">

              </div>

              {/* Schedule Viewing Form */}
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                <h2 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <CalendarDays size={16} className="text-blue-400" />
                  Schedule a Viewing
                </h2>

                {/* Tour Options */}
                <div className="mb-4">
                  <div className="flex flex-wrap gap-3 mb-3">
                    <label className="flex items-center gap-1.5">
                      <input type="radio" name="tourType" value="in-person" className="text-blue-500" defaultChecked />
                      <span className="text-xs text-white">In Person</span>
                    </label>
                    <label className="flex items-center gap-1.5">
                      <input type="radio" name="tourType" value="video" />
                      <span className="text-xs text-white">Video Chat</span>
                    </label>
                  </div>
                </div>

                {/* Contact Info */}
                <form action="/api/schedule-viewing" method="POST">
                  <input type="hidden" name="propertyId" value={property._id} />

                  {/* Date & Time */}
                  <div className="mb-4">
                    <p className="text-xs text-gray-400 mb-2">PREFERRED DATE</p>
                    <input
                      type="date"
                      name="preferredDate"
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-white/20"
                    />
                  </div>

                  <div className="mb-4">
                    <p className="text-xs text-gray-400 mb-2">PREFERRED TIME</p>
                    <select
                      name="preferredTime"
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-white/20"
                    >
                      <option value="">Select time</option>
                      {availableTimes.map(time => (
                        <option key={time} value={time}>{time}</option>
                      ))}
                    </select>
                  </div>

                  <input
                    type="text"
                    name="name"
                    placeholder="Name"
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-xs text-white placeholder-gray-500 mb-2 focus:outline-none focus:ring-2 focus:ring-white/20"
                    required
                  />
                  <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-xs text-white placeholder-gray-500 mb-2 focus:outline-none focus:ring-2 focus:ring-white/20"
                    required
                  />
                  <input
                    type="tel"
                    name="phone"
                    placeholder="Phone"
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-xs text-white placeholder-gray-500 mb-3 focus:outline-none focus:ring-2 focus:ring-white/20"
                    required
                  />
                  <textarea
                    name="message"
                    placeholder="Message to agent"
                    rows="2"
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-xs text-white placeholder-gray-500 mb-3 focus:outline-none focus:ring-2 focus:ring-white/20 resize-none"
                  />

                  <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2.5 rounded-lg text-xs font-medium hover:bg-blue-700 transition-colors"
                  >
                    Book Appointment
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}