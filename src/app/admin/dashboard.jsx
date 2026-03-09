import Head from 'next/head';
import Link from 'next/link';
import { verifyToken } from '../../lib/jwt';
import cookie from 'cookie';

export default function AdminDashboard({ user }) {
  return (
    <>
      <Head>
        <title>Admin Dashboard | Dark Theme</title>
      </Head>

      <div className="min-h-screen bg-gray-900">
        {/* Navigation */}
        <nav className="bg-gray-800 border-b border-gray-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>
                <h1 className="ml-4 text-xl font-bold text-white">Admin Dashboard</h1>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-white">
                      {user?.name?.charAt(0) || 'A'}
                    </span>
                  </div>
                  <span className="text-gray-300">{user?.email}</span>
                </div>
                
                {/* SSR Logout Link */}
                <Link 
                  href="/admin/logout"
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
                >
                  Logout
                </Link>
              </div>
            </div>
          </div>
        </nav>

        {/* Rest of the dashboard content remains the same */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Welcome Card */}
          <div className="bg-gray-800 rounded-lg p-6 mb-6">
            <h2 className="text-2xl font-bold text-white mb-2">
              Welcome back, {user?.name || 'Admin'}!
            </h2>
            <p className="text-gray-400">
              You have successfully logged in using JWT authentication with Server-Side Rendering.
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-white">Total Users</h3>
                <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
              </div>
              <p className="text-3xl font-bold text-white">1,234</p>
              <p className="text-sm text-green-400 mt-2">↑ 12% from last month</p>
            </div>

            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-white">Revenue</h3>
                <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <p className="text-3xl font-bold text-white">$45,678</p>
              <p className="text-sm text-green-400 mt-2">↑ 8% from last month</p>
            </div>

            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-white">Active Sessions</h3>
                <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
              </div>
              <p className="text-3xl font-bold text-white">573</p>
              <p className="text-sm text-green-400 mt-2">↑ 5% from last month</p>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-lg font-medium text-white mb-4">Recent Activity</h3>
            <div className="space-y-4">
              {[1, 2, 3].map((item) => (
                <div key={item} className="flex items-center justify-between py-3 border-b border-gray-700 last:border-0">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gray-700 rounded-full"></div>
                    <div>
                      <p className="text-white">New user registered</p>
                      <p className="text-sm text-gray-400">5 minutes ago</p>
                    </div>
                  </div>
                  <span className="text-sm text-gray-500">#00{item}</span>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </>
  );
}

export async function getServerSideProps(context) {
  const { req, res } = context;
  const token = req.cookies.token;

  if (!token) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }

  const decoded = verifyToken(token);

  if (!decoded) {
    // Clear invalid cookie
    res.setHeader('Set-Cookie', cookie.serialize('token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV !== 'development',
      expires: new Date(0),
      sameSite: 'strict',
      path: '/',
    }));

    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }

  return {
    props: {
      user: {
        id: decoded.id,
        email: decoded.email,
        name: decoded.name,
        role: decoded.role,
      },
    },
  };
}