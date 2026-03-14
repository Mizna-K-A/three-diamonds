'use client';

import { useState, useEffect } from 'react';
import { Save, Phone, Mail, MapPin, Clock, Share2, Globe, Trash2, Plus } from 'lucide-react';
import Swal from 'sweetalert2';

export default function SiteSettingsAdmin() {
    const [settings, setSettings] = useState({
        phoneNumbers: [],
        emails: [],
        locations: [],
        businessHours: [],
        socialLinks: []
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const showSwalToast = (type, msg) => {
        const Toast = Swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            didOpen: (toast) => {
                toast.addEventListener('mouseenter', Swal.stopTimer);
                toast.addEventListener('mouseleave', Swal.resumeTimer);
            }
        });

        Toast.fire({
            icon: type,
            title: msg,
            background: '#111111',
            color: '#ffffff',
            iconColor: type === 'success' ? '#4ade80' : '#ef4444'
        });
    };

    const fetchSettings = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/admin/site-settings');
            const data = await res.json();
            // Handle legacy data or empty arrays
            const formattedData = {
                ...data,
                locations: data.locations || [],
                socialLinks: Array.isArray(data.socialLinks) ? data.socialLinks :
                    (data.socialLinks ? Object.entries(data.socialLinks).map(([platform, url]) => ({ platform, url })) : [])
            };
            setSettings(formattedData);
        } catch {
            showSwalToast('error', 'Failed to load settings');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSettings();
    }, []);

    const handleUpdate = (field, value) => {
        setSettings(prev => ({ ...prev, [field]: value }));
    };

    const handleArrayChange = (field, index, value) => {
        const newArr = [...settings[field]];
        newArr[index] = value;
        handleUpdate(field, newArr);
    };

    const addArrayItem = (field) => {
        handleUpdate(field, [...settings[field], '']);
    };

    const removeArrayItem = (field, index) => {
        const newArr = [...settings[field]];
        newArr.splice(index, 1);
        handleUpdate(field, newArr);
    };

    // Location specific handlers
    const handleLocationChange = (index, field, value) => {
        const newLocations = [...settings.locations];
        newLocations[index] = { ...newLocations[index], [field]: value };
        handleUpdate('locations', newLocations);
    };

    const addLocation = () => {
        handleUpdate('locations', [...settings.locations, { title: '', address: '', lat: 0, lng: 0, mapEmbedUrl: '' }]);
    };

    const removeLocation = (index) => {
        const newLocations = [...settings.locations];
        newLocations.splice(index, 1);
        handleUpdate('locations', newLocations);
    };

    // Social specific handlers
    const handleSocialChange = (index, field, value) => {
        const newSocials = [...settings.socialLinks];
        newSocials[index] = { ...newSocials[index], [field]: value };
        handleUpdate('socialLinks', newSocials);
    };

    const addSocial = () => {
        handleUpdate('socialLinks', [...settings.socialLinks, { platform: 'facebook', url: '' }]);
    };

    const removeSocial = (index) => {
        const newSocials = [...settings.socialLinks];
        newSocials.splice(index, 1);
        handleUpdate('socialLinks', newSocials);
    };

    const saveSettings = async () => {
        setSaving(true);
        try {
            const res = await fetch('/api/admin/site-settings', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(settings)
            });
            if (!res.ok) throw new Error();
            showSwalToast('success', 'Settings saved successfully!');
        } catch {
            showSwalToast('error', 'Failed to save settings');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-24 bg-[#0a0a0a] min-h-screen">
                <div className="w-8 h-8 rounded-full border-2 border-gray-700 border-t-white animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0a0a0a] p-6 md:p-8" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            <div className="flex items-center justify-between mb-8 max-w-4xl mx-auto">
                <div>
                    <h1 className="text-2xl font-bold text-white tracking-tight">Site Settings</h1>
                    <p className="text-gray-500 text-sm mt-1">Manage contact details, multiple locations, and social links</p>
                </div>
                <button
                    onClick={saveSettings}
                    disabled={saving}
                    className="flex items-center gap-2 bg-white text-black px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-gray-100 transition-all duration-150 shadow-lg disabled:opacity-50"
                >
                    {saving ? <div className="w-4 h-4 border-2 border-black/20 border-t-black animate-spin rounded-full" /> : <Save size={18} />}
                    Save Changes
                </button>
            </div>

            <div className="max-w-4xl mx-auto space-y-6 pb-12">
                {/* Contact Info Section */}
                <div className="bg-[#111111] rounded-2xl border border-gray-800 p-6 shadow-xl">
                    <h3 className="text-white font-bold mb-6 flex items-center gap-2">
                        <Phone size={18} className="text-gray-400" />
                        Contact Information
                    </h3>

                    <div className="space-y-6">
                        <div>
                            <label className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-2 block">Phone Numbers</label>
                            <div className="space-y-2">
                                {settings.phoneNumbers.map((num, idx) => (
                                    <div key={idx} className="flex gap-2">
                                        <input
                                            value={num}
                                            onChange={(e) => handleArrayChange('phoneNumbers', idx, e.target.value)}
                                            placeholder="Enter phone number..."
                                            className="flex-1 bg-gray-900 border border-gray-800 rounded-xl px-4 py-2.5 text-white text-sm focus:border-gray-500 outline-none transition-colors"
                                        />
                                        <button onClick={() => removeArrayItem('phoneNumbers', idx)} className="p-2.5 text-red-500 hover:bg-red-500/10 rounded-xl transition-colors">
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                ))}
                                <button onClick={() => addArrayItem('phoneNumbers')} className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors bg-white/5 px-4 py-2 rounded-lg mt-2 font-medium">
                                    <Plus size={16} /> Add Phone Number
                                </button>
                            </div>
                        </div>

                        <div>
                            <label className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-2 block">Emails</label>
                            <div className="space-y-2">
                                {settings.emails.map((email, idx) => (
                                    <div key={idx} className="flex gap-2">
                                        <input
                                            value={email}
                                            onChange={(e) => handleArrayChange('emails', idx, e.target.value)}
                                            placeholder="Enter email address..."
                                            className="flex-1 bg-gray-900 border border-gray-800 rounded-xl px-4 py-2.5 text-white text-sm focus:border-gray-500 outline-none transition-colors"
                                        />
                                        <button onClick={() => removeArrayItem('emails', idx)} className="p-2.5 text-red-500 hover:bg-red-500/10 rounded-xl transition-colors">
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                ))}
                                <button onClick={() => addArrayItem('emails')} className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors bg-white/5 px-4 py-2 rounded-lg mt-2 font-medium">
                                    <Plus size={16} /> Add Email
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Multiple Locations Section */}
                <div className="bg-[#111111] rounded-2xl border border-gray-800 p-6 shadow-xl">
                    <h3 className="text-white font-bold mb-6 flex items-center gap-2">
                        <MapPin size={18} className="text-gray-400" />
                        Offices & Locations
                    </h3>

                    <div className="space-y-8">
                        {settings.locations.map((loc, idx) => (
                            <div key={idx} className="p-6 bg-gray-900/50 rounded-2xl border border-gray-800/50 space-y-4 relative overflow-hidden group">
                                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button onClick={() => removeLocation(idx)} className="p-2 text-red-500 hover:bg-red-500/10 rounded-xl transition-colors">
                                        <Trash2 size={18} />
                                    </button>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="md:col-span-2">
                                        <label className="text-gray-500 text-[10px] font-bold uppercase tracking-widest mb-1 block">Location Title</label>
                                        <input
                                            value={loc.title}
                                            onChange={(e) => handleLocationChange(idx, 'title', e.target.value)}
                                            placeholder="e.g. Main Office / Warehouse"
                                            className="w-full bg-[#0a0a0a] border border-gray-800 rounded-xl px-4 py-2.5 text-white text-sm focus:border-gray-500 outline-none"
                                        />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="text-gray-500 text-[10px] font-bold uppercase tracking-widest mb-1 block">Full Address</label>
                                        <textarea
                                            value={loc.address}
                                            onChange={(e) => handleLocationChange(idx, 'address', e.target.value)}
                                            placeholder="Enter full address..."
                                            rows={2}
                                            className="w-full bg-[#0a0a0a] border border-gray-800 rounded-xl px-4 py-2.5 text-white text-sm focus:border-gray-500 outline-none resize-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-gray-500 text-[10px] font-bold uppercase tracking-widest mb-1 block">Latitude</label>
                                        <input
                                            type="number"
                                            step="any"
                                            value={loc.lat}
                                            onChange={(e) => handleLocationChange(idx, 'lat', parseFloat(e.target.value))}
                                            className="w-full bg-[#0a0a0a] border border-gray-800 rounded-xl px-4 py-2.5 text-white text-sm focus:border-gray-500 outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-gray-500 text-[10px] font-bold uppercase tracking-widest mb-1 block">Longitude</label>
                                        <input
                                            type="number"
                                            step="any"
                                            value={loc.lng}
                                            onChange={(e) => handleLocationChange(idx, 'lng', parseFloat(e.target.value))}
                                            className="w-full bg-[#0a0a0a] border border-gray-800 rounded-xl px-4 py-2.5 text-white text-sm focus:border-gray-500 outline-none"
                                        />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="text-gray-500 text-[10px] font-bold uppercase tracking-widest mb-1 block">Google Maps Embed URL</label>
                                        <textarea
                                            value={loc.mapEmbedUrl}
                                            onChange={(e) => handleLocationChange(idx, 'mapEmbedUrl', e.target.value)}
                                            placeholder="Paste the <iframe> src here..."
                                            rows={2}
                                            className="w-full bg-[#0a0a0a] border border-gray-800 rounded-xl px-4 py-2.5 text-white text-sm focus:border-gray-500 outline-none resize-none"
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                        <button onClick={addLocation} className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors bg-white/5 w-full justify-center py-4 rounded-2xl border-2 border-dashed border-gray-800 hover:border-gray-600 font-medium">
                            <Plus size={18} /> Add New Location
                        </button>
                    </div>
                </div>

                {/* Business Hours */}
                <div className="bg-[#111111] rounded-2xl border border-gray-800 p-6 shadow-xl">
                    <h3 className="text-white font-bold mb-6 flex items-center gap-2">
                        <Clock size={18} className="text-gray-400" />
                        Business Hours
                    </h3>
                    <div className="space-y-2">
                        {settings.businessHours.map((hour, idx) => (
                            <div key={idx} className="flex gap-2">
                                <input
                                    value={hour}
                                    onChange={(e) => handleArrayChange('businessHours', idx, e.target.value)}
                                    placeholder="e.g. Mon - Fri: 9 AM - 6 PM"
                                    className="flex-1 bg-gray-900 border border-gray-800 rounded-xl px-4 py-2.5 text-white text-sm focus:border-gray-500 outline-none"
                                />
                                <button onClick={() => removeArrayItem('businessHours', idx)} className="p-2.5 text-red-500 hover:bg-red-500/10 rounded-xl">
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        ))}
                        <button onClick={() => addArrayItem('businessHours')} className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors bg-white/5 px-4 py-2 rounded-lg mt-2 font-medium">
                            <Plus size={16} /> Add Hours Rule
                        </button>
                    </div>
                </div>

                {/* Social Links Array */}
                <div className="bg-[#111111] rounded-2xl border border-gray-800 p-6 shadow-xl">
                    <h3 className="text-white font-bold mb-6 flex items-center gap-2">
                        <Share2 size={18} className="text-gray-400" />
                        Social Media Links
                    </h3>

                    <div className="space-y-4">
                        {settings.socialLinks.map((social, idx) => (
                            <div key={idx} className="flex flex-wrap md:flex-nowrap gap-4 items-end bg-gray-900/50 p-4 rounded-xl border border-gray-800/50">
                                <div className="flex-1 min-w-[150px]">
                                    <label className="text-gray-500 text-[10px] font-bold uppercase tracking-widest mb-1 block">Platform</label>
                                    <select
                                        value={social.platform}
                                        onChange={(e) => handleSocialChange(idx, 'platform', e.target.value)}
                                        className="w-full bg-[#0a0a0a] border border-gray-800 rounded-xl px-4 py-2.5 text-white text-sm focus:border-gray-500 outline-none appearance-none"
                                    >
                                        <option value="facebook">Facebook</option>
                                        <option value="instagram">Instagram</option>
                                        <option value="twitter">Twitter / X</option>
                                        <option value="linkedin">LinkedIn</option>
                                        <option value="youtube">YouTube</option>
                                        <option value="tiktok">TikTok</option>
                                        <option value="whatsapp">WhatsApp</option>
                                    </select>
                                </div>
                                <div className="flex-[2] min-w-[200px]">
                                    <label className="text-gray-500 text-[10px] font-bold uppercase tracking-widest mb-1 block">URL</label>
                                    <input
                                        value={social.url}
                                        onChange={(e) => handleSocialChange(idx, 'url', e.target.value)}
                                        placeholder="https://..."
                                        className="w-full bg-[#0a0a0a] border border-gray-800 rounded-xl px-4 py-2.5 text-white text-sm focus:border-gray-500 outline-none"
                                    />
                                </div>
                                <button onClick={() => removeSocial(idx)} className="mb-1 p-2.5 text-red-500 hover:bg-red-500/10 rounded-xl transition-colors">
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        ))}
                        <button onClick={addSocial} className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors bg-white/5 px-4 py-2 rounded-lg mt-2 font-medium">
                            <Plus size={16} /> Add Social Link
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
