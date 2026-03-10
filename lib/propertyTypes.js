import connectDB from './mongodb';
import PropertyType from './models/PropertyType';

/**
 * Fetches property types for header navigation (lightweight, no property count).
 * Used for server-side rendering in Header.
 */
export async function getPropertyTypesForHeader() {
  try {
    await connectDB();
    const types = await PropertyType.find({})
      .sort({ name: 1 })
      .select('name slug icon')
      .lean();

    return types.map((type) => ({
      id: type._id.toString(),
      name: type.name || '',
      slug: type.slug || '',
      icon: type.icon || '',
    }));
  } catch (error) {
    console.error('Error fetching property types for header:', error);
    return [];
  }
}
