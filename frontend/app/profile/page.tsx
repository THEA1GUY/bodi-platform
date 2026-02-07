"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getApiUrl } from '@/lib/api';
import Image from 'next/image';

type User = {
    id: string;
    name: string;
    email: string;
    phone: string;
    verification_level: string;
    trust_score: number;
};

export default function ProfilePage() {
    const [user, setUser] = useState<User | null>(null);
    const [selectedVerification, setSelectedVerification] = useState('');

    const userId = "USR-001"; // Mock - would come from auth

    useEffect(() => {
        loadUserData();
    }, []);

    const loadUserData = async () => {
        try {
            const res = await fetch(getApiUrl(`/api/users/${userId}`));
            const data = await res.json();
            setUser(data);
        } catch (err) {
            console.error("Failed to load user:", err);
        }
    };

    const upgradeVerification = async (level: string) => {
        try {
            const res = await fetch(getApiUrl(`/api/users/${userId}/verify`), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    user_id: userId,
                    level: level,
                    nin_number: level === 'nin_bvn' ? "12345678901" : null
                })
            });
            const data = await res.json();
            alert(data.message);
            loadUserData();
        } catch (err) {
            console.error("Verification error:", err);
        }
    };

    if (!user) return <div className="loading-screen">Loading profile...</div>;

    return (
        <div className="app-container">
            <header className="app-header">
                <Link href="/" className="logo">
                    <Image
                        src="/bodi-logo.png"
                        alt="BODI"
                        width={120}
                        height={35}
                        style={{ objectFit: 'contain' }}
                    />
                </Link>
                <div className="header-actions">
                    <Link href="/properties" className="text-btn">Properties</Link>
                    <Link href="/community" className="text-btn">Community</Link>
                </div>
            </header>

            <main className="profile-container">
                <div className="profile-grid">
                    {/* User Info Card */}
                    <div className="card profile-card">
                        <div className="profile-avatar">
                            <div className="avatar-circle">{user.name.charAt(0)}</div>
                        </div>

                        <h2>{user.name}</h2>
                        <p className="user-email">{user.email}</p>
                        <p className="user-phone">{user.phone}</p>

                        <div className="verification-status">
                            <h3>Verification Level</h3>
                            <span className="verification-badge">
                                {user.verification_level === 'nin_bvn' && '✓ NIN/BVN Verified'}
                                {user.verification_level === 'video' && '✓ Video Verified'}
                                {user.verification_level === 'phone' && '📱 Phone Only'}
                                {user.verification_level === 'biometric' && '✓ Biometric Verified'}
                            </span>
                        </div>

                        <div className="trust-score-display">
                            <h3>Trust Score</h3>
                            <div className="score-circle">{user.trust_score}</div>
                            <p className="score-label">Out of 1000</p>
                        </div>
                    </div>

                    {/* Verification Upgrade Card */}
                    <div className="card verification-upgrade-card">
                        <h2>🔐 Upgrade Verification</h2>
                        <p>Higher verification = More trust = Better deals</p>

                        <div className="verification-options">
                            <div className="verification-option">
                                <h4>📱 Phone Verification</h4>
                                <p>Basic SMS verification</p>
                                <span className="status-completed">✓ Completed</span>
                            </div>

                            <div className="verification-option">
                                <h4>🆔 NIN/BVN Verification</h4>
                                <p>Government ID verification</p>
                                {user.verification_level === 'nin_bvn' || user.verification_level === 'video' || user.verification_level === 'biometric' ? (
                                    <span className="status-completed">✓ Completed</span>
                                ) : (
                                    <button
                                        onClick={() => upgradeVerification('nin_bvn')}
                                        className="btn btn-primary btn-sm"
                                    >
                                        Upgrade Now
                                    </button>
                                )}
                            </div>

                            <div className="verification-option">
                                <h4>📹 Video Verification</h4>
                                <p>Live video call verification</p>
                                {user.verification_level === 'video' || user.verification_level === 'biometric' ? (
                                    <span className="status-completed">✓ Completed</span>
                                ) : (
                                    <button
                                        onClick={() => upgradeVerification('video')}
                                        className="btn btn-primary btn-sm"
                                    >
                                        Schedule Call
                                    </button>
                                )}
                            </div>

                            <div className="verification-option">
                                <h4>👆 Biometric Verification</h4>
                                <p>Fingerprint/Face ID verification</p>
                                {user.verification_level === 'biometric' ? (
                                    <span className="status-completed">✓ Completed</span>
                                ) : (
                                    <button
                                        onClick={() => upgradeVerification('biometric')}
                                        className="btn btn-primary btn-sm"
                                    >
                                        Enable Biometric
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
