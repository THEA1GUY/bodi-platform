"use client";

import { useState } from 'react';
import Link from 'next/link';
import { getApiUrl } from '@/lib/api';

type SearchResult = {
    query: string;
    ai_understanding: string;
    location_context: any;
    search_locations: string[];
    properties_found: number;
    properties: any[];
};

export default function SemanticSearchDemo() {
    const [query, setQuery] = useState('');
    const [result, setResult] = useState<SearchResult | null>(null);
    const [isSearching, setIsSearching] = useState(false);

    const exampleQueries = [
        "Find me something near University of Lagos",
        "I want a place close to the airport in Lagos",
        "Show me affordable properties around Gwarinpa",
        "Luxury apartments near Maitama",
        "Student housing close to UI Ibadan",
        "Properties in the vicinity of Lekki Phase 1"
    ];

    const handleSearch = async () => {
        if (!query.trim()) return;

        setIsSearching(true);
        try {
            const res = await fetch(getApiUrl(`/api/search/semantic?query=${encodeURIComponent(query)}`), {
                method: 'POST'
            });

            const data = await res.json();
            setResult(data);
        } catch (err) {
            console.error("Search error:", err);
            alert('Search failed. Please try again.');
        } finally {
            setIsSearching(false);
        }
    };

    return (
        <div className="app-container">
            <header className="app-header">
                <Link href="/" className="logo">
                    <span>🌿</span> BODI
                </Link>
                <div className="header-actions">
                    <Link href="/properties" className="text-btn">Browse Properties</Link>
                </div>
            </header>

            <main className="main-content">
                <div className="search-demo-container">
                    <div className="demo-header">
                        <h1>🧠 AI Semantic Search Demo</h1>
                        <p>
                            BODI understands Nigerian geography and proximity.
                            It verifies location claims before searching the database.
                        </p>
                    </div>

                    {/* Search Input */}
                    <div className="search-box">
                        <input
                            type="text"
                            placeholder="e.g., 'Find me a place near the airport in Lagos'"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                            className="search-input"
                        />
                        <button
                            onClick={handleSearch}
                            disabled={isSearching}
                            className="btn btn-primary"
                        >
                            {isSearching ? 'Searching...' : '🔍 Search'}
                        </button>
                    </div>

                    {/* Example Queries */}
                    <div className="example-queries">
                        <p><strong>Try these examples:</strong></p>
                        <div className="query-chips">
                            {exampleQueries.map((exampleQuery, i) => (
                                <button
                                    key={i}
                                    className="query-chip"
                                    onClick={() => setQuery(exampleQuery)}
                                >
                                    {exampleQuery}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Search Results */}
                    {result && (
                        <div className="search-results">
                            <div className="result-section">
                                <h2>🤖 AI Understanding</h2>
                                <div className="ai-analysis">
                                    <pre>{result.ai_understanding}</pre>
                                </div>
                            </div>

                            <div className="result-section">
                                <h2>📍 Location Context Extracted</h2>
                                <div className="context-grid">
                                    <div className="context-item">
                                        <strong>Cities:</strong>
                                        <p>{result.location_context.cities.join(', ') || 'None detected'}</p>
                                    </div>
                                    <div className="context-item">
                                        <strong>Neighborhoods:</strong>
                                        <p>
                                            {result.location_context.neighborhoods.map((n: any) => n.name).join(', ') || 'None detected'}
                                        </p>
                                    </div>
                                    <div className="context-item">
                                        <strong>Proximity Keywords:</strong>
                                        <p>{result.location_context.proximity_hints.join(', ') || 'None'}</p>
                                    </div>
                                    <div className="context-item">
                                        <strong>Preferences:</strong>
                                        <p>{result.location_context.preferences.join(', ') || 'None'}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="result-section">
                                <h2>🔍 Search Locations (Including Nearby Areas)</h2>
                                <div className="location-tags">
                                    {result.search_locations.map((loc, i) => (
                                        <span key={i} className="location-tag">{loc}</span>
                                    ))}
                                </div>
                            </div>

                            <div className="result-section">
                                <h2>🏘️ Properties Found ({result.properties_found})</h2>
                                {result.properties.length === 0 ? (
                                    <p className="no-results">No properties match your criteria in those locations.</p>
                                ) : (
                                    <div className="properties-grid">
                                        {result.properties.map((property) => (
                                            <Link
                                                key={property.id}
                                                href={`/property/${property.id}`}
                                                className="property-card-link"
                                            >
                                                <div className="property-card">
                                                    <div className="property-image">
                                                        <img src={property.image_urls[0]} alt={property.title} />
                                                        {property.verified && <span className="verified-badge">✓</span>}
                                                    </div>
                                                    <div className="property-info">
                                                        <h3>{property.title}</h3>
                                                        <p className="location">📍 {property.location}</p>
                                                        <p className="price">₦{property.price_ngn.toLocaleString()}/year</p>
                                                        <p className="safety">🛡️ Safety: {property.safety_score}/10</p>
                                                    </div>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
