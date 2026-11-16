'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Check, Instagram, Twitter, Youtube, Mail } from 'lucide-react';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // 'idle' | 'loading' | 'success' | 'error'
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setErrorMessage('Please enter a valid email address.');
      setStatus('error');
      return;
    }

    setStatus('loading');
    setErrorMessage('');

    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();

      if (data?.success) {
        setStatus('success');
        setEmail('');
      } else {
        setStatus('error');
        setErrorMessage(data?.error || 'Subscription failed. Please try again.');
      }
    } catch (err) {
      setStatus('error');
      setErrorMessage('Network error. Please try again.');
    }
  };

  return (
    <footer className="bg-[#111111] text-[#F5F1EC] pt-16 pb-12 border-t border-[#2A2A2A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-[#2A2A2A]">
          {/* Col 1 & 2: Brand Info & Newsletter */}
          <div className="lg:col-span-2 space-y-5">
            <Link href="/" className="inline-block">
              <span className="font-display text-3xl tracking-wider text-white">
                URBAN <span className="text-[#B38B66]">FIT</span>
              </span>
            </Link>
            <p className="font-sans text-xs text-[#A09A92] leading-relaxed max-w-sm">
              Engineering heavyweight oversized streetwear, drop hoodies, and modular silhouettes.
              High-grade 480 GSM French Terry cotton tailored for timeless rotation.
            </p>

            {/* Newsletter Subscription */}
            <div className="pt-2">
              <span className="font-heading text-xs uppercase tracking-streetwear text-white block mb-2">
                JOIN THE ARCHIVE / GET 10% OFF
              </span>
              <p className="font-sans text-[11px] text-[#A09A92] mb-3">
                Be the first to access limited batch drops and private sales.
              </p>

              {status === 'success' ? (
                <div className="flex items-center gap-2 p-3 bg-[#1C1C1C] border border-[#B38B66] text-white text-xs font-heading">
                  <Check className="w-4 h-4 text-[#B38B66]" />
                  <span>YOU ARE IN. CHECK YOUR INBOX FOR WELCOME CODE.</span>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="space-y-2">
                  <div className="flex">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="ENTER YOUR EMAIL..."
                      className="bg-[#1C1C1C] border border-[#333333] px-3.5 py-2.5 text-xs text-white placeholder:text-[#666666] font-heading uppercase flex-1 focus:outline-none focus:border-[#B38B66]"
                      required
                    />
                    <button
                      type="submit"
                      disabled={status === 'loading'}
                      className="bg-[#B38B66] hover:bg-[#916D4C] text-white px-4 py-2.5 font-heading text-xs uppercase transition-colors flex items-center justify-center disabled:opacity-50"
                      aria-label="Subscribe to newsletter"
                    >
                      {status === 'loading' ? '...' : <ArrowRight className="w-4 h-4" />}
                    </button>
                  </div>
                  {status === 'error' && (
                    <p className="text-[11px] text-[#E04848] font-heading">{errorMessage}</p>
                  )}
                </form>
              )}
            </div>
          </div>

          {/* Col 3: Shop Links */}
          <div className="space-y-3">
            <h4 className="font-heading text-xs tracking-streetwear uppercase text-white font-semibold">
              COLLECTIONS
            </h4>
            <ul className="space-y-2 text-xs font-heading text-[#A09A92] uppercase">
              <li>
                <Link href="/shop?isNew=true" className="hover:text-white transition-colors">
                  NEW ARRIVALS
                </Link>
              </li>
              <li>
                <Link href="/category/hoodies" className="hover:text-white transition-colors">
                  HEAVYWEIGHT HOODIES
                </Link>
              </li>
              <li>
                <Link href="/category/tees" className="hover:text-white transition-colors">
                  BOXY CUT TEES
                </Link>
              </li>
              <li>
                <Link href="/category/bottoms" className="hover:text-white transition-colors">
                  TACTICAL CARGOS
                </Link>
              </li>
              <li>
                <Link href="/category/outerwear" className="hover:text-white transition-colors">
                  JACKETS & OVERSHIRTS
                </Link>
              </li>
              <li>
                <Link href="/category/accessories" className="hover:text-white transition-colors">
                  STREET ACCESSORIES
                </Link>
              </li>
              <li>
                <Link href="/shop?sale=true" className="text-[#B38B66] hover:text-white transition-colors">
                  ARCHIVE SALE (50% OFF)
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Support */}
          <div className="space-y-3">
            <h4 className="font-heading text-xs tracking-streetwear uppercase text-white font-semibold">
              CLIENT CARE
            </h4>
            <ul className="space-y-2 text-xs font-heading text-[#A09A92] uppercase">
              <li>
                <Link href="/account/orders" className="hover:text-white transition-colors">
                  TRACK MY ORDER
                </Link>
              </li>
              <li>
                <Link href="/shipping-returns" className="hover:text-white transition-colors">
                  SHIPPING & RETURNS
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">
                  CONTACT CONCIERGE
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  OUR ARCHIVE PHILOSOPHY
                </Link>
              </li>
              <li>
                <Link href="/admin/login" className="hover:text-[#B38B66] transition-colors">
                  ADMIN PORTAL
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 5: Social & Connect */}
          <div className="space-y-3">
            <h4 className="font-heading text-xs tracking-streetwear uppercase text-white font-semibold">
              COMMUNITY
            </h4>
            <p className="font-sans text-xs text-[#A09A92]">
              Tag <span className="text-white font-medium">#URBANFITARCHIVE</span> on Instagram to be featured on our Lookbook.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-none bg-[#1C1C1C] border border-[#333333] flex items-center justify-center text-[#A09A92] hover:text-white hover:border-[#B38B66] transition-all"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-none bg-[#1C1C1C] border border-[#333333] flex items-center justify-center text-[#A09A92] hover:text-white hover:border-[#B38B66] transition-all"
                aria-label="Twitter/X"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-none bg-[#1C1C1C] border border-[#333333] flex items-center justify-center text-[#A09A92] hover:text-white hover:border-[#B38B66] transition-all"
                aria-label="YouTube"
              >
                <Youtube className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Strip */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <p className="font-sans text-[11px] text-[#736E67]">
            &copy; {new Date().getFullYear()} URBAN FIT APPAREL LLC. ALL RIGHTS RESERVED.
          </p>

          <div className="flex items-center gap-6 text-[11px] font-heading uppercase text-[#736E67]">
            <Link href="/privacy" className="hover:text-white transition-colors">
              PRIVACY POLICY
            </Link>
            <Link href="/terms" className="hover:text-white transition-colors">
              TERMS OF SERVICE
            </Link>
            <span className="text-[#A09A92]">PAYMENT: COD / CARDS</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
