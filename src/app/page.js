// app/page.jsx
import HeaderWithPropertyTypes from './components/HeaderWithPropertyTypes';
import Hero from './components/Hero';
import Team from './components/Team';
import Services from './components/Services';
import Contact from './components/Contact';
import Footer from './components/Footer';
import Testimonials from './components/Testimonials';
import FeaturedProperties from './components/FeaturedProperties';
import Loader from './components/Loader';
import { getProperties } from './admin/properties/page';
import { getPropertyTypes } from './admin/property-types/page';
import { getPropertyStatuses } from './admin/property-statuses/page';
import { getTags } from './admin/tags/page';
import dbConnect from '../../lib/mongodb';
import SiteSettings from '../../lib/models/SiteSettings';
import About from './components/About';
import { unstable_cache } from 'next/cache';

// Cached data fetchers
const getCachedProperties = unstable_cache(
  async () => getProperties(true),
  ['home-properties'],
  { revalidate: 3600, tags: ['properties'] }
);

const getCachedPropertyTypes = unstable_cache(
  async () => getPropertyTypes(),
  ['property-types'],
  { revalidate: 3600, tags: ['property-types'] }
);

const getCachedPropertyStatuses = unstable_cache(
  async () => getPropertyStatuses(),
  ['property-statuses'],
  { revalidate: 3600, tags: ['property-statuses'] }
);

const getCachedTags = unstable_cache(
  async () => getTags(),
  ['property-tags'],
  { revalidate: 3600, tags: ['tags'] }
);

const getCachedSettings = unstable_cache(
  async () => {
    await dbConnect();
    const settings = await SiteSettings.findOne().lean();
    return settings ? JSON.parse(JSON.stringify(settings)) : null;
  },
  ['site-settings'],
  { revalidate: 3600, tags: ['settings'] }
);

export default async function Home() {
  const [properties, propertyTypes, statuses, tags, serializedSettings] = await Promise.all([
    getCachedProperties(),
    getCachedPropertyTypes(),
    getCachedPropertyStatuses(),
    getCachedTags(),
    getCachedSettings()
  ]);
  return (
    <Loader>
      <main className="min-h-screen overflow-x-hidden">
        <HeaderWithPropertyTypes />
        <Hero />
        <Team />
        <About />
        <Services />
        <FeaturedProperties
          initialProperties={properties}
          propertyTypes={propertyTypes}
          statuses={statuses}
          tags={tags}               // [{ _id, name }]
        />
        <Testimonials />
        <Contact contactSettings={serializedSettings} />
        <Footer contactSettings={serializedSettings} />
      </main>
    </Loader>
  );
}