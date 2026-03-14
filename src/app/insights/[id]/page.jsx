import connectDB from '../../../lib/mongodb';
import Insight from '../../../lib/models/Insight';
import Header from '../../components/Header';
import { Calendar, Clock, User, ArrowLeft, Tag } from 'lucide-react';
import Link from 'next/link';

export default async function InsightDetailPage({ params }) {
    await connectDB();
    const { id } = params;

    let insight;
    try {
        insight = await Insight.findById(id).lean();
    } catch (e) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold mb-4">Insight not found</h1>
                    <Link href="/insights" className="text-gray-600 hover:text-black flex items-center gap-2">
                        <ArrowLeft size={20} /> Back to Insights
                    </Link>
                </div>
            </div>
        );
    }

    if (!insight) {
        return <div>Insight not found</div>;
    }

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <>
            <Header />
            <main className="min-h-screen bg-white">
                {/* Hero Section */}
                <header className="bg-gray-50 border-b border-gray-100 py-16 md:py-24">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <Link href="/insights" className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-900 mb-8 transition-colors">
                            <ArrowLeft size={20} />
                            Back to Insights
                        </Link>

                        <div className="max-w-4xl">
                            <div className="flex items-center gap-4 mb-6">
                                <span className="bg-gray-800 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                                    {insight.categoryName}
                                </span>
                                <span className="text-gray-400 text-sm flex items-center gap-1">
                                    <Clock size={16} />
                                    {insight.readTime}
                                </span>
                            </div>

                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-8">
                                {insight.title}
                            </h1>

                            <div className="flex flex-wrap items-center gap-8 border-t border-gray-200 pt-8">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center text-gray-600">
                                        <User size={24} />
                                    </div>
                                    <div>
                                        <p className="font-bold text-gray-900">{insight.author}</p>
                                        <p className="text-sm text-gray-500">{insight.authorRole || 'Contributor'}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 text-gray-500">
                                    <Calendar size={20} />
                                    <span>{formatDate(insight.date)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Article Content */}
                <article className="py-16 md:py-24">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="max-w-4xl mx-auto">
                            {insight.image && (
                                <div className="mb-12 rounded-2xl overflow-hidden shadow-2xl">
                                    <img src={insight.image} alt={insight.title} className="w-full h-auto" />
                                </div>
                            )}

                            <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
                                {/* If there's content, render it. Otherwise show excerpt as fallback */}
                                {insight.content ? (
                                    <div dangerouslySetInnerHTML={{ __html: insight.content.replace(/\n/g, '<br/>') }} />
                                ) : (
                                    <p className="text-xl italic text-gray-500">{insight.excerpt}</p>
                                )}
                            </div>

                            {/* Tags */}
                            {insight.tags && insight.tags.length > 0 && (
                                <div className="mt-16 pt-8 border-t border-gray-100 flex flex-wrap gap-2">
                                    {insight.tags.map((tag, index) => (
                                        <span key={index} className="flex items-center gap-1.5 bg-gray-50 text-gray-600 px-4 py-1.5 rounded-full text-sm">
                                            <Tag size={14} />
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </article>
            </main>
        </>
    );
}
