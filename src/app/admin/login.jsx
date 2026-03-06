import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import cookie from 'cookie';

export default function AdminLogout() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to login page after 2 seconds
    const timer = setTimeout(() => {
      router.push('/admin/login');
    }, 2000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <>
      <Head>
        <title>Logging out... | Admin</title>
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
        <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-gray-700/50 max-w-md w-full">
          <div className="text-center">
            {/* Spinner */}
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 border-4 border-gray-600 border-t-purple-500 rounded-full animate-spin"></div>
            </div>
            
            <h2 className="text-2xl font-bold text-white mb-2">
              Logging out...
            </h2>
            <p className="text-gray-400">
              You have been successfully logged out.
            </p>
            <p className="text-sm text-gray-500 mt-4">
              Redirecting to login page...
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export async function getServerSideProps(context) {
  const { res } = context;

  // Clear the authentication cookie
  res.setHeader('Set-Cookie', cookie.serialize('token', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV !== 'development',
    expires: new Date(0),
    sameSite: 'strict',
    path: '/',
  }));

  // No redirect here, we want to show the logout message
  return {
    props: {}, // Will be passed to the page component as props
  };
}