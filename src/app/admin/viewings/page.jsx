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

    return docs.map((d) => ({
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
      createdAt: d.createdAt ? new Date(d.createdAt).toISOString() : '',
    }));
  } catch (error) {
    console.error('Error fetching viewing requests:', error);
    return [];
  }
}

export default async function ViewingRequestsPage() {
  const viewings = await getViewings();

  return (
    <div className="p-6 bg-[#0a0a0a] min-h-screen">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white mb-2">Viewing Requests</h1>
        <p className="text-gray-400">Requests submitted from property detail pages.</p>
      </div>

      <div className="bg-[#111111] border border-gray-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-[#0f0f0f]">
              <tr className="text-left text-gray-300">
                <th className="px-4 py-3 font-medium">Created</th>
                <th className="px-4 py-3 font-medium">Property</th>
                <th className="px-4 py-3 font-medium">Customer</th>
                <th className="px-4 py-3 font-medium">Tour</th>
                <th className="px-4 py-3 font-medium">Preferred</th>
                <th className="px-4 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {viewings.length === 0 ? (
                <tr>
                  <td className="px-4 py-6 text-gray-400" colSpan={6}>
                    No viewing requests yet.
                  </td>
                </tr>
              ) : (
                viewings.map((v) => (
                  <tr key={v.id} className="text-gray-200 hover:bg-gray-900/40">
                    <td className="px-4 py-3 text-gray-400 whitespace-nowrap">
                      {v.createdAt ? v.createdAt.slice(0, 16).replace('T', ' ') : '—'}
                    </td>
                    <td className="px-4 py-3">
                      {v.propertyId ? (
                        <Link
                          href={`/admin/properties/${v.propertyId}`}
                          className="text-blue-400 hover:text-blue-300"
                        >
                          {v.propertyTitle || v.propertyId}
                        </Link>
                      ) : (
                        <span>{v.propertyTitle || '—'}</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-medium text-white">{v.name || '—'}</div>
                      <div className="text-gray-400">{v.email || '—'}</div>
                      <div className="text-gray-400">{v.phone || '—'}</div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">{v.tourType || '—'}</td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      {[v.preferredDate, v.preferredTime].filter(Boolean).join(' • ') || '—'}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="px-2 py-1 rounded-md bg-gray-800 text-gray-200 border border-gray-700">
                        {v.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

