import { useState } from 'react'
import { MessageSquare, Phone, Mail, MapPin, ExternalLink, X, CheckCircle, ChevronRight } from 'lucide-react'

const GOOGLE_FORM_URL = "https://docs.google.com/forms/d/e/1FAIpQLScFJR158guLGpkAEnDNJOb28tDPRrWEV59P8wm73tcntbaGuw/viewform?embedded=true"
const GOOGLE_FORM_DIRECT = "https://docs.google.com/forms/d/e/1FAIpQLScFJR158guLGpkAEnDNJOb28tDPRrWEV59P8wm73tcntbaGuw/viewform"

function FormModal({ onClose }) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(4px)' }}>
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl flex flex-col" style={{ maxHeight: '90vh' }}>
                <div className="flex items-center justify-between px-5 py-4 bg-navy rounded-t-2xl shrink-0">
                    <div className="flex items-center gap-2">
                        <MessageSquare className="w-4 h-4 text-accent2" />
                        <span className="font-display font-bold text-white text-[15px]">Contact & Feedback Form</span>
                    </div>
                    <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors">
                        <X className="w-4 h-4 text-white" />
                    </button>
                </div>
                <div className="overflow-auto rounded-b-2xl flex-1">
                    <iframe
                        src={GOOGLE_FORM_URL}
                        width="100%"
                        height="580"
                        frameBorder="0"
                        marginHeight="0"
                        marginWidth="0"
                        title="Veerexa Contact & Feedback Form"
                        style={{ display: 'block' }}
                    >
                        Loading...
                    </iframe>
                </div>
            </div>
        </div>
    )
}

export default function ContactPage({ onOpenForm }) {
    return (
        <div className="max-w-6xl mx-auto px-5 py-8">

            {/* Page Header */}
            <div className="mb-6">
                <h1 className="text-2xl font-display font-bold text-navy mb-1">Contact Us & Feedback</h1>
                <p className="text-muted text-[13.5px]">Any problem, suggestion or feedback? We are here to help you!</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

                {/* LEFT: Info */}
                <div className="space-y-4">
                    <div className="bg-white border border-border rounded-xl p-5">
                        <h2 className="font-display font-semibold text-[14px] text-ink mb-4">Get in Touch</h2>
                        <ul className="space-y-3.5">
                            <li className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-lg bg-emerald-50 flex items-center justify-center shrink-0">
                                    <Phone className="w-4 h-4 text-emerald-600" />
                                </div>
                                <div>
                                    <p className="text-[13px] font-semibold text-ink">WhatsApp Support</p>
                                    <p className="text-[12px] text-muted">Mon–Sat, 9AM–6PM</p>
                                </div>
                            </li>
                            <li className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                                    <Mail className="w-4 h-4 text-blue-600" />
                                </div>
                                <div>
                                    <p className="text-[13px] font-semibold text-ink">Email Support</p>
                                    <p className="text-[12px] text-muted">veerexa0@gmail.com</p>
                                </div>
                            </li>
                            <li className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-lg bg-violet-50 flex items-center justify-center shrink-0">
                                    <MapPin className="w-4 h-4 text-violet-600" />
                                </div>
                                <div>
                                    <p className="text-[13px] font-semibold text-ink">Service Area</p>
                                    <p className="text-[12px] text-muted">Pan India — CSP & Kiosk Services</p>
                                </div>
                            </li>
                        </ul>
                    </div>

                    <div className="bg-white border border-border rounded-xl p-4">
                        <h3 className="font-semibold text-[13px] text-ink mb-3">⏱ Response Time</h3>
                        <div className="space-y-2.5">
                            {[
                                { label: 'Software Issues', time: '2–4 Hours', color: 'text-emerald-600', dot: 'bg-emerald-500' },
                                { label: 'General Queries', time: '12–24 Hours', color: 'text-blue-600', dot: 'bg-blue-500' },
                                { label: 'Feedback', time: '24–48 Hours', color: 'text-amber-600', dot: 'bg-amber-500' },
                            ].map((r) => (
                                <div key={r.label} className="flex items-center justify-between text-[12.5px]">
                                    <span className="flex items-center gap-2 text-muted">
                                        <span className={`w-1.5 h-1.5 rounded-full ${r.dot}`} />
                                        {r.label}
                                    </span>
                                    <span className={`font-semibold ${r.color}`}>{r.time}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* RIGHT: CTA + Quick Help */}
                <div className="lg:col-span-2 space-y-4">

                    <div className="bg-white border border-border rounded-xl p-6">
                        <div className="flex items-start gap-4">
                            <div className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center shrink-0">
                                <MessageSquare className="w-7 h-7 text-accent" />
                            </div>
                            <div className="flex-1">
                                <h2 className="font-display font-bold text-[17px] text-navy mb-1">Send Us Your Feedback</h2>
                                <p className="text-muted text-[13px] mb-4 leading-relaxed">
                                    Click the button below to fill our contact form. We will get back to you as soon as possible.
                                </p>
                                <div className="flex flex-wrap gap-3">
                                    <button
                                        onClick={onOpenForm}
                                        className="flex items-center gap-2 bg-accent hover:bg-accent/90 text-white font-semibold text-[13.5px] px-5 py-2.5 rounded-lg transition-colors shadow-sm"
                                    >
                                        <MessageSquare className="w-4 h-4" />
                                        Fill Contact Form
                                    </button>
                                    <a
                                        href={GOOGLE_FORM_DIRECT}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-2 bg-white border border-border hover:border-accent hover:text-accent text-ink font-medium text-[13.5px] px-5 py-2.5 rounded-lg transition-colors"
                                    >
                                        <ExternalLink className="w-4 h-4" />
                                        Open in New Tab
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white border border-border rounded-xl p-5">
                        <h3 className="font-display font-semibold text-[14px] text-ink mb-3">How Can We Help You?</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {[
                                'Software download not working',
                                'Driver installation issue',
                                'Request a new software',
                                'Give a suggestion for website',
                                'BOB Kiosk setup problem',
                                'Any other technical issue',
                            ].map((topic) => (
                                <button
                                    key={topic}
                                    onClick={onOpenForm}
                                    className="flex items-center gap-2.5 text-left p-3 rounded-lg border border-border hover:border-accent hover:bg-accent/5 transition-colors group"
                                >
                                    <ChevronRight className="w-3.5 h-3.5 text-accent shrink-0" />
                                    <span className="text-[12.5px] text-ink group-hover:text-accent transition-colors">{topic}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="bg-navy rounded-xl p-4 flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-accent2 shrink-0" />
                        <p className="text-[12.5px] text-slate-300">
                            Your feedback helps us improve Veerexa. Every feedback is carefully reviewed and taken seriously. 🙏
                        </p>
                    </div>

                </div>
            </div>
        </div>
    )
}

export { FormModal }
