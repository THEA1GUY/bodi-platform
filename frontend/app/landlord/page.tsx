"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

type Property = {
    id: string;
    title: string;
    location: string;
    price_ngn: number;
    type: string;
    verified: boolean;
    safety_score: number;
};

type Analytics = {
    total_properties: number;
    verified_properties: number;
    total_revenue: number;
    pending_revenue: number;
    active_escrows: number;
    average_safety_score: number;
};

type MaintenanceRequest = {
    id: string;
    property_id: string;
    tenant_id: string;
    issue: string;
    status: string;
};

export default function LandlordDashboard() {
    const router = useRouter();
    const landlordId = "USR-001"; // Mock - would come from auth

    const [properties, setProperties] = useState<Property[]>([]);
    const [analytics, setAnalytics] = useState<Analytics | null>(null);
    const [maintenanceRequests, setMaintenanceRequests] = useState<MaintenanceRequest[]>([]);
    const [activeTab, setActiveTab] = useState<'overview' | 'properties' | 'maintenance'>('overview');

    useEffect(() => {
        loadDashboardData();
    }, []);

    const loadDashboardData = async () => {
        try {
            // Load properties
            const propsRes = await fetch(`http://localhost:8000/api/landlord/${landlordId}/properties`);
            const propsData = await propsRes.json();
            setProperties(propsData);

            // Load analytics
            const analyticsRes = await fetch(`http://localhost:8000/api/landlord/${landlordId}/analytics`);
            const analyticsData = await analyticsRes.json();
            setAnalytics(analyticsData);

            // Load maintenance requests
            const maintenanceRes = await fetch(`http://localhost:8000/api/landlord/${landlordId}/maintenance-requests`);
            const maintenanceData = await maintenanceRes.json();
            setMaintenanceRequests(maintenanceData);
        } catch (err) {
            console.error("Failed to load dashboard:", err);
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
                    <Link href="/landlord/list-property" className="btn btn-primary">
                        + List Property
                    </Link>
                    <Link href="/profile" className="btn btn-secondary">Profile</Link>
                </div>
            </header>

            <main className="main-content landlord-dashboard">
                <div className="dashboard-header">
                    <h1>Landlord Dashboard</h1>
                    <p>Manage your properties, tenants, and earnings</p>
                </div>

                {/* Tab Navigation */}
                <div className="dashboard-tabs">
                    <button
                        className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
                        onClick={() => setActiveTab('overview')}
                    >
                        Overview
                    </button>
                    <button
                        className={`tab-btn ${activeTab === 'properties' ? 'active' : ''}`}
                        onClick={() => setActiveTab('properties')}
                    >
                        My Properties ({properties.length})
                    </button>
                    <button
                        className={`tab-btn ${activeTab === 'maintenance' ? 'active' : ''}`}
                        onClick={() => setActiveTab('maintenance')}
                    >
                        Maintenance ({maintenanceRequests.length})
                    </button>
                </div>

                {/* Overview Tab */}
                {activeTab === 'overview' && analytics && (
                    <div className="dashboard-content">
                        <div className="analytics-grid">
                            <div className="analytics-card">
                                <div className="analytics-icon">🏘️</div>
                                <div className="analytics-info">
                                    <h3>{analytics.total_properties}</h3>
                                    <p>Total Properties</p>
                                    <span className="analytics-sub">{analytics.verified_properties} verified</span>
                                </div>
                            </div>

                            <div className="analytics-card">
                                <div className="analytics-icon">💰</div>
                                <div className="analytics-info">
                                    <h3>₦{analytics.total_revenue.toLocaleString()}</h3>
                                    <p>Total Revenue</p>
                                    <span className="analytics-sub">Released from escrow</span>
                                </div>
                            </div>

                            <div className="analytics-card">
                                <div className="analytics-icon">⏳</div>
                                <div className="analytics-info">
                                    <h3>₦{analytics.pending_revenue.toLocaleString()}</h3>
                                    <p>Pending Revenue</p>
                                    <span className="analytics-sub">{analytics.active_escrows} active escrows</span>
                                </div>
                            </div>

                            <div className="analytics-card">
                                <div className="analytics-icon">🛡️</div>
                                <div className="analytics-info">
                                    <h3>{analytics.average_safety_score}/10</h3>
                                    <p>Avg Safety Score</p>
                                    <span className="analytics-sub">Portfolio rating</span>
                                </div>
                            </div>
                        </div>

                        <div className="quick-actions">
                            <h2>Quick Actions</h2>
                            <div className="action-buttons">
                                <Link href="/landlord/list-property" className="action-btn">
                                    <span className="action-icon">➕</span>
                                    <div>
                                        <h4>List New Property</h4>
                                        <p>Add a property to BODI</p>
                                    </div>
                                </Link>
                                <button className="action-btn" onClick={() => setActiveTab('properties')}>
                                    <span className="action-icon">📊</span>
                                    <div>
                                        <h4>Manage Listings</h4>
                                        <p>Edit or remove properties</p>
                                    </div>
                                </button>
                                <button className="action-btn" onClick={() => setActiveTab('maintenance')}>
                                    <span className="action-icon">🔧</span>
                                    <div>
                                        <h4>View Requests</h4>
                                        <p>Handle maintenance issues</p>
                                    </div>
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Properties Tab */}
                {activeTab === 'properties' && (
                    <div className="dashboard-content">
                        <div className="properties-list">
                            {properties.map(property => (
                                <div key={property.id} className="landlord-property-card">
                                    <div className="property-info-section">
                                        <div className="property-header-row">
                                            <h3>{property.title}</h3>
                                            {property.verified ? (
                                                <span className="badge badge-verified">✓ Verified</span>
                                            ) : (
                                                <span className="badge" style={{ background: '#ffa500', color: 'white' }}>
                                                    Pending Verification
                                                </span>
                                            )}
                                        </div>
                                        <p className="property-location">📍 {property.location}</p>
                                        <div className="property-details-row">
                                            <span>₦{property.price_ngn.toLocaleString()}/year</span>
                                            <span>•</span>
                                            <span>Safety: {property.safety_score}/10</span>
                                            <span>•</span>
                                            <span>ID: {property.id}</span>
                                        </div>
                                    </div>
                                    <div className="property-actions-section">
                                        <Link href={`/property/${property.id}`} className="btn btn-secondary btn-sm">
                                            View Listing
                                        </Link>
                                        <button className="btn btn-primary btn-sm">
                                            Edit
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Maintenance Tab */}
                {activeTab === 'maintenance' && (
                    <div className="dashboard-content">
                        <div className="maintenance-list">
                            {maintenanceRequests.length === 0 ? (
                                <div className="empty-state">
                                    <p>No maintenance requests yet</p>
                                </div>
                            ) : (
                                maintenanceRequests.map(request => (
                                    <div key={request.id} className="maintenance-card">
                                        <div className="maintenance-header">
                                            <h4>Property ID: {request.property_id}</h4>
                                            <span className={`status-badge ${request.status}`}>
                                                {request.status}
                                            </span>
                                        </div>
                                        <p className="maintenance-issue">{request.issue}</p>
                                        <div className="maintenance-actions">
                                            <button className="btn btn-accent btn-sm">Mark Resolved</button>
                                            <button className="btn btn-secondary btn-sm">Contact Tenant</button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
