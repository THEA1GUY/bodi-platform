from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime
from enum import Enum

# --- ENUMS ---
class VerificationLevel(str, Enum):
    UNVERIFIED = "unverified"
    PHONE = "phone"
    NIN_BVN = "nin_bvn"
    VIDEO = "video"
    BIOMETRIC = "biometric"

class EscrowStatus(str, Enum):
    PENDING = "pending"
    DEPOSITED = "deposited"
    HELD = "held"
    RELEASED = "released"
    DISPUTED = "disputed"
    REFUNDED = "refunded"

class PropertyType(str, Enum):
    APARTMENT = "apartment"
    DUPLEX = "duplex"
    STUDIO = "studio"
    BUNGALOW = "bungalow"
    FLAT = "flat"

# --- USER MODELS ---
class User(BaseModel):
    id: str
    name: str
    email: str
    phone: str
    verification_level: VerificationLevel = VerificationLevel.UNVERIFIED
    trust_score: int = 0
    created_at: datetime = Field(default_factory=datetime.now)

class UserVerification(BaseModel):
    user_id: str
    level: VerificationLevel
    nin_number: Optional[str] = None
    bvn_number: Optional[str] = None
    video_verified: bool = False
    biometric_verified: bool = False

# --- PROPERTY MODELS ---
class Property(BaseModel):
    id: str
    title: str
    description: str
    location: str
    price_ngn: float
    type: PropertyType
    verified: bool = False
    safety_score: float
    owner_id: str
    image_urls: List[str]
    amenities: List[str] = []
    neighborhood_id: Optional[str] = None

class PropertyDetail(Property):
    virtual_tour_url: Optional[str] = None
    reviews: List['Review'] = []
    maintenance_requests: List['MaintenanceRequest'] = []

# --- ESCROW MODELS ---
class EscrowTransaction(BaseModel):
    id: str
    property_id: str
    tenant_id: str
    landlord_id: str
    amount_ngn: float
    status: EscrowStatus
    created_at: datetime = Field(default_factory=datetime.now)
    completed_at: Optional[datetime] = None
    dispute_reason: Optional[str] = None

class EscrowInitiate(BaseModel):
    property_id: str
    amount_ngn: float
    tenant_id: str
    
# --- REVIEW MODELS ---
class Review(BaseModel):
    id: str
    property_id: str
    reviewer_id: str
    rating: int = Field(..., ge=1, le=5)
    comment: str
    created_at: datetime = Field(default_factory=datetime.now)

class ReviewCreate(BaseModel):
    property_id: str
    user_id: str
    rating: int = Field(..., ge=1, le=5)
    comment: str

# --- SAFETY MODELS ---
class LocationShare(BaseModel):
    user_id: str
    property_id: str
    latitude: float
    longitude: float
    emergency_contact: str
    active: bool = True
    created_at: datetime = Field(default_factory=datetime.now)

class EmergencyTrigger(BaseModel):
    user_id: str
    location_share_id: str
    message: str
    triggered_at: datetime = Field(default_factory=datetime.now)

# --- COMMUNITY MODELS ---
class NeighborhoodForum(BaseModel):
    id: str
    neighborhood_id: str
    topic: str
    created_by: str
    posts: List['ForumPost'] = []

class ForumPost(BaseModel):
    id: str
    forum_id: str
    author_id: str
    content: str
    created_at: datetime = Field(default_factory=datetime.now)

class ServiceProvider(BaseModel):
    id: str
    name: str
    service_type: str  # "plumber", "electrician", "mover", etc.
    phone: str
    verified: bool = False
    rating: float = 0.0
    service_area: List[str] = []

# --- MAINTENANCE MODELS ---
class MaintenanceRequest(BaseModel):
    id: str
    property_id: str
    tenant_id: str
    description: str
    status: str = "pending"  # pending, in_progress, completed
    created_at: datetime = Field(default_factory=datetime.now)

# --- CHAT MODELS ---
class ChatMessage(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    messages: List[ChatMessage]
    language: str = "en"  # "en" or "pidgin"
