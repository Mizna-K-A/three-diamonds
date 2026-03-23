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

export default async function Home() {
  const properties = await getProperties()
  const propertyTypes = await getPropertyTypes();
  const statuses = await getPropertyStatuses();
  const tags = await getTags();

  await dbConnect();
  const settings = await SiteSettings.findOne().lean();
  const serializedSettings = settings ? JSON.parse(JSON.stringify(settings)) : null;
  return (
    <Loader>
      <main className="min-h-screen">
        <HeaderWithPropertyTypes />
        <Hero />
        <Team />
        <About/>
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