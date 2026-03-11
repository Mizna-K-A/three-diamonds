import { NextResponse } from 'next/server';
import connectDB from '../../../../lib/mongodb';
import ScheduleViewing from '../../../../lib/models/ScheduleViewing';
import Property from '../../../../lib/models/Property';

export async function POST(request) {
  try {
    const formData = await request.formData();

    const propertyId = formData.get('propertyId')?.toString() || '';
    const tourType = formData.get('tourType')?.toString() || 'in-person';
    const preferredDate = formData.get('preferredDate')?.toString() || '';
    const preferredTime = formData.get('preferredTime')?.toString() || '';
    const name = formData.get('name')?.toString() || '';
    const email = formData.get('email')?.toString() || '';
    const phone = formData.get('phone')?.toString() || '';
    const message = formData.get('message')?.toString() || '';

    if (!propertyId || !name || !email || !phone) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 },
      );
    }

    await connectDB();

    // Optional: store a snapshot of the property title for easier admin viewing
    let propertyTitle = '';
    try {
      const property = await Property.findById(propertyId).select('title').lean();
      propertyTitle = property?.title || '';
    } catch {
      // ignore property lookup errors; still store request
    }

    const doc = await ScheduleViewing.create({
      propertyId,
      propertyTitle,
      tourType,
      preferredDate,
      preferredTime,
      name,
      email,
      phone,
      message,
      status: 'new',
    });

    // Send Email Notifications
    try {
      const { sendMail, getViewingEmailTemplate, getAdminNotificationTemplate } = await import('../../../../lib/mail');

      // 1. Send to Client
      const clientMail = getViewingEmailTemplate(name, propertyTitle, preferredDate, preferredTime);
      await sendMail({
        to: email,
        ...clientMail
      });

      // 2. Send to Admin
      const adminMail = getAdminNotificationTemplate('Property Viewing Request', {
        name,
        email,
        phone,
        property: propertyTitle,
        type: tourType,
        date: preferredDate,
        time: preferredTime,
        message
      });
      if (process.env.ADMIN_EMAIL) {
        await sendMail({
          to: process.env.ADMIN_EMAIL,
          ...adminMail
        });
      }
    } catch (mailError) {
      console.error('Email notification failed but viewing request was saved:', mailError);
    }

    return NextResponse.json({
      success: true,
      id: doc._id.toString(),
    });
  } catch (error) {
    console.error('Error creating schedule viewing:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 },
    );
  }
}

