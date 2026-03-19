import connectDB from '../../../../lib/mongodb';
import SiteSettings from '../../../../lib/models/SiteSettings';
import ContactInfoAdminClient from './ContactInfoAdminClient';

export const dynamic = 'force-dynamic';

async function getContactSettings() {
    await connectDB();
    let settings = await SiteSettings.findOne();
    if (!settings) {
        settings = await SiteSettings.create({});
    }
    return JSON.parse(JSON.stringify(settings));
}

export default async function ContactInfoPage() {
    const settings = await getContactSettings();
    return <ContactInfoAdminClient initialSettings={settings} />;
}
