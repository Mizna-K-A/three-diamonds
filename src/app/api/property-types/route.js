import { getPropertyTypesForHeader } from '../../../../lib/propertyTypes';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const propertyTypes = await getPropertyTypesForHeader();
    return NextResponse.json(propertyTypes);
  } catch (error) {
    console.error('Error fetching property types:', error);
    return NextResponse.json([], { status: 500 });
  }
}
