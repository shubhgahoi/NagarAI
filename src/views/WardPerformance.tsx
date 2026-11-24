import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import {
  Activity,
  Award,
  Clock,
  ShieldCheck,
  TrendingUp,
  User,
  Phone,
  Info,
  Building2,
  MapPin,
  Shuffle,
  ChevronDown,
  Sparkles,
} from 'lucide-react';
import {
  CITIES_LEADERBOARD,
  CityLeaderboard,
  getRandomNearbyCity,
  NEARBY_CITIES_LIST,
} from '../data/cityLeaderboardData';

export const WardPerformance: React.FC = () => {
  const { wards: rewaWards, language, showToast } = useApp();
  const isHi = language === 'hi' || language === 'bg';

  // Default to Rewa as requested
  const [selectedCityId, setSelectedCityId] = useState<string>('rewa');

  const currentCity: CityLeaderboard =
    CITIES_LEADERBOARD.find((c) => c.id === selectedCityId) || CITIES_LEADERBOARD[0];

  // For Rewa, use live app context wards; for Satna & others, use city-specific wards
  const cityWards = selectedCityId === 'rewa' ? rewaWards : currentCity.wards;

  const chartData = cityWards.map((w) => ({
    name: w.name.split('-')[1]?.trim() || w.name,
    healthIndex: w.healthIndex,
    slaCompliance: w.slaComplianceRate,
  }));

  const sortedWards = [...cityWards].sort((a, b) => b.healthIndex - a.healthIndex);

  const handleCityChange = (cityId: string) => {
    setSelectedCityId(cityId);
    const target = CITIES_LEADERBOARD.find((c) => c.id === cityId);
    if (target) {
      showToast(`Showing leaderboard for ${target.name} (${target.hindiName})`, 'info');
    }
  };

  const handleRandomNearbyCity = () => {
    const randomCity = getRandomNearbyCity(selectedCityId);
    setSelectedCityId(randomCity.id);
    showToast(`🎲 Switched to nearby city: ${randomCity.name} (${randomCity.hindiName})`, 'success');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Top Banner with City Selector on Top Right */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 px-2 py-0.5 rounded">
              Governance Index
            </span>
            <span className="text-xs font-mono text-slate-500 dark:text-slate-400">
              {currentCity.bodyType}
            </span>
            {selectedCityId !== 'rewa' && (
              <span className="text-[10px] font-bold uppercase bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 px-2 py-0.5 rounded flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                {currentCity.district}
              </span>
            )}
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
            {isHi
              ? `${currentCity.hindiName} वार्ड स्वास्थ्य एवं प्रदर्शन सूचकांक`
              : `${currentCity.name} Ward Health Index & Performance Ranking`}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            {currentCity.tagline} • Evaluation across {cityWards.length} administrative wards.
          </p>
        </div>

        {/* TOP RIGHT: City Selector Controls */}
        <div className="flex flex-wrap items-center gap-2 bg-white dark:bg-stone-900 p-2 sm:p-2.5 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-sm shrink-0">
          <div className="flex items-center gap-1.5 px-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
            <Building2 className="w-4 h-4 text-[#5e7769] dark:text-[#8ea899]" />
            <span className="hidden sm:inline">City / नगर:</span>
          </div>

          {/* City Dropdown: Rewa (Default), Satna, and nearby cities */}
          <div className="relative">
            <select
              value={selectedCityId}
              onChange={(e) => handleCityChange(e.target.value)}
              className="appearance-none bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-750 text-slate-900 dark:text-white text-xs sm:text-sm font-bold pl-3 pr-8 py-1.5 rounded-xl border border-stone-300 dark:border-stone-700 focus:outline-none focus:ring-2 focus:ring-[#7fa99b] transition-colors cursor-pointer"
              aria-label="Change city for leaderboard"
            >
              <optgroup label="Default Focus">
                <option value="rewa">Rewa (रीवा) - Current</option>
              </optgroup>
              <optgroup label="Nearby Cities (विन्ध्य व पड़ोसी शहर)">
                <option value="satna">Satna (सतना) - Nagar Nigam</option>
                <option value="maihar">Maihar (मैहर) - Sharda Dham</option>
                <option value="sidhi">Sidhi (सीधी) - Gopad Corridor</option>
                <option value="singrauli">Singrauli (सिंगरौली) - Urjadhani</option>
                <option value="shahdol">Shahdol (शहडोल) - Division HQ</option>
                <option value="panna">Panna (पन्ना) - Diamond City</option>
              </optgroup>
            </select>
            <ChevronDown className="w-3.5 h-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
          </div>

          {/* Random Nearby City Button */}
          <button
            type="button"
            onClick={handleRandomNearbyCity}
            className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-bold rounded-xl bg-purple-50 hover:bg-purple-100 dark:bg-purple-950/60 dark:hover:bg-purple-900/60 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800 active:scale-95 transition-all cursor-pointer"
            title="Randomly view another nearby city's leaderboard"
          >
            <Shuffle className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Random Nearby</span>
            <span className="sm:hidden">Random</span>
          </button>
        </div>
      </div>

      {/* Selected City Key Stats Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-xs hover:-translate-y-0.5 transition-transform">
          <div className="text-[10.5px] font-semibold text-slate-500 dark:text-slate-400">
            Selected City
          </div>
          <div className="text-base sm:text-lg font-black text-slate-900 dark:text-white mt-0.5 flex items-center gap-1.5">
            <span>{currentCity.name}</span>
            <span className="text-xs text-slate-400 font-normal">({currentCity.hindiName})</span>
          </div>
          <div className="text-[10px] text-[#5e7769] dark:text-[#8ea899] font-mono mt-0.5 truncate">
            {currentCity.bodyType.split('(')[0].trim()}
          </div>
        </div>

        <div className="p-3.5 bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-xs hover:-translate-y-0.5 transition-transform">
          <div className="text-[10.5px] font-semibold text-slate-500 dark:text-slate-400">
            Avg Health Index
          </div>
          <div className="text-base sm:text-lg font-black text-emerald-600 dark:text-emerald-400 mt-0.5">
            {currentCity.avgHealthIndex} / 100
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">
            Across {cityWards.length} tracked wards
          </div>
        </div>

        <div className="p-3.5 bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-xs hover:-translate-y-0.5 transition-transform">
          <div className="text-[10.5px] font-semibold text-slate-500 dark:text-slate-400">
            Top Performing Ward
          </div>
          <div className="text-xs sm:text-sm font-black text-[#7a648b] dark:text-[#bda4ce] mt-1 truncate" title={sortedWards[0]?.name}>
            #{1} {sortedWards[0]?.name.split('-')[1]?.trim() || sortedWards[0]?.name}
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">
            Score: {sortedWards[0]?.healthIndex}/100 • SLA {sortedWards[0]?.slaComplianceRate}%
          </div>
        </div>

        <div className="p-3.5 bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-xs hover:-translate-y-0.5 transition-transform">
          <div className="text-[10.5px] font-semibold text-slate-500 dark:text-slate-400">
            Municipal Helpline
          </div>
          <div className="text-xs sm:text-sm font-mono font-black text-slate-800 dark:text-slate-200 mt-1">
            {currentCity.helpline}
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">
            Public grievance control room
          </div>
        </div>
      </div>

      {/* Safety Notice: Assurance that only this leaderboard view is changing */}
      {selectedCityId !== 'rewa' && (
        <div className="flex items-center justify-between gap-3 p-3 rounded-2xl bg-stone-100 dark:bg-stone-900/60 border border-stone-200 dark:border-stone-800 text-xs text-stone-700 dark:text-stone-300">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 shrink-0 text-[#5e7769] dark:text-[#8ea899]" />
            <span>
              Viewing benchmark civic data for <strong>{currentCity.name}</strong>. App issue reporting, live tickets, and officer operations remain anchored to <strong>Smart Rewa</strong>.
            </span>
          </div>
          <button
            type="button"
            onClick={() => handleCityChange('rewa')}
            className="text-[11px] font-bold text-[#5e7769] dark:text-[#8ea899] underline hover:no-underline whitespace-nowrap cursor-pointer"
          >
            Reset to Rewa
          </button>
        </div>
      )}

      {/* Formula Explanation Card with Clear POC Disclaimer */}
      <div className="bg-stone-50 dark:bg-stone-900/60 rounded-3xl p-6 border border-stone-200 dark:border-stone-800 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-[#5e7769] dark:text-[#8ea899]" />
            <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              POC Scoring Methodology ({currentCity.name})
            </span>
          </div>
          <span className="text-[10px] font-mono bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 px-2 py-0.5 rounded font-bold">
            Simulated Demo Model
          </span>
        </div>

        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
          The <span className="font-bold">Ward Health Index (0–100)</span> synthesizes four key operational pillars:
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 text-center">
            <div className="text-lg font-black text-blue-600">35%</div>
            <div className="font-bold text-slate-800 dark:text-slate-200">SLA Compliance</div>
            <div className="text-[10px] text-slate-400">On-time closure rate</div>
          </div>

          <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 text-center">
            <div className="text-lg font-black text-indigo-600">30%</div>
            <div className="font-bold text-slate-800 dark:text-slate-200">Resolution Speed</div>
            <div className="text-[10px] text-slate-400">Mean time to fix (hrs)</div>
          </div>

          <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 text-center">
            <div className="text-lg font-black text-purple-600">20%</div>
            <div className="font-bold text-slate-800 dark:text-slate-200">Issue Density</div>
            <div className="text-[10px] text-slate-400">Low open backlog score</div>
          </div>

          <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 text-center">
            <div className="text-lg font-black text-emerald-600">15%</div>
            <div className="font-bold text-slate-800 dark:text-slate-200">Satisfaction</div>
            <div className="text-[10px] text-slate-400">Citizen confirmation stars</div>
          </div>
        </div>

        <p className="text-[11px] text-slate-400 italic">
          Disclaimer: This index is a demonstration model for technical competition evaluation. It does not reflect official municipal audits or real administrative penalties.
        </p>
      </div>

      {/* Ward Comparison Chart */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Comparative Ward Health Index • {currentCity.name}
            </h3>
            <p className="text-xs text-slate-400">
              Ranking {cityWards.length} demonstration wards in {currentCity.name} ({currentCity.hindiName})
            </p>
          </div>
          <span className="text-xs text-slate-400">Scale: 0 to 100</span>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
              <XAxis dataKey="name" fontSize={11} stroke="#94a3b8" />
              <YAxis domain={[50, 100]} fontSize={11} stroke="#94a3b8" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f172a',
                  borderColor: '#334155',
                  borderRadius: '12px',
                  color: '#fff',
                  fontSize: '12px',
                }}
              />
              <Bar dataKey="healthIndex" fill="#7fa99b" radius={[6, 6, 0, 0]} name="Health Index" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Ward Ranking Cards */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            {currentCity.name} Ward Rankings & Locations
          </h2>
          <span className="text-xs text-slate-400">
            Sorted by highest municipal health index
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {sortedWards.map((w, idx) => (
            <div
              key={w.id}
              className="bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 p-5 shadow-xs hover:border-[#7fa99b] dark:hover:border-[#527766] transition-all flex flex-col justify-between space-y-4 hover:-translate-y-0.5"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="w-7 h-7 rounded-xl bg-stone-100 dark:bg-stone-800 text-slate-800 dark:text-slate-200 flex items-center justify-center font-extrabold text-xs">
                    #{idx + 1}
                  </span>
                  <span
                    className={`text-sm font-black ${
                      w.healthIndex >= 85
                        ? 'text-emerald-600 dark:text-emerald-400'
                        : w.healthIndex >= 75
                        ? 'text-[#5e7769] dark:text-[#8ea899]'
                        : 'text-amber-600 dark:text-amber-400'
                    }`}
                  >
                    Index: {w.healthIndex} / 100
                  </span>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">{w.name}</h3>
                  <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                    <span>{w.zone}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs pt-1 border-t border-slate-100 dark:border-stone-800">
                  <div className="p-2 rounded-xl bg-stone-50 dark:bg-stone-800/60">
                    <div className="text-[10px] text-slate-400">Open Backlog</div>
                    <div className="font-extrabold text-slate-800 dark:text-slate-200">
                      {w.openComplaints}
                    </div>
                  </div>

                  <div className="p-2 rounded-xl bg-stone-50 dark:bg-stone-800/60">
                    <div className="text-[10px] text-slate-400">SLA Compliance</div>
                    <div className="font-extrabold text-emerald-600">
                      {w.slaComplianceRate}%
                    </div>
                  </div>

                  <div className="p-2 rounded-xl bg-stone-50 dark:bg-stone-800/60">
                    <div className="text-[10px] text-slate-400">Avg Fix Time</div>
                    <div className="font-extrabold text-[#5e7769] dark:text-[#8ea899]">
                      {w.avgResolutionHours}h
                    </div>
                  </div>

                  <div className="p-2 rounded-xl bg-stone-50 dark:bg-stone-800/60">
                    <div className="text-[10px] text-slate-400">Citizen Rating</div>
                    <div className="font-extrabold text-purple-600">
                      {w.citizenSatisfaction}%
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500 space-y-0.5">
                <div className="flex items-center gap-1 font-semibold text-slate-700 dark:text-slate-300">
                  <User className="w-3 h-3 text-slate-400" />
                  <span>{w.officerName}</span>
                </div>
                <div className="flex items-center gap-1 font-mono text-[10px] text-slate-400">
                  <Phone className="w-3 h-3" />
                  <span>{w.contact}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
