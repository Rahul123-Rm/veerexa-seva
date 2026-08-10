import { useState, useMemo } from 'react'
import { Search, Download, Landmark, CheckSquare } from 'lucide-react'
import { SOFTWARE_LIST } from './data.js'

const BANKS = [
    { id: 'SBI', label: 'SBI' },
    { id: 'Bank of Baroda', label: 'BOB' },
    { id: 'Bank of India', label: 'BOI' },
    { id: 'PNB', label: 'PNB' },
    { id: 'Common Utilities', label: 'Other Tools' }
]

export default function SoftwarePage() {
    const [selectedBank, setSelectedBank] = useState('SBI')
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedSoftware, setSelectedSoftware] = useState([])

    const filteredSoftware = useMemo(() => {
        return SOFTWARE_LIST.filter(s => {
            const matchesBank = s.bank === selectedBank
            const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase())
            return matchesBank && matchesSearch
        })
    }, [selectedBank, searchQuery])

    const handleBankChange = (bankId) => {
        setSelectedBank(bankId)
        setSelectedSoftware([])
    }

    const toggleSelection = (softwareName) => {
        setSelectedSoftware(prev =>
            prev.includes(softwareName)
                ? prev.filter(name => name !== softwareName)
                : [...prev, softwareName]
        )
    }

    const selectAll = () => {
        if (selectedSoftware.length === filteredSoftware.length) {
            setSelectedSoftware([])
        } else {
            setSelectedSoftware(filteredSoftware.map(s => s.name))
        }
    }

    const downloadSelected = () => {
        const itemsToDownload = filteredSoftware.filter(s => selectedSoftware.includes(s.name))
        itemsToDownload.forEach((item, index) => {
            setTimeout(() => {
                const link = document.createElement('a')
                link.href = item.link
                link.target = '_blank'
                link.rel = 'noopener noreferrer'
                document.body.appendChild(link)
                link.click()
                document.body.removeChild(link)
            }, index * 500)
        })
    }

    return (
        <div className="max-w-6xl mx-auto px-5 py-8">
            <div className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-display font-bold text-navy mb-2">Software Downloads</h1>
                    <p className="text-muted text-[14px]">Download the latest CSP software, drivers, and tools for your bank.</p>
                </div>
                {selectedSoftware.length > 0 && (
                    <button
                        onClick={downloadSelected}
                        className="flex items-center gap-2 bg-accent hover:bg-accent/90 text-white px-5 py-2.5 rounded-lg text-[14px] font-medium transition-colors shrink-0 shadow-sm"
                    >
                        <Download className="w-4.5 h-4.5" />
                        Download Selected ({selectedSoftware.length})
                    </button>
                )}
            </div>

            <div className="bg-white border border-border rounded-xl overflow-hidden mb-6 shadow-sm">
                <div className="flex overflow-x-auto border-b border-border">
                    {BANKS.map(bank => (
                        <button
                            key={bank.id}
                            onClick={() => handleBankChange(bank.id)}
                            className={`px-6 py-4 text-[14px] font-medium whitespace-nowrap transition-colors ${selectedBank === bank.id
                                ? 'text-accent border-b-2 border-accent bg-accent/5'
                                : 'text-muted hover:text-ink hover:bg-surface2'
                                }`}
                        >
                            {bank.label}
                        </button>
                    ))}
                </div>

                <div className="p-4 bg-surface2 border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="relative max-w-md w-full">
                        <Search className="w-4 h-4 text-muted absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                            type="text"
                            placeholder={`Search ${BANKS.find(b => b.id === selectedBank)?.label} software...`}
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 rounded-lg border border-border text-[13.5px] outline-none focus:border-accent bg-white"
                        />
                    </div>
                    {filteredSoftware.length > 0 && (
                        <button
                            onClick={selectAll}
                            className="flex items-center gap-2 text-[13.5px] font-medium text-navy hover:text-accent transition-colors shrink-0"
                        >
                            <CheckSquare className="w-4.5 h-4.5" />
                            {selectedSoftware.length === filteredSoftware.length ? 'Deselect All' : 'Select All'}
                        </button>
                    )}
                </div>

                <div className="p-0">
                    {filteredSoftware.length > 0 ? (
                        <ul className="divide-y divide-border">
                            {filteredSoftware.map((s, i) => (
                                <li key={i} className={`flex items-center gap-4 p-4 transition-colors ${selectedSoftware.includes(s.name) ? 'bg-accent/5' : 'hover:bg-surface2'}`}>
                                    <div className="flex items-center justify-center shrink-0">
                                        <input
                                            type="checkbox"
                                            checked={selectedSoftware.includes(s.name)}
                                            onChange={() => toggleSelection(s.name)}
                                            className="w-4.5 h-4.5 rounded border-border text-accent focus:ring-accent cursor-pointer"
                                        />
                                    </div>
                                    <div className="w-12 h-12 rounded-xl bg-navy/5 flex items-center justify-center shrink-0 hidden sm:flex">
                                        <Landmark className="w-6 h-6 text-navy" />
                                    </div>
                                    <div className="flex-1 min-w-0 cursor-pointer" onClick={() => toggleSelection(s.name)}>
                                        <div className="flex items-center gap-2 mb-1">
                                            <h3 className="text-[15px] text-ink font-semibold truncate">{s.name}</h3>
                                            {s.tag && (
                                                <span className="text-[10px] font-bold text-white bg-emerald-600 px-1.5 py-0.5 rounded">
                                                    {s.tag}
                                                </span>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-3 text-[12px] text-muted">
                                            <span>Version: {s.version}</span>
                                            {s.size && (
                                                <>
                                                    <span className="w-1 h-1 rounded-full bg-border"></span>
                                                    <span>Size: {s.size}</span>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                    <a
                                        href={s.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-2 bg-white border border-border hover:border-accent hover:text-accent text-ink px-4 py-2 rounded-lg text-[13px] font-medium transition-colors shrink-0"
                                    >
                                        <Download className="w-4 h-4" />
                                        <span className="hidden sm:inline">Download</span>
                                    </a>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <div className="p-8 text-center text-muted">
                            <p>No software found matching your search.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
