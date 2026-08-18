import React, { useState, useEffect } from 'react';
import { Search, MapPin, Building, ChevronLeft, ChevronRight, AlertCircle, Loader2 } from 'lucide-react';

const STATES = [
    { code: "IN-AN", name: "Andaman and Nicobar Islands" },
    { code: "IN-AP", name: "Andhra Pradesh" },
    { code: "IN-AR", name: "Arunachal Pradesh" },
    { code: "IN-AS", name: "Assam" },
    { code: "IN-BR", name: "Bihar" },
    { code: "IN-CH", name: "Chandigarh" },
    { code: "IN-CT", name: "Chhattisgarh" },
    { code: "IN-DH", name: "Dadra and Nagar Haveli and Daman and Diu" },
    { code: "IN-DL", name: "Delhi" },
    { code: "IN-GA", name: "Goa" },
    { code: "IN-GJ", name: "Gujarat" },
    { code: "IN-HR", name: "Haryana" },
    { code: "IN-HP", name: "Himachal Pradesh" },
    { code: "IN-JK", name: "Jammu and Kashmir" },
    { code: "IN-JH", name: "Jharkhand" },
    { code: "IN-KA", name: "Karnataka" },
    { code: "IN-KL", name: "Kerala" },
    { code: "IN-LA", name: "Ladakh" },
    { code: "IN-LD", name: "Lakshadweep" },
    { code: "IN-MP", name: "Madhya Pradesh" },
    { code: "IN-MH", name: "Maharashtra" },
    { code: "IN-MN", name: "Manipur" },
    { code: "IN-ML", name: "Meghalaya" },
    { code: "IN-MZ", name: "Mizoram" },
    { code: "IN-NL", name: "Nagaland" },
    { code: "IN-OR", name: "Odisha" },
    { code: "IN-PY", name: "Puducherry" },
    { code: "IN-PB", name: "Punjab" },
    { code: "IN-RJ", name: "Rajasthan" },
    { code: "IN-SK", name: "Sikkim" },
    { code: "IN-TN", name: "Tamil Nadu" },
    { code: "IN-TG", name: "Telangana" },
    { code: "IN-TR", name: "Tripura" },
    { code: "IN-UP", name: "Uttar Pradesh" },
    { code: "IN-UT", name: "Uttarakhand" },
    { code: "IN-WB", name: "West Bengal" }
];

export default function IfscCodePage({ darkMode }) {
    const [searchMode, setSearchMode] = useState('location'); // 'location' or 'ifsc'
    const [bankCode, setBankCode] = useState('');
    const [bankSearchTerm, setBankSearchTerm] = useState('');
    const [isBankDropdownOpen, setIsBankDropdownOpen] = useState(false);
    const [stateCode, setStateCode] = useState('');
    const [city, setCity] = useState('');
    const [branch, setBranch] = useState('');
    const [ifscInput, setIfscInput] = useState('');

    const [banksList, setBanksList] = useState([]);
    const bankDropdownRef = React.useRef(null);

    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [page, setPage] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const [hasNext, setHasNext] = useState(false);
    const limit = 20;

    const [selectedBank, setSelectedBank] = useState(null);

    useEffect(() => {
        // Fetch list of all banks
        fetch('https://raw.githubusercontent.com/razorpay/ifsc/master/src/banknames.json')
            .then(res => res.json())
            .then(data => {
                const banksArray = Object.entries(data).map(([code, name]) => ({ code, name }));
                // Sort alphabetically by name
                banksArray.sort((a, b) => a.name.localeCompare(b.name));
                setBanksList(banksArray);
            })
            .catch(err => console.error('Failed to fetch banks list:', err));

        const handleClickOutside = (event) => {
            if (bankDropdownRef.current && !bankDropdownRef.current.contains(event.target)) {
                setIsBankDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const filteredBanks = banksList.filter(b => b.name.toLowerCase().includes(bankSearchTerm.toLowerCase()) || b.code.toLowerCase().includes(bankSearchTerm.toLowerCase()));

    const handleSearch = async (pageNum = 1) => {
        setLoading(true);
        setError('');
        setSelectedBank(null);
        setPage(pageNum);

        try {
            if (searchMode === 'ifsc') {
                if (!ifscInput.trim()) {
                    setError('Please enter an IFSC code.');
                    setLoading(false);
                    return;
                }
                const res = await fetch(`https://ifsc.razorpay.com/${ifscInput.trim().toUpperCase()}`);
                if (!res.ok) {
                    throw new Error('IFSC code not found or invalid.');
                }
                const data = await res.json();
                setResults([data]);
                setTotalCount(1);
                setHasNext(false);
            } else {
                if (!stateCode) {
                    setError('Please select a state.');
                    setLoading(false);
                    return;
                }

                let url = `https://ifsc.razorpay.com/search?state=${stateCode}&limit=${limit}&offset=${(pageNum - 1) * limit}`;
                if (bankCode) url += `&bankcode=${bankCode}`;
                if (city.trim()) url += `&city=${encodeURIComponent(city.trim().toUpperCase())}`;
                if (branch.trim()) url += `&branch=${encodeURIComponent(branch.trim().toUpperCase())}`;

                const proxyUrl = `https://corsproxy.io/?${encodeURIComponent(url)}`;
                const res = await fetch(proxyUrl);
                if (!res.ok) {
                    throw new Error('Failed to fetch data.');
                }
                const data = await res.json();

                if (data.data && data.data.length > 0) {
                    setResults(data.data);
                    setHasNext(data.hasNext);
                    setTotalCount(data.count || 0);
                } else {
                    setResults([]);
                    setHasNext(false);
                    setTotalCount(0);
                    setError('No banks found for the given criteria.');
                }
            }
        } catch (err) {
            setError(err.message || 'An error occurred.');
            setResults([]);
        } finally {
            setLoading(false);
        }
    };

    const handleRowClick = (bank) => {
        setSelectedBank(bank);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div className="max-w-6xl mx-auto px-5 py-8 min-h-screen">
            <div className="mb-8 text-center">
                <h1 className={`text-3xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-navy'}`}>IFSC Code Finder</h1>
                <p className={`${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>Find IFSC codes by state, city, and branch, or search directly by IFSC code.</p>
            </div>

            {/* Search Filters */}
            <div className={`p-6 rounded-xl shadow-sm mb-8 border ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
                <div className="flex gap-4 mb-6 border-b pb-4 border-slate-200 dark:border-slate-700">
                    <button
                        onClick={() => setSearchMode('location')}
                        className={`px-4 py-2 font-medium rounded-lg transition-colors ${searchMode === 'location' ? 'bg-accent text-white' : darkMode ? 'text-slate-300 hover:bg-slate-700' : 'text-slate-600 hover:bg-slate-100'}`}
                    >
                        Search by Location
                    </button>
                    <button
                        onClick={() => setSearchMode('ifsc')}
                        className={`px-4 py-2 font-medium rounded-lg transition-colors ${searchMode === 'ifsc' ? 'bg-accent text-white' : darkMode ? 'text-slate-300 hover:bg-slate-700' : 'text-slate-600 hover:bg-slate-100'}`}
                    >
                        Search by IFSC
                    </button>
                </div>

                {searchMode === 'location' ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div ref={bankDropdownRef} className="relative">
                            <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>Bank (Optional)</label>
                            <div
                                className={`w-full p-2.5 rounded-lg border flex justify-between items-center cursor-pointer ${darkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-300 text-navy'}`}
                                onClick={() => setIsBankDropdownOpen(!isBankDropdownOpen)}
                            >
                                <span className="truncate">{bankCode ? banksList.find(b => b.code === bankCode)?.name || 'Unknown Bank' : 'All Banks'}</span>
                                <ChevronRight className={`w-4 h-4 transition-transform ${isBankDropdownOpen ? 'rotate-90' : ''}`} />
                            </div>

                            {isBankDropdownOpen && (
                                <div className={`absolute z-10 w-full mt-1 rounded-lg border shadow-lg max-h-60 flex flex-col ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
                                    <div className="p-2 border-b dark:border-slate-700">
                                        <input
                                            type="text"
                                            placeholder="Search bank (e.g. SBI)"
                                            value={bankSearchTerm}
                                            onChange={(e) => setBankSearchTerm(e.target.value)}
                                            className={`w-full p-2 rounded border text-sm outline-none ${darkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-navy'}`}
                                            onClick={(e) => e.stopPropagation()}
                                        />
                                    </div>
                                    <div className="overflow-y-auto flex-1">
                                        <div
                                            className={`p-2.5 text-sm cursor-pointer hover:bg-accent/10 ${bankCode === '' ? 'font-semibold text-accent' : darkMode ? 'text-slate-200' : 'text-slate-700'}`}
                                            onClick={() => { setBankCode(''); setIsBankDropdownOpen(false); setBankSearchTerm(''); }}
                                        >
                                            All Banks
                                        </div>
                                        {filteredBanks.map(b => (
                                            <div
                                                key={b.code}
                                                className={`p-2.5 text-sm cursor-pointer hover:bg-accent/10 ${bankCode === b.code ? 'font-semibold text-accent' : darkMode ? 'text-slate-200' : 'text-slate-700'}`}
                                                onClick={() => { setBankCode(b.code); setIsBankDropdownOpen(false); setBankSearchTerm(''); }}
                                            >
                                                {b.name}
                                            </div>
                                        ))}
                                        {filteredBanks.length === 0 && (
                                            <div className="p-3 text-sm text-center text-slate-500">No banks found</div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                        <div>
                            <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>State *</label>
                            <select
                                value={stateCode}
                                onChange={(e) => setStateCode(e.target.value)}
                                className={`w-full p-2.5 rounded-lg border focus:ring-2 focus:ring-accent outline-none ${darkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-300 text-navy'}`}
                            >
                                <option value="">Select State</option>
                                {STATES.map(s => (
                                    <option key={s.code} value={s.code}>{s.name}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>City (Optional)</label>
                            <input
                                type="text"
                                value={city}
                                onChange={(e) => setCity(e.target.value)}
                                placeholder="e.g. MUMBAI"
                                className={`w-full p-2.5 rounded-lg border focus:ring-2 focus:ring-accent outline-none uppercase ${darkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-300 text-navy'}`}
                            />
                        </div>
                        <div>
                            <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>Branch / Area (Optional)</label>
                            <input
                                type="text"
                                value={branch}
                                onChange={(e) => setBranch(e.target.value)}
                                placeholder="e.g. ANDHERI"
                                className={`w-full p-2.5 rounded-lg border focus:ring-2 focus:ring-accent outline-none uppercase ${darkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-300 text-navy'}`}
                            />
                        </div>
                    </div>
                ) : (
                    <div className="max-w-md">
                        <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>IFSC Code *</label>
                        <input
                            type="text"
                            value={ifscInput}
                            onChange={(e) => setIfscInput(e.target.value)}
                            placeholder="e.g. SBIN0000001"
                            className={`w-full p-2.5 rounded-lg border focus:ring-2 focus:ring-accent outline-none uppercase ${darkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-300 text-navy'}`}
                        />
                    </div>
                )}

                <div className="mt-6 flex items-center gap-4">
                    <button
                        onClick={() => handleSearch(1)}
                        disabled={loading}
                        className="bg-accent hover:bg-accent/90 text-white px-6 py-2.5 rounded-lg font-medium flex items-center gap-2 transition-colors disabled:opacity-70"
                    >
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
                        {loading ? 'Searching...' : 'Search'}
                    </button>
                    {error && (
                        <div className="flex items-center gap-2 text-red-500 text-sm font-medium">
                            <AlertCircle className="w-4 h-4" />
                            {error}
                        </div>
                    )}
                </div>
            </div>

            {/* Selected Bank Details */}
            {selectedBank && (
                <div className={`p-6 rounded-xl shadow-sm mb-8 border animate-in fade-in slide-in-from-bottom-4 ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <h2 className={`text-2xl font-bold mb-1 ${darkMode ? 'text-white' : 'text-navy'}`}>{selectedBank.BANK}</h2>
                            <p className={`text-lg font-medium text-accent`}>{selectedBank.IFSC}</p>
                        </div>
                        <button onClick={() => setSelectedBank(null)} className={`p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                            <AlertCircle className="w-5 h-5 opacity-0" />
                            <span className="sr-only">Close</span>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute top-6 right-6"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div>
                            <p className={`text-sm mb-1 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Branch</p>
                            <p className={`font-medium ${darkMode ? 'text-slate-200' : 'text-slate-800'}`}>{selectedBank.BRANCH}</p>
                        </div>
                        <div>
                            <p className={`text-sm mb-1 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>City</p>
                            <p className={`font-medium ${darkMode ? 'text-slate-200' : 'text-slate-800'}`}>{selectedBank.CITY}</p>
                        </div>
                        <div>
                            <p className={`text-sm mb-1 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>State</p>
                            <p className={`font-medium ${darkMode ? 'text-slate-200' : 'text-slate-800'}`}>{selectedBank.STATE}</p>
                        </div>
                        <div>
                            <p className={`text-sm mb-1 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>District</p>
                            <p className={`font-medium ${darkMode ? 'text-slate-200' : 'text-slate-800'}`}>{selectedBank.DISTRICT}</p>
                        </div>
                        <div>
                            <p className={`text-sm mb-1 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>MICR Code</p>
                            <p className={`font-medium ${darkMode ? 'text-slate-200' : 'text-slate-800'}`}>{selectedBank.MICR || 'N/A'}</p>
                        </div>
                        <div>
                            <p className={`text-sm mb-1 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Contact</p>
                            <p className={`font-medium ${darkMode ? 'text-slate-200' : 'text-slate-800'}`}>{selectedBank.CONTACT || 'N/A'}</p>
                        </div>
                        <div className="md:col-span-2 lg:col-span-3">
                            <p className={`text-sm mb-1 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Address</p>
                            <p className={`font-medium ${darkMode ? 'text-slate-200' : 'text-slate-800'}`}>{selectedBank.ADDRESS}</p>
                        </div>
                    </div>

                    <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700 flex gap-4 flex-wrap">
                        <div className={`px-3 py-1 rounded-full text-xs font-medium ${selectedBank.UPI ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'}`}>
                            UPI: {selectedBank.UPI ? 'Supported' : 'Not Supported'}
                        </div>
                        <div className={`px-3 py-1 rounded-full text-xs font-medium ${selectedBank.IMPS ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'}`}>
                            IMPS: {selectedBank.IMPS ? 'Supported' : 'Not Supported'}
                        </div>
                        <div className={`px-3 py-1 rounded-full text-xs font-medium ${selectedBank.NEFT ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'}`}>
                            NEFT: {selectedBank.NEFT ? 'Supported' : 'Not Supported'}
                        </div>
                        <div className={`px-3 py-1 rounded-full text-xs font-medium ${selectedBank.RTGS ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'}`}>
                            RTGS: {selectedBank.RTGS ? 'Supported' : 'Not Supported'}
                        </div>
                    </div>
                </div>
            )}

            {/* Results Table */}
            {results.length > 0 && (
                <div className={`rounded-xl shadow-sm border overflow-hidden ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className={`border-b ${darkMode ? 'border-slate-700 bg-slate-800/50' : 'border-slate-200 bg-slate-50'}`}>
                                    <th className={`p-4 font-semibold text-sm ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>Bank</th>
                                    <th className={`p-4 font-semibold text-sm ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>IFSC</th>
                                    <th className={`p-4 font-semibold text-sm ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>Branch</th>
                                    <th className={`p-4 font-semibold text-sm ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>City</th>
                                    <th className={`p-4 font-semibold text-sm text-right ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {results.map((bank, idx) => (
                                    <tr
                                        key={bank.IFSC + idx}
                                        className={`border-b last:border-0 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors cursor-pointer ${darkMode ? 'border-slate-700' : 'border-slate-100'}`}
                                        onClick={() => handleRowClick(bank)}
                                    >
                                        <td className={`p-4 text-sm font-medium ${darkMode ? 'text-slate-200' : 'text-navy'}`}>
                                            <div className="flex items-center gap-2">
                                                <Building className="w-4 h-4 text-slate-400" />
                                                {bank.BANK}
                                            </div>
                                        </td>
                                        <td className="p-4 text-sm font-semibold text-accent">{bank.IFSC}</td>
                                        <td className={`p-4 text-sm ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>{bank.BRANCH}</td>
                                        <td className={`p-4 text-sm ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>{bank.CITY}</td>
                                        <td className="p-4 text-sm text-right">
                                            <button className="text-accent hover:underline font-medium text-sm">View Details</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {(hasNext || page > 1) && (
                        <div className={`p-4 border-t flex items-center justify-between ${darkMode ? 'border-slate-700 bg-slate-800/50' : 'border-slate-200 bg-slate-50'}`}>
                            <div className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                                Showing {((page - 1) * limit) + 1} to {Math.min(page * limit, totalCount || (page * limit))} {totalCount ? `of ${totalCount}` : ''}
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => handleSearch(page - 1)}
                                    disabled={page === 1 || loading}
                                    className={`p-2 rounded-lg border flex items-center justify-center transition-colors disabled:opacity-50 ${darkMode ? 'border-slate-600 hover:bg-slate-700 text-white' : 'border-slate-300 hover:bg-slate-100 text-navy'}`}
                                >
                                    <ChevronLeft className="w-5 h-5" />
                                </button>
                                <button
                                    onClick={() => handleSearch(page + 1)}
                                    disabled={!hasNext || loading}
                                    className={`p-2 rounded-lg border flex items-center justify-center transition-colors disabled:opacity-50 ${darkMode ? 'border-slate-600 hover:bg-slate-700 text-white' : 'border-slate-300 hover:bg-slate-100 text-navy'}`}
                                >
                                    <ChevronRight className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
