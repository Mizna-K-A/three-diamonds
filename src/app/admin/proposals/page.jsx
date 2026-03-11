import connectDB from '../../../../lib/mongodb';
import ProposalRequest from '../../../../lib/models/ProposalRequest';
import Link from 'next/link';

async function getProposals() {
    try {
        await connectDB();
        const docs = await ProposalRequest.find({})
            .sort({ createdAt: -1 })
            .limit(500)
            .lean();

        // Get counts for stats
        const totalCount = await ProposalRequest.countDocuments();
        const todayCount = await ProposalRequest.countDocuments({
            createdAt: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) }
        });

        // Get status counts
        const statusCounts = await ProposalRequest.aggregate([
            { $group: { _id: "$status", count: { $sum: 1 } } }
        ]);

        return {
            proposals: docs.map((d) => ({
                id: d._id.toString(),
                propertyId: d.propertyId?.toString?.() || '',
                propertyTitle: d.propertyTitle || '',
                name: d.name || '',
                email: d.email || '',
                phone: d.phone || '',
                status: d.status || 'new',
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
        console.error('Error fetching proposal requests:', error);
        return {
            proposals: [],
            stats: { total: 0, today: 0, shown: 0, byStatus: {} }
        };
    }
}

function StatusBadge({ status }) {
    const statusConfig = {
        new: { bg: 'bg-blue-500/20', text: 'text-blue-300', border: 'border-blue-500/30', dot: 'bg-blue-400', label: 'New' },
        processed: { bg: 'bg-yellow-500/20', text: 'text-yellow-300', border: 'border-yellow-500/30', dot: 'bg-yellow-400', label: 'Processed' },
        completed: { bg: 'bg-green-500/20', text: 'text-green-300', border: 'border-green-500/30', dot: 'bg-green-400', label: 'Completed' },
    };

    const config = statusConfig[status?.toLowerCase()] || statusConfig.new;

    return (
        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text} border ${config.border}`}>
            <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${config.dot}`}></span>
            {config.label}
        </span>
    );
}

export default async function ProposalRequestsPage() {
    const { proposals, stats } = await getProposals();

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-950 via-[#0a0a0a] to-gray-900">
            {/* Header with gradient */}
            <div className="border-b border-gray-800/50 bg-black/20 backdrop-blur-sm sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                                Proposal Requests
                            </h1>
                            <p className="text-gray-400 mt-1 flex items-center gap-2">
                                <span className="inline-block w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                                Lead submissions for property documents and proposals
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
                                        Created
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                                        Property
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                                        Customer
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                                        Contact Details
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                                        Status
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-800/60">
                                {proposals.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-16 text-center">
                                            <div className="flex flex-col items-center justify-center text-gray-400">
                                                <svg className="w-12 h-12 mb-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                </svg>
                                                <p className="text-lg font-medium text-gray-300">No proposal requests yet</p>
                                                <p className="text-sm text-gray-500 mt-1">Downloading proposals will trigger requests here</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    proposals.map((v, index) => (
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
                                                        </Link>
                                                    ) : (
                                                        <span className="text-gray-300">{v.propertyTitle || '—'}</span>
                                                    )}
                                                </div>
                                            </td>

                                            <td className="px-6 py-4">
                                                <span className="font-medium text-white">{v.name || '—'}</span>
                                            </td>

                                            <td className="px-6 py-4">
                                                <div className="flex flex-col gap-1">
                                                    {v.email && (
                                                        <a href={`mailto:${v.email}`} className="text-sm text-gray-400 hover:text-blue-400 transition-colors flex items-center gap-1">
                                                            {v.email}
                                                        </a>
                                                    )}
                                                    {v.phone && (
                                                        <a href={`tel:${v.phone}`} className="text-sm text-gray-400 hover:text-blue-400 transition-colors flex items-center gap-1">
                                                            {v.phone}
                                                        </a>
                                                    )}
                                                </div>
                                            </td>

                                            <td className="px-6 py-4">
                                                <StatusBadge status={v.status} />
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
