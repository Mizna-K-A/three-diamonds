import connectDB from '../../../lib/mongodb';
import SiteSettings from '../../../lib/models/SiteSettings';
import ContactClient from './ContactClient';

export default async function ContactPage() {
  await connectDB();
  const settings = await SiteSettings.findOne().lean();

  // Convert _id to string for serialization
  const serializedSettings = settings ? {
    ...JSON.parse(JSON.stringify(settings))
  } : null;

  return <ContactClient contactSettings={serializedSettings} />;
}