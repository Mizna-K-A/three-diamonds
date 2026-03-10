import { getPropertyTypesForHeader } from '../../../lib/propertyTypes';
import Header from './Header';

/**
 * Server component wrapper that fetches property types and passes them to Header.
 * Enables dynamic property types in the header with server-side rendering.
 */
export default async function HeaderWithPropertyTypes() {
  const propertyTypes = await getPropertyTypesForHeader();

  return <Header propertyTypes={propertyTypes} />;
}
