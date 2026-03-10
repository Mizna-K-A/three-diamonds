import connectDB from '../../../../lib/mongodb';
import ContactSubmission from '../../../../lib/models/ContactSubmission';

async function getContacts() {
  try {
    await connectDB();
    const docs = await ContactSubmission.find({})
      .sort({ createdAt: -1 })
      .limit(500)
      .lean();

    return docs.map((d) => ({
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
    }));
  } catch (error) {
    console.error('Error fetching contact submissions:', error);
    return [];
  }
}

export default async function ContactSubmissionsPage() {
  const contacts = await getContacts();

  return (
    <div className="p-6 bg-[#0a0a0a] min-h-screen">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white mb-2">Contact Submissions</h1>
        <p className="text-gray-400">Messages submitted from the Contact page and brochure modal.</p>
      </div>

      <div className="bg-[#111111] border border-gray-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-[#0f0f0f]">
              <tr className="text-left text-gray-300">
                <th className="px-4 py-3 font-medium">Created</th>
                <th className="px-4 py-3 font-medium">Source</th>
                <th className="px-4 py-3 font-medium">Customer</th>
                <th className="px-4 py-3 font-medium">Details</th>
                <th className="px-4 py-3 font-medium">Message</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {contacts.length === 0 ? (
                <tr>
                  <td className="px-4 py-6 text-gray-400" colSpan={5}>
                    No contact submissions yet.
                  </td>
                </tr>
              ) : (
                contacts.map((c) => (
                  <tr key={c.id} className="text-gray-200 hover:bg-gray-900/40 align-top">
                    <td className="px-4 py-3 text-gray-400 whitespace-nowrap">
                      {c.createdAt ? c.createdAt.slice(0, 16).replace('T', ' ') : '—'}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="px-2 py-1 rounded-md bg-gray-800 text-gray-200 border border-gray-700">
                        {c.source || '—'}
                      </span>
                      {c.pagePath ? <div className="text-gray-500 text-xs mt-1">{c.pagePath}</div> : null}
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-medium text-white">{c.name || '—'}</div>
                      <div className="text-gray-400">{c.email || '—'}</div>
                      {c.phone ? <div className="text-gray-400">{c.phone}</div> : null}
                    </td>
                    <td className="px-4 py-3 text-gray-300">
                      {c.company ? <div><span className="text-gray-500">Company:</span> {c.company}</div> : null}
                      {c.propertyType ? <div><span className="text-gray-500">Property type:</span> {c.propertyType}</div> : null}
                    </td>
                    <td className="px-4 py-3 text-gray-300 max-w-[520px]">
                      <div className="whitespace-pre-wrap break-words">{c.message || '—'}</div>
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

