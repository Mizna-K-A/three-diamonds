import connectDB from '../../../../lib/mongodb';
import ContactSubmission from '../../../../lib/models/ContactSubmission';

async function getContacts() {
  try {
    await connectDB();
    const docs = await ContactSubmission.find({})
      .sort({ createdAt: -1 })
      .limit(500)
      .lean();

    // Get counts for stats
    const totalCount = await ContactSubmission.countDocuments();
    const todayCount = await ContactSubmission.countDocuments({
      createdAt: { $gte: new Date(new Date().setHours(0,0,0,0)) }
    });

    return {
      submissions: docs.map((d) => ({
        id: d._id.toString(),
        source: d.source || '',
        pagePath: d.pagePath || '',
        name: d.name || '',
        email: d.email || '',
        phone: d.phone || '',
        company: d.company || '',
        propertyType: d.propertyType || '',
        message: d.message || '',
        createdAt: d.createdAt ? new Date(d.createdAt).toISOString() : '',
      })),
      stats: {
        total: totalCount,
        today: todayCount,
        shown: docs.length
      }
    };
  } catch (error) {
    console.error('Error fetching contact submissions:', error);
    return { submissions: [], stats: { total: 0, today: 0, shown: 0 } };
  }
}

export default async function ContactSubmissionsPage() {
  const { submissions: contacts, stats } = await getContacts();

  // Group submissions by source for summary
  const sourceCounts = contacts.reduce((acc, c) => {
    acc[c.source] = (acc[c.source] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-[#0a0a0a] to-gray-900">
      {/* Header with gradient */}
      <div className="border-b border-gray-800/50 bg-black/20 backdrop-blur-sm sticky top-0 z-10">
        <div className="      px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                Contact Submissions
              </h1>
              <p className="text-gray-400 mt-1 flex items-center gap-2">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                Messages from Contact page and brochure modal
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

          {/* Quick stats chips */}
          <div className="flex flex-wrap gap-2 mt-4">
            {Object.entries(sourceCounts).map(([source, count]) => (
              <div key={source} className="px-3 py-1 rounded-full bg-gray-800/50 border border-gray-700 text-sm">
                <span className="text-gray-300">{source || 'Unknown'}:</span>
                <span className="ml-1 font-medium text-white">{count}</span>
              </div>
            ))}
            <div className="px-3 py-1 rounded-full bg-gray-800/50 border border-gray-700 text-sm text-gray-400">
              Showing {stats.shown} of {stats.total}
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-gray-900/40 backdrop-blur-sm border border-gray-800/60 rounded-2xl shadow-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-900/80 border-b border-gray-800">
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    <div className="flex items-center gap-1">Created</div>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Source
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Details
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Message
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/60">
                {contacts.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-16 text-center">
                      <div className="flex flex-col items-center justify-center text-gray-400">
                        <svg className="w-12 h-12 mb-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                        </svg>
                        <p className="text-lg font-medium text-gray-300">No submissions yet</p>
                        <p className="text-sm text-gray-500 mt-1">Contact form submissions will appear here</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  contacts.map((c, index) => (
                    <tr 
                      key={c.id} 
                      className="hover:bg-white/5 transition-colors group"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-col">
                          <time className="text-sm text-gray-300 font-medium">
                            {c.createdAt ? new Date(c.createdAt).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric'
                            }) : '—'}
                          </time>
                          <span className="text-xs text-gray-500">
                            {c.createdAt ? new Date(c.createdAt).toLocaleTimeString('en-US', {
                              hour: '2-digit',
                              minute: '2-digit'
                            }) : ''}
                          </span>
                        </div>
                      </td>
                      
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1">
                          <span className={`
                            inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                            ${c.source === 'contact' ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' : 
                              c.source === 'brochure' ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' : 
                              'bg-gray-500/20 text-gray-300 border border-gray-500/30'}
                          `}>
                            <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                              c.source === 'contact' ? 'bg-blue-400' : 
                              c.source === 'brochure' ? 'bg-purple-400' : 
                              'bg-gray-400'
                            }`}></span>
                            {c.source || 'Unknown'}
                          </span>
                          {c.pagePath && (
                            <span className="text-xs text-gray-500 truncate max-w-[150px]" title={c.pagePath}>
                              {c.pagePath.split('/').pop() || c.pagePath}
                            </span>
                          )}
                        </div>
                      </td>
                      
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1">
                          <span className="font-medium text-white">{c.name || '—'}</span>
                          {c.email && (
                            <a href={`mailto:${c.email}`} className="text-sm text-gray-400 hover:text-blue-400 transition-colors flex items-center gap-1">
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                              </svg>
                              {c.email}
                            </a>
                          )}
                          {c.phone && (
                            <a href={`tel:${c.phone}`} className="text-sm text-gray-400 hover:text-blue-400 transition-colors flex items-center gap-1">
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                              </svg>
                              {c.phone}
                            </a>
                          )}
                        </div>
                      </td>
                      
                      <td className="px-6 py-4">
                        <div className="space-y-1 text-sm">
                          {c.company && (
                            <div className="flex items-center gap-1 text-gray-300">
                              <svg className="w-3.5 h-3.5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                              </svg>
                              <span className="text-gray-400">Company:</span>
                              <span className="text-white">{c.company}</span>
                            </div>
                          )}
                          {c.propertyType && (
                            <div className="flex items-center gap-1 text-gray-300">
                              <svg className="w-3.5 h-3.5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                              </svg>
                              <span className="text-gray-400">Property:</span>
                              <span className="text-white">{c.propertyType}</span>
                            </div>
                          )}
                        </div>
                      </td>
                      
                      <td className="px-6 py-4 max-w-md">
                        <div className="relative group/message">
                          <div className="text-sm text-gray-300 bg-gray-800/30 rounded-lg p-3 border border-gray-700/50 whitespace-pre-wrap break-words max-h-32 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
                            {c.message || '—'}
                          </div>
                          {c.message && c.message.length > 200 && (
                            <div className="absolute bottom-2 right-2 opacity-0 group-hover/message:opacity-100 transition-opacity">
                              <span className="text-xs text-gray-500 bg-gray-900 px-2 py-1 rounded-full">
                                {c.message.length} characters
                              </span>
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