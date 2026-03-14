'use client';

import { useState, useRef } from 'react';
import { Plus, Trash2, Save, Eye, EyeOff, CheckCircle, AlertCircle, Newspaper, Edit2, X, Upload, TrendingUp, Star } from 'lucide-react';
import Swal from 'sweetalert2';

export default function InsightsClient({ initialInsights, createInsight, updateInsight, deleteInsight, uploadImageAction }) {
    const [insights, setInsights] = useState(initialInsights);
    const [isEditing, setIsEditing] = useState(null);
    const [editForm, setEditForm] = useState(null);
    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState(null);
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef(null);

    const categories = [
        { id: 'market-reports', name: 'Market Reports', color: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
        { id: 'investment', name: 'Investment', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
        { id: 'residential', name: 'Residential', color: 'bg-purple-500/10 text-purple-400 border-purple-500/20' },
        { id: 'commercial', name: 'Commercial', color: 'bg-orange-500/10 text-orange-400 border-orange-500/20' },
        { id: 'industrial', name: 'Industrial', color: 'bg-gray-500/10 text-gray-400 border-gray-500/20' },
        { id: 'sustainability', name: 'Sustainability', color: 'bg-green-500/10 text-green-400 border-green-500/20' },
        { id: 'technology', name: 'Technology', color: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20' },
        { id: 'luxury', name: 'Luxury', color: 'bg-amber-500/10 text-amber-400 border-amber-500/20' }
    ];

    const showToast = (type, msg) => {
        Swal.fire({
            icon: type,
            title: msg,
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            background: '#111111',
            color: type === 'success' ? '#4ade80' : '#f87171',
            iconColor: type === 'success' ? '#4ade80' : '#f87171',
            customClass: {
                popup: 'rounded-xl border border-gray-800 shadow-2xl'
            }
        });
    };

    const handleEdit = (insight) => {
        setIsEditing(insight._id);
        setEditForm({ ...insight });
    };

    const handleAddNew = () => {
        setIsEditing('new');
        setEditForm({
            title: '',
            excerpt: '',
            content: '',
            category: 'market-reports',
            categoryName: 'Market Reports',
            date: new Date().toISOString().split('T')[0],
            readTime: '5 min read',
            author: 'Admin',
            authorRole: 'Editor',
            image: '',
            featured: false,
            trending: false,
            tags: [],
            active: true
        });
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            if (!editForm.title || !editForm.excerpt || !editForm.content || !editForm.image) {
                let missingFields = [];
                if (!editForm.title) missingFields.push('Title');
                if (!editForm.excerpt) missingFields.push('Excerpt');
                if (!editForm.content) missingFields.push('Content');
                if (!editForm.image) missingFields.push('Featured Image');
                
                showToast('error', `Required fields missing: ${missingFields.join(', ')}`);
                setSaving(false);
                return;
            }

            if (isEditing === 'new') {
                const res = await createInsight(editForm);
                if (res.error) throw new Error(res.error);
                setInsights([res.data, ...insights]);
                showToast('success', 'Insight created successfully!');
            } else {
                const res = await updateInsight(isEditing, editForm);
                if (res.error) throw new Error(res.error);
                setInsights(insights.map(i => i._id === isEditing ? res.data : i));
                showToast('success', 'Insight updated successfully!');
            }
            setIsEditing(null);
            setEditForm(null);
        } catch (error) {
            showToast('error', error.message || 'Failed to save insight');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: 'Delete Insight?',
            text: "This action cannot be undone.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            confirmButtonText: 'Yes, delete it',
            cancelButtonText: 'Cancel',
            background: '#111111',
            color: '#fff',
            customClass: {
                popup: 'rounded-2xl border border-gray-800',
                title: 'text-white font-bold',
                htmlContainer: 'text-gray-400',
                confirmButton: 'bg-red-500 hover:bg-red-600 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all',
                cancelButton: 'bg-transparent border border-gray-700 text-gray-300 hover:bg-gray-800 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all ml-3'
            }
        });

        if (!result.isConfirmed) return;

        setDeleting(id);
        try {
            const res = await deleteInsight(id);
            if (res.error) throw new Error(res.error);
            setInsights(insights.filter(i => i._id !== id));
            showToast('success', 'Insight deleted successfully');
        } catch (error) {
            showToast('error', error.message || 'Failed to delete insight');
        } finally {
            setDeleting(null);
        }
    };

    const handleUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        try {
            const formData = new FormData();
            formData.append('file', file);
            const res = await uploadImageAction(formData);
            if (res.error) throw new Error(res.error);
            setEditForm({ ...editForm, image: res.url });
            showToast('success', 'Image uploaded successfully!');
        } catch (error) {
            showToast('error', error.message || 'Image upload failed');
        } finally {
            setUploading(false);
        }
    };

    const toggleActive = async (insight) => {
        try {
            const res = await updateInsight(insight._id, { active: !insight.active });
            if (res.error) throw new Error(res.error);
            setInsights(insights.map(i => i._id === insight._id ? res.data : i));
            showToast('success', `Insight ${!insight.active ? 'published' : 'hidden'}`);
        } catch (error) {
            showToast('error', error.message);
        }
    };

    const getCategoryColor = (categoryId) => {
        return categories.find(c => c.id === categoryId)?.color || 'bg-gray-500/10 text-gray-400 border-gray-500/20';
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#0c0c0c] to-[#111111] p-6 md:p-8 font-['DM_Sans',sans-serif]">
            {/* Header Section */}
            <div className="mx-auto">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2.5 bg-gradient-to-br from-amber-500/20 to-orange-500/20 rounded-xl border border-amber-500/30">
                                <Newspaper className="w-5 h-5 text-amber-400" />
                            </div>
                            <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">Insights & Analysis</h1>
                        </div>
                        <p className="text-gray-500 text-sm ml-1">Manage blog posts, market reports, and industry news</p>
                    </div>
                    {!isEditing && (
                        <button 
                            onClick={handleAddNew} 
                            className="group flex items-center gap-2 bg-gradient-to-r from-white to-gray-100 text-black px-5 py-2.5 rounded-xl text-sm font-semibold hover:shadow-lg hover:shadow-white/10 transition-all duration-200 border border-white/20"
                        >
                            <Plus size={18} className="group-hover:rotate-90 transition-transform duration-200" />
                            Add New Insight
                        </button>
                    )}
                </div>

                {/* Edit Form */}
                {isEditing ? (
                    <div className="bg-[#111111] rounded-2xl border border-gray-800/80 p-6 md:p-8 mb-8 shadow-2xl shadow-black/50">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                <div className="w-1 h-6 bg-gradient-to-b from-amber-500 to-orange-500 rounded-full"></div>
                                {isEditing === 'new' ? 'Create New Insight' : 'Edit Insight'}
                            </h2>
                            <button 
                                onClick={() => { setIsEditing(null); setEditForm(null); }} 
                                className="text-gray-500 hover:text-white transition-colors p-2 hover:bg-gray-800 rounded-lg"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="space-y-6">
                            {/* Title */}
                            <div>
                                <label className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-2 block">
                                    Title <span className="text-red-500 ml-1">*</span>
                                </label>
                                <input
                                    value={editForm.title}
                                    onChange={e => setEditForm({ ...editForm, title: e.target.value })}
                                    className={`w-full bg-gray-900/50 border rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20 outline-none transition-all ${
                                        !editForm.title ? 'border-red-500/30' : 'border-gray-800'
                                    }`}
                                    placeholder="Enter a compelling title..."
                                />
                            </div>

                            {/* Grid Fields */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Category */}
                                <div>
                                    <label className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-2 block">Category</label>
                                    <select
                                        value={editForm.category}
                                        onChange={e => {
                                            const cat = categories.find(c => c.id === e.target.value);
                                            setEditForm({ ...editForm, category: e.target.value, categoryName: cat.name });
                                        }}
                                        className="w-full bg-gray-900/50 border border-gray-800 rounded-xl px-4 py-3 text-white focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20 outline-none transition-all appearance-none cursor-pointer"
                                    >
                                        {categories.map(c => (
                                            <option key={c.id} value={c.id} className="bg-gray-900">{c.name}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Author Name */}
                                <div>
                                    <label className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-2 block">Author Name</label>
                                    <input
                                        value={editForm.author}
                                        onChange={e => setEditForm({ ...editForm, author: e.target.value })}
                                        className="w-full bg-gray-900/50 border border-gray-800 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20 outline-none transition-all"
                                        placeholder="e.g. John Smith"
                                    />
                                </div>

                                {/* Author Role */}
                                <div>
                                    <label className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-2 block">Author Role</label>
                                    <input
                                        value={editForm.authorRole}
                                        onChange={e => setEditForm({ ...editForm, authorRole: e.target.value })}
                                        className="w-full bg-gray-900/50 border border-gray-800 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20 outline-none transition-all"
                                        placeholder="e.g. Senior Analyst"
                                    />
                                </div>

                                {/* Read Time */}
                                <div>
                                    <label className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-2 block">Read Time</label>
                                    <input
                                        value={editForm.readTime}
                                        onChange={e => setEditForm({ ...editForm, readTime: e.target.value })}
                                        className="w-full bg-gray-900/50 border border-gray-800 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20 outline-none transition-all"
                                        placeholder="e.g. 5 min read"
                                    />
                                </div>

                                {/* Date */}
                                <div>
                                    <label className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-2 block">Publish Date</label>
                                    <input
                                        type="date"
                                        value={editForm.date ? editForm.date.split('T')[0] : ''}
                                        onChange={e => setEditForm({ ...editForm, date: e.target.value })}
                                        className="w-full bg-gray-900/50 border border-gray-800 rounded-xl px-4 py-3 text-white focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20 outline-none transition-all"
                                    />
                                </div>
                            </div>

                            {/* Excerpt */}
                            <div>
                                <label className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-2 block">
                                    Excerpt (Short Summary) <span className="text-red-500 ml-1">*</span>
                                </label>
                                <textarea
                                    value={editForm.excerpt}
                                    onChange={e => setEditForm({ ...editForm, excerpt: e.target.value })}
                                    className={`w-full bg-gray-900/50 border rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20 outline-none transition-all resize-none ${
                                        !editForm.excerpt ? 'border-red-500/30' : 'border-gray-800'
                                    }`}
                                    rows={3}
                                    placeholder="A brief summary for the list view..."
                                />
                            </div>

                            {/* Content */}
                            <div>
                                <label className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-2 block">
                                    Full Content (Article) <span className="text-red-500 ml-1">*</span>
                                </label>
                                <textarea
                                    value={editForm.content}
                                    onChange={e => setEditForm({ ...editForm, content: e.target.value })}
                                    className={`w-full bg-gray-900/50 border rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20 outline-none transition-all resize-none ${
                                        !editForm.content ? 'border-red-500/30' : 'border-gray-800'
                                    }`}
                                    rows={8}
                                    placeholder="Write the full article content here..."
                                />
                            </div>

                            {/* Image Upload */}
                            <div>
                                <label className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-2 block">
                                    Featured Image <span className="text-red-500 ml-1">*</span>
                                </label>
                                <div className="flex flex-col sm:flex-row items-start gap-4">
                                    <div className={`w-full sm:w-48 h-32 bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl border-2 overflow-hidden relative ${
                                        !editForm.image ? 'border-dashed border-red-500/30' : 'border-gray-700'
                                    }`}>
                                        {editForm.image ? (
                                            <img src={editForm.image} alt="Preview" className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex flex-col items-center justify-center text-gray-700 gap-2">
                                                <Newspaper size={32} />
                                                <span className="text-xs">No image</span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleUpload}
                                            className="hidden"
                                            ref={fileInputRef}
                                        />
                                        <button
                                            onClick={() => fileInputRef.current.click()}
                                            disabled={uploading}
                                            className="flex items-center gap-2 bg-gradient-to-r from-gray-800 to-gray-700 text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:from-gray-700 hover:to-gray-600 transition-all disabled:opacity-50 border border-gray-600"
                                        >
                                            <Upload size={16} />
                                            {uploading ? 'Uploading...' : 'Upload Image'}
                                        </button>
                                        <p className="text-gray-600 text-xs mt-2">Recommended: 1200x800px, JPG or PNG (max 5MB)</p>
                                        {!editForm.image && (
                                            <p className="text-red-500 text-xs mt-2 flex items-center gap-1">
                                                <AlertCircle size={12} />
                                                Featured image is required
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Featured & Trending Toggles */}
                            <div className="flex flex-wrap gap-6 pt-2">
                                <label className="flex items-center gap-2 cursor-pointer group">
                                    <input
                                        type="checkbox"
                                        checked={editForm.featured}
                                        onChange={e => setEditForm({ ...editForm, featured: e.target.checked })}
                                        className="hidden"
                                    />
                                    <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${
                                        editForm.featured 
                                            ? 'bg-gradient-to-br from-amber-500 to-yellow-500 border-amber-500 shadow-lg shadow-amber-500/20' 
                                            : 'border-gray-700 bg-gray-800 group-hover:border-gray-600'
                                    }`}>
                                        {editForm.featured && <Star size={12} className="text-black fill-current" />}
                                    </div>
                                    <span className="text-gray-400 group-hover:text-white transition-colors text-sm">Mark as Featured</span>
                                </label>

                                <label className="flex items-center gap-2 cursor-pointer group">
                                    <input
                                        type="checkbox"
                                        checked={editForm.trending}
                                        onChange={e => setEditForm({ ...editForm, trending: e.target.checked })}
                                        className="hidden"
                                    />
                                    <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${
                                        editForm.trending 
                                            ? 'bg-gradient-to-br from-orange-500 to-red-500 border-orange-500 shadow-lg shadow-orange-500/20' 
                                            : 'border-gray-700 bg-gray-800 group-hover:border-gray-600'
                                    }`}>
                                        {editForm.trending && <TrendingUp size={12} className="text-white" />}
                                    </div>
                                    <span className="text-gray-400 group-hover:text-white transition-colors text-sm">Trending Now</span>
                                </label>
                            </div>

                            {/* Form Actions */}
                            <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-800">
                                <button
                                    onClick={() => { setIsEditing(null); setEditForm(null); }}
                                    className="px-6 py-2.5 rounded-xl text-sm font-semibold text-gray-400 hover:text-white hover:bg-gray-800/50 transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSave}
                                    disabled={saving}
                                    className="flex items-center gap-2 bg-gradient-to-r from-white to-gray-100 text-black px-8 py-2.5 rounded-xl text-sm font-bold hover:shadow-lg hover:shadow-white/10 transition-all disabled:opacity-50"
                                >
                                    {saving ? (
                                        <div className="w-4 h-4 border-2 border-black border-t-transparent animate-spin rounded-full" />
                                    ) : (
                                        <Save size={18} />
                                    )}
                                    {isEditing === 'new' ? 'Create Insight' : 'Save Changes'}
                                </button>
                            </div>
                        </div>
                    </div>
                ) : (
                    /* Insights Grid */
                    <>
                        {insights.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {insights.map((insight) => {
                                    const categoryColor = getCategoryColor(insight.category);
                                    return (
                                        <div 
                                            key={insight._id} 
                                            className="group bg-gradient-to-b from-[#111111] to-[#0c0c0c] rounded-2xl border border-gray-800/80 overflow-hidden flex flex-col hover:border-gray-700/80 hover:shadow-2xl hover:shadow-black/60 transition-all duration-300"
                                        >
                                            {/* Image Container */}
                                            <div className="relative h-48 bg-gradient-to-br from-gray-900 to-gray-800 overflow-hidden">
                                                {insight.image ? (
                                                    <img 
                                                        src={insight.image} 
                                                        alt={insight.title} 
                                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center">
                                                        <Newspaper size={48} className="text-gray-700" />
                                                    </div>
                                                )}
                                                
                                                {/* Category Badge */}
                                                <div className="absolute top-3 left-3">
                                                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${categoryColor}`}>
                                                        {insight.categoryName}
                                                    </span>
                                                </div>

                                                {/* Featured/Trending Icons */}
                                                <div className="absolute top-3 right-3 flex gap-2">
                                                    {insight.featured && (
                                                        <div className="p-1.5 bg-gradient-to-br from-amber-500 to-yellow-500 rounded-full shadow-lg shadow-amber-500/20">
                                                            <Star size={12} className="text-black fill-current" />
                                                        </div>
                                                    )}
                                                    {insight.trending && (
                                                        <div className="p-1.5 bg-gradient-to-br from-orange-500 to-red-500 rounded-full shadow-lg shadow-orange-500/20">
                                                            <TrendingUp size={12} className="text-white" />
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Status Indicator */}
                                                <div className={`absolute bottom-3 left-3 flex items-center gap-1.5 px-2 py-1 rounded-full backdrop-blur-md ${
                                                    insight.active ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'
                                                }`}>
                                                    {insight.active ? <Eye size={12} /> : <EyeOff size={12} />}
                                                    <span className="text-[10px] font-semibold uppercase tracking-wider">
                                                        {insight.active ? 'Published' : 'Hidden'}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Content */}
                                            <div className="p-5 flex-1 flex flex-col">
                                                <h3 className="text-white font-bold text-lg leading-tight mb-2 line-clamp-2 group-hover:text-amber-400 transition-colors">
                                                    {insight.title}
                                                </h3>
                                                <p className="text-gray-500 text-sm line-clamp-3 mb-4 flex-1">
                                                    {insight.excerpt}
                                                </p>

                                                {/* Meta Info */}
                                                <div className="flex items-center gap-2 text-xs text-gray-600 mb-4">
                                                    <span>{insight.author}</span>
                                                    <span>•</span>
                                                    <span>{insight.readTime}</span>
                                                </div>

                                                {/* Actions */}
                                                <div className="flex items-center justify-between pt-4 border-t border-gray-800/50">
                                                    <div className="flex items-center gap-1">
                                                        <button
                                                            onClick={() => toggleActive(insight)}
                                                            className={`p-2 rounded-lg transition-all ${
                                                                insight.active 
                                                                    ? 'text-green-500 hover:bg-green-500/10 hover:text-green-400' 
                                                                    : 'text-gray-600 hover:bg-gray-800 hover:text-gray-300'
                                                            }`}
                                                            title={insight.active ? 'Published' : 'Hidden'}
                                                        >
                                                            {insight.active ? <Eye size={16} /> : <EyeOff size={16} />}
                                                        </button>
                                                        <button
                                                            onClick={() => handleEdit(insight)}
                                                            className="p-2 text-gray-500 hover:text-white hover:bg-gray-800 rounded-lg transition-all"
                                                            title="Edit"
                                                        >
                                                            <Edit2 size={16} />
                                                        </button>
                                                    </div>
                                                    <button
                                                        onClick={() => handleDelete(insight._id)}
                                                        disabled={deleting === insight._id}
                                                        className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
                                                        title="Delete"
                                                    >
                                                        {deleting === insight._id ? (
                                                            <div className="w-4 h-4 border-2 border-red-500 border-t-transparent animate-spin rounded-full" />
                                                        ) : (
                                                            <Trash2 size={16} />
                                                        )}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            /* Empty State */
                            <div className="text-center py-24 bg-gradient-to-b from-[#111111] to-[#0a0a0a] rounded-3xl border border-gray-800/80 border-dashed">
                                <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center border border-gray-700">
                                    <Newspaper size={40} className="text-gray-600" />
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-3">No insights yet</h3>
                                <p className="text-gray-500 mb-8 max-w-sm mx-auto">
                                    Start sharing your market knowledge and company news with your audience.
                                </p>
                                <button 
                                    onClick={handleAddNew} 
                                    className="inline-flex items-center gap-2 bg-gradient-to-r from-white to-gray-100 text-black px-6 py-3 rounded-xl font-bold hover:shadow-lg hover:shadow-white/10 transition-all"
                                >
                                    <Plus size={20} />
                                    Create First Insight
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}