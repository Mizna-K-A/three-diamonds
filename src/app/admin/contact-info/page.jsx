'use client';

import { useState, useEffect } from 'react';
import { Save, Phone, Mail, MapPin, Facebook, Instagram, Linkedin, MessageCircle, Clock, Plus, Trash2, Globe, Youtube, Twitter } from 'lucide-react';
import Swal from 'sweetalert2';

export default function ContactInfoAdmin() {
    const [settings, setSettings] = useState({
        phoneNumbers: [''],
        emails: [''],
        locations: [{ title: '', address: '', lat: 0, lng: 0, mapEmbedUrl: '' }],
        businessHours: [''],
        socialLinks: [{ platform: 'facebook', url: '' }]
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

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
                popup: 'rounded-xl border border-gray-800'
            }
        });
    };

    const fetchSettings = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/admin/contact-settings');
            const result = await res.json();
            if (result.success) {
                // Ensure arrays exist to avoid crashes
                const data = result.data;
                setSettings({
                    phoneNumbers: data.phoneNumbers?.length ? data.phoneNumbers : [''],
                    emails: data.emails?.length ? data.emails : [''],
                    locations: data.locations?.length ? data.locations : [{ title: '', address: '', lat: 0, lng: 0, mapEmbedUrl: '' }],
                    businessHours: data.businessHours?.length ? data.businessHours : [''],
                    socialLinks: data.socialLinks?.length ? data.socialLinks : [{ platform: 'facebook', url: '' }]
                });
            }
        } catch (error) {
            showToast('error', 'Failed to load settings');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchSettings(); }, []);

    const handleArrayChange = (field, index, value) => {
        const newArr = [...settings[field]];
        newArr[index] = value;
        setSettings(prev => ({ ...prev, [field]: newArr }));
    };

    const handleObjectArrayChange = (field, index, subField, value) => {
        const newArr = [...settings[field]];
        newArr[index] = { ...newArr[index], [subField]: value };
        setSettings(prev => ({ ...prev, [field]: newArr }));
    };

    const addArrayItem = (field, defaultValue = '') => {
        setSettings(prev => ({ ...prev, [field]: [...prev[field], defaultValue] }));
    };

    const removeArrayItem = (field, index) => {
        if (settings[field].length > 1) {
            const newArr = settings[field].filter((_, i) => i !== index);
            setSettings(prev => ({ ...prev, [field]: newArr }));
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            // Filter out empty items before saving
            const filteredSettings = {
                phoneNumbers: settings.phoneNumbers.filter(p => p.trim() !== ''),
                emails: settings.emails.filter(e => e.trim() !== ''),
                locations: settings.locations.filter(l => l.address.trim() !== ''),
                businessHours: settings.businessHours.filter(h => h.trim() !== ''),
                socialLinks: settings.socialLinks.filter(s => s.url.trim() !== '')
            };

            const res = await fetch('/api/admin/contact-settings', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(filteredSettings),
            });
            const result = await res.json();
            if (result.success) {
                showToast('success', 'Settings updated successfully!');
                fetchSettings(); // Refresh with clean data
            } else {
                throw new Error(result.message);
            }
        } catch (error) {
            showToast('error', error.message || 'Failed to save settings');
        } finally {
            setSaving(false);
        }
    };

    const getSocialIcon = (platform) => {
        switch (platform) {
            case 'facebook': return <Facebook size={14} />;
            case 'instagram': return <Instagram size={14} />;
            case 'linkedin': return <Linkedin size={14} />;
            case 'whatsapp': return <MessageCircle size={14} />;
            case 'youtube': return <Youtube size={14} />;
            case 'twitter': return <Twitter size={14} />;
            default: return <Globe size={14} />;
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-24 min-h-screen bg-[#0a0a0a]">
                <div className="w-8 h-8 rounded-full border-2 border-gray-700 border-t-white animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0a0a0a] p-6 md:p-8" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-white tracking-tight">Site Settings</h1>
                    <p className="text-gray-500 text-sm mt-1">Manage public contact details, multiple locations, and social media</p>
                </div>
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center gap-2 bg-white text-black px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-gray-100 transition-all duration-150 shadow-lg disabled:opacity-50"
                >
                    {saving ? <div className="w-4 h-4 border-2 border-gray-400 border-t-black animate-spin rounded-full" /> : <Save size={16} />}
                    Save Changes
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Phone Numbers & Emails */}
                <div className="space-y-8">
                    {/* Phone Numbers */}
                    <div className="bg-[#111111] rounded-2xl border border-gray-800 p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                                <Phone size={18} className="text-gray-400" />
                                Phone Numbers
                            </h2>
                            <button onClick={() => addArrayItem('phoneNumbers')} className="text-xs bg-gray-800 text-gray-300 px-3 py-1 rounded-lg hover:bg-gray-700 transition-colors flex items-center gap-1">
                                <Plus size={12} /> Add
                            </button>
                        </div>
                        <div className="space-y-3">
                            {settings.phoneNumbers.map((phone, idx) => (
                                <div key={idx} className="flex gap-2">
                                    <input
                                        value={phone}
                                        onChange={e => handleArrayChange('phoneNumbers', idx, e.target.value)}
                                        className="flex-1 bg-gray-900 border border-gray-800 rounded-xl px-4 py-2 text-white text-sm focus:border-gray-600 outline-none"
                                        placeholder="+971 50 123 4567"
                                    />
                                    <button onClick={() => removeArrayItem('phoneNumbers', idx)} className="p-2 text-gray-500 hover:text-red-500 transition-colors">
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Emails */}
                    <div className="bg-[#111111] rounded-2xl border border-gray-800 p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                                <Mail size={18} className="text-gray-400" />
                                Email Addresses
                            </h2>
                            <button onClick={() => addArrayItem('emails')} className="text-xs bg-gray-800 text-gray-300 px-3 py-1 rounded-lg hover:bg-gray-700 transition-colors flex items-center gap-1">
                                <Plus size={12} /> Add
                            </button>
                        </div>
                        <div className="space-y-3">
                            {settings.emails.map((email, idx) => (
                                <div key={idx} className="flex gap-2">
                                    <input
                                        value={email}
                                        onChange={e => handleArrayChange('emails', idx, e.target.value)}
                                        className="flex-1 bg-gray-900 border border-gray-800 rounded-xl px-4 py-2 text-white text-sm focus:border-gray-600 outline-none"
                                        placeholder="info@threediamonds.ae"
                                    />
                                    <button onClick={() => removeArrayItem('emails', idx)} className="p-2 text-gray-500 hover:text-red-500 transition-colors">
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Business Hours */}
                    <div className="bg-[#111111] rounded-2xl border border-gray-800 p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                                <Clock size={18} className="text-gray-400" />
                                Business Hours
                            </h2>
                            <button onClick={() => addArrayItem('businessHours')} className="text-xs bg-gray-800 text-gray-300 px-3 py-1 rounded-lg hover:bg-gray-700 transition-colors flex items-center gap-1">
                                <Plus size={12} /> Add
                            </button>
                        </div>
                        <div className="space-y-3">
                            {settings.businessHours.map((hour, idx) => (
                                <div key={idx} className="flex gap-2">
                                    <input
                                        value={hour}
                                        onChange={e => handleArrayChange('businessHours', idx, e.target.value)}
                                        className="flex-1 bg-gray-900 border border-gray-800 rounded-xl px-4 py-2 text-white text-sm focus:border-gray-600 outline-none"
                                        placeholder="Mon - Fri: 9:00 AM - 6:00 PM"
                                    />
                                    <button onClick={() => removeArrayItem('businessHours', idx)} className="p-2 text-gray-500 hover:text-red-500 transition-colors">
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Social Media & Locations */}
                <div className="space-y-8">
                    {/* Social Media */}
                    <div className="bg-[#111111] rounded-2xl border border-gray-800 p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                                <Globe size={18} className="text-gray-400" />
                                Social Presence
                            </h2>
                            <button onClick={() => addArrayItem('socialLinks', { platform: 'facebook', url: '' })} className="text-xs bg-gray-800 text-gray-300 px-3 py-1 rounded-lg hover:bg-gray-700 transition-colors flex items-center gap-1">
                                <Plus size={12} /> Add Platform
                            </button>
                        </div>
                        <div className="space-y-4">
                            {settings.socialLinks.map((social, idx) => (
                                <div key={idx} className="flex gap-3 items-center">
                                    <select
                                        value={social.platform}
                                        onChange={e => handleObjectArrayChange('socialLinks', idx, 'platform', e.target.value)}
                                        className="bg-gray-900 border border-gray-800 rounded-xl px-3 py-2 text-white text-xs outline-none focus:border-gray-600"
                                    >
                                        <option value="facebook">Facebook</option>
                                        <option value="instagram">Instagram</option>
                                        <option value="linkedin">LinkedIn</option>
                                        <option value="whatsapp">WhatsApp</option>
                                        <option value="youtube">YouTube</option>
                                        <option value="twitter">X (Twitter)</option>
                                    </select>
                                    <div className="flex-1 flex gap-2 items-center">
                                        <div className="text-gray-500">
                                            {getSocialIcon(social.platform)}
                                        </div>
                                        <input
                                            value={social.url}
                                            onChange={e => handleObjectArrayChange('socialLinks', idx, 'url', e.target.value)}
                                            className="flex-1 bg-gray-900 border border-gray-800 rounded-xl px-4 py-2 text-white text-sm focus:border-gray-600 outline-none"
                                            placeholder="https://..."
                                        />
                                    </div>
                                    <button onClick={() => removeArrayItem('socialLinks', idx)} className="p-2 text-gray-500 hover:text-red-500 transition-colors">
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Locations */}
                    <div className="bg-[#111111] rounded-2xl border border-gray-800 p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                                <MapPin size={18} className="text-gray-400" />
                                Office Locations
                            </h2>
                            <button onClick={() => addArrayItem('locations', { title: '', address: '', lat: 0, lng: 0, mapEmbedUrl: '' })} className="text-xs bg-gray-800 text-gray-300 px-3 py-1 rounded-lg hover:bg-gray-700 transition-colors flex items-center gap-1">
                                <Plus size={12} /> Add Office
                            </button>
                        </div>
                        <div className="space-y-6">
                            {settings.locations.map((loc, idx) => (
                                <div key={idx} className="p-4 bg-gray-900/50 rounded-2xl border border-gray-800 space-y-4 relative">
                                    <button onClick={() => removeArrayItem('locations', idx)} className="absolute top-4 right-4 text-gray-500 hover:text-red-500 transition-colors">
                                        <Trash2 size={14} />
                                    </button>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-gray-500 text-[10px] font-bold uppercase tracking-wider mb-1 block">Office Title</label>
                                            <input
                                                value={loc.title}
                                                onChange={e => handleObjectArrayChange('locations', idx, 'title', e.target.value)}
                                                className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-2 text-white text-sm focus:border-gray-600 outline-none"
                                                placeholder="Main Office"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-gray-500 text-[10px] font-bold uppercase tracking-wider mb-1 block">Full Address</label>
                                            <input
                                                value={loc.address}
                                                onChange={e => handleObjectArrayChange('locations', idx, 'address', e.target.value)}
                                                className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-2 text-white text-sm focus:border-gray-600 outline-none"
                                                placeholder="Al Quoz Industrial Area..."
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-gray-500 text-[10px] font-bold uppercase tracking-wider mb-1 block">Map Embed URL (src)</label>
                                        <input
                                            value={loc.mapEmbedUrl}
                                            onChange={e => handleObjectArrayChange('locations', idx, 'mapEmbedUrl', e.target.value)}
                                            className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-2 text-white text-sm focus:border-gray-600 outline-none"
                                            placeholder="https://google.com/maps/embed?..."
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-gray-500 text-[10px] font-bold uppercase tracking-wider mb-1 block">Latitude</label>
                                            <input
                                                type="number"
                                                step="any"
                                                value={loc.lat}
                                                onChange={e => handleObjectArrayChange('locations', idx, 'lat', parseFloat(e.target.value))}
                                                className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-2 text-white text-sm focus:border-gray-600 outline-none"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-gray-500 text-[10px] font-bold uppercase tracking-wider mb-1 block">Longitude</label>
                                            <input
                                                type="number"
                                                step="any"
                                                value={loc.lng}
                                                onChange={e => handleObjectArrayChange('locations', idx, 'lng', parseFloat(e.target.value))}
                                                className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-2 text-white text-sm focus:border-gray-600 outline-none"
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
