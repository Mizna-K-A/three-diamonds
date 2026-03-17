import { NextResponse } from 'next/server';
import connectDB from '../../../../../lib/mongodb';
import SiteSettings from '../../../../../lib/models/SiteSettings';

export async function GET() {
    try {
        await connectDB();
        let settings = await SiteSettings.findOne();

        if (!settings) {
            settings = await SiteSettings.create({});
        }

        return NextResponse.json({ success: true, data: settings });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

export async function PUT(request) {
    try {
        await connectDB();
        const data = await request.json();

        let settings = await SiteSettings.findOne();

        if (settings) {
            settings = await SiteSettings.findByIdAndUpdate(settings._id, data, { new: true });
        } else {
            settings = await SiteSettings.create(data);
        }

        return NextResponse.json({ success: true, data: settings });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
