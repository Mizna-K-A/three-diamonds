import connectDB from '../../../../../lib/mongodb';
import Insight from '../../../../../lib/models/Insight';
import Header from '../../../components/Header';
import { Calendar, Clock, User, ArrowLeft, Edit2, Globe, Eye } from 'lucide-react';
import Link from 'next/link';

export default async function AdminInsightPreviewPage({ params }) {
    await connectDB();
    const { slug } = params;

    const insight = await Insight.findOne({ slug }).lean();

    if (!insight) {
        return (
            <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center text-white">
                <div className="text-center">
                    <h1 className="text-2xl font-bold mb-4">Insight not found</h1>
                    <Link href="/admin/insights" className="text-gray-400 hover:text-white flex items-center gap-2 justify-center">
                        <ArrowLeft size={20} /> Back to Admin
                    </Link>
                </div>
            </div>
        );
    }

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <div className="bg-[#0a0a0a] min-h-screen text-white pb-20">
            {/* Admin Toolbar */}
            <div className="sticky top-0 z-[60] bg-black/80 backdrop-blur-md border-b border-gray-800 px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/admin/insights" className="p-2 hover:bg-gray-800 rounded-lg transition-colors text-gray-400 hover:text-white">
                        <ArrowLeft size={20} />
                    </Link>
                    <div>
                        <h2 className="text-sm font-bold text-white tracking-tight">Admin Preview</h2>
                        <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest leading-none">Insight: {insight.slug}</p>
                    </div>
                </div>
                <div className="flex items-center gap-3 font-DM_Sans">
                    {/* <a
                        href={`/insights/${insight.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 bg-gray-900 border border-gray-800 text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-gray-800 transition-all"
                    >
                        <Globe size={14} />
                        View Live
                    </a> */}
                    <Link
                        href={`/admin/insights`}
                        className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 text-black px-4 py-2 rounded-xl text-xs font-bold shadow-lg shadow-amber-500/20 hover:scale-[1.02] active:scale-95 transition-all"
                    >
                        <Edit2 size={14} />
                        Back to Edit
                    </Link>
                </div>
            </div>

            <main className="mx-auto px-20 pt-12">
                {/* Visual Preview Mode Badge */}
                <div className="mb-12 flex justify-center">
                    <div className="bg-amber-500/10 text-amber-500 border border-amber-500/20 px-6 py-2 rounded-full text-xs font-bold uppercase tracking-[0.2em] flex items-center gap-3">
                        <Eye size={14} />
                        Visualization Mode
                    </div>
                </div>

                <div className="mx-auto">
                    <div className="space-y-6 mb-12">
                        <div className="flex items-center gap-3">
                            <span className="bg-gray-800 text-gray-400 text-[10px] font-black px-3 py-1 rounded-md uppercase tracking-widest border border-gray-700">
                                {insight.categoryName}
                            </span>
                            <span className="text-gray-600 text-xs flex items-center gap-1.5 font-medium">
                                <Clock size={14} />
                                {insight.readTime || '5 min read'}
                            </span>
                        </div>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight tracking-tighter">
                            {insight.title}
                        </h1>
                        <div className="flex items-center gap-4 pt-4">
                            <div className="w-12 h-12 rounded-xl bg-gray-900 border border-gray-800 flex items-center justify-center text-gray-500">
                                <User size={24} />
                            </div>
                            <div>
                                <p className="font-bold text-white leading-none mb-1">{insight.author}</p>
                                <p className="text-xs text-gray-600 font-medium">{insight.authorRole || 'Contributor'}</p>
                            </div>
                            <div className="ml-auto text-right">
                                <p className="text-[10px] text-gray-700 font-black uppercase tracking-widest mb-1">Created</p>
                                <p className="text-xs text-gray-500 font-bold">{formatDate(insight.date)}</p>
                            </div>
                        </div>
                    </div>

                    {insight.image && (
                        <div className="mb-16 rounded-[2rem] overflow-hidden shadow-2xl">
                            <img
                                src={insight.image}
                                alt={insight.title}
                                className="w-full h-auto object-cover opacity-90"
                                style={{ width: '40%', marginLeft: '30%' }}
                            />
                        </div>
                    )}

                    <div className="prose prose-invert prose-lg max-w-none prose-p:text-gray-400 prose-headings:text-white prose-p:leading-relaxed">
                        {insight.content ? (
                            <div dangerouslySetInnerHTML={{ __html: insight.content.replace(/\n/g, '<br/>') }} />
                        ) : (
                            <div className="p-8 bg-gray-900/30 rounded-3xl border border-gray-800 border-dashed text-center">
                                <p className="text-gray-500 italic">No full content provided. Showing excerpt fallback:</p>
                                <p className="mt-4 text-xl text-gray-300 font-medium">"{insight.excerpt}"</p>
                            </div>
                        )}
                    </div>

                    {insight.tags && insight.tags.length > 0 && (
                        <div className="mt-20 pt-10 border-t border-gray-900 flex flex-wrap gap-2">
                            {insight.tags.map((tag, index) => (
                                <span key={index} className="px-4 py-1.5 rounded-lg bg-gray-900 text-gray-500 text-xs font-bold border border-gray-800">
                                    #{tag}
                                </span>
                            ))}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
