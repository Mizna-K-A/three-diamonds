import { getSiteSettings } from '../../../lib/actions/settings';
import ContactPageClient from './ContactPageClient';

export const metadata = {
    title: 'Contact Us - Three Diamonds Real Estate',
    description: 'Get in touch with Three Diamonds Real Estate for personalized assistance with Dubai property management, sales, and maintenance.',
};

export default async function ContactPage() {
    const settings = await getSiteSettings();

    return <ContactPageClient settings={settings} />;
}
