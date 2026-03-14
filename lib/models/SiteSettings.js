import mongoose from 'mongoose';

const SiteSettingsSchema = new mongoose.Schema({
    phoneNumbers: {
        type: [String],
        default: ['052 939 8258', '056 777 0905']
    },
    emails: {
        type: [String],
        default: ['info@threediamonds.ae', 'sales@threediamonds.ae']
    },
    locations: [{
        title: { type: String, default: 'Main Office' },
        address: { type: String, default: 'Al Quoz Industrial Area - 3, Dubai, U.A.E' },
        lat: { type: Number, default: 25.1345 },
        lng: { type: Number, default: 55.2356 },
        mapEmbedUrl: { type: String, default: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3610.1781845735043!2d55.2334!3d25.1345!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjXCsDA4JzA0LjIiTiA1NcKwMTQnMDEuMCJF!5e0!3m2!1sen!2sae!4v1234567890!5m2!1sen!2sae' }
    }],
    businessHours: {
        type: [String],
        default: ['Mon - Fri: 9:00 AM - 6:00 PM', 'Sat: 10:00 AM - 4:00 PM']
    },
    socialLinks: [{
        platform: { type: String, default: 'facebook' },
        url: { type: String, default: '' }
    }]
}, { timestamps: true });

// Pre-populate if empty
SiteSettingsSchema.pre('save', function (next) {
    if (this.locations.length === 0) {
        this.locations.push({
            title: 'Main Office',
            address: 'Al Quoz Industrial Area - 3, Dubai, U.A.E',
            lat: 25.1345,
            lng: 55.2356,
            mapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3610.1781845735043!2d55.2334!3d25.1345!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjXCsDA4JzA0LjIiTiA1NcKwMTQnMDEuMCJF!5e0!3m2!1sen!2sae!4v1234567890!5m2!1sen!2sae'
        });
    }
    if (this.socialLinks.length === 0) {
        this.socialLinks.push(
            { platform: 'facebook', url: 'https://facebook.com/threediamondsreal-estate' },
            { platform: 'instagram', url: 'https://instagram.com/threediamondsrealestate' }
        );
    }
    next();
});

export default mongoose.models.SiteSettings || mongoose.model('SiteSettings', SiteSettingsSchema);
