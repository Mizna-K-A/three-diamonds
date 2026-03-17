import mongoose from 'mongoose';

const ContactSettingsSchema = new mongoose.Schema({
    phone1: { type: String, required: true },
    phone2: { type: String },
    email: { type: String, required: true },
    address: { type: String, required: true },
    location: {
        lat: { type: Number },
        lng: { type: Number }
    },
    mapEmbedUrl: { type: String, required: true },
    socialMedia: {
        facebook: { type: String },
        instagram: { type: String },
        whatsapp: { type: String },
        linkedin: { type: String }
    },
    nearbyPlaces: [{
        name: { type: String },
        distance: { type: String }
    }],
    updatedAt: { type: Date, default: Date.now }
});

export default mongoose.models.ContactSettings || mongoose.model('ContactSettings', ContactSettingsSchema);
