"""
Mock Database Layer for BODI MVP
In production, this would connect to PostgreSQL/MongoDB
"""
from typing import Dict, List, Optional
from models import *
import random
from datetime import datetime, timedelta

class MockDatabase:
    def __init__(self):
        self.users: Dict[str, User] = {}
        self.properties: Dict[str, Property] = {}
        self.escrow_transactions: Dict[str, EscrowTransaction] = {}
        self.reviews: Dict[str, Review] = {}
        self.location_shares: Dict[str, LocationShare] = {}
        self.forums: Dict[str, NeighborhoodForum] = {}
        self.service_providers: Dict[str, ServiceProvider] = {}
        self.maintenance_requests: Dict[str, MaintenanceRequest] = {}
        
        self._seed_data()
    
    def _seed_data(self):
        """Populate with mock data"""
        # Mock Users
        self.users = {
            "USR-001": User(
                id="USR-001",
                name="Chinedu Okafor",
                email="chinedu@example.com",
                phone="+234-808-123-4567",
                verification_level=VerificationLevel.NIN_BVN,
                trust_score=850
            ),
            "USR-002": User(
                id="USR-002",
                name="Aisha Ibrahim",
                email="aisha@example.com",
                phone="+234-809-987-6543",
                verification_level=VerificationLevel.VIDEO,
                trust_score=920
            )
        }
        
        # Generate 100 Properties
        self.properties = self._generate_properties()
        
        # Mock Service Providers
        self.service_providers = {
            "SP-001": ServiceProvider(
                id="SP-001",
                name="Emeka the Plumber",
                service_type="plumber",
                phone="+234-803-111-2222",
                verified=True,
                rating=4.7,
                service_area=["Yaba", "Surulere", "Ikeja"]
            ),
            "SP-002": ServiceProvider(
                id="SP-002",
                name="FastMove Logistics",
                service_type="mover",
                phone="+234-809-333-4444",
                verified=True,
                rating=4.5,
                service_area=["Lagos", "Ibadan"]
            )
        }
        
        # Mock Reviews
        self.reviews = {
            "REV-001": Review(
                id="REV-001",
                property_id="LAG-001",
                reviewer_id="USR-002",
                rating=5,
                comment="Amazing place! Landlord is very responsive. No issues with power."
            )
        }

    def _generate_properties(self) -> Dict[str, Property]:
        """Generate 100 diverse properties"""
        
        # Nigerian cities and neighborhoods
        locations = [
            ("Lagos", ["Yaba", "Ikeja", "Lekki", "Victoria Island", "Surulere", "Ikoyi", "Maryland", "Gbagada", "Ajah", "Magodo"]),
            ("Abuja", ["Wuse 2", "Maitama", "Garki", "Asokoro", "Gwarinpa", "Kubwa", "Jabi", "Utako"]),
            ("Ibadan", ["Bodija", "Agodi", "Ring Road", "UI", "Challenge", "Apata"]),
            ("Port Harcourt", ["GRA", "Trans Amadi", "Rumuokoro", "D-Line", "Old GRA"]),
            ("Kano", ["Nassarawa", "Sabon Gari", "Gwale", "Fagge"]),
            ("Enugu", ["GRA", "Independence Layout", "Trans-Ekulu", "New Haven"])
        ]
        
        property_types = [
            PropertyType.APARTMENT,
            PropertyType.DUPLEX,
            PropertyType.STUDIO,
            PropertyType.BUNGALOW,
            PropertyType.FLAT
        ]
        
        amenities_pool = [
            "24/7 Power", "Generator", "Parking", "Security", "Water Supply",
            "Gym Access", "Swimming Pool", "Balcony", "Elevator", "CCTV",
            "Cleaning Service", "Internet", "Air Conditioning", "Wardrobe",
            "Kitchen Cabinets", "Tiled Floor", "Pop Ceiling", "Boys Quarters"
        ]
        
        property_titles = {
            PropertyType.STUDIO: ["Compact Studio", "Modern Studio Apartment", "Cozy Studio Space", "Budget Studio"],
            PropertyType.APARTMENT: ["Modern Apartment", "Spacious Flat", "Luxury Apartment", "Family Apartment", "Executive Apartment"],
            PropertyType.DUPLEX: ["Executive Duplex", "Luxury Duplex", "Family Duplex", "Contemporary Duplex"],
            PropertyType.BUNGALOW: ["Detached Bungalow", "Semi-Detached Bungalow", "Modern Bungalow"],
            PropertyType.FLAT: ["Self-Contained Flat", "Serviced Flat", "Modern Flat", "Mini Flat"]
        }
        
        image_urls = [
            "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800",
            "https://images.unsplash.com/photo-1600596542815-e32509138b80?w=800",
            "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800",
            "https://images.unsplash.com/photo-1501183638710-841dd1904471?w=800",
            "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800",
            "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800",
            "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800",
            "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800",
        ]
        
        properties = {}
        property_counter = 1
        
        for city, neighborhoods in locations:
            city_code = city[:3].upper()
            
            # Generate 15-20 properties per city
            properties_per_city = random.randint(15, 20)
            
            for _ in range(properties_per_city):
                if property_counter > 100:
                    break
                    
                prop_id = f"{city_code}-{property_counter:03d}"
                prop_type = random.choice(property_types)
                neighborhood = random.choice(neighborhoods)
                
                # Price ranges based on type and city
                price_multiplier = 1.0
                if city in ["Lagos", "Abuja"]:
                    price_multiplier = 1.5
                if neighborhood in ["Lekki", "Victoria Island", "Maitama", "Ikoyi"]:
                    price_multiplier = 2.5
                
                base_prices = {
                    PropertyType.STUDIO: random.randint(200000, 400000),
                    PropertyType.FLAT: random.randint(350000, 600000),
                    PropertyType.APARTMENT: random.randint(600000, 1200000),
                    PropertyType.BUNGALOW: random.randint(800000, 1500000),
                    PropertyType.DUPLEX: random.randint(1500000, 4000000)
                }
                
                price = int(base_prices[prop_type] * price_multiplier)
                
                # Amenities (3-6 random amenities)
                num_amenities = random.randint(3, 6)
                selected_amenities = random.sample(amenities_pool, num_amenities)
                
                # Safety score (higher for verified properties)
                is_verified = random.random() > 0.3  # 70% verified
                safety_score = round(random.uniform(7.0, 10.0) if is_verified else random.uniform(6.0, 8.5), 1)
                
                # Title
                title_template = random.choice(property_titles[prop_type])
                bedrooms = ""
                if prop_type in [PropertyType.APARTMENT, PropertyType.DUPLEX, PropertyType.BUNGALOW]:
                    bedroom_count = random.randint(1, 4)
                    bedrooms = f"{bedroom_count}-Bedroom "
                
                title = f"{bedrooms}{title_template} in {neighborhood}"
                
                # Description
                descriptions = [
                    f"Well-maintained {prop_type.value} in a secure {neighborhood} area.",
                    f"Beautiful {prop_type.value} with modern finishes. Great for families.",
                    f"Spacious {prop_type.value} in the heart of {neighborhood}. Close to amenities.",
                    f"Newly renovated {prop_type.value}. Perfect for young professionals.",
                    f"Affordable {prop_type.value} in a peaceful neighborhood."
                ]
                description = random.choice(descriptions)
                
                # Owner
                owner_id = random.choice(["USR-001", "USR-002"])
                
                properties[prop_id] = Property(
                    id=prop_id,
                    title=title,
                    description=description,
                    location=f"{neighborhood}, {city}",
                    price_ngn=price,
                    type=prop_type,
                    verified=is_verified,
                    safety_score=safety_score,
                    owner_id=owner_id,
                    image_urls=[random.choice(image_urls)],
                    amenities=selected_amenities,
                    neighborhood_id=f"{city_code}-{neighborhood.replace(' ', '-').upper()}"
                )
                
                property_counter += 1
        
        return properties

# Global instance
db = MockDatabase()
