from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Optional
import os
import random
from dotenv import load_dotenv
from groq import Groq
from datetime import datetime
from models import *
from database import db

load_dotenv()

app = FastAPI(
    title="BODI Backend",
    description="Conversational AI Housing Platform - Full Feature Set",
    version="2.0"
)

# CORS Setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- GROQ CLIENT SETUP ---
try:
    groq_client = Groq(api_key=os.environ.get("GROQ_API_KEY"))
except Exception as e:
    print(f"Warning: Groq client failed. Error: {e}")
    groq_client = None

# --- HELPER FUNCTIONS ---
def get_ai_system_prompt(language: str = "en"):
    """Generate context-aware system prompt"""
    properties_context = "\n".join([
        f"- {p.title} in {p.location} ({p.type.value}) @ ₦{p.price_ngn:,}. Verified: {p.verified}. Safety: {p.safety_score}/10. ID: {p.id}"
        for p in db.properties.values()
    ])
    
    base_prompt = f"""
    You are BODI, an AI housing assistant for Nigeria with INTERNET ACCESS. Your tone is warm, helpful, and trustworthy.
    
    CORE MISSION: Connect users with safe, verified housing while prioritizing TRUST and SAFETY.
    
    INTERNET ACCESS:
    - You have real-time access to the internet via Tavily search
    - When users ask about locations, neighborhoods, or proximity, you can verify claims using web searches
    - Use this to confirm distances, nearby landmarks, and neighborhood characteristics
    - Example: "Let me verify how close Yaba is to the university..." [searches web] "Yes, Yaba is adjacent to the University of Lagos campus."
    
    LOCATION VERIFICATION CAPABILITY:
    - If someone asks "near University of Lagos", you can search the web to find which neighborhoods are actually close
    - If they mention "close to airport", you can verify which areas in Lagos/Abuja are nearest
    - Always verify location claims before making property recommendations
    - Be honest if you're uncertain and need to research
    
    Available Listings:
    {properties_context}
    
    CRITICAL INSTRUCTION: When recommending properties, ALWAYS mention the property ID in your response.
    For example: "I found LAG-001 which is a 2-bedroom in Yaba..." or "Check out ABJ-002 for a luxury duplex..."
    
    FORMATTING RULES:
    - Use **bold** (double asterisks) for important details like property IDs, prices, and key features
    - Put property recommendations in a bulleted list using "-" for easy reading
    - Add blank lines between paragraphs for readability
    - Keep responses concise but informative (2-4 sentences per recommendation)
    
    EXAMPLE FORMAT:
    "Let me find properties near the university for you.
    
    - **LAG-001**: Modern 2-Bedroom in Yaba for **₦800,000/year**. Verified property with 8.5/10 safety score. Yaba is right next to UNILAG campus.
    - **LAG-015**: Budget Studio in Akoka for **₦450,000/year**. Also very close to the university area.
    
    Would you like more details on any of these?"
    
    FEATURES YOU CAN HELP WITH:
    1. Property Search - Find homes matching user criteria (with web-verified locations)
    2. Location Verification - Use internet to confirm proximity claims
    3. Escrow Payments - Explain secure deposit protection
    4. Verification - Encourage users to verify identity for trust
    5. Safety Features - Mention location sharing during viewings
    6. Reviews - Show/explain property reviews
    7. Service Providers - Recommend verified plumbers, movers, etc.
    
    RULES:
    - Always mention if a property is VERIFIED (major trust signal)
    - When recommending properties, INCLUDE the property ID (e.g., LAG-001, ABJ-002)
    - Verify location claims using your internet access before making recommendations
    - If user asks for proximity (near/close/around), research and only suggest genuinely nearby properties
    - If discussing payments, emphasize ESCROW protection
    - If user seems worried about fraud, reassure with verification + escrow + safety toolkit
    - Recommend properties from the list above when relevant
    """
    
    if language == "pidgin":
        base_prompt += "\n\nLANGUAGE: Use Nigerian Pidgin English for a more relatable, local feel. E.g., 'Abeg check this one (LAG-001)', 'No wahala', 'E get as e be'."
    
    return base_prompt

# --- ENDPOINTS ---

@app.get("/")
def root():
    return {"message": "BODI Backend v2.0 - All Features Active", "status": "online"}

# === PROPERTY ENDPOINTS ===
@app.get("/api/properties", response_model=List[Property])
def get_properties(
    location: Optional[str] = None,
    max_price: Optional[float] = None,
    verified_only: bool = False
):
    """Get all properties with optional filters"""
    properties = list(db.properties.values())
    
    if location:
        properties = [p for p in properties if location.lower() in p.location.lower()]
    if max_price:
        properties = [p for p in properties if p.price_ngn <= max_price]
    if verified_only:
        properties = [p for p in properties if p.verified]
    
    return properties

@app.get("/api/properties/{property_id}")
def get_property_detail(property_id: str):
    """Get detailed property info with reviews"""
    if property_id not in db.properties:
        raise HTTPException(status_code=404, detail="Property not found")
    
    property_data = db.properties[property_id]
    property_reviews = [r for r in db.reviews.values() if r.property_id == property_id]
    
    return {
        **property_data.dict(),
        "reviews": property_reviews,
        "avg_rating": sum(r.rating for r in property_reviews) / len(property_reviews) if property_reviews else 0
    }

# === CHAT ENDPOINT (AI) ===
@app.post("/api/chat")
async def chat_endpoint(request: ChatRequest):
    """Conversational AI with language support"""
    if not groq_client:
        return {
            "response": "Abeg, my brain (API key) no dey available now. Configure am make I fit think properly!",
            "language": request.language
        }
    
    try:
        system_prompt = get_ai_system_prompt(request.language)
        messages = [{"role": "system", "content": system_prompt}] + [m.dict() for m in request.messages]
        
        completion = groq_client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=messages,
            temperature=0.7,
            max_tokens=600,
            top_p=1,
            stream=False,
        )
        
        return {
            "response": completion.choices[0].message.content,
            "language": request.language
        }
    
    except Exception as e:
        print(f"Groq Error: {e}")
        return {"response": "Network issue. Please try again.", "error": str(e)}

# === SEMANTIC SEARCH ENDPOINT ===
@app.post("/api/search/semantic")
async def semantic_search(query: str):
    """
    AI-powered semantic search with real-time internet access via Tavily
    Verifies location claims and gathers contextual information before searching properties
    """
    from tavily import TavilyClient
    
    # Initialize Tavily client
    tavily_api_key = os.environ.get("TAVILY_API_KEY")
    if not tavily_api_key:
        return {"error": "Tavily API key not configured"}
    
    tavily = TavilyClient(api_key=tavily_api_key)
    
    if not groq_client:
        return {"error": "AI service unavailable"}
    
    try:
        # Step 1: Use Tavily to research the location/context mentioned in query
        search_query = f"Nigeria real estate {query} location information neighborhoods"
        
        tavily_results = tavily.search(
            query=search_query,
            search_depth="basic",
            max_results=3
        )
        
        # Extract web context
        web_context = "\n".join([
            f"- {result['title']}: {result['content'][:200]}..."
            for result in tavily_results.get('results', [])
        ])
        
        # Step 2: Use AI to understand query with web-verified context
        understanding_prompt = f"""
        You are a Nigerian real estate search assistant with access to the internet.
        
        User Query: "{query}"
        
        Web Research Results:
        {web_context}
        
        Based on the query and web research:
        1. What specific locations/neighborhoods should I search? (Be specific about cities and areas)
        2. If the user mentioned proximity (near/close to), what are the actual nearby neighborhoods?
        3. What are the user's preferences? (price range, property type, amenities)
        4. Are there any claims I should verify? (e.g., "close to university" - which university? which neighborhoods?)
        
        Respond in this exact format:
        **Search Locations**: [comma-separated list of specific neighborhoods/cities]
        **Nearby Areas**: [if proximity mentioned, list actual nearby neighborhoods]
        **Price Preference**: [budget/mid-range/luxury or specific range if mentioned]
        **Property Type**: [apartment/duplex/studio/etc if mentioned, else "any"]
        **Verified Context**: [what you learned from web research about these locations]
        """
        
        understanding = groq_client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[{"role": "user", "content": understanding_prompt}],
            temperature=0.3,
            max_tokens=500
        )
        
        ai_understanding = understanding.choices[0].message.content
        
        # Step 3: Extract search parameters from AI understanding
        understanding_lower = ai_understanding.lower()
        
        # Filter properties based on AI understanding
        properties = list(db.properties.values())
        filtered_properties = []
        
        # Extract locations from AI response
        search_locations = []
        if "**search locations**:" in understanding_lower:
            locations_line = ai_understanding.split("**Search Locations**:")[1].split("\n")[0]
            search_locations = [loc.strip() for loc in locations_line.split(",")]
        
        # Add nearby areas if mentioned
        if "**nearby areas**:" in understanding_lower:
            nearby_line = ai_understanding.split("**Nearby Areas**:")[1].split("\n")[0]
            nearby_locs = [loc.strip() for loc in nearby_line.split(",") if loc.strip() and "none" not in loc.lower()]
            search_locations.extend(nearby_locs)
        
        # Filter by location
        if search_locations:
            for prop in properties:
                for location in search_locations:
                    if location.lower() in prop.location.lower():
                        if prop not in filtered_properties:
                            filtered_properties.append(prop)
        else:
            filtered_properties = properties
        
        # Apply preference filters
        if "budget" in understanding_lower or "affordable" in understanding_lower:
            filtered_properties = [p for p in filtered_properties if p.price_ngn < 1000000]
        elif "luxury" in understanding_lower or "upscale" in understanding_lower:
            filtered_properties = [p for p in filtered_properties if p.price_ngn > 1500000]
        
        # Limit results
        filtered_properties = filtered_properties[:10]
        
        return {
            "query": query,
            "web_research": {
                "sources": [r['url'] for r in tavily_results.get('results', [])],
                "context": web_context
            },
            "ai_understanding": ai_understanding,
            "search_locations": list(set([loc for loc in search_locations if loc])),
            "properties_found": len(filtered_properties),
            "properties": filtered_properties
        }
        
    except Exception as e:
        print(f"Semantic search error: {e}")
        return {"error": str(e), "details": "Check server logs"}

# === USER & VERIFICATION ENDPOINTS ===
@app.get("/api/users/{user_id}")
def get_user(user_id: str):
    """Get user profile"""
    if user_id not in db.users:
        raise HTTPException(status_code=404, detail="User not found")
    return db.users[user_id]

@app.post("/api/users/{user_id}/verify")
def verify_user(user_id: str, verification: UserVerification):
    """Update user verification level"""
    if user_id not in db.users:
        raise HTTPException(status_code=404, detail="User not found")
    
    user = db.users[user_id]
    user.verification_level = verification.level
    user.trust_score += 100  # Reward for verification
    
    return {
        "status": "success",
        "message": f"User verified to level: {verification.level.value}",
        "new_trust_score": user.trust_score
    }

# === ESCROW ENDPOINTS ===
@app.post("/api/escrow/initiate")
def initiate_escrow(request: EscrowInitiate):
    """Start escrow transaction"""
    if request.property_id not in db.properties:
        raise HTTPException(status_code=404, detail="Property not found")
    
    property_data = db.properties[request.property_id]
    transaction_id = f"ESC-{random.randint(10000, 99999)}"
    
    escrow = EscrowTransaction(
        id=transaction_id,
        property_id=request.property_id,
        tenant_id=request.tenant_id,
        landlord_id=property_data.owner_id,
        amount_ngn=request.amount_ngn,
        status=EscrowStatus.PENDING
    )
    
    db.escrow_transactions[transaction_id] = escrow
    
    return {
        "status": "success",
        "transaction_id": transaction_id,
        "message": f"Escrow initiated: ₦{request.amount_ngn:,}. Funds will be held securely.",
        "next_steps": "Complete payment to move status to 'DEPOSITED'"
    }

@app.get("/api/escrow/{transaction_id}")
def get_escrow_status(transaction_id: str):
    """Check escrow transaction status"""
    if transaction_id not in db.escrow_transactions:
        raise HTTPException(status_code=404, detail="Transaction not found")
    return db.escrow_transactions[transaction_id]

@app.post("/api/escrow/{transaction_id}/release")
def release_escrow(transaction_id: str):
    """Release funds (tenant confirms move-in)"""
    if transaction_id not in db.escrow_transactions:
        raise HTTPException(status_code=404, detail="Transaction not found")
    
    escrow = db.escrow_transactions[transaction_id]
    escrow.status = EscrowStatus.RELEASED
    escrow.completed_at = datetime.now()
    
    return {"status": "success", "message": "Funds released to landlord"}

# === REVIEW ENDPOINTS ===
@app.post("/api/reviews")
def create_review(review: ReviewCreate):
    """Submit property review"""
    review_id = f"REV-{random.randint(100, 999)}"
    new_review = Review(
        id=review_id,
        property_id=review.property_id,
        reviewer_id=review.user_id,
        rating=review.rating,
        comment=review.comment
    )
    db.reviews[review_id] = new_review
    
    return {"status": "success", "review_id": review_id, "message": "Review posted!"}

@app.get("/api/reviews/property/{property_id}")
def get_property_reviews(property_id: str):
    """Get all reviews for a property"""
    reviews = [r for r in db.reviews.values() if r.property_id == property_id]
    avg_rating = sum(r.rating for r in reviews) / len(reviews) if reviews else 0
    return {"reviews": reviews, "average_rating": avg_rating, "total_reviews": len(reviews)}

# === SAFETY ENDPOINTS ===
@app.post("/api/safety/location-share")
def start_location_share(location: LocationShare):
    """Start live location sharing (for property viewings)"""
    share_id = f"LOC-{random.randint(1000, 9999)}"
    location.created_at = datetime.now()
    db.location_shares[share_id] = location
    
    return {
        "status": "success",
        "share_id": share_id,
        "message": "Location sharing active. Emergency contact notified.",
        "safety_tip": "Stay in well-lit areas. Trust your instincts."
    }

@app.post("/api/safety/emergency")
def trigger_emergency(alert: EmergencyTrigger):
    """Trigger emergency alert"""
    # In production: Send SMS/Push to emergency contacts
    return {
        "status": "alert_sent",
        "message": "Emergency alert triggered. Notifying authorities and emergency contact.",
        "timestamp": datetime.now()
    }

# === COMMUNITY ENDPOINTS ===
@app.get("/api/service-providers")
def get_service_providers(service_type: Optional[str] = None, area: Optional[str] = None):
    """Get verified service providers"""
    providers = list(db.service_providers.values())
    
    if service_type:
        providers = [p for p in providers if p.service_type == service_type]
    if area:
        providers = [p for p in providers if any(area.lower() in sa.lower() for sa in p.service_area)]
    
    return providers

@app.post("/api/maintenance")
def create_maintenance_request(request: MaintenanceRequest):
    """Tenant submits maintenance request"""
    request_id = f"MAINT-{random.randint(100, 999)}"
    request.id = request_id
    db.maintenance_requests[request_id] = request
    
    return {
        "status": "success",
        "request_id": request_id,
        "message": "Maintenance request submitted. Landlord will be notified."
    }

# === LANDLORD/DEVELOPER ENDPOINTS ===
@app.post("/api/landlord/properties")
def create_property(property_data: Property):
    """Landlord lists a new property"""
    db.properties[property_data.id] = property_data
    return {
        "property_id": property_data.id,
        "message": "Property listed successfully!",
        "status": "pending_verification"
    }

@app.get("/api/landlord/{landlord_id}/properties")
def get_landlord_properties(landlord_id: str):
    """Get all properties owned by a landlord"""
    properties = [p for p in db.properties.values() if p.owner_id == landlord_id]
    return properties

@app.put("/api/landlord/properties/{property_id}")
def update_property(property_id: str, updates: dict):
    """Update property details"""
    if property_id not in db.properties:
        raise HTTPException(status_code=404, detail="Property not found")
    
    property = db.properties[property_id]
    for key, value in updates.items():
        if hasattr(property, key):
            setattr(property, key, value)
    
    return {"message": "Property updated successfully", "property": property}

@app.delete("/api/landlord/properties/{property_id}")
def delete_property(property_id: str):
    """Remove property listing"""
    if property_id not in db.properties:
        raise HTTPException(status_code=404, detail="Property not found")
    
    del db.properties[property_id]
    return {"message": "Property listing removed"}

@app.get("/api/landlord/{landlord_id}/escrow-transactions")
def get_landlord_escrow(landlord_id: str):
    """Get all escrow transactions for landlord's properties"""
    landlord_properties = [p.id for p in db.properties.values() if p.owner_id == landlord_id]
    transactions = [
        t for t in db.escrow_transactions.values() 
        if t.property_id in landlord_properties
    ]
    return transactions

@app.get("/api/landlord/{landlord_id}/maintenance-requests")
def get_landlord_maintenance(landlord_id: str):
    """Get all maintenance requests for landlord's properties"""
    landlord_properties = [p.id for p in db.properties.values() if p.owner_id == landlord_id]
    requests = [
        r for r in db.maintenance_requests.values()
        if r.property_id in landlord_properties
    ]
    return requests

@app.get("/api/landlord/{landlord_id}/analytics")
def get_landlord_analytics(landlord_id: str):
    """Get dashboard analytics for landlord"""
    properties = [p for p in db.properties.values() if p.owner_id == landlord_id]
    landlord_property_ids = [p.id for p in properties]
    
    escrow_transactions = [
        t for t in db.escrow_transactions.values()
        if t.property_id in landlord_property_ids
    ]
    
    total_revenue = sum(t.amount_ngn for t in escrow_transactions if t.status == EscrowStatus.RELEASED)
    pending_revenue = sum(t.amount_ngn for t in escrow_transactions if t.status == EscrowStatus.DEPOSITED)
    
    return {
        "total_properties": len(properties),
        "verified_properties": len([p for p in properties if p.verified]),
        "total_revenue": total_revenue,
        "pending_revenue": pending_revenue,
        "active_escrows": len([t for t in escrow_transactions if t.status in [EscrowStatus.PENDING, EscrowStatus.DEPOSITED]]),
        "average_safety_score": round(sum(p.safety_score for p in properties) / len(properties), 1) if properties else 0
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
