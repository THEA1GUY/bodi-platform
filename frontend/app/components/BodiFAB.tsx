"use client";

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

type Message = {
    role: 'user' | 'assistant';
    content: string;
    properties?: string[]; // Property IDs to display
};

type Property = {
    id: string;
    title: string;
    location: string;
    price_ngn: number;
    type: string;
    verified: boolean;
    image_urls: string[];
    safety_score: number;
};

export default function BodiFAB() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        {
            role: 'assistant',
            content: "Hi! I'm BODI, your housing guide. Looking for a property? Just describe what you need! (e.g., '2-bedroom in Yaba under 800k')"
        }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [language, setLanguage] = useState<'en' | 'pidgin'>('en');
    const [allProperties, setAllProperties] = useState<Property[]>([]);
    const chatEndRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    useEffect(() => {
        // Load all properties for matching
        fetch('http://localhost:8000/api/properties')
            .then(res => res.json())
            .then(data => setAllProperties(data))
            .catch(err => console.error("Failed to load properties:", err));
    }, []);

    const extractPropertyRecommendations = (aiResponse: string): string[] => {
        // Extract property IDs mentioned in AI response (format: LAG-001, ABJ-002, etc.)
        const propertyIdPattern = /\b[A-Z]{3}-\d{3}\b/g;
        const matches = aiResponse.match(propertyIdPattern);
        return matches ? [...new Set(matches)] : [];
    };

    const formatInlineText = (text: string) => {
        // Handle **bold** text
        const parts = text.split(/(\*\*.*?\*\*)/g);
        return parts.map((part, index) => {
            if (part.startsWith('**') && part.endsWith('**')) {
                return <strong key={index}>{part.slice(2, -2)}</strong>;
            }
            return part;
        });
    };

    const formatMessage = (content: string) => {
        // Split by double newlines for paragraphs
        const paragraphs = content.split('\n\n');

        return paragraphs.map((paragraph, pIndex) => {
            // Check if it's a list
            const lines = paragraph.split('\n');
            const isList = lines.every(line => line.trim().startsWith('-') || line.trim().startsWith('•') || line.trim().match(/^\d+\./));

            if (isList) {
                return (
                    <ul key={pIndex} className="chat-list">
                        {lines.map((line, lIndex) => {
                            const text = line.replace(/^[-•]\s*|\d+\.\s*/, '').trim();
                            return text ? <li key={lIndex}>{formatInlineText(text)}</li> : null;
                        })}
                    </ul>
                );
            }

            // Regular paragraph
            return (
                <p key={pIndex} className="chat-paragraph">
                    {formatInlineText(paragraph)}
                </p>
            );
        });
    };

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMsg: Message = { role: 'user', content: input };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsLoading(true);

        try {
            const contextMessages = [...messages, userMsg].slice(-10);

            const res = await fetch('http://localhost:8000/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ messages: contextMessages, language: language })
            });

            const data = await res.json();

            if (res.ok) {
                const propertyIds = extractPropertyRecommendations(data.response);
                setMessages(prev => [...prev, {
                    role: 'assistant',
                    content: data.response,
                    properties: propertyIds
                }]);
            } else {
                setMessages(prev => [...prev, { role: 'assistant', content: "My connection is a bit weak. Please try again." }]);
            }
        } catch (error) {
            console.error("Chat Error:", error);
            setMessages(prev => [...prev, { role: 'assistant', content: "Network error. Please check your connection." }]);
        } finally {
            setIsLoading(false);
        }
    };

    const viewAllRecommendations = (propertyIds: string[]) => {
        // Navigate to properties page with filter
        const query = propertyIds.join(',');
        router.push(`/properties?recommended=${query}`);
        setIsOpen(false);
    };

    return (
        <>
            {/* Floating Action Button */}
            <button
                className={`bodi-fab ${isOpen ? 'open' : ''}`}
                onClick={() => setIsOpen(!isOpen)}
            >
                {isOpen ? '✕' : 'AI'}
                <span className="fab-label">BODI</span>
            </button>

            {/* Chat Widget */}
            <div className={`bodi-widget ${isOpen ? 'open' : ''}`}>
                <div className="widget-header">
                    <div>
                        <h3>Chat with BODI</h3>
                        <p>Your AI Housing Assistant</p>
                    </div>
                    <div className="language-toggle-mini">
                        <button
                            className={language === 'en' ? 'active' : ''}
                            onClick={() => setLanguage('en')}
                        >
                            EN
                        </button>
                        <button
                            className={language === 'pidgin' ? 'active' : ''}
                            onClick={() => setLanguage('pidgin')}
                        >
                            PID
                        </button>
                    </div>
                </div>

                <div className="widget-messages">
                    {messages.map((msg, i) => (
                        <div key={i}>
                            <div className={`message-wrapper ${msg.role}`}>
                                <div className={`chat-bubble ${msg.role}`}>
                                    {msg.role === 'assistant' ? formatMessage(msg.content) : msg.content}
                                </div>
                                {msg.role === 'assistant' && <span className="ai-label">BODI</span>}
                            </div>

                            {/* Property Carousel */}
                            {msg.properties && msg.properties.length > 0 && (
                                <div className="property-recommendations">
                                    <div className="recommendations-header">
                                        <span>Recommended Properties ({msg.properties.length})</span>
                                        <button
                                            className="view-all-btn"
                                            onClick={() => viewAllRecommendations(msg.properties!)}
                                        >
                                            View All →
                                        </button>
                                    </div>
                                    <div className="property-carousel">
                                        {msg.properties.map(propId => {
                                            const property = allProperties.find(p => p.id === propId);
                                            if (!property) return null;

                                            return (
                                                <div
                                                    key={propId}
                                                    className="carousel-card"
                                                    onClick={() => {
                                                        router.push(`/property/${propId}`);
                                                        setIsOpen(false);
                                                    }}
                                                >
                                                    <div className="carousel-image">
                                                        <img src={property.image_urls[0]} alt={property.title} />
                                                        {property.verified && (
                                                            <span className="mini-badge">✓</span>
                                                        )}
                                                    </div>
                                                    <div className="carousel-content">
                                                        <h4>{property.title}</h4>
                                                        <p className="carousel-location">{property.location}</p>
                                                        <p className="carousel-price">₦{property.price_ngn.toLocaleString()}</p>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                    {isLoading && (
                        <div className="typing-indicator">
                            <span>•</span><span>•</span><span>•</span>
                        </div>
                    )}
                    <div ref={chatEndRef} />
                </div>

                <div className="widget-input">
                    <input
                        type="text"
                        placeholder={language === 'pidgin' ? "Wetin you need?" : "Describe your needs..."}
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    />
                    <button onClick={handleSend} disabled={isLoading}>
                        ➤
                    </button>
                </div>
            </div>
        </>
    );
}
