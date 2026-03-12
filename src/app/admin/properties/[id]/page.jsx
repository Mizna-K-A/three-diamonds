import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  ArrowLeft,
  Pencil,
  Copy,
  Trash2,
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
  Home,
  Building,
  Check,
  X,
  Eye,
  EyeOff,
  DollarSign,
  Hash,
  Tag,
  Layers,
  Grid,
  Users,
  Calendar,
  AlertCircle,
  Info,
  List,
  HomeIcon,
} from 'lucide-react';
import connectDB from '../../../../../lib/mongodb';
import Property from '../../../../../lib/models/Property';
import ImageGallery from './Imagegallery';

// ─── Data fetching ────────────────────────────────────────────────────────────

async function getProperty(id) {
  try {
    await connectDB();

    const property = await Property.findById(id)
      .populate('statusId', 'name label color icon slug')
      .populate('propertyTypeId', 'name slug icon')
      .populate('tagIds', 'name label color icon category slug')
      .populate('purposeTagId', 'name label color icon slug')
      .lean();

    if (!property) return null;

    // Process images for simplified schema - UPDATED
    const processedImages = (property.images || []).map((image, index) => ({
      _id: image._id?.toString() || `img-${index}`,
      url: image.url,
      thumbnailUrl: image.thumbnailUrl || image.url,
      alt: image.alt || property.title || 'Property image',
      isPrimary: image.isPrimary || false,
      sortOrder: image.sortOrder || index,
      uploadedAt: image.uploadedAt,
    }));

    return {
      ...property,
      _id: property._id.toString(),
      id: property._id.toString(),
      status: property.statusId
        ? {
          ...property.statusId,
          _id: property.statusId._id.toString(),
          slug: property.statusId.slug
        }
        : null,
      propertyType: property.propertyTypeId
        ? {
          ...property.propertyTypeId,
          _id: property.propertyTypeId._id.toString(),
          slug: property.propertyTypeId.slug
        }
        : null,
      tags: property.tagIds?.map((tag) => ({
        ...tag,
        _id: tag._id.toString(),
        slug: tag.slug
      })) || [],
      purposeTag: property.purposeTagId
        ? {
          ...property.purposeTagId,
          _id: property.purposeTagId._id.toString(),
          slug: property.purposeTagId.slug
        }
        : null,
      images: processedImages,
      features: (property.features || []).map(feature => {
        if (typeof feature === 'object') {
          return feature.name || feature.value || JSON.stringify(feature);
        }
        return feature;
      }),
      createdAt: property.createdAt?.toISOString().split('T')[0],
      updatedAt: property.updatedAt?.toISOString().split('T')[0],
      expiresAt: property.expiresAt?.toISOString().split('T')[0] ?? null,
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
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);

// Icon mapping helper
const getIconComponent = (iconName, defaultIcon = Info) => {
  if (!iconName) return defaultIcon;

  const iconMap = {
    'home': Home,
    'building': Building,
    'apartment': Building,
    'house': Home,
    'star': Star,
    'tag': Tag,
    'layers': Layers,
    'grid': Grid,
    'users': Users,
    'calendar': Calendar,
    'clock': Clock,
    'map-pin': MapPin,
    'dollar-sign': DollarSign,
    'hash': Hash,
    'check': Check,
    'x': X,
    'eye': Eye,
    'eye-off': EyeOff,
    'alert-circle': AlertCircle,
    'info': Info,
    'bed-double': BedDouble,
    'bath': Bath,
    'maximize-2': Maximize2,
    'phone': Phone,
    'mail': Mail,
    'user': User,
    'globe': Globe,
  };

  return iconMap[iconName.toLowerCase()] || defaultIcon;
};

// Extract coordinates from Google Maps URL
const extractCoordinatesFromMapLink = (mapLink) => {
  if (!mapLink) return null;

  // Handle different Google Maps URL formats
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

  const llCoordinatesRegex = /[?&]ll=(-?\d+\.\d+),(-?\d+\.\d+)/;
  const llMatch = mapLink.match(llCoordinatesRegex);
  if (llMatch) {
    return {
      lat: parseFloat(llMatch[1]),
      lng: parseFloat(llMatch[2]),
    };
  }

  return null;
};

// Generate static map image URL from coordinates
const getStaticMapUrl = (coordinates, zoom = 15, width = 600, height = 300) => {
  if (!coordinates) return null;

  // Using Google Maps Static API (you'll need an API key for production)
  const apiKey = process.env.GOOGLE_MAPS_API_KEY || 'YOUR_API_KEY';

  return `https://maps.googleapis.com/maps/api/staticmap?center=${coordinates.lat},${coordinates.lng}&zoom=${zoom}&size=${width}x${height}&maptype=roadmap&markers=color:red%7C${coordinates.lat},${coordinates.lng}&key=${apiKey}`;
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

  return null;
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

function InfoRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center justify-between py-2">
      <div className="flex items-center gap-2 text-gray-400">
        <Icon size={16} className="text-gray-500" />
        <span className="text-sm">{label}</span>
      </div>
      <span className="text-sm text-white font-medium">{value || '—'}</span>
    </div>
  );
}

function FeatureItem({ feature }) {
  return (
    <div className="flex items-center gap-2 text-gray-300">
      <Check size={16} className="text-green-500 flex-shrink-0" />
      <span className="text-sm">{feature}</span>
    </div>
  );
}

// Map Preview Component
function MapPreview({ mapLink, address, city, state }) {
  if (!mapLink) return null;

  const coordinates = extractCoordinatesFromMapLink(mapLink);
  const embedUrl = getEmbedMapUrl(mapLink);
  const staticMapUrl = coordinates ? getStaticMapUrl(coordinates) : null;

  const fullAddress = [address, city, state].filter(Boolean).join(', ');

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
      <div className="p-4 border-b border-gray-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MapPin size={18} className="text-blue-500" />
          <h2 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">
            Location Map
          </h2>
        </div>
        <a
          href={mapLink}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors"
        >
          <ExternalLink size={12} />
          Open in Maps
        </a>
      </div>

      <div className="p-4">
        {fullAddress && (
          <div className="mb-3 text-sm text-gray-400">
            {fullAddress}
          </div>
        )}

        {embedUrl && (
          <div className="relative w-full h-64 rounded-lg overflow-hidden border border-gray-700">
            <iframe
              src={embedUrl}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title={`Map location for ${fullAddress || 'property'}`}
              className="absolute inset-0"
            />
          </div>
        )}

        {!embedUrl && staticMapUrl && (
          <div className="relative w-full h-48 rounded-lg overflow-hidden border border-gray-700 bg-gray-800">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={staticMapUrl}
              alt={`Map location for ${fullAddress || 'property'}`}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.parentElement.innerHTML = `
                  <div class="flex items-center justify-center h-full bg-gray-800">
                    <div class="text-center">
                      <MapPin class="w-8 h-8 text-gray-600 mx-auto mb-2" />
                      <p class="text-sm text-gray-500">Map preview unavailable</p>
                      <a href="${mapLink}" target="_blank" rel="noopener noreferrer" class="text-xs text-blue-500 hover:text-blue-400 mt-2 inline-block">
                        Click to view on Google Maps
                      </a>
                    </div>
                  </div>
                `;
              }}
            />
          </div>
        )}

        {!embedUrl && !staticMapUrl && (
          <a
            href={mapLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between p-3 bg-gray-800 rounded-lg hover:bg-gray-750 transition-colors group"
          >
            <div className="flex items-center gap-2">
              <MapPin size={18} className="text-blue-500" />
              <span className="text-sm text-gray-300 group-hover:text-white">
                View location on Google Maps
              </span>
            </div>
            <ExternalLink size={16} className="text-gray-500 group-hover:text-gray-400" />
          </a>
        )}

        {coordinates && (
          <div className="mt-3 text-xs text-gray-500 flex items-center gap-2">
            <span>Lat: {coordinates.lat.toFixed(6)}</span>
            <span>Lng: {coordinates.lng.toFixed(6)}</span>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function PropertyDetailPage({ params }) {
  const { id } = await params;
  const property = await getProperty(id);

  if (!property) notFound();

  const pricePerSqft =
    property.area ? Math.round(property.price / property.area).toLocaleString() : null;

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Sticky Header */}
      <header className="sticky top-0 z-50 bg-gray-950/95 backdrop-blur-md border-b border-gray-800">
        <div className="px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          <Link
            href="/admin/properties"
            className="inline-flex items-center gap-2 px-3 py-2 text-gray-400 hover:text-white text-sm font-medium rounded-lg border border-gray-800 hover:bg-gray-900 transition-colors"
          >
            <ArrowLeft size={16} />
            Back to Properties
          </Link>

          <div className="flex-1 min-w-0">
            <h1 className="text-white font-semibold text-base truncate">
              {property.title}
            </h1>
            <p className="text-gray-500 text-xs mt-0.5">
              ID: {property._id}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href={`/admin/properties/${property._id}/edit`}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              <Pencil size={16} />
              Edit
            </Link>
            <button className="p-2 text-gray-400 hover:text-white rounded-lg border border-gray-800 hover:bg-gray-900 transition-colors">
              <Copy size={16} />
            </button>
            <button className="p-2 text-gray-400 hover:text-red-400 rounded-lg border border-gray-800 hover:bg-red-950/30 hover:border-red-800 transition-colors">
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Main Content - Left 2 columns */}
          <div className="lg:col-span-2 space-y-6">

            {/* Image Gallery */}
            {property.images?.length > 0 && (
              <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
                <ImageGallery images={property.images} title={property.title} />
              </div>
            )}

            {/* Price & Key Info */}
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
              <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
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
                </div>
                <div className="flex items-center gap-2">
                  {property.purposeTag && <TagPill tag={property.purposeTag} />}
                  <StatusBadge status={property.status} />
                </div>
              </div>

              {/* Key Stats */}
              <div className="grid grid-cols-3 gap-4 py-4 border-t border-b border-gray-800">
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
                {console.log(property, 'ttt')
                }
                <div>
                  <div className="flex items-center gap-2 text-gray-400 text-sm mb-1">
                    <List size={16} />
                    No of check
                  </div>
                  <div className="text-xl font-semibold text-white">
                    {property.NoOFCheck}
                  </div>
                </div>
                {property.RentalPeriod &&
                  <div>
                    <div className="flex items-center gap-2 text-gray-400 text-sm mb-1">
                      <HomeIcon size={16} />
                      Rental Period
                    </div>
                    <div className="text-xl font-semibold text-white">
                      {property.RentalPeriod}
                    </div>
                  </div>
                }

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

            {/* Description */}
            {property.description && (
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                <h2 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-4">
                  Description
                </h2>
                <p className="text-gray-300 leading-relaxed whitespace-pre-line">
                  {property.description}
                </p>
              </div>
            )}

            {/* Features */}
            {property.features?.length > 0 && (
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                <h2 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-4">
                  Features & Amenities
                </h2>
                <div className="grid grid-cols-2 gap-3">
                  {property.features.map((feature, index) => (
                    <FeatureItem key={index} feature={feature} />
                  ))}
                </div>
              </div>
            )}

            {/* Map Preview */}
            {property.mapLink && (
              <MapPreview
                mapLink={property.mapLink}
                address={property.address}
                city={property.city}
                state={property.state}
              />
            )}
          </div>

          {/* Sidebar - Right column */}
          <div className="space-y-6">

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

            {/* Timeline */}
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
              <h2 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-4">
                Timeline
              </h2>
              <div className="space-y-3">
                <InfoRow icon={CalendarDays} label="Created" value={property.createdAt} />
                <InfoRow icon={RefreshCw} label="Updated" value={property.updatedAt} />
              </div>
            </div>

            {/* Publishing Status */}
            {/* <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
              <h2 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-4">
                Publishing Status
              </h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-gray-400">
                    <Globe size={16} />
                    <span className="text-sm">Status</span>
                  </div>
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${
                    property.isPublished 
                      ? 'bg-green-500/20 text-green-500' 
                      : 'bg-gray-800 text-gray-400'
                  }`}>
                    {property.isPublished ? (
                      <>
                        <Eye size={12} />
                        Published
                      </>
                    ) : (
                      <>
                        <EyeOff size={12} />
                        Draft
                      </>
                    )}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-gray-400">
                    <Star size={16} />
                    <span className="text-sm">Featured</span>
                  </div>
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${
                    property.isFeatured 
                      ? 'bg-yellow-500/20 text-yellow-500' 
                      : 'bg-gray-800 text-gray-400'
                  }`}>
                    {property.isFeatured ? 'Yes' : 'No'}
                  </span>
                </div>

                {property.expiresAt && (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-gray-400">
                      <Clock size={16} />
                      <span className="text-sm">Expires</span>
                    </div>
                    <span className="text-sm text-white">{property.expiresAt}</span>
                  </div>
                )}
              </div>
            </div> */}

            {/* Quick Summary */}
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
              <h2 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-4">
                Quick Summary
              </h2>
              <div className="space-y-3">
                {property.area && (
                  <InfoRow icon={Maximize2} label="Area" value={`${property.area.toLocaleString()} ft²`} />
                )}
                {pricePerSqft && (
                  <InfoRow icon={DollarSign} label="Price/sq ft" value={`$${pricePerSqft}`} />
                )}
              </div>

              <div className="mt-4 pt-4 border-t border-gray-800">
                <div className="text-sm text-gray-400 mb-1">Total Price</div>
                <div className="text-2xl font-bold text-white">
                  {formatPrice(property.price)}
                </div>
              </div>
            </div>

            {/* Agent Information */}
            {(property.agentName || property.agentPhone || property.agentEmail) && (
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                <h2 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-4">
                  Agent Information
                </h2>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-gray-800 border border-gray-700 flex items-center justify-center flex-shrink-0">
                    <User size={20} className="text-gray-400" />
                  </div>
                  <div className="flex-1">
                    {property.agentName && (
                      <div className="text-white font-medium mb-1">
                        {property.agentName}
                      </div>
                    )}
                    {property.agentPhone && (
                      <a href={`tel:${property.agentPhone}`} className="flex items-center gap-2 text-sm text-gray-400 hover:text-white mb-1">
                        <Phone size={14} />
                        {property.agentPhone}
                      </a>
                    )}
                    {property.agentEmail && (
                      <a href={`mailto:${property.agentEmail}`} className="flex items-center gap-2 text-sm text-gray-400 hover:text-white">
                        <Mail size={14} />
                        {property.agentEmail}
                      </a>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}