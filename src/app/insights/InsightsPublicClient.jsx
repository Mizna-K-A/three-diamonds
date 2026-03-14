'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
    Calendar,
    Clock,
    User,
    ArrowRight,
    Search,
    TrendingUp,
    Home,
    Building,
    FileText,
    Newspaper,
    X
} from 'lucide-react';
import Header from '../components/Header';

export default function InsightsPublicClient({ initialInsights, currentCategory, currentSearch }) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [searchQuery, setSearchQuery] = useState(currentSearch);
    const [visibleArticles, setVisibleArticles] = useState(6);

    const categories = [
        { id: 'all', name: 'All Insights', icon: Newspaper },
        { id: 'market-reports', name: 'Market Reports', icon: TrendingUp },
        { id: 'investment', name: 'Investment', icon: TrendingUp },
        { id: 'residential', name: 'Residential', icon: Home },
        { id: 'commercial', name: 'Commercial', icon: Building },
        { id: 'industrial', name: 'Industrial', icon: Building },
        { id: 'sustainability', name: 'Sustainability', icon: FileText },
        { id: 'technology', name: 'Technology', icon: FileText },
        { id: 'luxury', name: 'Luxury', icon: Home }
    ];

    // Handle Category Filter via URL
    const handleCategoryChange = (categoryId) => {
        const params = new URLSearchParams(searchParams);
        if (categoryId === 'all') {
            params.delete('category');
        } else {
            params.set('category', categoryId);
        }
        router.push(`/insights?${params.toString()}`, { scroll: false });
    };

    // Handle Search via URL (with debounce or on Enter)
    const handleSearch = (e) => {
        if (e.key === 'Enter') {
            const params = new URLSearchParams(searchParams);
            if (searchQuery) {
                params.set('q', searchQuery);
            } else {
                params.delete('q');
            }
            router.push(`/insights?${params.toString()}`, { scroll: false });
        }
    };

    const featuredInsights = initialInsights.filter(item => item.featured);
    const trendingInsights = initialInsights.filter(item => item.trending).slice(0, 3);

    const displayedInsights = initialInsights.slice(0, visibleArticles);
    const hasMore = visibleArticles < initialInsights.length;

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-US', options);
    };

    const categoryName = categories.find(c => c.id === currentCategory)?.name || 'All Insights';

    return (
        <>
            <Header />
            <main className="min-h-screen bg-gray-50">
                {/* Hero Section */}
                <section className="relative bg-gradient-to-r from-black to-gray-900 text-white">
                    <div className="absolute inset-0 bg-black/60"></div>
                    <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
                        <div className="max-w-3xl">
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                                Insights & Analysis
                            </h1>
                            <p className="text-xl md:text-2xl text-gray-300 mb-8">
                                Expert perspectives on real estate markets, investment strategies, and industry trends
                            </p>

                            {/* Search Bar */}
                            <div className="relative max-w-xl">
                                <input
                                    type="text"
                                    placeholder="Search insights... (Press Enter)"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    onKeyDown={handleSearch}
                                    className="w-full px-6 py-4 pr-12 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-400 border border-gray-300 shadow-xl"
                                />
                                <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500" size={20} />
                            </div>
                        </div>
                    </div>
                </section>

                {/* Category Filter Bar */}
                <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="bg-white rounded-lg shadow-md p-4 border border-gray-200">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="font-semibold text-lg text-gray-800">Browse by Category</h2>
                            {currentCategory !== 'all' && (
                                <button
                                    onClick={() => handleCategoryChange('all')}
                                    className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900"
                                >
                                    <X size={16} />
                                    Clear filter
                                </button>
                            )}
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {categories.map((category) => {
                                const Icon = category.icon;
                                const isSelected = currentCategory === category.id;
                                return (
                                    <button
                                        key={category.id}
                                        onClick={() => handleCategoryChange(category.id)}
                                        className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${isSelected
                                            ? 'bg-gray-800 text-white shadow-md'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                            }`}
                                    >
                                        <Icon size={16} />
                                        <span>{category.name}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </section>

                {/* Main Content Areas */}
                <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
                    <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
                        {/* Sidebar - Trending */}
                        <aside className="lg:w-1/4">
                            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 sticky top-24">
                                <h3 className="font-semibold text-lg mb-4 flex items-center gap-2 text-gray-800">
                                    <TrendingUp className="text-gray-600" size={20} />
                                    Trending Now
                                </h3>
                                <div className="space-y-4">
                                    {trendingInsights.map((insight, index) => (
                                        <Link key={insight._id} href={`/insights/${insight._id}`} className="block group">
                                            <div className="flex gap-3">
                                                <span className="text-2xl font-bold text-gray-300 group-hover:text-gray-600 transition-colors">{index + 1}</span>
                                                <div>
                                                    <h4 className="font-medium text-gray-900 group-hover:text-gray-700 transition-colors line-clamp-2">{insight.title}</h4>
                                                    <div className="flex items-center gap-2 mt-1 text-sm text-gray-500">
                                                        <Calendar size={14} />
                                                        <span>{formatDate(insight.date)}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </aside>

                        {/* Articles Grid */}
                        <div className="lg:w-3/4">
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-800">{categoryName}</h2>
                                    {currentSearch && <p className="text-sm text-gray-500 mt-1">Results for "{currentSearch}"</p>}
                                </div>
                                <span className="text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                                    {initialInsights.length} {initialInsights.length === 1 ? 'article' : 'articles'}
                                </span>
                            </div>

                            {displayedInsights.length > 0 ? (
                                <>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {displayedInsights.map((insight) => (
                                            <article key={insight._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 border border-gray-200">
                                                <Link href={`/insights/${insight._id}`} className="block">
                                                    <div className="relative h-48 bg-gray-900">
                                                        {insight.image ? (
                                                            <img src={insight.image} alt={insight.title} className="w-full h-full object-cover opacity-80" />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center bg-gray-800 opacity-50">
                                                                <Newspaper size={48} className="text-white" />
                                                            </div>
                                                        )}
                                                        <div className="absolute top-4 left-4">
                                                            <span className="bg-black/60 backdrop-blur-md text-white text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider border border-white/20">
                                                                {insight.categoryName}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className="p-6">
                                                        <h3 className="text-xl font-bold mb-2 text-gray-900 line-clamp-2">{insight.title}</h3>
                                                        <p className="text-gray-600 mb-4 line-clamp-3 leading-relaxed">{insight.excerpt}</p>
                                                        <div className="flex items-center justify-between text-sm text-gray-500 border-t border-gray-50 pt-4">
                                                            <div className="flex items-center gap-2">
                                                                <User size={14} className="text-gray-400" />
                                                                <span className="font-medium text-gray-700">{insight.author}</span>
                                                            </div>
                                                            <div className="flex items-center gap-2">
                                                                <Calendar size={14} />
                                                                <span>{formatDate(insight.date)}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </Link>
                                            </article>
                                        ))}
                                    </div>
                                    {hasMore && (
                                        <div className="text-center mt-12">
                                            <button
                                                onClick={() => setVisibleArticles(prev => prev + 6)}
                                                className="inline-flex items-center gap-2 bg-gray-900 text-white px-10 py-3.5 rounded-xl hover:bg-black transition-all shadow-xl font-bold"
                                            >
                                                Load More Articles
                                                <ArrowRight size={18} />
                                            </button>
                                        </div>
                                    )}
                                </>
                            ) : (
                                <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100">
                                    <Search size={48} className="mx-auto text-gray-200 mb-4" />
                                    <h3 className="text-xl font-bold text-gray-800">No matching articles</h3>
                                    <p className="text-gray-500 mt-2">Try different keywords or browse another category.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </section>

                {/* Newsletter Subscription */}
                <section className="bg-black text-white py-20">
                    <div className="container mx-auto px-4 text-center">
                        <h2 className="text-3xl font-bold mb-4">Stay Informed on Market Shifts</h2>
                        <p className="text-gray-400 mb-10 max-w-xl mx-auto">Get exclusive real estate reports and investment analysis delivered to your inbox.</p>
                        <form className="max-w-md mx-auto flex gap-3">
                            <input
                                type="email"
                                placeholder="Your email address"
                                className="flex-1 bg-gray-900 border border-gray-800 rounded-xl px-5 py-3 outline-none focus:border-gray-600 transition-all"
                                required
                            />
                            <button className="bg-white text-black px-8 py-3 rounded-xl font-bold hover:bg-gray-200 transition-all">Subscribe</button>
                        </form>
                    </div>
                </section>
            </main>
        </>
    );
}
