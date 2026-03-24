'use client';

import { useState } from 'react';
import { Plus, Trash2, Save, ArrowUp, ArrowDown, Eye, EyeOff } from 'lucide-react';
import Swal from 'sweetalert2';
import {
  createTestimonial,
  deleteTestimonial,
  reorderTestimonials,
  updateTestimonial,
} from './actions';

export default function TestimonialsAdminClient({ initialTestimonials }) {
  const [testimonials, setTestimonials] = useState(
    (initialTestimonials || []).map((t) => ({ ...t, _dirty: false }))
  );
  const [saving, setSaving] = useState(null);
  const [deleting, setDeleting] = useState(null);

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
        popup: 'rounded-xl border border-gray-800',
      },
    });
  };

  const updateField = (id, field, value) => {
    setTestimonials((prev) =>
      prev.map((t) => (t._id === id ? { ...t, [field]: value, _dirty: true } : t))
    );
  };

  const saveAllTestimonials = async () => {
    const dirtyTestimonials = testimonials.filter((t) => t._dirty);
    if (dirtyTestimonials.length === 0) return;

    setSaving('all');
    try {
      await Promise.all(
        dirtyTestimonials.map((t) =>
          updateTestimonial(t._id, {
            name: t.name,
            company: t.company,
            content: t.content,
            rating: t.rating,
            avatar: t.avatar,
            order: t.order,
            active: t.active,
          })
        )
      );
      setTestimonials((prev) =>
        prev.map((t) => ({ ...t, _dirty: false }))
      );
      showToast('success', 'All testimonials saved!');
    } catch (e) {
      console.error(e);
      showToast('error', 'Failed to save some testimonials');
    } finally {
      setSaving(null);
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Delete Testimonial?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, delete it',
      background: '#111111',
      color: '#fff',
      iconColor: '#ef4444',
      customClass: {
        popup: 'rounded-xl border border-gray-800',
        title: 'text-white font-bold',
        htmlContainer: 'text-gray-400',
        confirmButton: 'rounded-lg px-4 py-2 text-sm font-medium',
        cancelButton: 'rounded-lg px-4 py-2 text-sm font-medium',
      },
    });

    if (!result.isConfirmed) return;

    setDeleting(id);
    try {
      await deleteTestimonial(id);
      setTestimonials((prev) => prev.filter((t) => t._id !== id));
      showToast('success', 'Testimonial deleted');
    } catch (e) {
      console.error(e);
      showToast('error', 'Failed to delete testimonial');
    } finally {
      setDeleting(null);
    }
  };

  const addTestimonial = async () => {
    const maxOrder =
      testimonials.length > 0 ? Math.max(...testimonials.map((t) => t.order ?? 0)) + 1 : 0;
    try {
      const newTestimonial = await createTestimonial({
        name: 'New Client',
        company: 'Company Name',
        content: 'Write testimonial here...',
        rating: 5,
        avatar: '👨‍💼',
        order: maxOrder,
        active: true,
      });
      setTestimonials((prev) => [...prev, { ...newTestimonial, _dirty: false }]);
      showToast('success', 'New testimonial added');
    } catch (e) {
      console.error(e);
      showToast('error', 'Failed to add testimonial');
    }
  };

  const moveTestimonial = async (id, dir) => {
    const idx = testimonials.findIndex((t) => t._id === id);
    const newIdx = idx + dir;
    if (newIdx < 0 || newIdx >= testimonials.length) return;

    const updated = [...testimonials];
    [updated[idx], updated[newIdx]] = [updated[newIdx], updated[idx]];
    const reordered = updated.map((t, i) => ({ ...t, order: i, _dirty: true }));
    setTestimonials(reordered);

    try {
      await reorderTestimonials(
        reordered.map((t) => ({
          id: t._id,
          order: t.order,
        }))
      );
      setTestimonials((prev) => prev.map((t) => ({ ...t, _dirty: false })));
      showToast('success', 'Order updated');
    } catch (e) {
      console.error(e);
      showToast('error', 'Failed to update order');
    }
  };

  const hasChanges = testimonials.some(t => t._dirty);

  return (
    <div
      className="min-h-screen bg-[#0a0a0a] p-6 md:p-8"
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Testimonials</h1>
          <p className="text-gray-500 text-sm mt-1">
            Manage client feedback and success stories
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={saveAllTestimonials}
            disabled={saving === 'all' || !hasChanges}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 shadow-lg ${hasChanges
              ? 'bg-green-600 text-white hover:bg-green-500 hover:scale-105 active:scale-95'
              : 'bg-gray-900 text-gray-500 border border-gray-800 cursor-not-allowed opacity-50'
              }`}
          >
            {saving === 'all' ? (
              <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
            ) : (
              <Save size={18} />
            )}
            {saving === 'all' ? 'Saving...' : 'Save All Changes'}
          </button>
          <button
            onClick={addTestimonial}
            className="flex items-center gap-2 bg-white text-black px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-gray-100 transition-all duration-150 shadow-lg"
          >
            <Plus size={16} />
            Add Testimonial
          </button>
        </div>
      </div>

      {testimonials.length === 0 && (
        <div className="text-center py-24 text-gray-600">
          <p className="text-lg">No testimonials yet.</p>
        </div>
      )}

      {testimonials.length > 0 && (
        <div className="space-y-6">
          {testimonials.map((testimonial, idx) => (
            <div
              key={testimonial._id}
              className={`bg-[#111111] rounded-2xl border transition-all duration-200 overflow-hidden ${testimonial._dirty ? 'border-green-900/50 bg-[#121412]' : 'border-gray-800'
                }`}
            >
              <div className="flex flex-col lg:flex-row gap-6 p-6">
                <div className="flex lg:flex-col items-center gap-4 shrink-0">
                  <div className="flex flex-col items-center gap-1">
                    <span className="text-gray-600 text-xs font-semibold">
                      #{idx + 1}
                    </span>
                    <button
                      onClick={() => moveTestimonial(testimonial._id, -1)}
                      disabled={idx === 0}
                      className="p-1.5 rounded-lg text-gray-500 hover:text-white hover:bg-gray-800 transition-colors disabled:opacity-30"
                    >
                      <ArrowUp size={14} />
                    </button>
                    <button
                      onClick={() => moveTestimonial(testimonial._id, 1)}
                      disabled={idx === testimonials.length - 1}
                      className="p-1.5 rounded-lg text-gray-500 hover:text-white hover:bg-gray-800 transition-colors disabled:opacity-30"
                    >
                      <ArrowDown size={14} />
                    </button>
                  </div>
                  <div className="relative group w-20 h-20 rounded-full overflow-hidden border border-gray-800 bg-gray-900 flex items-center justify-center text-3xl">
                    <input
                      value={testimonial.avatar}
                      onChange={(e) =>
                        updateField(testimonial._id, 'avatar', e.target.value)
                      }
                      className="w-full h-full bg-transparent text-center focus:outline-none"
                      title="Emoji or Image URL"
                    />
                  </div>
                </div>

                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-1 block">
                      Client Name
                    </label>
                    <input
                      value={testimonial.name}
                      onChange={(e) =>
                        updateField(testimonial._id, 'name', e.target.value)
                      }
                      className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-2 text-white text-sm focus:border-gray-600 outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-1 block">
                      Company / Role
                    </label>
                    <input
                      value={testimonial.company}
                      onChange={(e) =>
                        updateField(testimonial._id, 'company', e.target.value)
                      }
                      className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-2 text-white text-sm focus:border-gray-600 outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-1 block">
                      Rating (1-5)
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="5"
                      value={testimonial.rating}
                      onChange={(e) =>
                        updateField(
                          testimonial._id,
                          'rating',
                          parseInt(e.target.value, 10) || 0
                        )
                      }
                      className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-2 text-white text-sm focus:border-gray-600 outline-none"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-1 block">
                      Testimonial Content
                    </label>
                    <textarea
                      value={testimonial.content}
                      onChange={(e) =>
                        updateField(testimonial._id, 'content', e.target.value)
                      }
                      rows={3}
                      className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-2 text-white text-sm focus:border-gray-600 outline-none resize-none"
                    />
                  </div>
                </div>

                <div className="flex lg:flex-col justify-end gap-2 shrink-0">
                  <button
                    onClick={() =>
                      updateField(testimonial._id, 'active', !testimonial.active)
                    }
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${testimonial.active
                      ? 'bg-green-500/10 text-green-400 border border-green-700/40'
                      : 'bg-gray-800 text-gray-500 border border-gray-700'
                      }`}
                  >
                    {testimonial.active ? <Eye size={12} /> : <EyeOff size={12} />}
                    {testimonial.active ? 'Visible' : 'Hidden'}
                  </button>
                  <button
                    onClick={() => handleDelete(testimonial._id)}
                    disabled={deleting === testimonial._id}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-red-400 border border-gray-800 hover:bg-red-500/10 hover:border-red-700/40 transition-all"
                  >
                    {deleting === testimonial._id ? (
                      <div className="w-3 h-3 border border-red-400 border-t-transparent animate-spin rounded-full" />
                    ) : (
                      <Trash2 size={12} />
                    )}
                    Delete
                  </button>
                </div>
              </div>
              {testimonial._dirty && (
                <div className="px-6 py-2 bg-green-500/5 border-t border-green-900/30 text-[10px] text-green-500 flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                  Unsaved changes — click &quot;Save All Changes&quot; to apply
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

