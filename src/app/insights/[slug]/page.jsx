import connectDB from '../../../../lib/mongodb';
import Insight from '../../../../lib/models/Insight';
import Header from '../../components/Header';
import { Calendar, Clock, User, ArrowLeft, Tag, Share2, Facebook, Twitter, Linkedin, Building2 } from 'lucide-react';
import Link from 'next/link';

export async function generateMetadata({ params }) {
    await connectDB();
    const { slug } = params;
    const insight = await Insight.findOne({ slug }).lean();

    if (!insight) return { title: 'Insight Not Found | Three Diamonds' };

    return {
        title: `${insight.title} | Three Diamonds Insights`,
        description: insight.excerpt,
        openGraph: {
            title: insight.title,
            description: insight.excerpt,
            images: [insight.image],
            type: 'article',
        },
    };
}

export default async function InsightDetailPage({ params }) {
    await connectDB();
    const { slug } = params;

    const insight = await Insight.findOne({ slug }).lean();

    if (!insight) {
        return (
            <div className="min-h-screen bg-[#050505] flex items-center justify-center text-white p-6">
                <div className="text-center max-w-md">
                    <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-8 border border-red-500/20 text-red-500">
                        <ArrowLeft size={40} />
                    </div>
                    <h1 className="text-4xl font-bold mb-4 tracking-tight">Post Not Found</h1>
                    <p className="text-gray-500 mb-10 leading-relaxed">The insight you're looking for might have been moved, deleted, or is temporarily unavailable.</p>
                    <Link href="/insights" className="inline-flex items-center gap-2 bg-white text-black px-8 py-4 rounded-2xl font-bold hover:bg-gray-200 transition-all shadow-xl">
                        <ArrowLeft size={20} /> Back to Insights
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
        <>
            <Header dark />

            <div className="bg-[#050505] text-white min-h-screen selection:bg-amber-500/30 selection:text-amber-200 overflow-x-hidden pt-20">

                {/* Background Glows */}
                <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
                    <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-amber-500/5 blur-[150px] rounded-full translate-x-1/2 -translate-y-1/2 opacity-30"></div>
                    <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-500/5 blur-[120px] rounded-full -translate-x-1/2 translate-y-1/2 opacity-20"></div>
                </div>

                <main>
                    {/* Hero Section */}
                    <header className="relative pt-12 md:pt-20 pb-16 md:pb-24 overflow-hidden">
                        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                            <div className="mx-auto">
                                <Link href="/insights" className="group inline-flex items-center gap-3 text-gray-500 hover:text-white mb-10 transition-all duration-300">
                                    <div className="p-2 rounded-xl bg-gray-900 border border-gray-800 group-hover:bg-gray-800 transition-colors">
                                        <ArrowLeft size={18} />
                                    </div>
                                    <span className="font-medium tracking-wide">Back to All Insights</span>
                                </Link>

                                <div className="flex flex-wrap items-center gap-4 mb-8">
                                    <span className="bg-amber-500/10 text-amber-400 text-xs font-bold px-4 py-1.5 rounded-full border border-amber-500/20 uppercase tracking-[2px]">
                                        {insight.categoryName}
                                    </span>
                                    <div className="flex items-center gap-4 text-gray-500 text-sm font-medium">
                                        <span className="flex items-center gap-2">
                                            <Clock size={16} className="text-gray-600" />
                                            {insight.readTime || '5 min read'}
                                        </span>
                                        <span className="w-1 h-1 bg-gray-700 rounded-full"></span>
                                        <span className="flex items-center gap-2 text-gray-500">
                                            <Building2 size={16} className="text-gray-600" />
                                            Three Diamonds
                                        </span>
                                    </div>
                                </div>

                                <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold text-white leading-[1.15] mb-10 tracking-tight">
                                    {insight.title}
                                </h1>

                                <div className="flex flex-wrap items-center justify-between gap-8 pt-10 border-t border-gray-800/50 mt-10">
                                    <div className="flex items-center gap-4">
                                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 flex items-center justify-center text-amber-500 shadow-2xl relative">
                                            <User size={28} />
                                            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 border-4 border-[#0a0a0a] rounded-full"></div>
                                        </div>
                                        <div>
                                            <p className="font-bold text-white text-lg tracking-tight">{insight.author}</p>
                                            <p className="text-sm text-gray-500 font-medium uppercase tracking-wider">{insight.authorRole || 'Analyst'}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-6">
                                        <div className="text-right hidden sm:block">
                                            <p className="text-xs text-gray-600 font-bold uppercase tracking-widest mb-1">Published</p>
                                            <p className="text-white font-semibold flex items-center gap-2 justify-end uppercase text-sm tracking-tight">
                                                <Calendar size={14} className="text-amber-500/50" />
                                                {formatDate(insight.date)}
                                            </p>
                                        </div>
                                        <div className="w-px h-10 bg-gray-800 hidden sm:block"></div>
                                        <div className="flex items-center gap-3">
                                            {[Facebook, Twitter, Linkedin].map((Icon, i) => (
                                                <button key={i} className="w-10 h-10 rounded-xl bg-gray-900 border border-gray-800 flex items-center justify-center text-gray-400 hover:text-white hover:bg-gray-800 transition-all duration-300">
                                                    <Icon size={18} />
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </header>

                    {/* Featured Image */}
                    <div className="container mx-auto px-4">
                        {insight.image && (
                            <div className="relative group overflow-hidden rounded-[2.5rem] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.8)] border border-gray-800">
                                <img
                                    src={insight.image}
                                    alt={insight.title}
                                    className="w-full h-auto aspect-[21/9] object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity"></div>
                            </div>
                        )}
                    </div>

                    {/* Article Content */}
                    <article className="py-20 md:py-32 relative">
                        <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row gap-16">
                            {/* Sidebar Left - Floating Nav or Details */}
                            <div className="lg:w-1/4 hidden lg:block">
                                <div className="sticky top-32 space-y-12">
                                    <div>
                                        <h4 className="text-xs font-bold text-gray-600 uppercase tracking-widest mb-6">Article Excerpt</h4>
                                        <p className="text-gray-400 text-sm leading-relaxed italic border-l-2 border-amber-500/30 pl-4 py-2">
                                            "{insight.excerpt}"
                                        </p>
                                    </div>

                                    <div>
                                        <h4 className="text-xs font-bold text-gray-600 uppercase tracking-widest mb-6">Contact Us</h4>
                                        <div className="bg-gradient-to-br from-gray-900 to-black p-6 rounded-2xl border border-gray-800 shadow-xl">
                                            <p className="text-sm font-semibold mb-4 text-gray-300">Interested in this market?</p>
                                            <Link href="/contact" className="block text-center bg-white text-black text-xs font-bold py-3 rounded-xl hover:bg-gray-200 transition-all uppercase tracking-wider">
                                                Speak to an Advisor
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Main Body */}
                            <div className="lg:w-2/4">
                                <div className="prose prose-invert prose-lg max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-a:text-amber-400 hover:prose-a:text-amber-300 prose-blockquote:border-amber-500/30 prose-blockquote:bg-amber-500/[0.03] prose-blockquote:py-2 prose-blockquote:px-6 prose-blockquote:rounded-r-2xl prose-img:rounded-3xl prose-p:text-gray-300 prose-p:leading-[1.8] prose-p:text-[1.125rem]">
                                    {insight.content ? (
                                        <div dangerouslySetInnerHTML={{ __html: insight.content.replace(/\n/g, '<br/>') }} />
                                    ) : (
                                        <p className="text-2xl leading-relaxed text-gray-400 font-medium italic underline decoration-amber-500/20 underline-offset-8 decoration-4">
                                            {insight.excerpt}
                                        </p>
                                    )}
                                </div>

                                {/* Tags Section */}
                                {insight.tags && insight.tags.length > 0 && (
                                    <div className="mt-24 pt-10 border-t border-gray-900 flex flex-wrap gap-3">
                                        <span className="w-full text-xs font-bold text-gray-600 uppercase tracking-widest mb-2 flex items-center gap-2">
                                            <Tag size={12} className="text-amber-500/50" />
                                            Article Tags
                                        </span>
                                        {insight.tags.map((tag, index) => (
                                            <Link
                                                key={index}
                                                href={`/insights?q=${tag}`}
                                                className="px-5 py-2.5 rounded-xl bg-gray-900/50 border border-gray-800 text-gray-400 text-sm hover:border-amber-500/30 hover:text-white hover:bg-gray-800 transition-all duration-300 group"
                                            >
                                                <span className="text-amber-500/0 group-hover:text-amber-500/100 transition-all duration-300">#</span> {tag}
                                            </Link>
                                        ))}
                                    </div>
                                )}

                                {/* Author Card Mobile/Tablet */}
                                <div className="mt-24 bg-gradient-to-br from-gray-900 to-black p-8 rounded-[2rem] border border-gray-800 flex items-center gap-6 shadow-2xl relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 p-8 text-gray-900 group-hover:text-amber-500/10 transition-colors pointer-events-none">
                                        <User size={120} strokeWidth={1} />
                                    </div>
                                    <div className="w-20 h-20 rounded-[1.5rem] bg-amber-500/10 flex items-center justify-center text-amber-500 shrink-0 border border-amber-500/20 relative z-10">
                                        <User size={40} />
                                    </div>
                                    <div className="relative z-10">
                                        <h5 className="font-bold text-xl mb-1 text-white">{insight.author}</h5>
                                        <p className="text-amber-500/70 text-sm font-bold uppercase tracking-widest mb-3">{insight.authorRole || 'Market Analyst'}</p>
                                        <p className="text-gray-400 text-sm leading-relaxed max-w-sm">
                                            Expert contributor specialized in {insight.categoryName.toLowerCase()} and real estate analytics.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Sidebar Right - Related or Actions */}
                            <div className="lg:w-1/4">
                                <div className="sticky top-32 space-y-12">
                                    <div className="p-8 bg-amber-500 rounded-[2rem] text-black shadow-[0_20px_50px_rgba(245,158,11,0.2)]">
                                        <h4 className="text-2xl font-black mb-4 leading-tight">Insightful?</h4>
                                        <p className="font-medium mb-8 opacity-80 leading-relaxed">Share this report with your network or colleagues.</p>
                                        <button className="w-full bg-black text-white px-6 py-4 rounded-2xl font-bold flex items-center justify-center gap-3 hover:translate-y-[-4px] transition-all shadow-xl active:scale-95">
                                            <Share2 size={20} />
                                            Share Report
                                        </button>
                                    </div>

                                    <div className="group overflow-hidden rounded-[2rem] border border-gray-800 bg-gray-900/20 backdrop-blur-md">
                                        <div className="p-8">
                                            <h4 className="font-bold text-white mb-6 uppercase tracking-widest text-xs">Stay Updated</h4>
                                            <p className="text-gray-400 text-sm mb-6 leading-relaxed">Join 2,500+ investors receiving our weekly market intelligence report.</p>
                                            <div className="relative">
                                                <input
                                                    type="email"
                                                    placeholder="Email Address"
                                                    className="w-full bg-black/40 border border-gray-800 rounded-xl px-4 py-3 text-sm focus:border-amber-500/50 outline-none placeholder:text-gray-600 transition-all"
                                                />
                                                <button className="mt-3 w-full bg-gray-100 text-black font-extrabold text-xs py-3 rounded-xl hover:bg-white transition-all uppercase tracking-widest">
                                                    Subscribe
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </article>

                    {/* Footer Insight CTA */}
                    <section className="bg-gray-950/50 border-y border-gray-900 py-24 mt-20 relative overflow-hidden">
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[500px] bg-amber-500/5 blur-[120px] rounded-full opacity-50"></div>
                        <div className="container mx-auto px-4 relative z-10 text-center max-w-4xl">
                            <span className="text-amber-500 font-black uppercase tracking-[0.3em] text-xs mb-8 block">Ready for more?</span>
                            <h2 className="text-4xl md:text-6xl font-bold text-white mb-10 leading-[1.1] tracking-tighter">Explore the latest market movements with our experts.</h2>
                            <div className="flex flex-wrap justify-center gap-6">
                                <Link href="/insights" className="bg-white text-black px-10 py-5 rounded-2xl font-black hover:bg-gray-200 transition-all shadow-2xl flex items-center gap-3">
                                    View All Case Studies
                                </Link>
                                <Link href="/contact" className="bg-transparent text-white border border-gray-800 backdrop-blur-md px-10 py-5 rounded-2xl font-black hover:bg-gray-900 transition-all flex items-center gap-3">
                                    Request Custom Analysis
                                </Link>
                            </div>
                        </div>
                    </section>
                </main>
            </div>
        </>
    );
}

