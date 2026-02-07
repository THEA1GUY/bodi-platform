"use client";

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';

type Property = {
    id: string;
    title: string;
    location: string;
    price_ngn: number;
    type: string;
    verified: boolean;
    image_urls: string[];
    safety_score: number;
    amenities: string[];
};

function PropertiesContent() {
    const searchParams = useSearchParams();
    const [properties, setProperties] = useState<Property[]>([]);
    const [allProperties, setAllProperties] = useState<Property[]>([]);
    const [filters, setFilters] = useState({
        location: '',
        maxPrice: '',
        verifiedOnly: false
    });

    useEffect(() => {
        loadProperties();
    }, [filters]);

    useEffect(() => {
        // Check if we have recommended properties from BODI
        const recommended = searchParams.get('recommended');
        if (recommended && allProperties.length > 0) {
            const propertyIds = recommended.split(',');
            filterRecommendedProperties(propertyIds);
        }
    }, [searchParams, allProperties]);

    const loadProperties = async () => {
        const params = new URLSearchParams();
        if (filters.location) params.append('location', filters.location);
        if (filters.maxPrice) params.append('max_price', filters.maxPrice);
        if (filters.verifiedOnly) params.append('verified_only', 'true');

        try {
            const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
            const res = await fetch(`${apiBase}/api/properties?${params}`);
            const data = await res.json();
            setProperties(data);
            setAllProperties(data);
        } catch (err) {
            console.error("Failed to load properties:", err);
        }
    };

    const filterRecommendedProperties = (propertyIds: string[]) => {
        const filtered = allProperties.filter(p => propertyIds.includes(p.id));
        if (filtered.length > 0) {
            setProperties(filtered);
        }
    };

    const isShowingRecommended = searchParams.get('recommended') !== null;

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
                    <Link href="/community" className="text-btn">Community</Link>
                    <Link href="/profile" className="btn btn-secondary">Profile</Link>
                </div>
            </header>

            <main className="main-content">
                <div className="section-title">
                    <h1>{isShowingRecommended ? 'BODI Recommendations' : 'Browse Properties'}</h1>
                    <p>{isShowingRecommended ? 'Properties matched to your search' : 'Find your perfect home with verified listings'}</p>
                    {isShowingRecommended && (
                        <Link href="/properties" className="btn btn-secondary btn-sm" style={{ marginTop: '1rem' }}>
                            ← Back to All Properties
                        </Link>
                    )}
                </div>

                {!isShowingRecommended && (
                    <div className="filters-bar">
                        <input
                            type="text"
                            placeholder="Location (e.g., Yaba)"
                            value={filters.location}
                            onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                            className="filter-input"
                        />
                        <input
                            type="number"
                            placeholder="Max Price (₦)"
                            value={filters.maxPrice}
                            onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
                            className="filter-input"
                        />
                        <label className="checkbox-label">
                            <input
                                type="checkbox"
                                checked={filters.verifiedOnly}
                                onChange={(e) => setFilters({ ...filters, verifiedOnly: e.target.checked })}
                            />
                            Verified Only
                        </label>
                    </div>
                )}

                <div className="listings-grid">
                    {properties.map((prop) => (
                        <Link href={`/property/${prop.id}`} key={prop.id} className="card property-card">
                            <div className="card-image">
                                <img src={prop.image_urls[0]} alt={prop.title} />
                                <div className="card-badges">
                                    {prop.verified && <span className="badge badge-verified">✓ Verified</span>}
                                    <span className="badge badge-safety">{prop.safety_score}/10</span>
                                </div>
                            </div>

                            <div className="card-content">
                                <span className="prop-type">{prop.type} • {prop.location}</span>
                                <h3>{prop.title}</h3>

                                <div className="amenities-list">
                                    {prop.amenities.slice(0, 2).map((amenity, i) => (
                                        <span key={i} className="amenity-tag">{amenity}</span>
                                    ))}
                                </div>

                                <div className="card-footer">
                                    <div className="price-info">
                                        <p className="price">₦{prop.price_ngn.toLocaleString()}/yr</p>
                                    </div>
                                    <span className="link-arrow">→</span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </main>
        </div>
    );
}

export default function PropertiesPage() {
    return (
        <Suspense fallback={<div className="loading-screen">Loading properties...</div>}>
            <PropertiesContent />
        </Suspense>
    );
}
