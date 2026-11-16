'use client';

import React, { useState } from 'react';
import ShopLayout from '@/components/layout/ShopLayout';
import { Mail, Phone, MapPin, Clock, CheckCircle2, Send, Loader2 } from 'lucide-react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'General Inquiry',
    orderNumber: '',
    message: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
      setFormData({ name: '', email: '', subject: 'General Inquiry', orderNumber: '', message: '' });
    }, 1000);
  };

  return (
    <ShopLayout>
      <div className="bg-primary-bg min-h-screen">
        {/* Header */}
        <div className="bg-surface border-b border-border py-12 md:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-2xl">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-tan block mb-2">
              Concierge & Inquiries
            </span>
            <h1 className="font-display text-4xl sm:text-5xl uppercase tracking-wider text-ink mb-3">
              Get in Touch
            </h1>
            <p className="text-sm font-sans text-ink/70">
              Have questions regarding our drops, sizing recommendations, or an existing order? Our client team is available around the clock.
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Contact Details & Showrooms */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-card border border-border p-6 sm:p-8 space-y-6">
                <h3 className="font-display text-2xl uppercase tracking-wider text-ink border-b border-border pb-3">
                  Direct Support
                </h3>

                <div className="flex items-start gap-3 text-xs">
                  <Mail className="w-4 h-4 text-tan shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold uppercase tracking-wider text-ink">Client Support Email</p>
                    <p className="font-mono text-ink/60 mt-0.5">concierge@urbanfit.style</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 text-xs">
                  <Phone className="w-4 h-4 text-tan shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold uppercase tracking-wider text-ink">Telephone Hotline</p>
                    <p className="font-mono text-ink/60 mt-0.5">+1 (800) 872-2634</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 text-xs">
                  <Clock className="w-4 h-4 text-tan shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold uppercase tracking-wider text-ink">Operating Hours</p>
                    <p className="font-mono text-ink/60 mt-0.5">24/7 Mon – Sun Response Concierge</p>
                  </div>
                </div>
              </div>

              {/* Showroom Studios */}
              <div className="bg-card border border-border p-6 sm:p-8 space-y-4">
                <h3 className="font-display text-2xl uppercase tracking-wider text-ink border-b border-border pb-3">
                  Flagship Studios
                </h3>

                <div className="space-y-3 text-xs font-sans text-ink/80">
                  <div className="flex items-start gap-2.5">
                    <MapPin className="w-4 h-4 text-tan shrink-0 mt-0.5" />
                    <div>
                      <strong className="block text-ink uppercase tracking-wider">SoHo Flagship — New York</strong>
                      <p className="text-ink/60">452 Broadway, SoHo, NY 10013</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5 pt-2 border-t border-border/60">
                    <MapPin className="w-4 h-4 text-tan shrink-0 mt-0.5" />
                    <div>
                      <strong className="block text-ink uppercase tracking-wider">Shibuya Studio — Tokyo</strong>
                      <p className="text-ink/60">1-19-14 Jinnan, Shibuya-ku, Tokyo 150-0041</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Form */}
            <div className="lg:col-span-7">
              <div className="bg-card border border-border p-6 sm:p-8">
                <h3 className="font-display text-2xl uppercase tracking-wider text-ink mb-6 pb-3 border-b border-border">
                  Send a Message
                </h3>

                {submitted ? (
                  <div className="py-12 text-center space-y-4">
                    <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                      <CheckCircle2 className="w-7 h-7" />
                    </div>
                    <h4 className="font-display text-2xl uppercase tracking-wider text-ink">
                      Message Dispatched
                    </h4>
                    <p className="text-xs font-mono text-ink/60 max-w-sm mx-auto">
                      Thank you for contacting URBAN FIT. A concierge specialist will respond within 4 business hours.
                    </p>
                    <button
                      onClick={() => setSubmitted(false)}
                      className="bg-ink text-primary-bg px-6 py-2.5 text-xs font-semibold uppercase tracking-wider"
                    >
                      Send Another Message
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-ink mb-1">
                          Your Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="e.g. Jordan Hayes"
                          className="w-full bg-surface border border-border px-3.5 py-2.5 text-xs text-ink focus:outline-none focus:border-ink"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-ink mb-1">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="you@domain.com"
                          className="w-full bg-surface border border-border px-3.5 py-2.5 text-xs text-ink focus:outline-none focus:border-ink"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-ink mb-1">
                          Topic / Subject
                        </label>
                        <select
                          value={formData.subject}
                          onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                          className="w-full bg-surface border border-border px-3.5 py-2.5 text-xs text-ink focus:outline-none focus:border-ink cursor-pointer"
                        >
                          <option value="General Inquiry">General Inquiry</option>
                          <option value="Order Tracking">Order Status & Tracking</option>
                          <option value="Sizing Guide">Sizing & Fit Advice</option>
                          <option value="Returns & Exchanges">Returns & Exchanges</option>
                          <option value="Press & Wholesale">Press & Wholesale</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-ink mb-1">
                          Order Reference (If Applicable)
                        </label>
                        <input
                          type="text"
                          value={formData.orderNumber}
                          onChange={(e) => setFormData({ ...formData, orderNumber: e.target.value })}
                          placeholder="e.g. UF-17382-9901"
                          className="w-full bg-surface border border-border px-3.5 py-2.5 text-xs text-ink focus:outline-none focus:border-ink"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-ink mb-1">
                        Message *
                      </label>
                      <textarea
                        required
                        rows={5}
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        placeholder="How can we assist you with your streetwear wardrobe?"
                        className="w-full bg-surface border border-border p-3.5 text-xs text-ink focus:outline-none focus:border-ink"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={submitting}
                      className="bg-ink hover:bg-ink/85 text-primary-bg px-8 py-3.5 text-xs font-semibold uppercase tracking-widest flex items-center justify-center gap-2 transition-colors cursor-pointer"
                    >
                      {submitting ? (
                        <Loader2 className="w-4 h-4 animate-spin text-tan" />
                      ) : (
                        <>
                          <span>Submit Message</span>
                          <Send className="w-3.5 h-3.5" />
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </ShopLayout>
  );
}
