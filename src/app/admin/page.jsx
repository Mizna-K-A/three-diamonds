// pages/admin/index.js

const Dashboard = () => {
  const stats = [
    { name: 'Total Users', value: '2,543', change: '+12%' },
    { name: 'Revenue', value: '$45,234', change: '+8%' },
    { name: 'Orders', value: '1,234', change: '+23%' },
    { name: 'Conversion Rate', value: '3.2%', change: '-2%' },
  ];

  return (
      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-2xl font-semibold text-white">Dashboard</h1>
          <p className="mt-1 text-sm text-white">
            Welcome back! Here's what's happening with your application.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.name}
              className="px-4 py-5 bg-white shadow rounded-lg overflow-hidden sm:p-6"
            >
              <dt className="text-sm font-medium text-gray-500 truncate">
                {stat.name}
              </dt>
              <dd className="mt-1 text-3xl font-semibold text-gray-900">
                {stat.value}
              </dd>
              <dd className="mt-2">
                <span className={`text-sm ${
                  stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'
                }`}>
                  {stat.change}
                </span>
                <span className="text-sm text-gray-500"> from last month</span>
              </dd>
            </div>
          ))}
        </div>

        {/* Recent Activity */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg font-medium leading-6 text-gray-900">
              Recent Activity
            </h3>
          </div>
          <div className="border-t border-gray-200">
            <div className="px-4 py-5 sm:p-6">
              <p className="text-gray-500">No recent activity to display.</p>
            </div>
          </div>
        </div>
      </div>
  );
};

export default Dashboard;