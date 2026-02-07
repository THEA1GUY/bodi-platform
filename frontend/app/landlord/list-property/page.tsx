"use client";

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

type PropertyType = 'apartment' | 'duplex' | 'studio' | 'bungalow' | 'flat';

export default function ListPropertyPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        location: '',
        city: '',
        price_ngn: '',
        type: 'apartment' as PropertyType,
        amenities: [] as string[],
        image_url: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const cities = ['Lagos', 'Abuja', 'Ibadan', 'Port Harcourt', 'Kano', 'Enugu'];
    const availableAmenities = [
        '24/7 Power', 'Generator', 'Parking', 'Security', 'Water Supply',
        'Gym Access', 'Swimming Pool', 'Balcony', 'Elevator', 'CCTV',
        'Internet', 'Air Conditioning', 'Wardrobe', 'Kitchen Cabinets'
    ];

    const toggleAmenity = (amenity: string) => {
        setFormData(prev => ({
            ...prev,
            amenities: prev.amenities.includes(amenity)
                ? prev.amenities.filter(a => a !== amenity)
                : [...prev.amenities, amenity]
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            // Generate property ID
            const cityCode = formData.city.substring(0, 3).toUpperCase();
            const randomNum = Math.floor(Math.random() * 900) + 100;
            const propertyId = `${cityCode}-${randomNum}`;

            const propertyData = {
                id: propertyId,
                title: formData.title,
                description: formData.description,
                location: `${formData.location}, ${formData.city}`,
                price_ngn: parseInt(formData.price_ngn),
                type: formData.type,
                verified: false,
                safety_score: 7.0,
                owner_id: "USR-001",
                image_urls: [formData.image_url || "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800"],
                amenities: formData.amenities,
                neighborhood_id: `${cityCode}-${formData.location.replace(/\s+/g, '-').toUpperCase()}`
            };

            const res = await fetch('http://localhost:8000/api/landlord/properties', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(propertyData)
            });

            const data = await res.json();

            if (res.ok) {
                alert(`Property listed successfully! ID: ${data.property_id}\n\nYour property is pending verification.`);
                router.push('/landlord');
            } else {
                alert('Failed to list property. Please try again.');
            }
        } catch (err) {
            console.error("Listing error:", err);
            alert('Network error. Please check your connection.');
        } finally {
            setIsSubmitting(false);
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
                    <Link href="/landlord" className="text-btn">← Back to Dashboard</Link>
                </div>
            </header>

            <main className="main-content">
                <div className="list-property-container">
                    <div className="form-header">
                        <h1>List Your Property</h1>
                        <p>Reach thousands of verified tenants on BODI</p>
                    </div>

                    <form onSubmit={handleSubmit} className="property-form">
                        {/* Basic Info */}
                        <div className="form-section">
                            <h2>Basic Information</h2>

                            <div className="form-group">
                                <label>Property Title *</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="e.g., Modern 3-Bedroom Apartment"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    className="form-input"
                                />
                            </div>

                            <div className="form-group">
                                <label>Description *</label>
                                <textarea
                                    required
                                    rows={4}
                                    placeholder="Describe your property in detail..."
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="form-input"
                                />
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>Property Type *</label>
                                    <select
                                        required
                                        value={formData.type}
                                        onChange={(e) => setFormData({ ...formData, type: e.target.value as PropertyType })}
                                        className="form-input"
                                    >
                                        <option value="apartment">Apartment</option>
                                        <option value="duplex">Duplex</option>
                                        <option value="studio">Studio</option>
                                        <option value="bungalow">Bungalow</option>
                                        <option value="flat">Flat</option>
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label>Annual Rent (₦) *</label>
                                    <input
                                        type="number"
                                        required
                                        placeholder="800000"
                                        value={formData.price_ngn}
                                        onChange={(e) => setFormData({ ...formData, price_ngn: e.target.value })}
                                        className="form-input"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Location */}
                        <div className="form-section">
                            <h2>Location</h2>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>City *</label>
                                    <select
                                        required
                                        value={formData.city}
                                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                        className="form-input"
                                    >
                                        <option value="">Select City</option>
                                        {cities.map(city => (
                                            <option key={city} value={city}>{city}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label>Neighborhood *</label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="e.g., Yaba, Maitama"
                                        value={formData.location}
                                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                        className="form-input"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Amenities */}
                        <div className="form-section">
                            <h2>Amenities</h2>
                            <p className="section-description">Select all that apply</p>

                            <div className="amenities-grid">
                                {availableAmenities.map(amenity => (
                                    <label key={amenity} className="amenity-checkbox">
                                        <input
                                            type="checkbox"
                                            checked={formData.amenities.includes(amenity)}
                                            onChange={() => toggleAmenity(amenity)}
                                        />
                                        <span>{amenity}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Image */}
                        <div className="form-section">
                            <h2>Property Image</h2>
                            <div className="form-group">
                                <label>Image URL (Optional)</label>
                                <input
                                    type="url"
                                    placeholder="https://example.com/image.jpg"
                                    value={formData.image_url}
                                    onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                                    className="form-input"
                                />
                                <p className="input-hint">Leave blank to use default image</p>
                            </div>
                        </div>

                        {/* Submit */}
                        <div className="form-actions">
                            <Link href="/landlord" className="btn btn-secondary">
                                Cancel
                            </Link>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="btn btn-primary"
                            >
                                {isSubmitting ? 'Listing Property...' : 'List Property'}
                            </button>
                        </div>
                    </form>
                </div>
            </main>
        </div>
    );
}
