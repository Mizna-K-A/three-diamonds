'use server';

import { revalidatePath } from 'next/cache';
import connectDB from '../../../../lib/mongodb';
import SiteSettings from '../../../../lib/models/SiteSettings';

function serialize(doc) {
    if (!doc) return null;
    const obj = doc.toObject ? doc.toObject() : doc;
    return JSON.parse(JSON.stringify(obj));
}

export async function getContactSettings() {
    await connectDB();
    let settings = await SiteSettings.findOne();
    if (!settings) {
        settings = await SiteSettings.create({});
    }
    return serialize(settings);
}

export async function updateContactSettings(data) {
    await connectDB();

    let settings = await SiteSettings.findOne();

    if (settings) {
        settings = await SiteSettings.findByIdAndUpdate(settings._id, data, { new: true });
    } else {
        settings = await SiteSettings.create(data);
    }

    revalidatePath('/admin/contact-info');
    revalidatePath('/contact');
    revalidatePath('/');

    return serialize(settings);
}
