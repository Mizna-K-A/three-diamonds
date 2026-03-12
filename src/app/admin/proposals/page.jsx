import connectDB from '../../../../lib/mongodb';
import ProposalRequest from '../../../../lib/models/ProposalRequest';
import ProposalRequestsClient from './ProposalRequestsClient';

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
                agentName: d.agentName || '',
                agentEmail: d.agentEmail || '',
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
        <div className="min-h-screen bg-gradient-to-br from-gray-950 via-[#0a0a0a] to-gray-900 text-white">
            {/* Header with gradient */}
            <div className="border-b border-gray-800/50 bg-black/20 backdrop-blur-sm sticky top-0 z-10">
                <div className="px-4 sm:px-6 lg:px-8 py-6">
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
                        <div className="flex gap-3 text-white">
                            <div className="px-4 py-2 rounded-xl bg-gray-900/50 border border-gray-800 backdrop-blur-sm">
                                <div className="text-xs text-gray-400">Today</div>
                                <div className="text-xl font-semibold">{stats.today}</div>
                            </div>
                            <div className="px-4 py-2 rounded-xl bg-gray-900/50 border border-gray-800 backdrop-blur-sm">
                                <div className="text-xs text-gray-400">Total</div>
                                <div className="text-xl font-semibold">{stats.total}</div>
                            </div>
                        </div>
                    </div>

                    {/* Status chips and quick stats */}
                    <div className="flex flex-wrap items-center gap-3 mt-4">
                        {Object.entries(stats.byStatus).map(([status, count]) => (
                            <div key={status} className="flex items-center gap-2 px-3 py-1 rounded-full bg-gray-800/50 border border-gray-700">
                                <StatusBadge status={status} />
                                <span className="text-sm font-medium">{count}</span>
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
                <ProposalRequestsClient initialProposals={proposals} />
            </div>
        </div>
    );
}
