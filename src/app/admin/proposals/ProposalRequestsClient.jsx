'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Download, FileText, Mail, Phone, ExternalLink, Loader2 } from 'lucide-react';
import jsPDF from 'jspdf';
import { buildProposalPDF } from '../../../../lib/buildProposalPDF';

export default function ProposalRequestsClient({ initialProposals }) {
    const [proposals, setProposals] = useState(initialProposals);
    const [generatingId, setGeneratingId] = useState(null);
    const [notifyingId, setNotifyingId] = useState(null);

    const notifyAgent = async (proposalId) => {
        setNotifyingId(proposalId);
        try {
            const response = await fetch('/api/admin/notify-agent', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ proposalId }),
            });
            const data = await response.json();
            if (data.success) {
                alert('Notification sent to agent successfully!');
            } else {
                alert(data.message || 'Failed to send notification');
            }
        } catch (error) {
            console.error('Error notifying agent:', error);
            alert('An error occurred. Please try again.');
        } finally {
            setNotifyingId(null);
        }
    };

    const generatePDF = async (proposal) => {
        setGeneratingId(proposal.id);
        try {
            const property = proposal.property;

            if (!property) {
                throw new Error('No property details available for this proposal');
            }

            // Load logo as base64 for watermark
            let logoBase64 = null;
            try {
                const res = await fetch('/logoooo.png');
                const buf = await res.arrayBuffer();
                logoBase64 = btoa(String.fromCharCode(...new Uint8Array(buf)));
            } catch { /* watermark is cosmetic — skip if missing */ }

            const doc = buildProposalPDF(
                new jsPDF(),
                property,
                { name: proposal.name, email: proposal.email, phone: proposal.phone },
                logoBase64
            );

            doc.save(`Proposal_${(property.title || 'Property').replace(/\s+/g, '_')}.pdf`);
        } catch (error) {
            console.error('Error generating PDF:', error);
            alert('Failed to generate PDF. Please try again.');
        } finally {
            setGeneratingId(null);
        }
    };



    function StatusBadge({ status }) {
        const statusConfig = {
            new: { bg: 'bg-blue-500/20', text: 'text-blue-300', border: 'border-blue-500/30', dot: 'bg-blue-400', label: 'New' },
            processed: { bg: 'bg-yellow-500/20', text: 'text-yellow-300', border: 'border-yellow-500/30', dot: 'bg-yellow-400', label: 'Processed' },
            completed: { bg: 'bg-green-500/20', text: 'text-green-300', border: 'border-green-500/30', dot: 'bg-green-400', label: 'Completed' },
        };

        const config = statusConfig[status?.toLowerCase()] || statusConfig.new;

        return (
            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text} border ${config.border}`}>
                <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${config.dot}`}></span>
                {config.label}
            </span>
        );
    }

    return (
        <div className="bg-gray-900/40 backdrop-blur-sm border border-gray-800 rounded-2xl shadow-2xl overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="bg-gray-900 border-b border-gray-800">
                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Created</th>
                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Property & Agent</th>
                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Customer</th>
                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-4 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800">
                        {proposals.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="px-6 py-16 text-center text-gray-400">
                                    No proposal requests yet
                                </td>
                            </tr>
                        ) : (
                            proposals.map((v, index) => (
                                <tr key={v.id} className="hover:bg-white/5 transition-colors group">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex flex-col">
                                            <time className="text-sm text-gray-300 font-medium">
                                                {new Date(v.createdAt).toLocaleDateString()}
                                            </time>
                                            <span className="text-xs text-gray-500">
                                                {new Date(v.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                    </td>

                                    <td className="px-6 py-4">
                                        <div className="flex flex-col gap-1 max-w-xs">
                                            <Link
                                                href={`/admin/properties/${v.propertyId}`}
                                                className="text-blue-400 hover:text-blue-300 transition-colors font-medium truncate"
                                            >
                                                {v.propertyTitle}
                                            </Link>
                                            {v.agentEmail && (
                                                <span className="text-xs text-emerald-400/80 flex items-center gap-1">
                                                    <Loader2 size={10} className="animate-pulse" />
                                                    Notified: {v.agentName || v.agentEmail}
                                                </span>
                                            )}
                                        </div>
                                    </td>

                                    <td className="px-6 py-4">
                                        <div className="flex flex-col">
                                            <span className="font-medium text-white">{v.name}</span>
                                            <div className="flex items-center gap-3 mt-1">
                                                <a href={`mailto:${v.email}`} title={v.email} className="text-gray-500 hover:text-blue-400 transition-colors">
                                                    <Mail size={14} />
                                                </a>
                                                <a href={`tel:${v.phone}`} title={v.phone} className="text-gray-500 hover:text-blue-400 transition-colors">
                                                    <Phone size={14} />
                                                </a>
                                            </div>
                                        </div>
                                    </td>

                                    <td className="px-6 py-4">
                                        <StatusBadge status={v.status} />
                                    </td>

                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <a href={`mailto:${v.agentEmail}`}>

                                                <button
                                                    // onClick={() => notifyAgent(v.id)}
                                                    disabled={notifyingId === v.id || !v.agentEmail}
                                                    title={v.agentEmail ? `Notify ${v.agentName || v.agentEmail}` : 'No agent assigned'}
                                                    className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 rounded-lg transition-all border border-emerald-500/20 disabled:opacity-30 disabled:cursor-not-allowed"
                                                >
                                                    {notifyingId === v.id ? (
                                                        <Loader2 size={14} className="animate-spin" />
                                                    ) : (
                                                        <Mail size={14} />
                                                    )}
                                                    <span className="text-xs font-medium">Notify Agent</span>
                                                </button>
                                            </a>

                                            <button
                                                onClick={() => generatePDF(v)}
                                                disabled={generatingId === v.id}
                                                className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white rounded-lg transition-all border border-gray-700 disabled:opacity-50"
                                            >
                                                {generatingId === v.id ? (
                                                    <Loader2 size={14} className="animate-spin" />
                                                ) : (
                                                    <FileText size={14} />
                                                )}
                                                <span className="text-xs font-medium">Generate PDF</span>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
