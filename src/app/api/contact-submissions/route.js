import { NextResponse } from 'next/server';
import connectDB from '../../../../lib/mongodb';
import ContactSubmission from '../../../../lib/models/ContactSubmission';

export async function POST(request) {
  try {
    const body = await request.json();

    const source = body?.source || 'contact-page';
    const pagePath = body?.pagePath || '';
    const propertyType = body?.propertyType || '';
    const company = body?.company || '';
    const name = body?.name || '';
    const email = body?.email || '';
    const phone = body?.phone || '';
    const message = body?.message || '';

    if (!name || !email) {
      return NextResponse.json(
        { success: false, message: 'Name and email are required' },
        { status: 400 },
      );
    }

    await connectDB();

    const doc = await ContactSubmission.create({
      source,
      pagePath,
      propertyType,
      company,
      name,
      email,
      phone,
      message,
    });

    return NextResponse.json({ success: true, id: doc._id.toString() });
  } catch (error) {
    console.error('Error creating contact submission:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 },
    );
  }
}

