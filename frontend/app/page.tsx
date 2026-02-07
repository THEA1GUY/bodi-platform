"use client";

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';

export default function HomePage() {
  const [language, setLanguage] = useState<'en' | 'pidgin'>('en');

  const content = {
    en: {
      hero: {
        title: "Find Your Safe Home in Nigeria",
        subtitle: "AI-powered property search with verified listings, secure escrow payments, and community trust",
        cta: "Browse Properties",
        ctaSecondary: "List Your Property"
      },
      features: {
        title: "Why Choose BODI?",
        items: [
          {
            title: "AI-Powered Search",
            description: "BODI understands Nigerian locations and verifies proximity claims with real-time internet access"
          },
          {
            title: "Verified Listings",
            description: "All properties undergo verification with safety scores and landlord background checks"
          },
          {
            title: "Secure Escrow",
            description: "Your deposit is protected until you confirm move-in. Zero risk of fraud"
          },
          {
            title: "Trust & Safety",
            description: "ID verification, location sharing during viewings, and emergency alerts"
          },
          {
            title: "Community Reviews",
            description: "Real tenant reviews and neighborhood insights from verified users"
          },
          {
            title: "Service Network",
            description: "Verified plumbers, movers, and maintenance providers at your fingertips"
          }
        ]
      },
      stats: {
        properties: "100+ Properties",
        verified: "70% Verified",
        cities: "6 Cities",
        trust: "Escrow Protected"
      },
      cta: {
        title: "Ready to Find Your Home?",
        description: "Join thousands of Nigerians finding safe, verified housing with BODI",
        button: "Get Started"
      }
    },
    pidgin: {
      hero: {
        title: "Find Your Safe House for Naija",
        subtitle: "AI wey dey help you find house with verified listings, secure escrow payment, and community trust",
        cta: "Check Properties",
        ctaSecondary: "List Your Property"
      },
      features: {
        title: "Why You Go Choose BODI?",
        items: [
          {
            title: "AI Search Wey Smart",
            description: "BODI sabi all Naija locations and dey verify say the place near where you talk am"
          },
          {
            title: "Verified Listings",
            description: "All properties don pass verification with safety scores and landlord background check"
          },
          {
            title: "Secure Escrow",
            description: "Your deposit dey protected until you confirm say you don move in. Zero fraud risk"
          },
          {
            title: "Trust & Safety",
            description: "ID verification, location sharing when you dey view house, and emergency alert"
          },
          {
            title: "Community Reviews",
            description: "Real tenant reviews and neighborhood gist from verified users"
          },
          {
            title: "Service Network",
            description: "Verified plumbers, movers, and maintenance people wey you fit trust"
          }
        ]
      },
      stats: {
        properties: "100+ Properties",
        verified: "70% Verified",
        cities: "6 Cities",
        trust: "Escrow Protected"
      },
      cta: {
        title: "You Ready to Find Your House?",
        description: "Join thousands of Nigerians wey dey find safe, verified housing with BODI",
        button: "Start Now"
      }
    }
  };

  const t = content[language];

  return (
    <div className="app-container">
      {/* Header */}
      <header className="app-header homepage-header">
        <Link href="/" className="logo">
          <Image
            src="/bodi-logo.png"
            alt="BODI"
            width={140}
            height={40}
            priority
            style={{ objectFit: 'contain' }}
          />
        </Link>
        <nav className="header-nav">
          <Link href="/properties" className="nav-link">Properties</Link>
          <Link href="/landlord" className="nav-link">For Landlords</Link>
          <Link href="/community" className="nav-link">Community</Link>
          <div className="language-toggle">
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
          <Link href="/profile" className="btn btn-primary">Sign In</Link>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">{t.hero.title}</h1>
          <p className="hero-subtitle">{t.hero.subtitle}</p>
          <div className="hero-actions">
            <Link href="/properties" className="btn btn-primary btn-lg">
              {t.hero.cta}
            </Link>
            <Link href="/landlord/list-property" className="btn btn-secondary btn-lg">
              {t.hero.ctaSecondary}
            </Link>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="stats-bar">
          <div className="stat-item">
            <div className="stat-value">{t.stats.properties}</div>
            <div className="stat-label">Available</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">{t.stats.verified}</div>
            <div className="stat-label">Verified</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">{t.stats.cities}</div>
            <div className="stat-label">Coverage</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">{t.stats.trust}</div>
            <div className="stat-label">Protection</div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <h2 className="section-title">{t.features.title}</h2>
        <div className="features-grid">
          {t.features.items.map((feature, index) => (
            <div key={index} className="feature-card">
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-description">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <h2 className="cta-title">{t.cta.title}</h2>
        <p className="cta-description">{t.cta.description}</p>
        <Link href="/properties" className="btn btn-primary btn-lg">
          {t.cta.button}
        </Link>
      </section>

      {/* Footer */}
      <footer className="app-footer">
        <div className="footer-content">
          <div className="footer-brand">
            <div className="logo">
              <Image
                src="/bodi-logo.png"
                alt="BODI"
                width={120}
                height={35}
                style={{ objectFit: 'contain' }}
              />
            </div>
            <p>Safe, verified housing for Nigerians</p>
          </div>
          <div className="footer-links">
            <div className="footer-column">
              <h4>Platform</h4>
              <Link href="/properties">Browse Properties</Link>
              <Link href="/landlord">List Property</Link>
              <Link href="/community">Community</Link>
            </div>
            <div className="footer-column">
              <h4>Resources</h4>
              <Link href="/search-demo">AI Search Demo</Link>
              <Link href="/profile">Your Profile</Link>
            </div>
            <div className="footer-column">
              <h4>Trust & Safety</h4>
              <a href="#verification">Verification</a>
              <a href="#escrow">Escrow Protection</a>
              <a href="#safety">Safety Features</a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2026 BODI Platform. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
