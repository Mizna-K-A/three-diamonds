import connectDB from '../../../../lib/mongodb';
import ScheduleViewing from '../../../../lib/models/ScheduleViewing';
import Link from 'next/link';

async function getViewings() {
  try {
    await connectDB();
    const docs = await ScheduleViewing.find({})
      .sort({ createdAt: -1 })
      .limit(500)
      .lean();

    // Get counts for stats
    const totalCount = await ScheduleViewing.countDocuments();
    const todayCount = await ScheduleViewing.countDocuments({
      createdAt: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) }
    });

    // Get status counts
    const statusCounts = await ScheduleViewing.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } }
    ]);

    return {
      viewings: docs.map((d) => ({
        id: d._id.toString(),
        propertyId: d.propertyId?.toString?.() || '',
        propertyTitle: d.propertyTitle || '',
        tourType: d.tourType || '',
        preferredDate: d.preferredDate || '',
        preferredTime: d.preferredTime || '',
        name: d.name || '',
        email: d.email || '',
        phone: d.phone || '',
        status: d.status || 'new',
        notes: d.notes || '',
        createdAt: d.createdAt ? new Date(d.createdAt).toISOString() : '',
      })),
      stats: {
        total: totalCount,
        today: todayCount,
        shown: docs.length,
        byStatus: statusCounts.reduce((acc, { _id, count }) => {
          acc[_id || 'unknown'] = count;
          return acc;
        }, {})
      }
    };
  } catch (error) {
    console.error('Error fetching viewing requests:', error);
    return {
      viewings: [],
      stats: { total: 0, today: 0, shown: 0, byStatus: {} }
    };
  }
}

function StatusBadge({ status }) {
  const statusConfig = {
    new: { bg: 'bg-blue-500/20', text: 'text-blue-300', border: 'border-blue-500/30', dot: 'bg-blue-400', label: 'New' },
    confirmed: { bg: 'bg-green-500/20', text: 'text-green-300', border: 'border-green-500/30', dot: 'bg-green-400', label: 'Confirmed' },
    completed: { bg: 'bg-gray-500/20', text: 'text-gray-300', border: 'border-gray-500/30', dot: 'bg-gray-400', label: 'Completed' },
    cancelled: { bg: 'bg-red-500/20', text: 'text-red-300', border: 'border-red-500/30', dot: 'bg-red-400', label: 'Cancelled' },
    rescheduled: { bg: 'bg-yellow-500/20', text: 'text-yellow-300', border: 'border-yellow-500/30', dot: 'bg-yellow-400', label: 'Rescheduled' },
  };

  const config = statusConfig[status?.toLowerCase()] || statusConfig.new;

  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text} border ${config.border}`}>
      <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${config.dot}`}></span>
      {config.label}
    </span>
  );
}

function TourTypeBadge({ type }) {
  const typeConfig = {
    'in-person': { bg: 'bg-purple-500/20', text: 'text-purple-300', border: 'border-purple-500/30', icon: '👤' },
    'virtual': { bg: 'bg-indigo-500/20', text: 'text-indigo-300', border: 'border-indigo-500/30', icon: '💻' },
    'video': { bg: 'bg-indigo-500/20', text: 'text-indigo-300', border: 'border-indigo-500/30', icon: '📹' },
  };

  const config = typeConfig[type?.toLowerCase()] || {
    bg: 'bg-gray-500/20',
    text: 'text-gray-300',
    border: 'border-gray-500/30',
    icon: '📅'
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text} border ${config.border}`}>
      <span className="mr-1">{config.icon}</span>
      {type || '—'}
    </span>
  );
}

export default async function ViewingRequestsPage() {
  const { viewings, stats } = await getViewings();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-[#0a0a0a] to-gray-900">
      {/* Header with gradient */}
      <div className="border-b border-gray-800/50 bg-black/20 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                Viewing Requests
              </h1>
              <p className="text-gray-400 mt-1 flex items-center gap-2">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                Property tour and viewing schedule requests
              </p>
            </div>

            {/* Stats badges */}
            <div className="flex gap-3">
              <div className="px-4 py-2 rounded-xl bg-gray-900/50 border border-gray-800 backdrop-blur-sm">
                <div className="text-xs text-gray-400">Today</div>
                <div className="text-xl font-semibold text-white">{stats.today}</div>
              </div>
              <div className="px-4 py-2 rounded-xl bg-gray-900/50 border border-gray-800 backdrop-blur-sm">
                <div className="text-xs text-gray-400">Total</div>
                <div className="text-xl font-semibold text-white">{stats.total}</div>
              </div>
            </div>
          </div>

          {/* Status chips and quick stats */}
          <div className="flex flex-wrap items-center gap-3 mt-4">
            {Object.entries(stats.byStatus).map(([status, count]) => (
              <div key={status} className="flex items-center gap-2 px-3 py-1 rounded-full bg-gray-800/50 border border-gray-700">
                <StatusBadge status={status} />
                <span className="text-sm font-medium text-white">{count}</span>
              </div>
            ))}
            <div className="px-3 py-1 rounded-full bg-gray-800/50 border border-gray-700 text-sm text-gray-400">
              Showing {stats.shown} of {stats.total}
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-gray-900/40 backdrop-blur-sm border border-gray-800/60 rounded-2xl shadow-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-900/80 border-b border-gray-800">
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    <div className="flex items-center gap-1">Created</div>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Property
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Tour Type
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Preferred Date/Time
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/60">
                {viewings.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-16 text-center">
                      <div className="flex flex-col items-center justify-center text-gray-400">
                        <svg className="w-12 h-12 mb-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <p className="text-lg font-medium text-gray-300">No viewing requests yet</p>
                        <p className="text-sm text-gray-500 mt-1">Property viewing requests will appear here</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  viewings.map((v, index) => (
                    <tr
                      key={v.id}
                      className="hover:bg-white/5 transition-colors group"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-col">
                          <time className="text-sm text-gray-300 font-medium">
                            {v.createdAt ? new Date(v.createdAt).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric'
                            }) : '—'}
                          </time>
                          <span className="text-xs text-gray-500">
                            {v.createdAt ? new Date(v.createdAt).toLocaleTimeString('en-US', {
                              hour: '2-digit',
                              minute: '2-digit'
                            }) : ''}
                          </span>
                        </div>
                      </td>

                      <td className="px-6 py-4 max-w-xs">
                        <div className="flex flex-col gap-1">
                          {v.propertyId ? (
                            <Link
                              href={`/admin/properties/${v.propertyId}`}
                              className="text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1 group/link"
                            >
                              <span className="truncate font-medium">
                                {v.propertyTitle || v.propertyId}
                              </span>
                              <svg className="w-3.5 h-3.5 opacity-0 group-hover/link:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                              </svg>
                            </Link>
                          ) : (
                            <span className="text-gray-300">{v.propertyTitle || '—'}</span>
                          )}
                          {v.propertyId && (
                            <span className="text-xs text-gray-500">
                              ID: {v.propertyId.slice(-6)}
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1">
                          <span className="font-medium text-white">{v.name || '—'}</span>
                          {v.email && (
                            <a href={`mailto:${v.email}`} className="text-sm text-gray-400 hover:text-blue-400 transition-colors flex items-center gap-1">
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                              </svg>
                              {v.email}
                            </a>
                          )}
                          {v.phone && (
                            <a href={`tel:${v.phone}`} className="text-sm text-gray-400 hover:text-blue-400 transition-colors flex items-center gap-1">
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                              </svg>
                              {v.phone}
                            </a>
                          )}
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <TourTypeBadge type={v.tourType} />
                        {v.notes && (
                          <div className="mt-2 text-xs text-gray-500 max-w-[150px] truncate" title={v.notes}>
                            📝 {v.notes}
                          </div>
                        )}
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1">
                          {v.preferredDate && (
                            <span className="text-sm text-gray-300 flex items-center gap-1">
                              <svg className="w-3.5 h-3.5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                              {new Date(v.preferredDate).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric'
                              })}
                            </span>
                          )}
                          {v.preferredTime && (
                            <span className="text-sm text-gray-400 flex items-center gap-1 ml-4">
                              <svg className="w-3.5 h-3.5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              {v.preferredTime}
                            </span>
                          )}
                          {!v.preferredDate && !v.preferredTime && '—'}
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex flex-col items-start gap-2">
                          <StatusBadge status={v.status} />

                          {/* Quick action buttons (placeholder) */}
                          {v.status?.toLowerCase() === 'new' && (
                            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button className="p-1 hover:bg-green-500/20 rounded transition-colors" title="Confirm">
                                <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                              </button>
                              <button className="p-1 hover:bg-yellow-500/20 rounded transition-colors" title="Reschedule">
                                <svg className="w-4 h-4 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                </svg>
                              </button>
                              <button className="p-1 hover:bg-red-500/20 rounded transition-colors" title="Cancel">
                                <svg className="w-4 h-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                              </button>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}