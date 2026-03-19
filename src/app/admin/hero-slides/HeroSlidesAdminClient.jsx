'use client';

import { useState, useRef } from 'react';
import { Plus, Trash2, Save, Upload, Eye, EyeOff, ArrowUp, ArrowDown, CheckCircle, AlertCircle } from 'lucide-react';
import Swal from 'sweetalert2';
import {
    createHeroSlide,
    updateHeroSlide,
    deleteHeroSlide,
    reorderHeroSlides,
} from './actions';

export default function HeroSlidesAdminClient({ initialSlides }) {
    const [slides, setSlides] = useState(initialSlides.map((s) => ({ ...s, _dirty: false })));
    const [saving, setSaving] = useState(null); // slide id or 'order'
    const [deleting, setDeleting] = useState(null);
    const [uploading, setUploading] = useState(null);
    const [toast, setToast] = useState(null); // { type: 'success'|'error', msg }
    const fileInputRefs = useRef({});

    const showToast = (type, msg) => {
        setToast({ type, msg });
        setTimeout(() => setToast(null), 3000);
    };

    const showAlert = async (options) => {
        return await Swal.fire({
            background: '#111111',
            color: '#ffffff',
            iconColor: options.icon === 'success' ? '#22c55e' : '#ef4444',
            confirmButtonColor: '#ffffff',
            confirmButtonText: 'OK',
            ...options
        });
    };

    const updateField = (id, field, value) => {
        setSlides((prev) =>
            prev.map((s) => (s._id === id ? { ...s, [field]: value, _dirty: true } : s))
        );
    };

    // Save (update) a single slide via server action
    const saveSlide = async (slide) => {
        setSaving(slide._id);
        try {
            const updated = await updateHeroSlide(slide._id, {
                title: slide.title,
                subtitle: slide.subtitle,
                cta: slide.cta,
                image: slide.image,
                order: slide.order,
                active: slide.active,
            });
            setSlides((prev) =>
                prev.map((s) => (s._id === slide._id ? { ...updated, _dirty: false } : s))
            );
            
            await showAlert({
                icon: 'success',
                title: 'Saved!',
                text: 'Slide has been updated successfully.',
                timer: 2000,
                showConfirmButton: false
            });
        } catch {
            await showAlert({
                icon: 'error',
                title: 'Error',
                text: 'Failed to save slide. Please try again.',
            });
        } finally {
            setSaving(null);
        }
    };

    // Delete slide via server action
    const deleteSlide = async (id) => {
        const result = await Swal.fire({
            title: 'Delete Slide?',
            text: 'This action cannot be undone!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#6b7280',
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'Cancel',
            background: '#111111',
            color: '#ffffff',
            iconColor: '#ef4444'
        });

        if (!result.isConfirmed) return;
        
        setDeleting(id);
        try {
            await deleteHeroSlide(id);
            setSlides((prev) => prev.filter((s) => s._id !== id));
            
            await showAlert({
                icon: 'success',
                title: 'Deleted!',
                text: 'Slide has been deleted.',
                timer: 2000,
                showConfirmButton: false
            });
        } catch {
            await showAlert({
                icon: 'error',
                title: 'Error',
                text: 'Failed to delete slide. Please try again.',
            });
        } finally {
            setDeleting(null);
        }
    };

    // Add new slide via server action
    const addSlide = async () => {
        const maxOrder = slides.length > 0 ? Math.max(...slides.map((s) => s.order)) + 1 : 0;
        try {
            const newSlide = await createHeroSlide({
                title: 'New Slide',
                subtitle: 'Add subtitle here',
                cta: 'Learn More',
                image: '/d11.webp',
                order: maxOrder,
                active: true,
            });
            setSlides((prev) => [...prev, { ...newSlide, _dirty: false }]);
            
            await showAlert({
                icon: 'success',
                title: 'Added!',
                text: 'New slide has been created.',
                timer: 2000,
                showConfirmButton: false
            });
        } catch {
            await showAlert({
                icon: 'error',
                title: 'Error',
                text: 'Failed to add slide. Please try again.',
            });
        }
    };

    // Upload image for a slide
    const uploadImage = async (slideId, file) => {
        setUploading(slideId);
        try {
            const formData = new FormData();
            formData.append('file', file);
            const res = await fetch('/api/admin/upload', { method: 'POST', body: formData });
            if (!res.ok) {
                const error = await res.json();
                throw new Error(error.error || 'Upload failed');
            }
            const { url } = await res.json();
            updateField(slideId, 'image', url);
            
            await showAlert({
                icon: 'success',
                title: 'Uploaded!',
                text: 'Image has been uploaded and converted to WebP!',
                timer: 2000,
                showConfirmButton: false
            });
        } catch (error) {
            await showAlert({
                icon: 'error',
                title: 'Upload Failed',
                text: error.message || 'Image upload failed. Please try again.',
            });
        } finally {
            setUploading(null);
        }
    };

    // Move slide order via server action
    const moveSlide = async (id, dir) => {
        const idx = slides.findIndex((s) => s._id === id);
        const newIdx = idx + dir;
        if (newIdx < 0 || newIdx >= slides.length) return;

        const updated = [...slides];
        [updated[idx], updated[newIdx]] = [updated[newIdx], updated[idx]];
        const reordered = updated.map((s, i) => ({ ...s, order: i, _dirty: true }));
        setSlides(reordered);

        setSaving('order');
        try {
            await reorderHeroSlides(reordered.map((s) => ({ id: s._id, order: s.order })));
            setSlides(reordered.map((s) => ({ ...s, _dirty: false })));
            
            await showAlert({
                icon: 'success',
                title: 'Order Updated!',
                text: 'Slide order has been saved.',
                timer: 2000,
                showConfirmButton: false
            });
        } catch {
            await showAlert({
                icon: 'error',
                title: 'Error',
                text: 'Failed to update order. Please try again.',
            });
            // Revert optimistic update
            setSlides(initialSlides.map((s) => ({ ...s, _dirty: false })));
        } finally {
            setSaving(null);
        }
    };

    return (
        <div className="min-h-screen bg-[#0a0a0a] p-6 md:p-8" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            {/* Toast */}
            {toast && (
                <div
                    className={`fixed top-6 right-6 z-50 flex items-center gap-3 px-5 py-3 rounded-xl shadow-2xl border text-sm font-medium transition-all duration-300 ${toast.type === 'success'
                            ? 'bg-gray-900 border-green-700 text-green-400'
                            : 'bg-gray-900 border-red-700 text-red-400'
                        }`}
                >
                    {toast.type === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
                    {toast.msg}
                </div>
            )}

            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-white tracking-tight">Home Slides</h1>
                    <p className="text-gray-500 text-sm mt-1">Manage homepage carousel slides</p>
                </div>
                <button
                    onClick={addSlide}
                    className="flex items-center gap-2 bg-white text-black px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-gray-100 transition-all duration-150 shadow-lg"
                >
                    <Plus size={16} />
                    Add Slide
                </button>
            </div>

            {/* Empty state */}
            {slides.length === 0 && (
                <div className="text-center py-24 text-gray-600">
                    <p className="text-lg">No slides yet.</p>
                    <p className="text-sm mt-1">Click &quot;Add Slide&quot; to get started.</p>
                </div>
            )}

            {/* Slides */}
            <div className="space-y-6">
                {slides.map((slide, idx) => (
                    <div
                        key={slide._id}
                        className={`bg-[#111111] rounded-2xl border transition-all duration-200 overflow-hidden ${slide._dirty ? 'border-gray-600' : 'border-gray-800'
                            }`}
                    >
                        <div className="flex gap-4 p-5">
                            {/* Order Controls */}
                            <div className="flex flex-col items-center gap-1 pt-1 shrink-0">
                                <span className="text-gray-600 text-xs font-semibold mb-1">#{idx + 1}</span>
                                <button
                                    onClick={() => moveSlide(slide._id, -1)}
                                    disabled={idx === 0 || saving === 'order'}
                                    className="p-1.5 rounded-lg text-gray-500 hover:text-white hover:bg-gray-800 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                                    title="Move up"
                                >
                                    <ArrowUp size={14} />
                                </button>
                                <button
                                    onClick={() => moveSlide(slide._id, 1)}
                                    disabled={idx === slides.length - 1 || saving === 'order'}
                                    className="p-1.5 rounded-lg text-gray-500 hover:text-white hover:bg-gray-800 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                                    title="Move down"
                                >
                                    <ArrowDown size={14} />
                                </button>
                            </div>

                            {/* Image Preview */}
                            <div className="shrink-0">
                                <div
                                    className="w-36 h-24 rounded-xl bg-gray-900 overflow-hidden border border-gray-800 relative group cursor-pointer"
                                    onClick={() => fileInputRefs.current[slide._id]?.click()}
                                >
                                    {slide.image && (
                                        // eslint-disable-next-line @next/next/no-img-element
                                        <img
                                            src={slide.image}
                                            alt="Slide"
                                            className="w-full h-full object-cover"
                                        />
                                    )}
                                    {/* Overlay on hover */}
                                    <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                        {uploading === slide._id ? (
                                            <div className="w-5 h-5 rounded-full border-2 border-gray-400 border-t-white animate-spin" />
                                        ) : (
                                            <>
                                                <Upload size={18} className="text-white" />
                                                <span className="text-white text-xs font-medium">Change Image</span>
                                                <span className="text-gray-400 text-[10px]">(Auto-converts to WebP)</span>
                                            </>
                                        )}
                                    </div>
                                </div>
                                {/* Hidden file input */}
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    ref={(el) => (fileInputRefs.current[slide._id] = el)}
                                    onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) uploadImage(slide._id, file);
                                        e.target.value = '';
                                    }}
                                />
                                <p className="text-gray-600 text-[10px] text-center mt-1.5">
                                    {slide.image?.includes('.webp') ? 'WebP format' : 'Click to change'}
                                </p>
                            </div>

                            {/* Fields */}
                            <div className="flex-1 grid grid-cols-1 gap-3">
                                <div>
                                    <label className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-1 block">Title</label>
                                    <input
                                        value={slide.title}
                                        onChange={(e) => updateField(slide._id, 'title', e.target.value)}
                                        placeholder="Slide title"
                                        className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-2.5 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-gray-600 transition-colors"
                                    />
                                </div>
                                <div>
                                    <label className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-1 block">Subtitle</label>
                                    <input
                                        value={slide.subtitle}
                                        onChange={(e) => updateField(slide._id, 'subtitle', e.target.value)}
                                        placeholder="Slide subtitle"
                                        className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-2.5 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-gray-600 transition-colors"
                                    />
                                </div>
                                <div>
                                    <label className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-1 block">CTA Button Text</label>
                                    <input
                                        value={slide.cta}
                                        onChange={(e) => updateField(slide._id, 'cta', e.target.value)}
                                        placeholder="Call to action text"
                                        className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-2.5 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-gray-600 transition-colors"
                                    />
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex flex-col items-end gap-2 shrink-0">
                                {/* Active toggle */}
                                <button
                                    onClick={() => updateField(slide._id, 'active', !slide.active)}
                                    title={slide.active ? 'Visible on site' : 'Hidden on site'}
                                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 ${slide.active
                                            ? 'bg-green-500/10 text-green-400 border border-green-700/40'
                                            : 'bg-gray-800 text-gray-500 border border-gray-700'
                                        }`}
                                >
                                    {slide.active ? <Eye size={12} /> : <EyeOff size={12} />}
                                    {slide.active ? 'Visible' : 'Hidden'}
                                </button>

                                {/* Save */}
                                <button
                                    onClick={() => saveSlide(slide)}
                                    disabled={saving === slide._id || !slide._dirty}
                                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 ${slide._dirty
                                            ? 'bg-white text-black hover:bg-gray-200'
                                            : 'bg-gray-900 text-gray-600 border border-gray-800 cursor-default'
                                        }`}
                                >
                                    {saving === slide._id ? (
                                        <div className="w-3 h-3 rounded-full border border-gray-400 border-t-black animate-spin" />
                                    ) : (
                                        <Save size={12} />
                                    )}
                                    Save
                                </button>

                                {/* Delete */}
                                <button
                                    onClick={() => deleteSlide(slide._id)}
                                    disabled={deleting === slide._id}
                                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-red-400 border border-gray-800 hover:bg-red-500/10 hover:border-red-700/40 transition-all duration-150"
                                >
                                    {deleting === slide._id ? (
                                        <div className="w-3 h-3 rounded-full border border-red-400 border-t-transparent animate-spin" />
                                    ) : (
                                        <Trash2 size={12} />
                                    )}
                                    Delete
                                </button>
                            </div>
                        </div>

                        {/* Unsaved indicator */}
                        {slide._dirty && (
                            <div className="px-5 py-2 bg-gray-800/40 border-t border-gray-800 text-xs text-gray-500 flex items-center gap-1.5">
                                <div className="w-1.5 h-1.5 rounded-full bg-yellow-400" />
                                Unsaved changes — click Save to apply
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}