import { NextResponse } from 'next/server';
import connectDB from '../../../../../lib/mongodb';
import Property from '../../../../../lib/models/Property';
import PropertyType from '../../../../../lib/models/PropertyType';
import PropertyStatus from '../../../../../lib/models/PropertyStatus';
import Tag from '../../../../../lib/models/Tag';

export async function GET(request, { params }) {
    try {
        const { id } = await params;
        console.log('Fetching property for PDF. ID:', id);
        await connectDB();

        const property = await Property.findById(id)
            .populate('propertyTypeId', 'name icon slug')
            .lean();

        if (!property) {
            return NextResponse.json({ success: false, message: 'Property not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true, data: property });
    } catch (error) {
        console.error('Error fetching property for PDF:', error);
        return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
    }
}
