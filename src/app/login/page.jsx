'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

const AdminLoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        try {

            const res = await fetch("/api/admin/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include",   // ⭐ important for cookies
                body: JSON.stringify({ email, password })
            });

            const data = await res.json();

            if (!data.success) {
                setError(data.message);
                return;
            }

            router.push("/admin");   // redirect after login

        } catch (error) {
            setError("Login failed");
        } finally {
            setIsLoading(false);
        }
    };

    const inputStyle = {
        width: '100%',
        padding: '11px 12px 11px 38px',
        background: '#111',
        border: '1px solid #2a2a2a',
        color: '#fff',
        fontSize: '14px',
        outline: 'none',
        borderRadius: '8px',
        boxSizing: 'border-box',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        transition: 'border-color 0.2s',
    };

    return (
        <div style={{
            minHeight: '100vh',
            backgroundColor: '#000',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
            position: 'relative',
            overflow: 'hidden',
        }}>
            {/* Grid background */}
            <div style={{
                position: 'absolute', inset: 0,
                backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
                backgroundSize: '40px 40px',
                pointerEvents: 'none',
            }} />

            {/* Corner decorations */}
            <div style={{ position: 'absolute', top: '32px', left: '32px', width: '48px', height: '48px', borderLeft: '1px solid #2a2a2a', borderTop: '1px solid #2a2a2a', borderRadius: '6px 0 0 0', pointerEvents: 'none' }} />
            <div style={{ position: 'absolute', bottom: '32px', right: '32px', width: '48px', height: '48px', borderRight: '1px solid #2a2a2a', borderBottom: '1px solid #2a2a2a', borderRadius: '0 0 6px 0', pointerEvents: 'none' }} />

            {/* Card */}
            <div style={{ position: 'relative', width: '100%', maxWidth: '440px' }}>
                <div style={{
                    background: '#0a0a0a',
                    border: '1px solid #1e1e1e',
                    borderRadius: '16px',
                    padding: '36px',
                    boxShadow: '0 30px 80px rgba(0,0,0,0.9)',
                }}>

                    {/* Header */}
                    <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '18px' }}>
                            <div style={{
                                width: '56px', height: '56px',
                                background: '#fff',
                                borderRadius: '14px',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                            }}>
                                <svg width="28" height="28" fill="none" stroke="#000" viewBox="0 0 24 24" strokeWidth="1.5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                                </svg>
                            </div>
                        </div>
                        <h1 style={{ fontSize: '20px', fontWeight: '600', color: '#fff', margin: '0 0 6px 0' }}>
                            Administrator Access
                        </h1>
                        <p style={{ fontSize: '13px', color: '#555', margin: 0 }}>Secure authentication required</p>
                    </div>

                    {/* Error */}
                    {error && (
                        <div style={{ marginBottom: '20px', padding: '12px 14px', background: '#111', border: '1px solid #2a2a2a', borderLeft: '3px solid #fff', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <svg width="16" height="16" fill="none" stroke="#aaa" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <p style={{ color: '#aaa', fontSize: '13px', margin: 0 }}>{error}</p>
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleSubmit}>

                        {/* Email */}
                        <div style={{ marginBottom: '18px' }}>
                            <label style={{ display: 'block', fontSize: '13px', color: '#888', marginBottom: '7px' }}>
                                Email Address
                            </label>
                            <div style={{ position: 'relative' }}>
                                <div style={{ position: 'absolute', left: '11px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
                                    <svg width="16" height="16" fill="none" stroke="#555" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="admin@company.com"
                                    required
                                    style={inputStyle}
                                    onFocus={e => e.target.style.borderColor = '#555'}
                                    onBlur={e => e.target.style.borderColor = '#2a2a2a'}
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div style={{ marginBottom: '18px' }}>
                            <label style={{ display: 'block', fontSize: '13px', color: '#888', marginBottom: '7px' }}>
                                Password
                            </label>
                            <div style={{ position: 'relative' }}>
                                <div style={{ position: 'absolute', left: '11px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
                                    <svg width="16" height="16" fill="none" stroke="#555" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                    </svg>
                                </div>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Enter your password"
                                    required
                                    style={{ ...inputStyle, paddingRight: '42px' }}
                                    onFocus={e => e.target.style.borderColor = '#555'}
                                    onBlur={e => e.target.style.borderColor = '#2a2a2a'}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    style={{ position: 'absolute', right: '11px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', padding: 0, color: '#555' }}
                                >
                                    {showPassword ? (
                                        <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                        </svg>
                                    ) : (
                                        <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.543 7-1.275 4.057-5.065 7-9.543 7-4.477 0-8.268-2.943-9.543-7z" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Remember me & Forgot */}
                        {/* <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
                            <button type="button" style={{ fontSize: '13px', color: '#666', background: 'none', border: 'none', cursor: 'pointer', padding: 0, textDecoration: 'underline', textDecorationColor: '#333', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>
                                Forgot password?
                            </button>
                        </div> */}

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            style={{
                                width: '100%', padding: '12px',
                                background: isLoading ? '#1a1a1a' : '#fff',
                                color: isLoading ? '#555' : '#000',
                                border: 'none', borderRadius: '8px',
                                fontSize: '14px', fontWeight: '500',
                                cursor: isLoading ? 'not-allowed' : 'pointer',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                                fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
                                transition: 'background 0.2s',
                                marginBottom: '20px',
                            }}
                        >
                            {isLoading ? (
                                <>
                                    <svg style={{ animation: 'spin 1s linear infinite' }} width="16" height="16" fill="none" viewBox="0 0 24 24">
                                        <circle cx="12" cy="12" r="10" stroke="#444" strokeWidth="3" />
                                        <path fill="#777" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                    </svg>
                                    Authenticating...
                                </>
                            ) : (
                                <>
                                    <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                                    </svg>
                                    Login
                                </>
                            )}
                        </button>
                    </form>
                </div>
            </div>

            <style>{`
                @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
                input::placeholder { color: #3a3a3a; }
                * { box-sizing: border-box; }
            `}</style>
        </div>
    );
};

export default AdminLoginPage;