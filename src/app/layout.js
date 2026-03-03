// app/layout.jsx
// import CustomCursor from './components/CustomCursor'
import './globals.css'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Three Diamonds Real Estate',
  description: 'Dubai\'s Trusted Real Estate Partner',
   icons: {
    icon: '/threediamond.png',
    // You can also add additional icon formats:
    // shortcut: '/threediamond.png',
    // apple: '/apple-icon.png',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-50 text-gray-900`}>
         {/* <CustomCursor /> */}
        {children}
      </body>
    </html>
  )
}