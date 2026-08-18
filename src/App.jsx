import { useMemo, useState, useEffect, useRef } from 'react'
import {
  Search, Sun, Moon, Download, Newspaper, FileText, Calculator, Wrench, Landmark,
  Shield, HeartHandshake, BookOpen, Printer, AlertCircle, Info, ChevronRight,
  PiggyBank, CircleDollarSign, TrendingUp, Receipt, FileSpreadsheet, BadgePercent, Timer, X
} from 'lucide-react'
import {
  SOFTWARE_LIST, HIGHLIGHTS, BANK_STATUS, QUICK_LINKS, LATEST_NEWS,
  CALCULATORS, IMPORTANT_DATES, GOVT_SCHEMES, HELP_GUIDES, NAV_LINKS
} from './data.js'
import SoftwarePage from './SoftwarePage.jsx'
import SeoSchema from './SeoSchema.jsx'
import ContactPage, { FormModal } from './ContactPage.jsx'

const ICONS = {
  Download, Newspaper, FileText, Calculator, Wrench, Search, Landmark,
  Shield, HeartHandshake, BookOpen, Printer, AlertCircle, Info,
  PiggyBank, CircleDollarSign, TrendingUp, Receipt, FileSpreadsheet, BadgePercent, Timer,
}

function Icon({ name, className }) {
  const C = ICONS[name] || Info
  return <C className={className} />
}

function AdSlot({ w, h, label }) {
  return (
    <div className="border border-dashed border-border rounded-lg bg-surface2 flex items-center justify-center text-muted text-sm" style={{ minHeight: h }}>
      {label || `${w} x ${h}`}
    </div>
  )
}

function Card({ title, viewAllHref = "#", children, dm }) {
  return (
    <div
      className="rounded-xl p-4"
      style={{
        backgroundColor: dm ? '#111827' : '#ffffff',
        border: `1px solid ${dm ? '#374151' : '#E4E7EC'}`,
        transition: 'background-color 0.3s ease',
      }}
    >
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-display font-semibold text-[15px]" style={{ color: dm ? '#F3F4F6' : '#1B2430' }}>{title}</h3>
        <a href={viewAllHref} className="text-[12.5px] text-accent font-medium hover:underline">View All</a>
      </div>
      {children}
    </div>
  )
}

export default function App() {
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(() => {
    return localStorage.getItem('veerexa_currentPage') || "home"
  })

  useEffect(() => {
    localStorage.setItem('veerexa_currentPage', currentPage)
  }, [currentPage])

  const [showContactForm, setShowContactForm] = useState(false)

  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('veerexa_darkMode')
      if (saved !== null) {
        return saved === 'true'
      }
      return window.matchMedia('(prefers-color-scheme: dark)').matches
    }
    return false
  })

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
    localStorage.setItem('veerexa_darkMode', darkMode)
  }, [darkMode])

  const bankStatusColor = s => s === "Working" ? "text-ok" : "text-rose-600"
  const bankDotColor = s => s === "Working" ? "bg-ok" : "bg-rose-600"

  const newSoftware = useMemo(() => SOFTWARE_LIST.filter(s => s.tag === "NEW").slice(0, 4), [])
  const popularDownloads = useMemo(() => SOFTWARE_LIST.slice(0, 5), [])

  // Search
  const [showResults, setShowResults] = useState(false)
  const searchRef = useRef(null)

  const searchResults = useMemo(() => {
    if (!searchTerm.trim() || searchTerm.length < 2) return []
    const q = searchTerm.toLowerCase()
    return SOFTWARE_LIST.filter(s =>
      s.name.toLowerCase().includes(q) ||
      s.bank.toLowerCase().includes(q) ||
      (s.id && s.id.toLowerCase().includes(q)) ||
      (s.version && s.version.toLowerCase().includes(q)) ||
      (s.message && s.message.toLowerCase().includes(q))
    ).slice(0, 8)
  }, [searchTerm])

  useEffect(() => {
    function handleClickOutside(e) {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowResults(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div
      className="min-h-screen"
      style={{
        backgroundColor: darkMode ? '#0B1120' : '#F7F8FA',
        color: darkMode ? '#E5E7EB' : '#1B2430',
        transition: 'background-color 0.3s ease, color 0.3s ease',
      }}
    >
      <SeoSchema />
      {showContactForm && <FormModal onClose={() => setShowContactForm(false)} />}
      {/* HEADER */}
      <header
        className="sticky top-0 z-30"
        style={{
          backgroundColor: darkMode ? '#111827' : '#ffffff',
          borderBottom: `1px solid ${darkMode ? '#374151' : '#E4E7EC'}`,
          transition: 'background-color 0.3s ease',
        }}
      >
        <div className="max-w-6xl mx-auto px-5 py-3 flex items-center gap-6">
          <div className="flex items-center gap-2 shrink-0">
            <div className="w-9 h-9 rounded-lg bg-navy flex items-center justify-center">
              <Landmark className="w-5 h-5 text-accent2" />
            </div>
            <div className="leading-tight">
              <div className="font-display font-extrabold text-lg text-navy tracking-tight">VEEREXA</div>
              <div className="text-[10px] text-muted -mt-0.5">for CSP &amp; Banking Services</div>
            </div>
          </div>

          {/* SEARCH BAR */}
          <div className="flex-1 max-w-xl hidden md:block relative" ref={searchRef}>
            <div
              className="flex items-center gap-2 rounded-lg px-3 py-2 transition-colors"
              style={{
                backgroundColor: darkMode ? '#1F2937' : '#F1F3F6',
                border: `1px solid ${darkMode ? '#374151' : '#E4E7EC'}`,
              }}
            >
              <Search className="w-4 h-4 text-muted shrink-0" />
              <input
                value={searchTerm}
                onChange={e => { setSearchTerm(e.target.value); setShowResults(true) }}
                onFocus={() => setShowResults(true)}
                placeholder="Search software, bank name, driver..."
                className="flex-1 bg-transparent outline-none text-[13.5px] text-ink placeholder:text-muted"
              />
              {searchTerm && (
                <button onClick={() => { setSearchTerm(''); setShowResults(false) }} className="text-muted hover:text-ink">
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* DROPDOWN RESULTS */}
            {showResults && searchTerm.length >= 2 && (
              <div
                className="absolute top-full left-0 right-0 mt-1.5 rounded-xl shadow-xl z-50 overflow-hidden"
                style={{
                  backgroundColor: darkMode ? '#111827' : '#ffffff',
                  border: `1px solid ${darkMode ? '#374151' : '#E4E7EC'}`,
                }}
              >
                {searchResults.length > 0 ? (
                  <>
                    <div className="px-3 py-2 border-b border-border bg-surface2">
                      <span className="text-[11.5px] text-muted font-medium">{searchResults.length} result{searchResults.length > 1 ? 's' : ''} found for "{searchTerm}"</span>
                    </div>
                    <ul className="max-h-72 overflow-y-auto divide-y divide-border">
                      {searchResults.map((s) => (
                        <li key={s.id} className="flex items-center gap-3 px-3 py-2.5 hover:bg-surface2 transition-colors">
                          <div className="w-8 h-8 rounded-lg bg-navy/5 flex items-center justify-center shrink-0">
                            <Landmark className="w-4 h-4 text-navy" />
                          </div>
                          <div className="flex-1 min-w-0 cursor-pointer" onClick={() => {
                            localStorage.setItem('veerexa_selectedBank', s.bank);
                            window.dispatchEvent(new Event('bankChanged'));
                            setCurrentPage('software');
                            setShowResults(false);
                            setSearchTerm('');
                            setTimeout(() => {
                              const el = document.getElementById(s.id);
                              if (el) {
                                el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                                el.classList.add('bg-accent/10');
                                setTimeout(() => el.classList.remove('bg-accent/10'), 2000);
                              }
                            }, 100);
                          }}>
                            <p className="text-[13px] text-ink font-semibold truncate">{s.name}</p>
                            <p className="text-[11px] text-muted">{s.bank} &bull; {s.version} &bull; {s.size}</p>
                          </div>
                          <button
                            onClick={() => {
                              localStorage.setItem('veerexa_selectedBank', s.bank);
                              window.dispatchEvent(new Event('bankChanged'));
                              setCurrentPage('software');
                              setShowResults(false);
                              setSearchTerm('');
                              setTimeout(() => {
                                const el = document.getElementById(s.id);
                                if (el) {
                                  el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                                  el.classList.add('bg-accent/10');
                                  setTimeout(() => el.classList.remove('bg-accent/10'), 2000);
                                }
                              }, 100);
                            }}
                            className="flex items-center gap-1.5 bg-surface2 hover:bg-border text-ink text-[11.5px] font-medium px-3 py-1.5 rounded-md shrink-0 transition-colors"
                          >
                            View <ChevronRight className="w-3 h-3" />
                          </button>
                        </li>
                      ))}
                    </ul>
                    <div className="px-3 py-2 border-t border-border">
                      <button
                        onClick={() => { setCurrentPage('software'); setShowResults(false); setSearchTerm(''); }}
                        className="text-[12px] text-accent font-medium hover:underline w-full text-center"
                      >
                        View all software →
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="px-4 py-5 text-center">
                    <p className="text-[13px] text-muted">No software found for "{searchTerm}"</p>
                    <p className="text-[11.5px] text-muted mt-1">Try: BOB, SBI, PNB, Morpho, Mantra, Driver...</p>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="flex items-center gap-5 ml-auto text-[13px] text-muted font-medium">
            <a href="#" onClick={(e) => { e.preventDefault(); setShowContactForm(true); }} className="hidden sm:inline hover:text-navy">About Us</a>
            <a href="#" onClick={(e) => { e.preventDefault(); setShowContactForm(true); }} className="hidden sm:inline hover:text-navy">Contact Us</a>
            <button onClick={() => setDarkMode(!darkMode)} className="hidden sm:block hover:text-navy transition-colors">
              {darkMode ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            </button>
            <button className="bg-navy text-white text-[13px] font-medium px-4 py-1.5 rounded-md">Login</button>
          </div>
        </div>
        <nav style={{ borderTop: `1px solid ${darkMode ? '#374151' : '#E4E7EC'}` }}>
          <div className="max-w-6xl mx-auto px-5 flex items-center gap-6 overflow-x-auto text-[13px] text-muted font-medium">
            {NAV_LINKS.map((link, i) => (
              <a
                key={link}
                href="#"
                onClick={(e) => {
                  if (link === "Software") {
                    e.preventDefault();
                    setCurrentPage("software");
                  } else if (link === "Home") {
                    e.preventDefault();
                    setCurrentPage("home");
                  } else if (link === "Help Center") {
                    e.preventDefault();
                    setShowContactForm(true);
                  }
                }}
                className={"py-2.5 whitespace-nowrap border-b-2 " + ((currentPage === 'home' && link === 'Home') || (currentPage === 'software' && link === 'Software') || (currentPage === 'contact' && link === 'Help Center') ? "text-accent border-accent" : "border-transparent hover:text-navy")}
              >
                {link}
              </a>
            ))}
          </div>
        </nav>
      </header>

      {currentPage === 'software' ? (
        <SoftwarePage darkMode={darkMode} />
      ) : currentPage === 'contact' ? (
        <ContactPage onOpenForm={() => setShowContactForm(true)} />
      ) : (
        <div className="max-w-6xl mx-auto px-5 py-5 space-y-5">

          {/* TOP: HIGHLIGHTS + AD */}
          <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-4">
            <Card title="TODAY'S HIGHLIGHTS" dm={darkMode}>
              <ul className="divide-y divide-border">
                {HIGHLIGHTS.map((h, i) => (
                  <li key={i} className="flex items-center gap-3 py-2.5">
                    <span className={"text-[10px] font-semibold text-white px-2 py-0.5 rounded " + h.tagColor}>{h.tag}</span>
                    <span className="flex-1 text-[13px] text-ink">{h.text}</span>
                    <span className="text-[11px] text-muted whitespace-nowrap">{h.time}</span>
                  </li>
                ))}
              </ul>
            </Card>

            <AdSlot w={300} h={250} />
          </div>

          {/* QUICK LINKS ROW */}
          <div
            className="rounded-xl py-6 px-4"
            style={{
              backgroundColor: darkMode ? '#111827' : '#ffffff',
              border: `1px solid ${darkMode ? '#374151' : '#E4E7EC'}`,
              transition: 'background-color 0.3s ease',
            }}
          >
            <div className="grid grid-cols-3 sm:grid-cols-7 gap-4 text-center">
              {QUICK_LINKS.map((q, i) => (
                <a
                  key={i}
                  href="#"
                  onClick={(e) => {
                    if (q.label === "Software\nDownload") {
                      e.preventDefault();
                      setCurrentPage("software");
                    }
                  }}
                  className="flex flex-col items-center gap-2 group"
                >
                  <div className="w-12 h-12 rounded-xl bg-surface2 group-hover:bg-accent/10 flex items-center justify-center transition-colors">
                    <Icon name={q.icon} className="w-5 h-5 text-accent" />
                  </div>
                  <span className="text-[12px] text-ink font-medium whitespace-pre-line leading-tight">{q.label}</span>
                </a>
              ))}
            </div>
          </div>

          {/* SOFTWARE / DOWNLOADS */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card title="New Software" dm={darkMode}>
              <ul className="divide-y divide-border">
                {newSoftware.map((s, i) => (
                  <li key={i} id={s.id} onClick={() => {
                    localStorage.setItem('veerexa_selectedBank', s.bank);
                    window.dispatchEvent(new Event('bankChanged'));
                    setCurrentPage('software');
                    setTimeout(() => {
                      const el = document.getElementById(s.id);
                      if (el) {
                        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        el.classList.add('bg-accent/10');
                        setTimeout(() => el.classList.remove('bg-accent/10'), 2000);
                      }
                    }, 100);
                  }} className="flex items-center gap-3 py-2.5 cursor-pointer hover:bg-surface2 px-2 -mx-2 rounded-lg transition-colors">
                    <div className="w-9 h-9 rounded-lg bg-navy/5 flex items-center justify-center shrink-0">
                      <Landmark className="w-4 h-4 text-navy" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-[13px] text-ink font-medium truncate">{s.name}</span>
                        <span className={`text-[9.5px] font-semibold text-white ${s.tagColor || 'bg-emerald-600'} px-1.5 py-0.5 rounded`}>NEW</span>
                      </div>
                      <span className="text-[11px] text-muted">{s.time || "a few hours ago"}</span>
                      {s.message && <span className="text-[11px] text-muted block mt-0.5">{s.message}</span>}
                    </div>
                    <a href={s.link} target="_blank" rel="noopener noreferrer" onClick={(e) => { e.stopPropagation(); window.history.pushState(null, '', `#${s.id}`); }} className="text-accent shrink-0">
                      <Download className="w-4 h-4" />
                    </a>
                  </li>
                ))}
              </ul>
            </Card>

            <Card title="Popular Downloads" dm={darkMode}>
              <ul className="divide-y divide-border">
                {popularDownloads.map((s, i) => (
                  <li key={i} id={s.id} onClick={() => {
                    localStorage.setItem('veerexa_selectedBank', s.bank);
                    window.dispatchEvent(new Event('bankChanged'));
                    setCurrentPage('software');
                    setTimeout(() => {
                      const el = document.getElementById(s.id);
                      if (el) {
                        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        el.classList.add('bg-accent/10');
                        setTimeout(() => el.classList.remove('bg-accent/10'), 2000);
                      }
                    }, 100);
                  }} className="flex items-center gap-3 py-2.5 cursor-pointer hover:bg-surface2 px-2 -mx-2 rounded-lg transition-colors">
                    <div className="w-9 h-9 rounded-lg bg-navy/5 flex items-center justify-center shrink-0">
                      <Landmark className="w-4 h-4 text-navy" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-[13px] text-ink font-medium block truncate">{s.name}</span>
                      <span className="text-[11px] text-muted">{s.version} {s.size ? "| " + s.size : ""}</span>
                      {s.message && <span className="text-[11px] text-muted block mt-0.5">{s.message}</span>}
                    </div>
                    <a href={s.link} target="_blank" rel="noopener noreferrer" onClick={(e) => { e.stopPropagation(); window.history.pushState(null, '', `#${s.id}`); }} className="text-accent shrink-0">
                      <Download className="w-4 h-4" />
                    </a>
                  </li>
                ))}
              </ul>
            </Card>
          </div>

          {/* TOOLS & CALCULATORS + NEWSLETTER + AD */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div
              className="lg:col-span-2 rounded-xl p-4"
              style={{
                backgroundColor: darkMode ? '#111827' : '#ffffff',
                border: `1px solid ${darkMode ? '#374151' : '#E4E7EC'}`,
                transition: 'background-color 0.3s ease',
              }}
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-display font-semibold text-[15px] mb-3" style={{ color: darkMode ? '#F3F4F6' : '#1B2430' }}>Tools &amp; Calculators</h3>
                <a href="#" className="text-[12.5px] text-accent font-medium hover:underline">View All</a>
              </div>
              <div className="grid grid-cols-4 sm:grid-cols-7 gap-3 text-center">
                {CALCULATORS.map((c, i) => (
                  <a key={i} href="#" className="flex flex-col items-center gap-2 group">
                    <div className="w-11 h-11 rounded-xl bg-surface2 group-hover:bg-accent/10 flex items-center justify-center transition-colors">
                      <Icon name={c.icon} className="w-4.5 h-4.5 text-accent" />
                    </div>
                    <span className="text-[11px] text-ink font-medium leading-tight">{c.label}</span>
                  </a>
                ))}
              </div>
            </div>

            <div
              className="rounded-xl p-4"
              style={{
                backgroundColor: darkMode ? '#111827' : '#ffffff',
                border: `1px solid ${darkMode ? '#374151' : '#E4E7EC'}`,
                transition: 'background-color 0.3s ease',
              }}
            >
              <h3 className="font-display font-semibold text-[15px] mb-1.5" style={{ color: darkMode ? '#F3F4F6' : '#1B2430' }}>Stay Updated</h3>
              <p className="text-[12.5px] text-muted mb-3">Get latest updates, news and software directly in your inbox.</p>
              <div className="flex gap-2">
                <input placeholder="Enter your email" className="flex-1 border border-border rounded-md px-3 py-2 text-[13px] outline-none focus:border-accent" />
                <button className="bg-accent hover:bg-accent/90 text-white text-[13px] font-medium px-3.5 rounded-md">Subscribe</button>
              </div>
              <p className="text-[11px] text-muted mt-2">We respect your privacy.</p>
            </div>
          </div>

          <AdSlot w={728} h={90} />

          {/* DATES / SCHEMES / GUIDES */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <Card title="Important Dates" dm={darkMode}>
              <ul className="space-y-2.5">
                {IMPORTANT_DATES.map((d, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <ChevronRight className="w-3.5 h-3.5 text-accent mt-0.5 shrink-0" />
                    <div>
                      <p className="text-[13px] text-ink leading-snug">{d.title}</p>
                      <span className="text-[11px] text-muted">{d.date}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </Card>

            <Card title="Government Schemes" dm={darkMode}>
              <ul className="space-y-3">
                {GOVT_SCHEMES.map((s, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-navy/5 flex items-center justify-center shrink-0">
                      <Icon name={s.icon} className="w-4 h-4 text-navy" />
                    </div>
                    <div>
                      <p className="text-[13px] text-ink font-medium">{s.title}</p>
                      <a href="#" className="text-[11px] text-accent hover:underline">Read More</a>
                    </div>
                  </li>
                ))}
              </ul>
            </Card>

            <Card title="Help & Guides" dm={darkMode}>
              <ul className="space-y-3">
                {HELP_GUIDES.map((g, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-navy/5 flex items-center justify-center shrink-0">
                      <Icon name={g.icon} className="w-4 h-4 text-navy" />
                    </div>
                    <div>
                      <p className="text-[13px] text-ink font-medium">{g.title}</p>
                      <span className="text-[11px] text-muted">{g.sub}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </Card>
          </div>
        </div>
      )}

      {/* FOOTER */}
      <footer className="bg-navy text-slate-300 mt-6">
        <div className="max-w-6xl mx-auto px-5 py-10 grid grid-cols-2 sm:grid-cols-5 gap-8">
          <div className="col-span-2 sm:col-span-1">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                <Landmark className="w-4 h-4 text-accent2" />
              </div>
              <span className="font-display font-extrabold text-white">VEEREXA</span>
            </div>
            <p className="text-[12px] text-slate-400 leading-relaxed">Your trusted partner for all CSP, banking services, software, news and much more.</p>
          </div>
          <div>
            <h5 className="text-white font-semibold text-[13px] mb-3">Quick Links</h5>
            <ul className="space-y-2 text-[12.5px]">
              <li><a href="#" onClick={(e) => { e.preventDefault(); setShowContactForm(true); }} className="hover:text-white">About Us</a></li>
              <li><a href="#" onClick={(e) => { e.preventDefault(); setShowContactForm(true); }} className="hover:text-white">Contact Us</a></li>
              <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white">Terms &amp; Conditions</a></li>
            </ul>
          </div>
          <div>
            <h5 className="text-white font-semibold text-[13px] mb-3">Useful Links</h5>
            <ul className="space-y-2 text-[12.5px]">
              <li><a href="#" className="hover:text-white">IFSC Code Finder</a></li>
              <li><a href="#" className="hover:text-white">PIN Code Finder</a></li>
              <li><a href="#" className="hover:text-white">All Banks List</a></li>
              <li><a href="#" className="hover:text-white">Bank Holidays</a></li>
            </ul>
          </div>
          <div>
            <h5 className="text-white font-semibold text-[13px] mb-3">Popular Categories</h5>
            <ul className="space-y-2 text-[12.5px]">
              <li><a href="#" className="hover:text-white">SBI CSP Software</a></li>
              <li><a href="#" className="hover:text-white">PNB CSP Software</a></li>
              <li><a href="#" className="hover:text-white">BOB CSP Software</a></li>
              <li><a href="#" className="hover:text-white">AEPS Services</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-white/10 py-4 text-center text-[11.5px] text-slate-400">
          © 2026 Veerexa. All Rights Reserved.
        </div>
      </footer>
    </div>
  )
}
