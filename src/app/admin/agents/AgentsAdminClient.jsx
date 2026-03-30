'use client';

import { useState, useRef } from 'react';
import { Plus, Trash2, Save, Upload, CheckCircle, AlertCircle, Mail, Phone, User } from 'lucide-react';
import Swal from 'sweetalert2';
import {
    createAgent,
    updateAgent,
    deleteAgent,
} from './actions';

export default function AgentsAdminClient({ initialAgents }) {
    const [agents, setAgents] = useState(initialAgents.map((a) => ({ ...a, _dirty: false })));
    const [saving, setSaving] = useState(null); // agent id or 'all'
    const [deleting, setDeleting] = useState(null);
    const [uploading, setUploading] = useState(null);
    const [toast, setToast] = useState(null);
    const fileInputRefs = useRef({});

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
        setAgents((prev) =>
            prev.map((a) => (a._id === id ? { ...a, [field]: value, _dirty: true } : a))
        );
    };

    const saveAllAgents = async () => {
        const dirtyAgents = agents.filter(a => a._dirty);
        if (dirtyAgents.length === 0) return;

        setSaving('all');
        try {
            await Promise.all(
                dirtyAgents.map(agent =>
                    updateAgent(agent._id, {
                        name: agent.name,
                        phone: agent.phone,
                        email: agent.email,
                        image: agent.image,
                    })
                )
            );

            setAgents(prev => prev.map(a => ({ ...a, _dirty: false })));

            await showAlert({
                icon: 'success',
                title: 'All Saved!',
                text: `${dirtyAgents.length} agents have been updated successfully.`,
                timer: 2000,
                showConfirmButton: false
            });
        } catch (error) {
            console.error('Save all error:', error);
            await showAlert({
                icon: 'error',
                title: 'Error',
                text: 'Failed to save some agents. Please try again.',
            });
        } finally {
            setSaving(null);
        }
    };

    const deleteAgentHandler = async (id) => {
        const result = await Swal.fire({
            title: 'Delete Agent?',
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
            await deleteAgent(id);
            setAgents((prev) => prev.filter((a) => a._id !== id));

            await showAlert({
                icon: 'success',
                title: 'Deleted!',
                text: 'Agent has been deleted.',
                timer: 2000,
                showConfirmButton: false
            });
        } catch {
            await showAlert({
                icon: 'error',
                title: 'Error',
                text: 'Failed to delete agent. Please try again.',
            });
        } finally {
            setDeleting(null);
        }
    };

    const addAgent = async () => {
        try {
            const newAgent = await createAgent({
                name: 'New Agent',
                phone: '+1 000 000 0000',
                email: 'agent@example.com',
                image: '/avatar.jpg', // Default image
            });
            setAgents((prev) => [{ ...newAgent, _dirty: false }, ...prev]);

            await showAlert({
                icon: 'success',
                title: 'Added!',
                text: 'New agent has been created.',
                timer: 2000,
                showConfirmButton: false
            });
        } catch {
            await showAlert({
                icon: 'error',
                title: 'Error',
                text: 'Failed to add agent. Please try again.',
            });
        }
    };

    const uploadImage = async (agentId, file) => {
        setUploading(agentId);
        try {
            const formData = new FormData();
            formData.append('file', file);
            const res = await fetch('/api/admin/upload', { method: 'POST', body: formData });
            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.error || 'Upload failed');
            }
            const { url } = await res.json();
            updateField(agentId, 'image', url);

            await showAlert({
                icon: 'success',
                title: 'Uploaded!',
                text: 'Image has been uploaded and converted to WebP!',
                timer: 2000,
                showConfirmButton: false
            });
        } catch (error) {
            console.error('Upload error:', error);
            await showAlert({
                icon: 'error',
                title: 'Upload Failed',
                text: error.message || 'Image upload failed. Please try again.',
            });
        } finally {
            setUploading(null);
        }
    };

    const hasChanges = agents.some(a => a._dirty);

    return (
        <div className="min-h-screen bg-[#0a0a0a] p-6 md:p-8" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-white tracking-tight">Property Agents</h1>
                    <p className="text-gray-500 text-sm mt-1">Manage agents for property listings</p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={saveAllAgents}
                        disabled={saving === 'all' || !hasChanges}
                        className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 shadow-lg ${hasChanges
                            ? 'bg-green-600 text-white hover:bg-green-500 hover:scale-105 active:scale-95'
                            : 'bg-gray-800 text-gray-500 cursor-not-allowed opacity-50'
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
                        onClick={addAgent}
                        className="flex items-center gap-2 bg-white text-black px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-gray-100 transition-all duration-150 shadow-lg"
                    >
                        <Plus size={16} />
                        Add Agent
                    </button>
                </div>
            </div>

            {/* Empty state */}
            {agents.length === 0 && (
                <div className="text-center py-24 text-gray-600">
                    <p className="text-lg">No agents yet.</p>
                    <p className="text-sm mt-1">Click &quot;Add Agent&quot; to get started.</p>
                </div>
            )}

            {/* Agents List */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                {agents.map((agent) => (
                    <div
                        key={agent._id}
                        className={`bg-[#111111] rounded-2xl border transition-all duration-200 overflow-hidden ${agent._dirty ? 'border-green-900/50 bg-[#121412]' : 'border-gray-800'
                            }`}
                    >
                        <div className="p-6">
                            <div className="flex gap-6">
                                {/* Image Upload */}
                                <div className="shrink-0">
                                    <div
                                        className="w-32 h-32 rounded-2xl bg-gray-900 overflow-hidden border border-gray-800 relative group cursor-pointer"
                                        onClick={() => fileInputRefs.current[agent._id]?.click()}
                                    >
                                        {agent.image && (
                                            <img
                                                src={agent.image}
                                                alt={agent.name}
                                                className="w-full h-full object-cover"
                                            />
                                        )}
                                        <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                            {uploading === agent._id ? (
                                                <div className="w-5 h-5 rounded-full border-2 border-gray-400 border-t-white animate-spin" />
                                            ) : (
                                                <>
                                                    <Upload size={20} className="text-white" />
                                                    <span className="text-white text-[10px] font-medium">Change Photo</span>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        ref={(el) => (fileInputRefs.current[agent._id] = el)}
                                        onChange={(e) => {
                                            const file = e.target.files?.[0];
                                            if (file) uploadImage(agent._id, file);
                                            e.target.value = '';
                                        }}
                                    />
                                    <p className="text-gray-600 text-[10px] text-center mt-2 font-medium uppercase tracking-wider">
                                        Agent Photo
                                    </p>
                                </div>

                                {/* Fields */}
                                <div className="flex-1 space-y-4">
                                    <div className="relative">
                                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                                            <User size={16} />
                                        </div>
                                        <input
                                            value={agent.name}
                                            onChange={(e) => updateField(agent._id, 'name', e.target.value)}
                                            placeholder="Agent Name"
                                            className="w-full bg-gray-900 border border-gray-800 rounded-xl pl-10 pr-4 py-2.5 text-white text-sm focus:outline-none focus:border-gray-600 transition-colors"
                                        />
                                    </div>
                                    <div className="relative">
                                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                                            <Phone size={16} />
                                        </div>
                                        <input
                                            value={agent.phone}
                                            onChange={(e) => updateField(agent._id, 'phone', e.target.value)}
                                            placeholder="Phone Number"
                                            className="w-full bg-gray-900 border border-gray-800 rounded-xl pl-10 pr-4 py-2.5 text-white text-sm focus:outline-none focus:border-gray-600 transition-colors"
                                        />
                                    </div>
                                    <div className="relative">
                                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                                            <Mail size={16} />
                                        </div>
                                        <input
                                            value={agent.email}
                                            onChange={(e) => updateField(agent._id, 'email', e.target.value)}
                                            placeholder="Email Address"
                                            className="w-full bg-gray-900 border border-gray-800 rounded-xl pl-10 pr-4 py-2.5 text-white text-sm focus:outline-none focus:border-gray-600 transition-colors"
                                        />
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex flex-col gap-2">
                                    <button
                                        onClick={() => deleteAgentHandler(agent._id)}
                                        disabled={deleting === agent._id}
                                        className="p-2.5 rounded-xl text-red-500 bg-red-500/5 border border-red-500/10 hover:bg-red-500/10 hover:border-red-500/20 transition-all duration-150"
                                        title="Delete Agent"
                                    >
                                        {deleting === agent._id ? (
                                            <div className="w-5 h-5 rounded-full border-2 border-red-500/30 border-t-red-500 animate-spin" />
                                        ) : (
                                            <Trash2 size={20} />
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Unsaved indicator */}
                        {agent._dirty && (
                            <div className="px-6 py-2 bg-green-500/5 border-t border-green-900/30 text-[10px] text-green-500 font-bold uppercase tracking-widest flex items-center gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                                Unsaved Changes
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
