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
import { getSiteSettings } from '../../lib/actions/settings';

export default async function Home() {
  const properties = await getProperties()
  const propertyTypes = await getPropertyTypes();
  const statuses = await getPropertyStatuses();
  const tags = await getTags();
  const settings = await getSiteSettings();
  return (
    <Loader>
      <main className="min-h-screen">
        <HeaderWithPropertyTypes />
        <Hero />
        <Team />
        <Services />
        <FeaturedProperties
          initialProperties={properties}
          propertyTypes={propertyTypes}
          statuses={statuses}
          tags={tags}               // [{ _id, name }]
        />
        <Testimonials />
        <Contact settings={settings} />
        <Footer settings={settings} />
      </main>
    </Loader>
  );
}