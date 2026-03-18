import './globals.css'
import { Inter } from 'next/font/google'
import dbConnect from '../../lib/mongodb';
import SiteSettings from '../../lib/models/SiteSettings';
import FloatingActions from './components/FloatingActions'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Three Diamonds Real Estate',
  description: 'Dubai\'s Trusted Real Estate Partner',
  icons: {
    icon: '/threediamond.png',
  },
}

export default async function RootLayout({ children }) {
  await dbConnect();
  const settings = await SiteSettings.findOne().lean();
  const whatsappNumber = settings?.phoneNumbers?.[0] || '971529398258';

  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-50 text-gray-900`}>
        {/* <CustomCursor /> */}
        {children}
        <FloatingActions whatsappNumber={whatsappNumber} />
      </body>
    </html>
  )
}