'use client';

import { useState } from 'react';
import { CalendarDays } from 'lucide-react';
import Swal from 'sweetalert2';

export default function ScheduleViewingForm({ propertyId }) {
    const [loading, setLoading] = useState(false);
    const availableTimes = ['10:00 AM', '11:00 AM', '12:00 PM', '2:00 PM', '3:00 PM', '4:00 PM'];

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData(e.target);

        try {
            const response = await fetch('/api/schedule-viewing', {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();

            if (data.success) {
                Swal.fire({
                    icon: 'success',
                    title: 'Viewing Scheduled!',
                    text: 'We have received your request and will contact you shortly.',
                    background: '#111827',
                    color: '#fff',
                    confirmButtonColor: '#3b82f6'
                });
                e.target.reset();
            } else {
                throw new Error(data.message || 'Something went wrong');
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: error.message || 'Failed to schedule viewing',
                background: '#111827',
                color: '#fff',
                confirmButtonColor: '#ef4444'
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <h2 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-4 flex items-center gap-2">
                <CalendarDays size={16} className="text-blue-400" />
                Schedule a Viewing
            </h2>

            <form onSubmit={handleSubmit}>
                {/* Tour Options */}
                <div className="mb-4">
                    <div className="flex flex-wrap gap-3 mb-3">
                        <label className="flex items-center gap-1.5">
                            <input type="radio" name="tourType" value="in-person" className="text-blue-500" defaultChecked />
                            <span className="text-xs text-white">In Person</span>
                        </label>
                        <label className="flex items-center gap-1.5">
                            <input type="radio" name="tourType" value="video" />
                            <span className="text-xs text-white">Video Chat</span>
                        </label>
                    </div>
                </div>

                <input type="hidden" name="propertyId" value={propertyId} />

                {/* Date & Time */}
                <div className="mb-4">
                    <p className="text-xs text-gray-400 mb-2">PREFERRED DATE</p>
                    <input
                        type="date"
                        name="preferredDate"
                        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-white/20"
                        required
                    />
                </div>

                <div className="mb-4">
                    <p className="text-xs text-gray-400 mb-2">PREFERRED TIME</p>
                    <select
                        name="preferredTime"
                        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-white/20"
                        required
                    >
                        <option value="">Select time</option>
                        {availableTimes.map(time => (
                            <option key={time} value={time}>{time}</option>
                        ))}
                    </select>
                </div>

                <input
                    type="text"
                    name="name"
                    placeholder="Name"
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-xs text-white placeholder-gray-500 mb-2 focus:outline-none focus:ring-2 focus:ring-white/20"
                    required
                />
                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-xs text-white placeholder-gray-500 mb-2 focus:outline-none focus:ring-2 focus:ring-white/20"
                    required
                />
                <input
                    type="tel"
                    name="phone"
                    placeholder="Phone"
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-xs text-white placeholder-gray-500 mb-3 focus:outline-none focus:ring-2 focus:ring-white/20"
                    required
                />
                <textarea
                    name="message"
                    placeholder="Message to agent"
                    rows="2"
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-xs text-white placeholder-gray-500 mb-3 focus:outline-none focus:ring-2 focus:ring-white/20 resize-none"
                />

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 text-white py-2.5 rounded-lg text-xs font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                    {loading ? 'Submitting...' : 'Book Appointment'}
                </button>
            </form>
        </div>
    );
}
