"""
Nigerian Geographic Knowledge Base
Used for semantic location understanding and proximity searches
"""

# Nigerian Cities and Neighborhoods with geographic/proximity data
NIGERIAN_GEOGRAPHY = {
    "Lagos": {
        "neighborhoods": {
            "Yaba": {
                "zone": "Mainland",
                "landmarks": ["University of Lagos", "Yaba Tech", "Tejuosho Market"],
                "nearby": ["Surulere", "Ebute Metta", "Akoka"],
                "known_for": "Tech hub, student area, affordable housing"
            },
            "Ikeja": {
                "zone": "Mainland",
                "landmarks": ["Murtala Muhammed Airport", "Computer Village", "Ikeja City Mall"],
                "nearby": ["Maryland", "Ogba", "Oshodi"],
                "known_for": "Commercial center, state capital, shopping"
            },
            "Lekki": {
                "zone": "Island",
                "landmarks": ["Lekki Conservation Centre", "Elegushi Beach"],
                "nearby": ["Ajah", "Victoria Island", "Ikoyi"],
                "known_for": "Upscale residential, gated estates, expats"
            },
            "Victoria Island": {
                "zone": "Island",
                "landmarks": ["Eko Hotel", "Bar Beach", "The Palms Mall"],
                "nearby": ["Lekki", "Ikoyi", "Lagos Island"],
                "known_for": "Business district, luxury living, high-end"
            },
            "Surulere": {
                "zone": "Mainland",
                "landmarks": ["National Stadium", "Adeniran Ogunsanya"],
                "nearby": ["Yaba", "Mushin", "Costain"],
                "known_for": "Vibrant neighborhood, middle-class, accessible"
            },
            "Ikoyi": {
                "zone": "Island",
                "landmarks": ["Ikoyi Club", "Falomo"],
                "nearby": ["Victoria Island", "Obalende"],
                "known_for": "Elite residential, embassies, old money"
            },
            "Maryland": {
                "zone": "Mainland",
                "landmarks": ["Maryland Mall"],
                "nearby": ["Ikeja", "Anthony", "Ojota"],
                "known_for": "Residential, transit hub"
            },
            "Gbagada": {
                "zone": "Mainland",
                "landmarks": ["Gbagada Phase 1 & 2"],
                "nearby": ["Maryland", "Bariga", "Ogudu"],
                "known_for": "Quiet residential, family-friendly"
            },
            "Ajah": {
                "zone": "Island",
                "landmarks": ["Ajah Market"],
                "nearby": ["Lekki", "Sangotedo", "Abraham Adesanya"],
                "known_for": "Developing area, affordable Island option"
            },
            "Magodo": {
                "zone": "Mainland",
                "landmarks": ["Magodo Phase 1 & 2"],
                "nearby": ["Ojodu", "Ikosi"],
                "known_for": "Gated estates, secure, upper-middle class"
            }
        }
    },
    "Abuja": {
        "neighborhoods": {
            "Wuse 2": {
                "zone": "Central",
                "landmarks": ["Wuse Market", "Ceddi Plaza"],
                "nearby": ["Maitama", "Garki", "Central Business District"],
                "known_for": "Commercial hub, offices, nightlife"
            },
            "Maitama": {
                "zone": "Central",
                "landmarks": ["Transcorp Hilton", "Jabi Lake"],
                "nearby": ["Wuse 2", "Asokoro", "Jabi"],
                "known_for": "Most expensive area, government officials, luxury"
            },
            "Garki": {
                "zone": "Central",
                "landmarks": ["Garki Model Market", "Area 11"],
                "nearby": ["Wuse", "Gudu", "Area 1"],
                "known_for": "Residential and commercial mix, accessible"
            },
            "Asokoro": {
                "zone": "Central",
                "landmarks": ["Aso Rock proximity"],
                "nearby": ["Maitama", "Central Area"],
                "known_for": "Exclusive, politicians, high security"
            },
            "Gwarinpa": {
                "zone": "Outskirts",
                "landmarks": ["Gwarinpa Estate"],
                "nearby": ["Kubwa", "Dutse"],
                "known_for": "Largest residential estate, affordable, families"
            },
            "Kubwa": {
                "zone": "Outskirts",
                "landmarks": ["Kubwa Market"],
                "nearby": ["Gwarinpa", "Bwari"],
                "known_for": "Budget-friendly, growing population"
            },
            "Jabi": {
                "zone": "Central",
                "landmarks": ["Jabi Lake Mall"],
                "nearby": ["Maitama", "Utako", "Dakwo"],
                "known_for": "Shopping, entertainment, middle-class"
            },
            "Utako": {
                "zone": "Central",
                "landmarks": ["Utako Market"],
                "nearby": ["Jabi", "Wuse 2"],
                "known_for": "Commercial, restaurants"
            }
        }
    },
    "Ibadan": {
        "neighborhoods": {
            "Bodija": {
                "zone": "North",
                "landmarks": ["Bodija Market"],
                "nearby": ["Sango", "UI"],
                "known_for": "Upscale residential, quiet"
            },
            "Agodi": {
                "zone": "Central",
                "landmarks": ["Agodi Gardens", "Government Secretariat"],
                "nearby": ["Mokola", "Bodija"],
                "known_for": "Government area, recreation"
            },
            "Ring Road": {
                "zone": "Central",
                "landmarks": ["Ring Road State Hospital"],
                "nearby": ["Challenge", "Oke-Ado"],
                "known_for": "Central location, accessible"
            },
            "UI": {
                "zone": "North",
                "landmarks": ["University of Ibadan"],
                "nearby": ["Bodija", "Sango"],
                "known_for": "Student area, academic"
            },
            "Challenge": {
                "zone": "West",
                "landmarks": ["Challenge Roundabout"],
                "nearby": ["Ring Road", "Felele"],
                "known_for": "Mixed residential-commercial"
            },
            "Apata": {
                "zone": "South",
                "landmarks": ["Apata Market"],
                "nearby": ["Idi-Arere", "Elebu"],
                "known_for": "Industrial, growing"
            }
        }
    },
    "Port Harcourt": {
        "neighborhoods": {
            "GRA": {
                "zone": "Central",
                "landmarks": ["Government Reserved Area"],
                "nearby": ["Old GRA", "D-Line"],
                "known_for": "Elite residential, expats, oil companies"
            },
            "Trans Amadi": {
                "zone": "Industrial",
                "landmarks": ["Trans Amadi Industrial Layout"],
                "nearby": ["Rumuokoro", "GRA"],
                "known_for": "Industrial area, factories"
            },
            "Rumuokoro": {
                "zone": "Residential",
                "landmarks": ["Rumuokoro Market"],
                "nearby": ["Trans Amadi", "Elelenwo"],
                "known_for": "Student area, affordable"
            },
            "D-Line": {
                "zone": "Central",
                "landmarks": ["D-Line Roundabout"],
                "nearby": ["GRA", "Elekahia"],
                "known_for": "Nightlife, restaurants"
            },
            "Old GRA": {
                "zone": "Central",
                "landmarks": ["Old Government Reserved Area"],
                "nearby": ["GRA", "Borikiri"],
                "known_for": "Historic, established residential"
            }
        }
    }
}

# Common search terms and their meanings
LOCATION_ALIASES = {
    "VI": "Victoria Island",
    "VI Lagos": "Victoria Island",
    "Computer Village": "Ikeja",
    "Lekki Phase 1": "Lekki",
    "UI": "UI",
    "University of Ibadan": "UI",
    "UNILAG": "Yaba",
    "Unilag": "Yaba",
    "Airport": "Ikeja",
    "Airport Road": "Ikeja",
    "Aso Rock": "Asokoro"
}

def get_location_context(query: str) -> dict:
    """
    Extract location context from a search query
    Returns city, neighborhood, and proximity information
    """
    query_lower = query.lower()
    
    # Check for aliases
    for alias, location in LOCATION_ALIASES.items():
        if alias.lower() in query_lower:
            query_lower = query_lower.replace(alias.lower(), location.lower())
    
    context = {
        "cities": [],
        "neighborhoods": [],
        "landmarks": [],
        "proximity_hints": [],
        "preferences": []
    }
    
    # Detect cities
    for city in NIGERIAN_GEOGRAPHY.keys():
        if city.lower() in query_lower:
            context["cities"].append(city)
    
    # Detect neighborhoods
    for city_name, city_data in NIGERIAN_GEOGRAPHY.items():
        for neighborhood, details in city_data["neighborhoods"].items():
            if neighborhood.lower() in query_lower:
                context["neighborhoods"].append({
                    "name": neighborhood,
                    "city": city_name,
                    "details": details
                })
    
    # Detect proximity keywords
    proximity_keywords = ["near", "close to", "around", "nearby", "vicinity of"]
    for keyword in proximity_keywords:
        if keyword in query_lower:
            context["proximity_hints"].append(keyword)
    
    # Detect preference keywords
    preference_map = {
        "affordable": "budget-friendly",
        "cheap": "budget-friendly",
        "luxury": "upscale",
        "upscale": "upscale",
        "quiet": "peaceful residential",
        "peaceful": "peaceful residential",
        "student": "student-friendly",
        "family": "family-friendly",
        "secure": "gated/secure",
        "gated": "gated/secure"
    }
    
    for keyword, category in preference_map.items():
        if keyword in query_lower:
            if category not in context["preferences"]:
                context["preferences"].append(category)
    
    return context

def find_nearby_neighborhoods(neighborhood_name: str, city_name: str) -> list:
    """
    Given a neighborhood, return nearby neighborhoods
    """
    if city_name not in NIGERIAN_GEOGRAPHY:
        return []
    
    if neighborhood_name not in NIGERIAN_GEOGRAPHY[city_name]["neighborhoods"]:
        return []
    
    nearby = NIGERIAN_GEOGRAPHY[city_name]["neighborhoods"][neighborhood_name].get("nearby", [])
    return nearby

def get_neighborhood_info(neighborhood_name: str, city_name: str) -> dict:
    """
    Get detailed information about a neighborhood
    """
    if city_name not in NIGERIAN_GEOGRAPHY:
        return {}
    
    if neighborhood_name not in NIGERIAN_GEOGRAPHY[city_name]["neighborhoods"]:
        return {}
    
    return NIGERIAN_GEOGRAPHY[city_name]["neighborhoods"][neighborhood_name]
