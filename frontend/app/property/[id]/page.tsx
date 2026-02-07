"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams } from 'next/navigation';

type Property = {
    id: string;
    title: string;
    description: string;
    location: string;
    price_ngn: number;
    type: string;
    verified: boolean;
    image_urls: string[];
    safety_score: number;
    amenities: string[];
    owner_id: string;
};

type Review = {
    id: string;
    rating: number;
    comment: string;
    created_at: string;
};

export default function PropertyDetailPage() {
    const params = useParams();
    const propertyId = params.id as string;

    const [property, setProperty] = useState<Property | null>(null);
    const [reviews, setReviews] = useState<Review[]>([]);
    const [avgRating, setAvgRating] = useState(0);
    const [showEscrow, setShowEscrow] = useState(false);
    const [showLocationShare, setShowLocationShare] = useState(false);
    const [escrowStatus, setEscrowStatus] = useState('');

    useEffect(() => {
        loadPropertyDetails();
    }, [propertyId]);

    const loadPropertyDetails = async () => {
        try {
            const res = await fetch(`http://localhost:8000/api/properties/${propertyId}`);
            const data = await res.json();
            setProperty(data);
            setReviews(data.reviews || []);
            setAvgRating(data.avg_rating || 0);
        } catch (err) {
            console.error("Failed to load property:", err);
        }
    };

    const initiateEscrow = async () => {
        try {
            const res = await fetch('http://localhost:8000/api/escrow/initiate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    property_id: propertyId,
                    amount_ngn: property?.price_ngn,
                    tenant_id: "USR-001" // Mock user
                })
            });
            const data = await res.json();
            setEscrowStatus(`✓ ${data.message}`);
        } catch (err) {
            console.error("Escrow error:", err);
        }
    };

    const startLocationShare = async () => {
        try {
            const res = await fetch('http://localhost:8000/api/safety/location-share', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    user_id: "USR-001",
                    property_id: propertyId,
                    latitude: 6.5244,
                    longitude: 3.3792,
                    emergency_contact: "+234-800-000-0000"
                })
            });
            const data = await res.json();
            alert(`${data.message}\n\n${data.safety_tip}`);
            setShowLocationShare(true);
        } catch (err) {
            console.error("Location share error:", err);
        }
    };

    if (!property) return <div className="loading-screen">Loading property...</div>;

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
                    <Link href="/properties" className="text-btn">← Back to Listings</Link>
                </div>
            </header>

            <main className="property-detail-container">
                {/* Hero Image */}
                <div className="property-hero">
                    <img src={property.image_urls[0]} alt={property.title} />
                    <div className="hero-overlay">
                        {property.verified && <span className="badge badge-verified-lg">✓ VERIFIED PROPERTY</span>}
                    </div>
                </div>

                {/* Property Info */}
                <div className="property-info-grid">
                    <div className="property-main-info">
                        <h1>{property.title}</h1>
                        <p className="location-text">📍 {property.location}</p>

                        <div className="price-section">
                            <h2 className="price-large">₦{property.price_ngn.toLocaleString()}</h2>
                            <p className="price-label">Annual Rent</p>
                        </div>

                        <div className="safety-badge-section">
                            <div className="safety-indicator">
                                <span className="safety-score">{property.safety_score}/10</span>
                                <span className="safety-label">Safety Score</span>
                            </div>
                        </div>

                        <h3>Description</h3>
                        <p>{property.description}</p>

                        <h3>Amenities</h3>
                        <div className="amenities-grid">
                            {property.amenities.map((amenity, i) => (
                                <span key={i} className="amenity-chip">✓ {amenity}</span>
                            ))}
                        </div>

                        {/* Reviews */}
                        <h3>Reviews ({reviews.length})</h3>
                        {reviews.length > 0 ? (
                            <div className="reviews-list">
                                {reviews.map((review) => (
                                    <div key={review.id} className="review-card">
                                        <div className="review-rating">{'⭐'.repeat(review.rating)}</div>
                                        <p>{review.comment}</p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="no-reviews">No reviews yet. Be the first!</p>
                        )}
                    </div>

                    {/* Action Sidebar */}
                    <div className="property-actions-sidebar">
                        <div className="action-card">
                            <h3>💰 Secure Payment</h3>
                            <p>Use BODI Escrow to protect your deposit</p>
                            <button onClick={() => setShowEscrow(!showEscrow)} className="btn btn-primary full-width">
                                Start Escrow
                            </button>
                            {showEscrow && (
                                <div className="escrow-flow">
                                    <button onClick={initiateEscrow} className="btn btn-secondary full-width mt-2">
                                        Confirm ₦{property.price_ngn.toLocaleString()}
                                    </button>
                                    {escrowStatus && <p className="status-message">{escrowStatus}</p>}
                                </div>
                            )}
                        </div>

                        <div className="action-card">
                            <h3>📍 Safety Toolkit</h3>
                            <p>Share live location during viewing</p>
                            <button onClick={startLocationShare} className="btn btn-accent full-width">
                                {showLocationShare ? '✓ Location Sharing Active' : 'Enable Location Share'}
                            </button>
                        </div>

                        <div className="action-card">
                            <h3>📞 Contact Owner</h3>
                            <p>Verified landlord with Trust Score</p>
                            <button className="btn btn-secondary full-width">Send Message</button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
