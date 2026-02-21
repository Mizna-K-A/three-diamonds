// app/insights/page.jsx
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
    Calendar,
    Clock,
    User,
    ArrowRight,
    Filter,
    Search,
    TrendingUp,
    Home,
    Building,
    FileText,
    Newspaper,
    Download,
    Share2,
    Bookmark,
    ChevronRight,
    Tag,
    Eye,
    X
} from 'lucide-react';
import Header from '../components/Header';

export default function InsightsPage() {
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [visibleArticles, setVisibleArticles] = useState(6);

    // Sample insights data
    const insights = [
        {
            id: 1,
            title: "Q4 2024 Real Estate Market Report: Trends and Forecasts",
            excerpt: "Comprehensive analysis of market performance, emerging trends, and predictions for the coming year in the real estate sector.",
            category: "market-reports",
            categoryName: "Market Reports",
            date: "2024-12-15",
            readTime: "8 min read",
            author: "Sarah Johnson",
            authorRole: "Senior Market Analyst",
            image: "/images/insights/market-report.jpg",
            featured: true,
            trending: true,
            views: 1245,
            tags: ["Market Analysis", "Forecast", "Q4 2024"]
        },
        {
            id: 2,
            title: "Investment Strategies for Commercial Real Estate in 2025",
            excerpt: "Expert insights on commercial real estate investment opportunities and strategies for the upcoming year.",
            category: "investment",
            categoryName: "Investment",
            date: "2024-12-10",
            readTime: "6 min read",
            author: "Michael Chen",
            authorRole: "Investment Director",
            image: "/images/insights/investment.jpg",
            featured: false,
            trending: true,
            views: 987,
            tags: ["Investment", "Commercial", "Strategy"]
        },
        {
            id: 3,
            title: "Sustainable Building Practices: The Future of Development",
            excerpt: "How green building practices are shaping the future of real estate development and attracting environmentally conscious investors.",
            category: "sustainability",
            categoryName: "Sustainability",
            date: "2024-12-05",
            readTime: "5 min read",
            author: "Emma Watson",
            authorRole: "Sustainability Consultant",
            image: "/images/insights/sustainability.jpg",
            featured: false,
            trending: false,
            views: 756,
            tags: ["Sustainability", "Green Building", "Development"]
        },
        {
            id: 4,
            title: "Residential Market Trends: First-Time Buyers Guide",
            excerpt: "Essential guide for first-time home buyers navigating today's market conditions and mortgage landscape.",
            category: "residential",
            categoryName: "Residential",
            date: "2024-11-28",
            readTime: "4 min read",
            author: "David Miller",
            authorRole: "Residential Specialist",
            image: "/images/insights/residential.jpg",
            featured: true,
            trending: false,
            views: 1543,
            tags: ["Residential", "First-Time Buyers", "Mortgage"]
        },
        {
            id: 5,
            title: "Industrial Real Estate: E-commerce Boom Continues",
            excerpt: "Analysis of how e-commerce growth is driving demand for industrial and logistics properties across the country.",
            category: "industrial",
            categoryName: "Industrial",
            date: "2024-11-20",
            readTime: "7 min read",
            author: "Robert Taylor",
            authorRole: "Industrial Specialist",
            image: "/images/insights/industrial.jpg",
            featured: false,
            trending: true,
            views: 876,
            tags: ["Industrial", "Logistics", "E-commerce"]
        },
        {
            id: 6,
            title: "Luxury Real Estate Market: High-End Property Trends",
            excerpt: "Exploring the latest trends in luxury real estate, from smart homes to exclusive amenities and locations.",
            category: "luxury",
            categoryName: "Luxury",
            date: "2024-11-15",
            readTime: "6 min read",
            author: "Patricia Adams",
            authorRole: "Luxury Property Specialist",
            image: "/images/insights/luxury.jpg",
            featured: false,
            trending: false,
            views: 654,
            tags: ["Luxury", "High-End", "Premium Properties"]
        },
        {
            id: 7,
            title: "Property Technology: How AI is Transforming Real Estate",
            excerpt: "Discover how artificial intelligence and prop-tech innovations are revolutionizing property management and transactions.",
            category: "technology",
            categoryName: "Technology",
            date: "2024-11-10",
            readTime: "5 min read",
            author: "James Wilson",
            authorRole: "Tech Innovation Lead",
            image: "/images/insights/technology.jpg",
            featured: false,
            trending: true,
            views: 1123,
            tags: ["PropTech", "AI", "Innovation"]
        },
        {
            id: 8,
            title: "Navigating Commercial Leases: A Tenant's Guide",
            excerpt: "Comprehensive guide for businesses looking to lease commercial space, including negotiation tips and key considerations.",
            category: "commercial",
            categoryName: "Commercial",
            date: "2024-11-05",
            readTime: "8 min read",
            author: "Lisa Brown",
            authorRole: "Commercial Leasing Expert",
            image: "/images/insights/commercial-lease.jpg",
            featured: false,
            trending: false,
            views: 789,
            tags: ["Commercial", "Leasing", "Tenant Guide"]
        }
    ];

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

    const featuredInsights = insights.filter(item => item.featured);
    const trendingInsights = insights.filter(item => item.trending).slice(0, 3);

    // Filter insights based on category and search
    const filteredInsights = insights.filter(insight => {
        const matchesCategory = selectedCategory === 'all' || insight.category === selectedCategory;
        const matchesSearch = insight.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            insight.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
            insight.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
        return matchesCategory && matchesSearch;
    });

    const displayedInsights = filteredInsights.slice(0, visibleArticles);
    const hasMore = visibleArticles < filteredInsights.length;

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-US', options);
    };

    // Get current category name
    const currentCategory = categories.find(c => c.id === selectedCategory)?.name || 'All Insights';

    return (
        <>
            <Header />
            <main className="min-h-screen bg-gray-50">
                {/* Hero Section - Black & Grey */}
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
                                    placeholder="Search insights..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full px-6 py-4 pr-12 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-400 border border-gray-300"
                                />
                                <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500" size={20} />
                            </div>
                        </div>
                    </div>
                </section>

                {/* Category Filter Bar - Moved to top */}
                <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="bg-white rounded-lg shadow-md p-4 border border-gray-200">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="font-semibold text-lg text-gray-800">Browse by Category</h2>
                            {selectedCategory !== 'all' && (
                                <button
                                    onClick={() => setSelectedCategory('all')}
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
                                const isSelected = selectedCategory === category.id;
                                return (
                                    <button
                                        key={category.id}
                                        onClick={() => setSelectedCategory(category.id)}
                                        className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                                            isSelected 
                                                ? 'bg-gray-800 text-white shadow-md' 
                                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}
                                    >
                                        <Icon size={16} />
                                        <span>{category.name}</span>
                                        {isSelected && (
                                            <span className="ml-1 text-xs bg-white text-gray-800 px-1.5 rounded-full">
                                                {filteredInsights.length}
                                            </span>
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </section>

                {/* Featured Insights Section */}
                {featuredInsights.length > 0 && selectedCategory === 'all' && !searchQuery && (
                    <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                        <div className="mb-6">
                            <h2 className="text-2xl font-bold text-gray-800">Featured Insights</h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {featuredInsights.map((insight) => (
                                <Link
                                    key={insight.id}
                                    href={`/insights/${insight.id}`}
                                    className="group bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 border border-gray-200"
                                >
                                    <div className="relative h-48 bg-gray-200">
                                        <div className="absolute inset-0 bg-gradient-to-br from-gray-700 to-gray-900 opacity-75 group-hover:opacity-90 transition-opacity"></div>
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <span className="text-white font-semibold">Featured Insight</span>
                                        </div>
                                        <div className="absolute top-4 left-4">
                                            <span className="bg-black text-white text-xs font-semibold px-3 py-1 rounded-full">
                                                {insight.categoryName}
                                            </span>
                                        </div>
                                        <div className="absolute top-4 right-4">
                                            <span className="bg-gray-800 text-white text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1">
                                                <TrendingUp size={12} />
                                                Featured
                                            </span>
                                        </div>
                                    </div>
                                    <div className="p-6">
                                        <h3 className="text-xl font-semibold mb-2 group-hover:text-gray-700 transition-colors line-clamp-2 text-gray-800">
                                            {insight.title}
                                        </h3>
                                        <p className="text-gray-600 mb-4 line-clamp-3">
                                            {insight.excerpt}
                                        </p>
                                        <div className="flex items-center justify-between text-sm text-gray-500">
                                            <div className="flex items-center gap-2">
                                                <User size={14} />
                                                <span>{insight.author}</span>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <span className="flex items-center gap-1">
                                                    <Calendar size={14} />
                                                    {formatDate(insight.date)}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <Clock size={14} />
                                                    {insight.readTime}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </section>
                )}

                {/* Main Content - Insights Grid */}
                <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
                    <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
                        {/* Sidebar - Trending Now only */}
                        <aside className="lg:w-1/4">
                            {/* Trending Now */}
                            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 sticky top-24">
                                <h3 className="font-semibold text-lg mb-4 flex items-center gap-2 text-gray-800">
                                    <TrendingUp className="text-gray-600" size={20} />
                                    Trending Now
                                </h3>
                                <div className="space-y-4">
                                    {trendingInsights.map((insight, index) => (
                                        <Link
                                            key={insight.id}
                                            href={`/insights/${insight.id}`}
                                            className="block group"
                                        >
                                            <div className="flex gap-3">
                                                <span className="text-2xl font-bold text-gray-300 group-hover:text-gray-600 transition-colors">
                                                    {index + 1}
                                                </span>
                                                <div>
                                                    <h4 className="font-medium text-gray-900 group-hover:text-gray-700 transition-colors line-clamp-2">
                                                        {insight.title}
                                                    </h4>
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

                        {/* Main Content Area */}
                        <div className="lg:w-3/4">
                            {/* Insights Header */}
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-800">
                                        {currentCategory}
                                    </h2>
                                    {selectedCategory !== 'all' && (
                                        <p className="text-sm text-gray-600 mt-1">
                                            Showing {filteredInsights.length} {filteredInsights.length === 1 ? 'article' : 'articles'}
                                        </p>
                                    )}
                                </div>
                                <span className="text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                                    {filteredInsights.length} {filteredInsights.length === 1 ? 'article' : 'articles'}
                                </span>
                            </div>

                            {/* Insights Grid */}
                            {displayedInsights.length > 0 ? (
                                <>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {displayedInsights.map((insight) => (
                                            <article
                                                key={insight.id}
                                                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 border border-gray-200"
                                            >
                                                <Link href={`/insights/${insight.id}`} className="block">
                                                    <div className="relative h-48 bg-gray-200">
                                                        <div className="absolute inset-0 bg-gradient-to-br from-gray-700 to-gray-900 opacity-50"></div>
                                                        <div className="absolute inset-0 flex items-center justify-center">
                                                            <span className="text-white font-semibold opacity-75">Insight Image</span>
                                                        </div>
                                                        <div className="absolute top-4 left-4">
                                                            <span className="bg-gray-800 text-white text-xs font-semibold px-3 py-1 rounded-full">
                                                                {insight.categoryName}
                                                            </span>
                                                        </div>
                                                        {insight.trending && (
                                                            <div className="absolute top-4 right-4">
                                                                <span className="bg-gray-700 text-white text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1">
                                                                    <TrendingUp size={12} />
                                                                    Trending
                                                                </span>
                                                            </div>
                                                        )}
                                                    </div>

                                                    <div className="p-6">
                                                        <h3 className="text-xl font-semibold mb-2 hover:text-gray-700 transition-colors line-clamp-2 text-gray-800">
                                                            {insight.title}
                                                        </h3>
                                                        <p className="text-gray-600 mb-4 line-clamp-3">
                                                            {insight.excerpt}
                                                        </p>

                                                        <div className="flex flex-wrap gap-2 mb-4">
                                                            {insight.tags.map((tag, index) => (
                                                                <span
                                                                    key={index}
                                                                    className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full"
                                                                >
                                                                    {tag}
                                                                </span>
                                                            ))}
                                                        </div>

                                                        <div className="flex items-center justify-between text-sm text-gray-500 border-t border-gray-100 pt-4">
                                                            <div className="flex items-center gap-2">
                                                                <User size={14} />
                                                                <span>{insight.author}</span>
                                                            </div>
                                                            <div className="flex items-center gap-3">
                                                                <span className="flex items-center gap-1">
                                                                    <Calendar size={14} />
                                                                    {formatDate(insight.date)}
                                                                </span>
                                                                <span className="flex items-center gap-1">
                                                                    <Clock size={14} />
                                                                    {insight.readTime}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </Link>
                                            </article>
                                        ))}
                                    </div>

                                    {/* Load More Button */}
                                    {hasMore && (
                                        <div className="text-center mt-10">
                                            <button
                                                onClick={() => setVisibleArticles(prev => prev + 6)}
                                                className="inline-flex items-center gap-2 bg-gray-800 text-white px-8 py-3 rounded-lg hover:bg-gray-900 transition-colors duration-300 font-semibold"
                                            >
                                                Load More Articles
                                                <ArrowRight size={18} />
                                            </button>
                                        </div>
                                    )}
                                </>
                            ) : (
                                <div className="text-center py-12 bg-white rounded-lg shadow-md border border-gray-200">
                                    <Newspaper size={48} className="mx-auto text-gray-400 mb-4" />
                                    <h3 className="text-xl font-semibold text-gray-800 mb-2">No insights found</h3>
                                    <p className="text-gray-600">
                                        Try adjusting your search or filter to find what you're looking for.
                                    </p>
                                    {selectedCategory !== 'all' && (
                                        <button
                                            onClick={() => setSelectedCategory('all')}
                                            className="mt-4 text-gray-600 hover:text-gray-900 underline"
                                        >
                                            View all insights
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </section>

                {/* Newsletter Section */}
                <section className="bg-gradient-to-r from-black to-gray-900 text-white py-16">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">
                            Stay Informed
                        </h2>
                        <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                            Subscribe to our newsletter and receive the latest market insights and industry news directly in your inbox.
                        </p>
                        <form className="max-w-md mx-auto flex flex-col sm:flex-row gap-4">
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="flex-1 px-6 py-3 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-400 border border-gray-300"
                                required
                            />
                            <button
                                type="submit"
                                className="bg-white text-gray-900 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-300 whitespace-nowrap"
                            >
                                Subscribe
                            </button>
                        </form>
                        <p className="text-sm text-gray-400 mt-4">
                            We respect your privacy. Unsubscribe at any time.
                        </p>
                    </div>
                </section>
            </main>
        </>
    );
}