'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
    Building2,
    MessageSquare,
    Calendar,
    FileText,
    ChevronRight,
    Clock,
    ArrowUpRight
} from 'lucide-react';

const iconMap = {
    'properties': Building2,
    'contacts': MessageSquare,
    'viewings': Calendar,
    'proposals': FileText,
};

const gradientMap = {
    'properties': 'from-blue-500 to-cyan-400',
    'contacts': 'from-purple-500 to-pink-500',
    'viewings': 'from-amber-400 to-orange-500',
    'proposals': 'from-emerald-400 to-teal-500',
};

const bgMap = {
    'properties': 'bg-blue-500/10',
    'contacts': 'bg-purple-500/10',
    'viewings': 'bg-amber-400/10',
    'proposals': 'bg-emerald-500/10',
};

const DashboardClient = ({ stats, allActivity }) => {
    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        show: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 300, damping: 24 } }
    };

    return (
        <div className="space-y-8 p-10">
            {/* Page Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="flex items-center justify-between"
            >
                <div>
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                        Dashboard Overview
                    </h1>
                    <p className="mt-2 text-sm text-gray-400">
                        Welcome back! Here&apos;s a quick snapshot of your application&apos;s recent performance.
                    </p>
                </div>
            </motion.div>

            {/* Stats Grid */}
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="show"
                className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
            >
                {stats.map((stat) => {
                    const Icon = iconMap[stat.id] || Building2;
                    const gradient = gradientMap[stat.id] || 'from-gray-500 to-gray-400';
                    const bgClassName = bgMap[stat.id] || 'bg-gray-500/10';

                    return (
                        <motion.div key={stat.id} variants={itemVariants}>
                            <Link href={stat.link} className="block group h-full">
                                <div className={`relative overflow-hidden rounded-2xl border border-white/10 bg-black/40 backdrop-blur-md p-6 h-full transition-all duration-300 hover:border-white/20 hover:bg-black/60 hover:shadow-[0_8px_30px_rgb(0,0,0,0.5)]`}>
                                    {/* Background Glow */}
                                    <div className={`absolute -right-6 -top-6 w-24 h-24 rounded-full blur-3xl opacity-20 bg-gradient-to-br ${gradient} group-hover:opacity-40 transition-opacity duration-500`} />

                                    <div className="flex justify-between items-start">
                                        <div className={`p-3 rounded-xl ${bgClassName} text-white mb-4 group-hover:scale-110 transition-transform duration-300`}>
                                            <Icon className="w-6 h-6" />
                                        </div>
                                        <ArrowUpRight className="w-5 h-5 text-gray-500 opacity-0 -translate-y-2 translate-x-2 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all duration-300" />
                                    </div>

                                    <div>
                                        <dt className="text-sm font-medium text-gray-400 truncate">
                                            {stat.name}
                                        </dt>
                                        <dd className="mt-2 text-4xl font-bold tracking-tight text-white space-x-2">
                                            <span className="bg-clip-text text-transparent bg-gradient-to-br from-white to-gray-500">
                                                {stat.value}
                                            </span>
                                        </dd>
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    );
                })}
            </motion.div>

            {/* Recent Activity */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="bg-black/40 backdrop-blur-md border border-white/10 shadow-xl rounded-2xl overflow-hidden"
            >
                <div className="px-6 py-5 border-b border-white/10 flex items-center justify-between bg-white/5">
                    <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                        <Clock className="w-5 h-5 text-gray-400" />
                        Recent Activity Feed
                    </h3>
                    <span className="text-xs font-medium px-2.5 py-1 bg-white/10 text-gray-300 rounded-full">
                        Top {allActivity.length} events
                    </span>
                </div>

                <div className="divide-y divide-white/5">
                    {allActivity.length > 0 ? (
                        <motion.ul
                            variants={containerVariants}
                            initial="hidden"
                            animate="show"
                            role="list"
                            className="divide-y divide-white/5"
                        >
                            {allActivity.map((activity, index) => (
                                <motion.li key={`${activity.type}-${activity.id}`} variants={itemVariants}>
                                    <Link href={activity.link} className="block group hover:bg-white/5 transition-colors">
                                        <div className="px-6 py-5">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-2 h-2 rounded-full 
                            ${activity.type === 'Contact' ? 'bg-blue-400 shadow-[0_0_10px_rgba(96,165,250,0.8)]' : ''}
                            ${activity.type === 'Viewing' ? 'bg-orange-400 shadow-[0_0_10px_rgba(251,146,60,0.8)]' : ''}
                            ${activity.type === 'Proposal' ? 'bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.8)]' : ''}
                          `} />
                                                    <p className="text-sm font-medium text-white group-hover:text-indigo-300 transition-colors">
                                                        {activity.name} <span className="text-gray-400 font-normal hidden sm:inline-block">({activity.email})</span>
                                                    </p>
                                                </div>
                                                <div className="flex items-center gap-4">
                                                    <p className={`px-3 py-1 text-xs font-semibold rounded-full border 
                            ${activity.type === 'Contact' ? 'bg-blue-500/10 text-blue-300 border-blue-500/20' : ''}
                            ${activity.type === 'Viewing' ? 'bg-orange-500/10 text-orange-300 border-orange-500/20' : ''}
                            ${activity.type === 'Proposal' ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20' : ''}
                          `}>
                                                        {activity.type}
                                                    </p>
                                                    <ChevronRight className="w-5 h-5 text-gray-600 group-hover:text-white transition-colors group-hover:translate-x-1 duration-300" />
                                                </div>
                                            </div>
                                            <div className="mt-3 sm:flex sm:justify-between items-center ml-5">
                                                <div className="sm:flex">
                                                    <p className="flex items-center text-sm text-gray-400 group-hover:text-gray-300 transition-colors">
                                                        {activity.details}
                                                    </p>
                                                </div>
                                                <div className="mt-2 text-xs text-gray-500 sm:mt-0 flex items-center gap-2 group-hover:text-gray-400 transition-colors">
                                                    <Clock className="w-3.5 h-3.5" />
                                                    <span>
                                                        {new Date(activity.date).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })} at {new Date(activity.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                </motion.li>
                            ))}
                        </motion.ul>
                    ) : (
                        <div className="px-6 py-12 text-center">
                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/5 mb-4">
                                <Clock className="w-8 h-8 text-gray-500" />
                            </div>
                            <p className="text-gray-400">No recent activity to display.</p>
                            <p className="text-sm text-gray-600 mt-1">Activities will appear here once users start interacting.</p>
                        </div>
                    )}
                </div>
            </motion.div>
        </div>
    );
};

export default DashboardClient;
