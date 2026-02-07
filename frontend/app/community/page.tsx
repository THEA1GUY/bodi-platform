"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getApiUrl } from '@/lib/api';
import Image from 'next/image';

type ServiceProvider = {
    id: string;
    name: string;
    service_type: string;
    phone: string;
    verified: boolean;
    rating: number;
    service_area: string[];
};

export default function CommunityPage() {
    const [serviceProviders, setServiceProviders] = useState<ServiceProvider[]>([]);
    const [filterType, setFilterType] = useState('');

    useEffect(() => {
        loadServiceProviders();
    }, [filterType]);

    const loadServiceProviders = async () => {
        const params = filterType ? `?service_type=${filterType}` : '';
        try {
            const res = await fetch(getApiUrl(`/api/service-providers${params}`));
            const data = await res.json();
            setServiceProviders(data);
        } catch (err) {
            console.error("Failed to load providers:", err);
        }
    };

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
                    <Link href="/profile" className="btn btn-secondary">Profile</Link>
                </div>
            </header>

            <main className="main-content">
                <div className="section-title">
                    <h1>🏘️ Community Hub</h1>
                    <p>Connect with verified service providers and neighbors</p>
                </div>

                {/* Category Filters */}
                <div className="category-tabs">
                    <button
                        className={`tab-btn ${filterType === '' ? 'active' : ''}`}
                        onClick={() => setFilterType('')}
                    >
                        All Services
                    </button>
                    <button
                        className={`tab-btn ${filterType === 'plumber' ? 'active' : ''}`}
                        onClick={() => setFilterType('plumber')}
                    >
                        🔧 Plumbers
                    </button>
                    <button
                        className={`tab-btn ${filterType === 'mover' ? 'active' : ''}`}
                        onClick={() => setFilterType('mover')}
                    >
                        🚚 Movers
                    </button>
                    <button
                        className={`tab-btn ${filterType === 'electrician' ? 'active' : ''}`}
                        onClick={() => setFilterType('electrician')}
                    >
                        ⚡ Electricians
                    </button>
                </div>

                {/* Service Providers Grid */}
                <div className="providers-grid">
                    {serviceProviders.map((provider) => (
                        <div key={provider.id} className="card provider-card">
                            <div className="provider-header">
                                <h3>{provider.name}</h3>
                                {provider.verified && <span className="badge badge-verified">✓ Verified</span>}
                            </div>

                            <div className="provider-info">
                                <p className="service-type">🛠️ {provider.service_type}</p>
                                <p className="rating">⭐ {provider.rating}/5.0</p>
                                <p className="contact">📞 {provider.phone}</p>
                                <p className="areas">📍 {provider.service_area.join(', ')}</p>
                            </div>

                            <button className="btn btn-primary full-width mt-3">
                                Contact {provider.name}
                            </button>
                        </div>
                    ))}
                </div>

                {/* Neighborhood Forums Section */}
                <div className="forums-section">
                    <h2>Neighborhood Forums</h2>
                    <p className="subtitle">Ask questions, share tips, connect with neighbors</p>

                    <div className="forum-topics">
                        <div className="card forum-card">
                            <h3>💡 Is Yaba safe at night?</h3>
                            <p>12 responses • Last active 2 hours ago</p>
                            <button className="btn btn-secondary btn-sm">Join Discussion</button>
                        </div>

                        <div className="card forum-card">
                            <h3>🔌 Best areas for constant electricity?</h3>
                            <p>28 responses • Last active 5 hours ago</p>
                            <button className="btn btn-secondary btn-sm">Join Discussion</button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
