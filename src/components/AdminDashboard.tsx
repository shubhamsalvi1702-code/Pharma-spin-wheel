import React, { useState, useEffect, useCallback } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  Search, 
  Filter, 
  Download, 
  Users, 
  Gift, 
  Award, 
  Calendar, 
  Phone, 
  Store, 
  MapPin, 
  RefreshCw, 
  Sliders, 
  LogOut, 
  X, 
  Check, 
  AlertCircle,
  TrendingUp,
  Percent,
  CheckCircle2,
  FileSpreadsheet
} from 'lucide-react';
import { motion } from 'motion/react';
import { Participant, PrizeConfig } from '../types';

interface AdminDashboardProps {
  onClose: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onClose }) => {
  // Always require password on every access (no persistent token in localStorage)
  const [token, setToken] = useState<string | null>(null);
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  useEffect(() => {
    // Clear any previously saved token to force password authentication
    try {
      localStorage.removeItem('pharma_admin_token');
    } catch (_) {}
  }, []);

  // Dashboard state
  const [activeTab, setActiveTab] = useState<'participants' | 'probabilities' | 'config'>('participants');
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPrizesIssued, setTotalPrizesIssued] = useState(0);
  const [prizeCounts, setPrizeCounts] = useState<Record<string, number>>({});
  const [uniqueCities, setUniqueCities] = useState<string[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(false);

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPrize, setSelectedPrize] = useState('all');
  const [selectedCity, setSelectedCity] = useState('all');
  const [selectedDate, setSelectedDate] = useState('');

  // Probabilities config state
  const [adminConfig, setAdminConfig] = useState<any>(null);
  const [editedPrizes, setEditedPrizes] = useState<PrizeConfig[]>([]);
  const [configSuccessMsg, setConfigSuccessMsg] = useState<string | null>(null);
  const [isSavingConfig, setIsSavingConfig] = useState(false);

  // Handle Login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setIsAuthenticating(true);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setAuthError(data.error || 'Invalid password');
        setIsAuthenticating(false);
        return;
      }

      setToken(data.token);
      setIsAuthenticating(false);
    } catch (err) {
      setAuthError('Failed to authenticate. Check server connection.');
      setIsAuthenticating(false);
    }
  };

  const handleLogout = () => {
    setToken(null);
    setPassword('');
    try {
      localStorage.removeItem('pharma_admin_token');
    } catch (_) {}
  };

  // Fetch Participants Data
  const fetchData = useCallback(async () => {
    if (!token) return;
    setIsLoadingData(true);

    try {
      const params = new URLSearchParams();
      if (searchTerm) params.append('search', searchTerm);
      if (selectedPrize && selectedPrize !== 'all') params.append('prize', selectedPrize);
      if (selectedCity && selectedCity !== 'all') params.append('city', selectedCity);
      if (selectedDate) params.append('date', selectedDate);

      const res = await fetch(`/api/admin/participants?${params.toString()}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status === 401) {
        handleLogout();
        return;
      }

      const data = await res.json();
      setParticipants(data.participants || []);
      setTotalCount(data.totalParticipants || 0);
      setTotalPrizesIssued(data.totalPrizesIssued || 0);
      setPrizeCounts(data.prizeCounts || {});
      setUniqueCities(data.uniqueCities || []);
    } catch (err) {
      console.error('Error fetching admin data:', err);
    } finally {
      setIsLoadingData(false);
    }
  }, [token, searchTerm, selectedPrize, selectedCity, selectedDate]);

  // Fetch Config
  const fetchConfig = useCallback(async () => {
    if (!token) return;
    try {
      const res = await fetch('/api/admin/config', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setAdminConfig(data);
        setEditedPrizes(data.prizes || []);
      }
    } catch (err) {
      console.error('Error loading config:', err);
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      fetchData();
      fetchConfig();
    }
  }, [token, fetchData, fetchConfig]);

  // Handle Export CSV
  const handleExportCSV = async () => {
    if (!token) return;
    try {
      const res = await fetch('/api/admin/export', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `pharmacist_campaign_export_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Export failed:', err);
    }
  };

  // Save updated prize probabilities
  const handleSaveProbabilities = async () => {
    if (!token) return;
    setIsSavingConfig(true);
    setConfigSuccessMsg(null);

    const totalWeight = editedPrizes.reduce((sum, p) => sum + (Number(p.probability) || 0), 0);

    try {
      const res = await fetch('/api/admin/config', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...adminConfig,
          prizes: editedPrizes,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setAdminConfig(data.config);
        setConfigSuccessMsg(`Probabilities saved successfully! Total distribution: ${totalWeight}%`);
        setTimeout(() => setConfigSuccessMsg(null), 4000);
      }
    } catch (err) {
      console.error('Failed to save config:', err);
    } finally {
      setIsSavingConfig(false);
    }
  };

  // Probability weight change handler
  const handleProbabilityChange = (index: number, val: number) => {
    const updated = [...editedPrizes];
    updated[index] = { ...updated[index], probability: Math.max(0, val) };
    setEditedPrizes(updated);
  };

  // If not logged in, show Password Gateway
  if (!token) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl border border-slate-200 relative"
        >
          <button
            id="btn-close-admin-login"
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="w-12 h-12 rounded-2xl bg-cyan-50 text-cyan-700 flex items-center justify-center mx-auto mb-3 border border-cyan-200 shadow-2xs">
            <Lock className="w-6 h-6" />
          </div>

          <h3 className="text-xl font-black text-center text-slate-800 tracking-tight uppercase">
            Admin Access
          </h3>
          <p className="text-xs text-center text-slate-400 mt-1 mb-5 font-medium">
            Management portal for campaign leads and audits.
          </p>

          <form onSubmit={handleLogin} className="space-y-4">
            {authError && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{authError}</span>
              </div>
            )}

            <div>
              <label htmlFor="input-admin-password" className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                Admin Password
              </label>
              <input
                id="input-admin-password"
                type="password"
                placeholder="Enter admin password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoFocus
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-600 transition-all font-mono"
              />
            </div>

            <button
              id="btn-admin-submit-login"
              type="submit"
              disabled={isAuthenticating}
              className="w-full py-3.5 px-4 rounded-2xl bg-cyan-600 hover:bg-cyan-700 text-white font-black text-xs sm:text-sm tracking-wider uppercase shadow-lg shadow-cyan-200 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>{isAuthenticating ? 'Verifying...' : 'Unlock Dashboard'}</span>
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  // Calculate current sum of probabilities
  const currentTotalProbability = editedPrizes.reduce((sum, p) => sum + (Number(p.probability) || 0), 0);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-100 animate-fade-in">
      {/* Top Admin Header */}
      <div className="sticky top-0 z-20 bg-slate-900 text-white border-b border-slate-800 shadow-md">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-cyan-600 flex items-center justify-center text-white font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-sm font-extrabold tracking-tight">
                Pharmacist Campaign Command Center
              </h1>
              <span className="text-[10px] text-cyan-400 font-medium block leading-none">
                Single-Spin Campaign Registry & Auditing
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              id="btn-admin-refresh"
              onClick={fetchData}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
              title="Refresh Records"
            >
              <RefreshCw className={`w-4 h-4 ${isLoadingData ? 'animate-spin' : ''}`} />
            </button>

            <button
              id="btn-admin-export-csv"
              onClick={handleExportCSV}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>Export CSV/Excel</span>
            </button>

            <button
              id="btn-admin-logout"
              onClick={handleLogout}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-red-900/60 hover:text-red-300 text-slate-400 text-xs font-semibold transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Logout</span>
            </button>

            <button
              id="btn-admin-close-modal"
              onClick={onClose}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="max-w-6xl mx-auto px-4 flex gap-6 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('participants')}
            className={`py-2.5 border-b-2 transition-all cursor-pointer ${
              activeTab === 'participants'
                ? 'border-cyan-400 text-cyan-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Participants Registry ({totalCount})
          </button>
          <button
            onClick={() => setActiveTab('probabilities')}
            className={`py-2.5 border-b-2 transition-all cursor-pointer ${
              activeTab === 'probabilities'
                ? 'border-cyan-400 text-cyan-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Prize Probabilities Engine
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-6xl mx-auto px-4 py-5 pb-16">
        {/* Metric Summary Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5 mb-5">
          {/* Total Participants */}
          <div className="bg-white rounded-2xl p-3 border border-slate-200/90 shadow-2xs col-span-2 sm:col-span-2">
            <div className="flex items-center justify-between text-slate-500 mb-1">
              <span className="text-[11px] font-bold uppercase tracking-wider">Total Participants</span>
              <Users className="w-4 h-4 text-teal-600" />
            </div>
            <div className="text-2xl font-black text-slate-900 tracking-tight">{totalCount}</div>
            <div className="text-[10px] text-slate-400 font-medium">100% Unique Mobile Numbers</div>
          </div>

          {/* Total Prizes Issued */}
          <div className="bg-white rounded-2xl p-3 border border-slate-200/90 shadow-2xs col-span-2 sm:col-span-2">
            <div className="flex items-center justify-between text-slate-500 mb-1">
              <span className="text-[11px] font-bold uppercase tracking-wider">Total Prizes Won</span>
              <Gift className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-2xl font-black text-emerald-700 tracking-tight">{totalPrizesIssued}</div>
            <div className="text-[10px] text-emerald-600 font-medium">
              {totalCount > 0 ? `${Math.round((totalPrizesIssued / totalCount) * 100)}% Win Rate` : '0%'}
            </div>
          </div>

          {/* Prize Specific Counts */}
          <div className="bg-white rounded-xl p-2.5 border border-slate-200 text-center">
            <span className="text-[10px] font-bold text-teal-700 block">Kettles</span>
            <span className="text-lg font-black text-slate-900">{prizeCounts['KETTLE'] || 0}</span>
          </div>

          <div className="bg-white rounded-xl p-2.5 border border-slate-200 text-center">
            <span className="text-[10px] font-bold text-sky-700 block">Umbrellas</span>
            <span className="text-lg font-black text-slate-900">{prizeCounts['UMBRELLA'] || 0}</span>
          </div>

          <div className="bg-white rounded-xl p-2.5 border border-slate-200 text-center">
            <span className="text-[10px] font-bold text-emerald-700 block">Scissors</span>
            <span className="text-lg font-black text-slate-900">{prizeCounts['SCISSOR'] || 0}</span>
          </div>

          <div className="bg-white rounded-xl p-2.5 border border-slate-200 text-center">
            <span className="text-[10px] font-bold text-indigo-700 block">Mystery</span>
            <span className="text-lg font-black text-slate-900">{prizeCounts['MYSTERY GIFT'] || 0}</span>
          </div>

          <div className="bg-white rounded-xl p-2.5 border border-slate-200 text-center">
            <span className="text-[10px] font-bold text-cyan-700 block">Products</span>
            <span className="text-lg font-black text-slate-900">{prizeCounts['PRODUCT'] || 0}</span>
          </div>

          <div className="bg-white rounded-xl p-2.5 border border-slate-200 text-center">
            <span className="text-[10px] font-bold text-slate-600 block">Blank/Try</span>
            <span className="text-lg font-black text-slate-900">{prizeCounts['BLANK'] || 0}</span>
          </div>
        </div>

        {/* Tab 1: Participants List & Filtering */}
        {activeTab === 'participants' && (
          <div className="space-y-4">
            {/* Filter Bar */}
            <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-2xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {/* Search */}
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Search className="w-4 h-4" />
                  </div>
                  <input
                    id="admin-search-input"
                    type="text"
                    placeholder="Search name, phone, pharmacy, city..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600"
                  />
                </div>

                {/* Prize Filter */}
                <div>
                  <select
                    id="admin-filter-prize"
                    value={selectedPrize}
                    onChange={(e) => setSelectedPrize(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 font-medium"
                  >
                    <option value="all">All Prizes (Filter)</option>
                    <option value="kettle">Kettle</option>
                    <option value="umbrella">Umbrella</option>
                    <option value="scissor">Scissor</option>
                    <option value="mystery_gift">Mystery Gift</option>
                    <option value="product">Product</option>
                    <option value="blank">Blank / No Prize</option>
                  </select>
                </div>

                {/* City Filter */}
                <div>
                  <select
                    id="admin-filter-city"
                    value={selectedCity}
                    onChange={(e) => setSelectedCity(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 font-medium"
                  >
                    <option value="all">All Cities ({uniqueCities.length})</option>
                    {uniqueCities.map((city) => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                </div>

                {/* Date Filter */}
                <div>
                  <input
                    id="admin-filter-date"
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 font-mono"
                  />
                </div>
              </div>

              {/* Active Filter Clear */}
              {(searchTerm || selectedPrize !== 'all' || selectedCity !== 'all' || selectedDate) && (
                <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-500">
                    Showing <strong>{participants.length}</strong> matching entries
                  </span>
                  <button
                    onClick={() => {
                      setSearchTerm('');
                      setSelectedPrize('all');
                      setSelectedCity('all');
                      setSelectedDate('');
                    }}
                    className="text-teal-600 hover:text-teal-800 font-semibold cursor-pointer"
                  >
                    Clear All Filters
                  </button>
                </div>
              )}
            </div>

            {/* Mobile Export Button (on small screens) */}
            <div className="sm:hidden">
              <button
                onClick={handleExportCSV}
                className="w-full py-2.5 px-4 rounded-xl bg-teal-600 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs cursor-pointer"
              >
                <FileSpreadsheet className="w-4 h-4" />
                <span>Download CSV Export</span>
              </button>
            </div>

            {/* Participants Data Table */}
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-700">
                  <thead className="bg-slate-100/90 text-slate-700 font-bold border-b border-slate-200 uppercase tracking-wider text-[10px]">
                    <tr>
                      <th className="px-4 py-3">Date & Time</th>
                      <th className="px-4 py-3">Pharmacist Name</th>
                      <th className="px-4 py-3">Mobile Number</th>
                      <th className="px-4 py-3">Pharmacy Name</th>
                      <th className="px-4 py-3">City</th>
                      <th className="px-4 py-3">Prize Won</th>
                      <th className="px-4 py-3 text-right">Claim Code</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {participants.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="px-4 py-8 text-center text-slate-400">
                          No participants found matching the current search filters.
                        </td>
                      </tr>
                    ) : (
                      participants.map((p) => (
                        <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                          <td className="px-4 py-3 font-mono whitespace-nowrap">
                            <div className="font-semibold text-slate-900">{p.date}</div>
                            <div className="text-[10px] text-slate-400">{p.time}</div>
                          </td>
                          <td className="px-4 py-3 font-bold text-slate-900 whitespace-nowrap">
                            {p.name}
                          </td>
                          <td className="px-4 py-3 font-mono text-slate-800 whitespace-nowrap font-medium">
                            {p.phone}
                          </td>
                          <td className="px-4 py-3 text-slate-700 whitespace-nowrap">
                            {p.pharmacyName}
                          </td>
                          <td className="px-4 py-3 text-slate-700 whitespace-nowrap">
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[11px]">
                              {p.city}
                            </span>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <span className={`inline-flex items-center px-2.5 py-1 rounded-full font-bold text-[11px] ${
                              p.prizeId === 'kettle'
                                ? 'bg-teal-100 text-teal-800'
                                : p.prizeId === 'umbrella'
                                ? 'bg-sky-100 text-sky-800'
                                : p.prizeId === 'scissor'
                                ? 'bg-emerald-100 text-emerald-800'
                                : p.prizeId === 'mystery_gift'
                                ? 'bg-indigo-100 text-indigo-800'
                                : p.prizeId === 'product'
                                ? 'bg-cyan-100 text-cyan-800'
                                : 'bg-slate-100 text-slate-600'
                            }`}>
                              {p.prizeName}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-right font-mono font-bold whitespace-nowrap text-slate-900">
                            {p.claimCode}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Live Probability Engine */}
        {activeTab === 'probabilities' && (
          <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-2xs max-w-3xl">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-black text-slate-900">
                  Configurable Backend Prize Probabilities
                </h3>
                <p className="text-xs text-slate-500">
                  The wheel continues to visually display exactly 6 equal slices while the server awards prizes according to these weights.
                </p>
              </div>

              <div className="text-right">
                <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${
                  currentTotalProbability === 100
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                    : 'bg-amber-100 text-amber-800 border border-amber-300'
                }`}>
                  <Percent className="w-3.5 h-3.5" />
                  <span>Total: {currentTotalProbability}%</span>
                </span>
              </div>
            </div>

            {configSuccessMsg && (
              <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>{configSuccessMsg}</span>
              </div>
            )}

            <div className="space-y-3 mb-6">
              {editedPrizes.map((prize, idx) => (
                <div key={prize.id} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: prize.color }}
                    />
                    <div>
                      <span className="text-xs font-bold text-slate-900 block">{prize.name}</span>
                      <span className="text-[10px] text-slate-400">Slice #{idx + 1} ({prize.isWin ? 'Win Prize' : 'Non-winning Try'})</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={prize.probability}
                      onChange={(e) => handleProbabilityChange(idx, Number(e.target.value))}
                      className="w-32 sm:w-48 accent-teal-600"
                    />
                    <div className="relative w-16">
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={prize.probability}
                        onChange={(e) => handleProbabilityChange(idx, Number(e.target.value))}
                        className="w-full px-2 py-1 text-right text-xs font-mono font-bold rounded-lg border border-slate-300 bg-white"
                      />
                      <span className="absolute right-6 top-1 text-[10px] text-slate-400 pointer-events-none"></span>
                    </div>
                    <span className="text-xs font-bold text-slate-600 w-4">%</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                id="btn-admin-save-probabilities"
                onClick={handleSaveProbabilities}
                disabled={isSavingConfig}
                className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold tracking-wider uppercase shadow-md shadow-teal-700/20 active:scale-95 transition-all cursor-pointer disabled:opacity-50 flex items-center gap-2"
              >
                <Sliders className="w-4 h-4" />
                <span>{isSavingConfig ? 'Saving...' : 'Apply Probability Changes'}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
