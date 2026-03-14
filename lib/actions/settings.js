import connectDB from '../mongodb';
import SiteSettings from '../models/SiteSettings';

export async function getSiteSettings() {
    await connectDB();
    try {
        let settings = await SiteSettings.findOne().lean();

        const defaultSettings = {
            phoneNumbers: ['052 939 8258', '056 777 0905'],
            emails: ['info@threediamonds.ae', 'sales@threediamonds.ae'],
            locations: [{
                title: 'Main Office',
                address: 'Al Quoz Industrial Area - 3, Dubai, U.A.E',
                lat: 25.1345,
                lng: 55.2356,
                mapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3610.1781845735043!2d55.2334!3d25.1345!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjXCsDA4JzA0LjIiTiA1NcKwMTQnMDEuMCJF!5e0!3m2!1sen!2sae!4v1234567890!5m2!1sen!2sae'
            }],
            businessHours: ['Mon - Fri: 9:00 AM - 6:00 PM', 'Sat: 10:00 AM - 4:00 PM'],
            socialLinks: [
                { platform: 'facebook', url: 'https://facebook.com/threediamondsreal-estate' },
                { platform: 'instagram', url: 'https://instagram.com/threediamondsrealestate' }
            ]
        };

        if (!settings) return defaultSettings;

        // Ensure robust transformation for frontend
        const result = JSON.parse(JSON.stringify(settings));

        result.phoneNumbers = Array.isArray(result.phoneNumbers) ? result.phoneNumbers : defaultSettings.phoneNumbers;
        result.emails = Array.isArray(result.emails) ? result.emails : defaultSettings.emails;
        result.businessHours = Array.isArray(result.businessHours) ? result.businessHours : defaultSettings.businessHours;

        if (!Array.isArray(result.locations) || result.locations.length === 0) {
            result.locations = [{
                title: 'Main Office',
                address: result.address || defaultSettings.locations[0].address,
                lat: result.locationCoords?.lat || result.lat || defaultSettings.locations[0].lat,
                lng: result.locationCoords?.lng || result.lng || defaultSettings.locations[0].lng,
                mapEmbedUrl: result.mapEmbedUrl || defaultSettings.locations[0].mapEmbedUrl
            }];
        }

        if (!Array.isArray(result.socialLinks) || result.socialLinks.length === 0) {
            const sl = result.socialLinks || {};
            const transformed = typeof sl === 'object' && !Array.isArray(sl)
                ? Object.entries(sl).map(([platform, url]) => ({ platform, url }))
                : [];

            result.socialLinks = transformed.length > 0 ? transformed : defaultSettings.socialLinks;
        }

        return result;
    } catch (error) {
        console.error("Error fetching site settings:", error);
        return null;
    }
}
