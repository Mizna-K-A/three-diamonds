'use server';

import { revalidatePath, revalidateTag } from 'next/cache';
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
        settings = await SiteSettings.findByIdAndUpdate(
            settings._id,
            { $set: data },
            { new: true, strict: false }
        );
    } else {
        settings = await SiteSettings.create(data);
    }

    revalidatePath('/admin/contact-info');
    revalidatePath('/contact');
    revalidatePath('/');
    revalidateTag('settings');

    return serialize(settings);
}
