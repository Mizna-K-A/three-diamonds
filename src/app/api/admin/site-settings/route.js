import { NextResponse } from 'next/server';
import connectDB from '../../../../../lib/mongodb';
import SiteSettings from '../../../../../lib/models/SiteSettings';

export async function GET() {
    try {
        await connectDB();
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

        if (!settings) {
            return NextResponse.json(defaultSettings);
        }

        // Robust transformation
        settings.phoneNumbers = Array.isArray(settings.phoneNumbers) ? settings.phoneNumbers : defaultSettings.phoneNumbers;
        settings.emails = Array.isArray(settings.emails) ? settings.emails : defaultSettings.emails;
        settings.businessHours = Array.isArray(settings.businessHours) ? settings.businessHours : defaultSettings.businessHours;

        if (!Array.isArray(settings.locations) || settings.locations.length === 0) {
            settings.locations = [{
                title: 'Main Office',
                address: settings.address || defaultSettings.locations[0].address,
                lat: settings.locationCoords?.lat || settings.lat || defaultSettings.locations[0].lat,
                lng: settings.locationCoords?.lng || settings.lng || defaultSettings.locations[0].lng,
                mapEmbedUrl: settings.mapEmbedUrl || defaultSettings.locations[0].mapEmbedUrl
            }];
        }

        if (!Array.isArray(settings.socialLinks) || settings.socialLinks.length === 0) {
            const sl = settings.socialLinks || {};
            const transformed = typeof sl === 'object' && !Array.isArray(sl)
                ? Object.entries(sl).map(([platform, url]) => ({ platform, url }))
                : [];

            settings.socialLinks = transformed.length > 0 ? transformed : defaultSettings.socialLinks;
        }

        return NextResponse.json(settings);
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function PUT(req) {
    try {
        await connectDB();
        const data = await req.json();
        let settings = await SiteSettings.findOne();

        if (!settings) {
            settings = new SiteSettings(data);
        } else {
            // Clean up socialLinks before assigning
            if (Array.isArray(data.socialLinks)) {
                data.socialLinks = data.socialLinks.filter(link => link.platform && link.url);
            }

            // Handle locations array if provided
            if (Array.isArray(data.locations)) {
                data.locations = data.locations.filter(loc => loc.address);
            }

            Object.assign(settings, data);
        }

        await settings.save();
        return NextResponse.json(settings);
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
