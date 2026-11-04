import React, { useState } from 'react';
import { Check, ArrowRight, Truck, CheckCircle2, Sparkles } from 'lucide-react';

export const TRUCK_SPECS = {
  'Dry Van (Semi)':    { spec: '53ft Enclosed Trailer · CDL-A',   cargo: 'General Palletized Freight', cabColor: '#0052CC', trailerStyle: 'dryvan' },
  'Reefer (Semi)':     { spec: '53ft Temp-Controlled · CDL-A',    cargo: 'Produce, Frozen & Pharma',   cabColor: '#0284C7', trailerStyle: 'reefer' },
  'Flatbed (Semi)':    { spec: '48ft–53ft Open Deck · CDL-A',     cargo: 'Steel, Lumber & Building',   cabColor: '#1E40AF', trailerStyle: 'flatbed' },
  'Step Deck (Semi)':  { spec: '53ft Drop-Deck Trailer · CDL-A',  cargo: 'Tall Machinery & Crates',    cabColor: '#0F172A', trailerStyle: 'stepdeck' },
  'Power Only (Semi)': { spec: '5th-Wheel Sleeper Tractor · CDL-A',cargo: 'Drop & Hook Broker Trailers',cabColor: '#0066FF', trailerStyle: 'poweronly' },
  'Car Hauler (Semi)': { spec: '7–9 Car Bi-Level Rack · CDL-A',   cargo: 'Auto Dealership & Auction',  cabColor: '#1D4ED8', trailerStyle: 'carhauler' },
  'Heavy Haul (Semi)': { spec: 'RGN Lowboy / Tri-Axle · CDL-A',   cargo: 'Oversize & Heavy Equipment', cabColor: '#B45309', trailerStyle: 'heavyhaul' },
  'Drayage (Semi)':    { spec: '40ft–53ft Port Chassis · TWIC',   cargo: 'Port & Rail Containers',     cabColor: '#0369A1', trailerStyle: 'drayage' },
  'Box Truck':         { spec: '26ft Straight Box + Liftgate',    cargo: 'Non-CDL / CDL-B Expedited',  cabColor: '#0066FF', trailerStyle: 'boxtruck' },
  'Hotshot (40ft)':    { spec: 'Dually 3500/4500 + 40ft GN',      cargo: 'CDL & Non-CDL Time-Critical',cabColor: '#0F172A', trailerStyle: 'hotshot' },
  'Sprinter Van':      { spec: 'High-Roof Extended Cargo Van',    cargo: 'Non-CDL Priority Expedited', cabColor: '#1E3A8A', trailerStyle: 'sprinter' },
  'Straight Truck':    { spec: '28ft–30ft Tandem Heavy Box',      cargo: 'Regional Dock-to-Dock LTL',  cabColor: '#0052CC', trailerStyle: 'straight' }
};

/**
 * Renders a detailed side-profile truck graphic for every equipment type
 * with the official Roadway Logistics Group LLC (/rlg-logo.jpg) emblem
 * branded directly on the truck trailer / box / cab door.
 */
export function RoadwayBrandedTruck({ type, isSelected = false }) {
  const info = TRUCK_SPECS[type] || TRUCK_SPECS['Dry Van (Semi)'];
  const style = info.trailerStyle;
  const cab = info.cabColor;

  // Position of the Roadway Logo badge on each truck type (% of container)
  const logoPlacement = {
    dryvan:    { left: '14%', top: '16%', width: '48%', height: '50%' },
    reefer:    { left: '16%', top: '16%', width: '46%', height: '50%' },
    flatbed:   { left: '16%', top: '22%', width: '42%', height: '42%' },
    stepdeck:  { left: '20%', top: '24%', width: '40%', height: '42%' },
    poweronly: { left: '34%', top: '22%', width: '34%', height: '42%' },
    carhauler: { left: '18%', top: '24%', width: '44%', height: '40%' },
    heavyhaul: { left: '20%', top: '22%', width: '40%', height: '42%' },
    drayage:   { left: '14%', top: '18%', width: '46%', height: '46%' },
    boxtruck:  { left: '15%', top: '16%', width: '46%', height: '50%' },
    hotshot:   { left: '15%', top: '26%', width: '40%', height: '38%' },
    sprinter:  { left: '18%', top: '22%', width: '42%', height: '44%' },
    straight:  { left: '14%', top: '16%', width: '48%', height: '50%' }
  }[style] || { left: '15%', top: '16%', width: '46%', height: '50%' };

  return (
    <div
      className={`relative w-52 sm:w-56 h-24 rounded-2xl overflow-hidden border transition-all select-none shrink-0 ${
        isSelected
          ? 'bg-gradient-to-b from-[#070B14] via-[#0F172A] to-[#1E293B] border-[#0066FF] shadow-[0_8px_24px_rgba(0,102,255,0.3)] ring-2 ring-[#0066FF]/40'
          : 'bg-gradient-to-b from-[#0A0F1D] via-[#111827] to-[#1E293B] border-slate-700/80 hover:border-blue-400'
      }`}
      title={`${type} — Branded with Roadway Logistics Group LLC Logo`}
    >
      {/* Subtle studio horizon glow & asphalt road line */}
      <div className="absolute inset-x-0 bottom-0 h-5 bg-[#090D16] border-t border-slate-700/70" />
      <div className="absolute inset-x-3 bottom-2 h-[1.5px] border-b border-dashed border-amber-400/50" />

      {/* SVG Truck Silhouette & Equipment Details */}
      <svg viewBox="0 0 240 96" className="w-full h-full relative z-10" fill="none">
        {/* 1. DRY VAN / REEFER 53FT SEMI */}
        {(style === 'dryvan' || style === 'reefer') && (
          <g>
            {/* 53ft Enclosed Trailer */}
            <rect x="14" y="12" width="136" height="54" rx="3" fill="#0F172A" stroke="#60A5FA" strokeWidth="1.5" />
            {/* Metallic Side Trim */}
            <rect x="14" y="12" width="136" height="3" fill="#38BDF8" opacity="0.7" />
            <rect x="14" y="63" width="136" height="3" fill="#F59E0B" opacity="0.8" />
            {/* Reefer Cooling Unit on Nose */}
            {style === 'reefer' && (
              <g>
                <rect x="150" y="15" width="9" height="36" rx="2" fill="#E2E8F0" stroke="#38BDF8" strokeWidth="1.2" />
                <circle cx="154.5" cy="24" r="2.5" fill="#0284C7" />
                <circle cx="154.5" cy="33" r="2.5" fill="#0284C7" />
              </g>
            )}
            {/* Landing Gear */}
            <line x1="126" y1="66" x2="126" y2="76" stroke="#94A3B8" strokeWidth="2.5" />
            {/* Sleeper Semi Tractor */}
            <path d="M160 22 H192 L203 38 L222 41 V66 H160 V22 Z" fill={cab} stroke="#93C5FD" strokeWidth="1.2" />
            {/* Windshield & Door Window */}
            <polygon points="188,26 199,38 184,38 184,26" fill="#BAE6FD" opacity="0.85" />
            <rect x="166" y="27" width="12" height="11" rx="1.5" fill="#38BDF8" opacity="0.45" />
            {/* Chrome Exhaust Stack & Grille */}
            <rect x="157" y="14" width="2.8" height="50" rx="1" fill="#E2E8F0" />
            <rect x="219" y="43" width="3.5" height="18" rx="1" fill="#E2E8F0" />
            {/* Headlight glow */}
            <circle cx="221" cy="56" r="2.2" fill="#FEF08A" />
            {/* Wheels (Tandem Trailer + Tandem Drive + Steer) */}
            {[28, 44, 152, 168, 208].map(cx => (
              <g key={cx}>
                <circle cx={cx} cy="72" r="8.5" fill="#090D16" stroke="#475569" strokeWidth="2" />
                <circle cx={cx} cy="72" r="3.8" fill="#CBD5E1" />
              </g>
            ))}
          </g>
        )}

        {/* 2. FLATBED / STEP DECK SEMI */}
        {(style === 'flatbed' || style === 'stepdeck') && (
          <g>
            {/* Branded Tarp / Cargo Housing on Deck with Roadway Logo Frame */}
            <rect
              x={style === 'stepdeck' ? '26' : '18'}
              y={style === 'stepdeck' ? '20' : '18'}
              width="120"
              height="40"
              rx="4"
              fill="#0F172A"
              stroke="#60A5FA"
              strokeWidth="1.5"
            />
            {/* Tie-down winches & straps */}
            {[36, 68, 100, 124].map(x => (
              <line key={x} x1={x} y1="20" x2={x} y2="62" stroke="#F59E0B" strokeWidth="1.2" strokeDasharray="3 2" />
            ))}
            {/* Flatbed or Step-Deck Beam */}
            {style === 'flatbed' ? (
              <rect x="14" y="58" width="144" height="6" rx="1.5" fill="#38BDF8" />
            ) : (
              <path d="M14 62 H126 V54 H158 V59 H130 V66 H14 Z" fill="#38BDF8" />
            )}
            {/* Tractor */}
            <path d="M160 22 H192 L203 38 L222 41 V66 H160 V22 Z" fill={cab} stroke="#93C5FD" strokeWidth="1.2" />
            <polygon points="188,26 199,38 184,38 184,26" fill="#BAE6FD" opacity="0.85" />
            <rect x="157" y="14" width="2.8" height="50" rx="1" fill="#E2E8F0" />
            <rect x="219" y="43" width="3.5" height="18" rx="1" fill="#E2E8F0" />
            {[28, 44, 152, 168, 208].map(cx => (
              <g key={cx}>
                <circle cx={cx} cy="72" r="8.5" fill="#090D16" stroke="#475569" strokeWidth="2" />
                <circle cx={cx} cy="72" r="3.8" fill="#CBD5E1" />
              </g>
            ))}
          </g>
        )}

        {/* 3. POWER ONLY SLEEPER TRACTOR */}
        {style === 'poweronly' && (
          <g>
            {/* 5th wheel deck & heavy frame */}
            <rect x="34" y="58" width="60" height="7" rx="1.5" fill="#334155" stroke="#64748B" strokeWidth="1" />
            <path d="M46 53 H64 L60 58 H42 Z" fill="#F59E0B" />
            {/* Large High-Roof Sleeper Tractor */}
            <path d="M76 16 H154 L172 38 L208 42 V66 H76 V16 Z" fill="#0F172A" stroke="#38BDF8" strokeWidth="1.6" />
            <polygon points="150,22 166,38 146,38 146,22" fill="#BAE6FD" opacity="0.85" />
            <rect x="72" y="12" width="3.5" height="52" rx="1.2" fill="#E2E8F0" />
            <rect x="204" y="44" width="4" height="19" rx="1" fill="#E2E8F0" />
            <circle cx="206" cy="57" r="2.5" fill="#FEF08A" />
            {[50, 70, 188].map(cx => (
              <g key={cx}>
                <circle cx={cx} cy="72" r="9.5" fill="#090D16" stroke="#475569" strokeWidth="2.2" />
                <circle cx={cx} cy="72" r="4.2" fill="#CBD5E1" />
              </g>
            ))}
          </g>
        )}

        {/* 4. CAR HAULER / HEAVY HAUL / DRAYAGE */}
        {(style === 'carhauler' || style === 'heavyhaul' || style === 'drayage') && (
          <g>
            {/* Upper/Lower Structure or Intermodal Container */}
            <rect x="16" y="15" width="134" height="48" rx="3" fill="#0F172A" stroke={style === 'heavyhaul' ? '#F59E0B' : '#38BDF8'} strokeWidth="1.6" />
            {style === 'carhauler' && (
              <>
                <line x1="16" y1="39" x2="150" y2="39" stroke="#F59E0B" strokeWidth="2" />
                <line x1="16" y1="15" x2="150" y2="22" stroke="#38BDF8" strokeWidth="2" />
              </>
            )}
            {style === 'drayage' && (
              <>
                {[28, 44, 124, 138].map(x => (
                  <line key={x} x1={x} y1="17" x2={x} y2="61" stroke="#334155" strokeWidth="1.5" />
                ))}
                <rect x="14" y="62" width="140" height="4" fill="#0284C7" />
              </>
            )}
            {style === 'heavyhaul' && (
              <>
                <rect x="14" y="61" width="140" height="5" fill="#F59E0B" />
                <circle cx="168" cy="18" r="3" fill="#F59E0B" />
              </>
            )}
            {/* Tractor */}
            <path d="M160 22 H192 L203 38 L222 41 V66 H160 V22 Z" fill={cab} stroke="#93C5FD" strokeWidth="1.2" />
            <polygon points="188,26 199,38 184,38 184,26" fill="#BAE6FD" opacity="0.85" />
            <rect x="219" y="43" width="3.5" height="18" rx="1" fill="#E2E8F0" />
            {[26, 40, 54, 154, 168, 208].map(cx => (
              <g key={cx}>
                <circle cx={cx} cy="72" r="8" fill="#090D16" stroke="#475569" strokeWidth="2" />
                <circle cx={cx} cy="72" r="3.5" fill="#CBD5E1" />
              </g>
            ))}
          </g>
        )}

        {/* 5. 26FT BOX TRUCK / STRAIGHT TRUCK */}
        {(style === 'boxtruck' || style === 'straight') && (
          <g>
            {/* 26ft–30ft Box Cargo Body */}
            <rect x="18" y="13" width="136" height="52" rx="3" fill="#0F172A" stroke="#38BDF8" strokeWidth="1.6" />
            <rect x="18" y="62" width="136" height="3" fill="#F59E0B" />
            {/* Rear Liftgate */}
            <rect x="13" y="46" width="5" height="20" rx="1" fill="#94A3B8" />
            {/* Medium-Duty Cab */}
            <path d="M156 30 H188 L202 45 L218 48 V65 H156 V30 Z" fill={cab} stroke="#93C5FD" strokeWidth="1.3" />
            <polygon points="184,34 197,45 178,45 178,34" fill="#BAE6FD" opacity="0.9" />
            <circle cx="216" cy="56" r="2.2" fill="#FEF08A" />
            {(style === 'straight' ? [42, 58, 198] : [48, 198]).map(cx => (
              <g key={cx}>
                <circle cx={cx} cy="72" r="8.5" fill="#090D16" stroke="#475569" strokeWidth="2" />
                <circle cx={cx} cy="72" r="3.8" fill="#CBD5E1" />
              </g>
            ))}
          </g>
        )}

        {/* 6. HOTSHOT 40FT GOOSENECK + DUALLY PICKUP */}
        {style === 'hotshot' && (
          <g>
            {/* Branded 40ft Gooseneck Cargo Enclosure */}
            <rect x="16" y="22" width="108" height="38" rx="3" fill="#0F172A" stroke="#F59E0B" strokeWidth="1.5" />
            {/* Gooseneck Hitch Arch */}
            <path d="M16 60 H128 V42 H156 V47 H132 V64 H16 Z" fill="#38BDF8" />
            {/* Dually 3500/4500 Crew-Cab Pickup */}
            <path d="M142 46 H162 V34 H196 L208 46 L224 49 V65 H142 V46 Z" fill="#1E3A8A" stroke="#93C5FD" strokeWidth="1.2" />
            <polygon points="190,37 203,46 182,46 182,37" fill="#BAE6FD" opacity="0.9" />
            <rect x="166" y="37" width="13" height="9" rx="1" fill="#BAE6FD" opacity="0.75" />
            {[32, 46, 156, 210].map(cx => (
              <g key={cx}>
                <circle cx={cx} cy="72" r="8" fill="#090D16" stroke="#475569" strokeWidth="2" />
                <circle cx={cx} cy="72" r="3.5" fill="#CBD5E1" />
              </g>
            ))}
          </g>
        )}

        {/* 7. HIGH-ROOF SPRINTER CARGO VAN */}
        {style === 'sprinter' && (
          <g>
            <path d="M26 18 H172 L196 42 L214 48 V66 H26 V18 Z" fill="#0F172A" stroke="#38BDF8" strokeWidth="1.6" />
            <rect x="26" y="62" width="188" height="3" fill="#F59E0B" />
            <polygon points="168,23 190,42 164,42 164,23" fill="#BAE6FD" opacity="0.9" />
            <circle cx="212" cy="56" r="2.2" fill="#FEF08A" />
            {[58, 188].map(cx => (
              <g key={cx}>
                <circle cx={cx} cy="72" r="8.5" fill="#090D16" stroke="#475569" strokeWidth="2" />
                <circle cx={cx} cy="72" r="3.8" fill="#CBD5E1" />
              </g>
            ))}
          </g>
        )}
      </svg>

      {/* OFFICIAL ROADWAY LOGISTICS GROUP LLC LOGO ON THE SIDE OF THE TRUCK */}
      <div
        className="absolute z-20 flex items-center gap-1.5 px-1.5 py-0.5 rounded-lg bg-[#070B14]/95 border border-amber-400/70 shadow-[0_2px_10px_rgba(0,0,0,0.65)] pointer-events-none"
        style={logoPlacement}
      >
        <img
          src="/rlg-logo.jpg"
          alt="RW Roadway Logo on Truck"
          className="h-full w-auto max-w-[42%] object-contain rounded shrink-0"
        />
        <div className="leading-none overflow-hidden">
          <span className="block text-[8px] font-black tracking-wider text-amber-400 truncate">
            ROADWAY
          </span>
          <span className="block text-[6.5px] font-bold tracking-tight text-sky-300 truncate mt-0.5">
            LOGISTICS LLC
          </span>
        </div>
      </div>

      {/* Top-Right Equipment Type Badge */}
      <span className="absolute top-1.5 right-2 z-20 px-1.5 py-0.5 rounded bg-blue-600/90 text-[8px] font-extrabold uppercase tracking-wider text-white shadow">
        RW FLEET
      </span>
    </div>
  );
}

/**
 * Interactive Fleet Table allowing carriers to select the truck(s) they have,
 * view every truck with the Roadway Logistics Group LLC logo on the truck,
 * and choose Flat Weekly Rate ($500/$800) or Truck-Specific Flat Percentage (%).
 */
export default function RoadwayTruckTable({
  marketRates,
  truckRowConfig,
  setTruckMode,
  setTruckPct,
  setAllTrucksMode,
  chooseTruckPlan
}) {
  const [filterCat, setFilterCat] = useState('all');
  const [selectedTrucks, setSelectedTrucks] = useState(['Dry Van (Semi)']);
  const [truckUnits, setTruckUnits] = useState(() =>
    Object.fromEntries(marketRates.map(r => [r.type, 1]))
  );

  const visibleRates = filterCat === 'all'
    ? marketRates
    : marketRates.filter(r => r.category === filterCat);

  const toggleTruckSelection = (truckType) => {
    setSelectedTrucks(prev =>
      prev.includes(truckType)
        ? prev.filter(t => t !== truckType)
        : [...prev, truckType]
    );
  };

  const setUnitsForTruck = (truckType, count) => {
    const clean = Math.max(1, Math.min(50, Number(count) || 1));
    setTruckUnits(prev => ({ ...prev, [truckType]: clean }));
    if (!selectedTrucks.includes(truckType)) {
      setSelectedTrucks(prev => [...prev, truckType]);
    }
  };

  // Summary calculation for all checked trucks
  const summary = selectedTrucks.reduce(
    (acc, tName) => {
      const r = marketRates.find(m => m.type === tName);
      if (!r) return acc;
      const cfg = truckRowConfig[r.type] || { mode: 'flat', pct: r.pct };
      const units = truckUnits[r.type] || 1;
      const pctFee = Math.round((r.gross * (cfg.pct ?? r.pct)) / 100);
      const feePerTruck = cfg.mode === 'flat' ? r.flatFee : pctFee;
      acc.totalUnits += units;
      acc.totalGross += r.gross * units;
      acc.totalFee += feePerTruck * units;
      acc.totalNet += (r.gross - feePerTruck) * units;
      return acc;
    },
    { totalUnits: 0, totalGross: 0, totalFee: 0, totalNet: 0 }
  );

  const handleDispatchSelected = () => {
    const primaryType = selectedTrucks[0] || 'Dry Van (Semi)';
    const r = marketRates.find(m => m.type === primaryType) || marketRates[0];
    const cfg = truckRowConfig[r.type] || { mode: 'flat', pct: r.pct };
    chooseTruckPlan(r.type, cfg.mode, cfg.pct ?? r.pct);
  };

  return (
    <div className="bg-white/95 backdrop-blur-xl rounded-3xl border-2 border-blue-100 overflow-hidden shadow-[0_20px_50px_rgba(15,23,42,0.08)]">
      {/* Table Header Banner */}
      <div className="p-5 sm:p-6 bg-gradient-to-r from-[#0F172A] via-[#1E293B] to-[#0F172A] text-white flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex items-start sm:items-center gap-3.5">
          <div className="w-14 h-14 rounded-2xl bg-[#070B14] border border-amber-400/50 p-1.5 shrink-0 flex items-center justify-center shadow-lg">
            <img src="/rlg-logo.jpg" alt="Roadway Logistics Group LLC" className="w-full h-full object-contain rounded-xl" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-500/20 border border-blue-400/40 text-sky-300 text-[11px] font-bold mb-1">
              <Sparkles className="w-3 h-3 text-amber-400" />
              <span>Interactive Fleet Configurator · All 12 Truck Types</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-extrabold tracking-tight text-white">
              Select the Truck You Have — Flat Weekly Rate or Truck Percentage (%)
            </h3>
            <p className="text-xs text-slate-300 mt-0.5">
              Check your truck type(s) below, view your Roadway-branded unit, and choose either <strong className="text-amber-300">Flat Weekly ($500/$800)</strong> or <strong className="text-emerald-300">Flat Percentage (4%–10% by truck)</strong>.
            </p>
          </div>
        </div>

        {/* Filter & Bulk Mode Controls */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="inline-flex rounded-xl bg-white/10 p-1 border border-white/15">
            {[
              ['all', 'All Trucks (12)'],
              ['semi', 'Semi Trucks (8)'],
              ['box', 'Box / Hotshot / Van (4)']
            ].map(([id, label]) => (
              <button
                key={id}
                type="button"
                onClick={() => setFilterCat(id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                  filterCat === id ? 'bg-[#0066FF] text-white shadow' : 'text-slate-200 hover:text-white'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="inline-flex rounded-xl bg-white/10 p-1 border border-white/15">
            <button
              type="button"
              onClick={() => setAllTrucksMode('flat')}
              className="px-3 py-1.5 rounded-lg text-xs font-bold text-sky-300 hover:bg-white/10 transition cursor-pointer"
            >
              All Flat $
            </button>
            <button
              type="button"
              onClick={() => setAllTrucksMode('pct')}
              className="px-3 py-1.5 rounded-lg text-xs font-bold text-emerald-300 hover:bg-white/10 transition cursor-pointer"
            >
              All Truck %
            </button>
          </div>
        </div>
      </div>

      {/* Main Truck Selection Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-200 text-[#475569] bg-[#F8FBFF] uppercase tracking-wider text-[11px]">
              <th className="py-3.5 px-4 font-extrabold text-center">Select</th>
              <th className="py-3.5 px-4 font-extrabold">Roadway Branded Truck</th>
              <th className="py-3.5 px-4 font-extrabold">Truck Type &amp; Specs</th>
              <th className="py-3.5 px-4 font-extrabold"># Trucks</th>
              <th className="py-3.5 px-4 font-extrabold">Avg Gross/Wk</th>
              <th className="py-3.5 px-4 font-extrabold">Choose Flat or %</th>
              <th className="py-3.5 px-4 font-extrabold">Truck % Rate</th>
              <th className="py-3.5 px-4 font-extrabold">Weekly Fee</th>
              <th className="py-3.5 px-4 font-extrabold text-emerald-700">Est. Net Keep/Wk</th>
              <th className="py-3.5 px-4 font-extrabold text-right">Dispatch Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200/80">
            {visibleRates.map(r => {
              const isSelected = selectedTrucks.includes(r.type);
              const rowCfg = truckRowConfig[r.type] || { mode: 'flat', pct: r.pct };
              const isFlat = rowCfg.mode === 'flat';
              const activePct = rowCfg.pct ?? r.pct;
              const units = truckUnits[r.type] || 1;
              const pctFee = Math.round((r.gross * activePct) / 100);
              const singleFee = isFlat ? r.flatFee : pctFee;
              const totalRowFee = singleFee * units;
              const totalRowNet = (r.gross - singleFee) * units;
              const specInfo = TRUCK_SPECS[r.type] || TRUCK_SPECS['Dry Van (Semi)'];

              return (
                <tr
                  key={r.type}
                  onClick={() => toggleTruckSelection(r.type)}
                  className={`transition-colors cursor-pointer ${
                    isSelected ? 'bg-blue-50/75 hover:bg-blue-50' : 'hover:bg-slate-50/90'
                  }`}
                >
                  {/* 1. Checkbox Select */}
                  <td className="py-3.5 px-4 text-center" onClick={e => e.stopPropagation()}>
                    <button
                      type="button"
                      onClick={() => toggleTruckSelection(r.type)}
                      aria-label={`Select ${r.type}`}
                      className={`w-7 h-7 rounded-xl border-2 flex items-center justify-center mx-auto transition cursor-pointer ${
                        isSelected
                          ? 'bg-[#0066FF] border-[#0066FF] text-white shadow-sm'
                          : 'bg-white border-slate-300 text-transparent hover:border-[#0066FF]'
                      }`}
                    >
                      <Check className="w-4 h-4 stroke-[3]" />
                    </button>
                  </td>

                  {/* 2. Truck Graphic with Roadway Logo on the Truck */}
                  <td className="py-3.5 px-4">
                    <RoadwayBrandedTruck type={r.type} isSelected={isSelected} />
                  </td>

                  {/* 3. Equipment Name & Specs */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-1.5">
                      <span className="font-extrabold text-sm text-[#0F172A]">{r.type}</span>
                      {isSelected && (
                        <span className="px-2 py-0.5 rounded-full bg-[#0066FF] text-white text-[10px] font-bold">
                          Selected
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] font-semibold text-[#0066FF] mt-0.5">{specInfo.spec}</p>
                    <p className="text-[11px] text-[#64748B]">
                      Spot: <strong className="text-[#0F172A]">${r.rate.toFixed(2)}/mi</strong> · Range: {r.range}/wk
                    </p>
                  </td>

                  {/* 4. Number of Trucks */}
                  <td className="py-3.5 px-4" onClick={e => e.stopPropagation()}>
                    <input
                      type="number"
                      min={1}
                      max={50}
                      value={units}
                      onChange={e => setUnitsForTruck(r.type, e.target.value)}
                      className="w-14 px-2 py-1.5 rounded-xl bg-white border border-slate-300 font-extrabold text-center text-xs text-[#0F172A] focus:outline-none focus:border-[#0066FF]"
                    />
                  </td>

                  {/* 5. Avg Weekly Gross */}
                  <td className="py-3.5 px-4">
                    <span className="font-extrabold text-sm text-emerald-700">
                      ${(r.gross * units).toLocaleString()}/wk
                    </span>
                    {units > 1 && (
                      <span className="block text-[10px] text-[#64748B]">
                        ${r.gross.toLocaleString()}/truck
                      </span>
                    )}
                  </td>

                  {/* 6. Toggle Flat Weekly vs Flat Percentage */}
                  <td className="py-3.5 px-4" onClick={e => e.stopPropagation()}>
                    <div className="inline-flex rounded-xl p-0.5 bg-slate-100 border border-slate-200">
                      <button
                        type="button"
                        onClick={() => {
                          setTruckMode(r.type, 'flat');
                          if (!isSelected) toggleTruckSelection(r.type);
                        }}
                        className={`px-2.5 py-1.5 rounded-lg text-[11px] font-extrabold transition cursor-pointer ${
                          isFlat ? 'bg-[#0066FF] text-white shadow-xs' : 'text-[#475569] hover:text-[#0F172A]'
                        }`}
                      >
                        Flat ${r.flatFee}/wk
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setTruckMode(r.type, 'pct');
                          if (!isSelected) toggleTruckSelection(r.type);
                        }}
                        className={`px-2.5 py-1.5 rounded-lg text-[11px] font-extrabold transition cursor-pointer ${
                          !isFlat ? 'bg-emerald-600 text-white shadow-xs' : 'text-[#475569] hover:text-[#0F172A]'
                        }`}
                      >
                        {activePct}% Pct
                      </button>
                    </div>
                  </td>

                  {/* 7. Truck-Specific Percentage Selector */}
                  <td className="py-3.5 px-4" onClick={e => e.stopPropagation()}>
                    <select
                      value={activePct}
                      onChange={e => {
                        setTruckPct(r.type, Number(e.target.value));
                        if (!isSelected) toggleTruckSelection(r.type);
                      }}
                      className="px-2.5 py-1.5 rounded-xl bg-white border border-slate-300 text-xs font-extrabold text-[#0F172A] focus:outline-none focus:border-[#0066FF] cursor-pointer"
                    >
                      {r.pctOptions.map(opt => (
                        <option key={opt} value={opt}>
                          {opt}% Flat ({opt === r.pct ? 'Default' : 'Option'})
                        </option>
                      ))}
                    </select>
                  </td>

                  {/* 8. Selected Weekly Fee */}
                  <td className="py-3.5 px-4">
                    <span className="font-extrabold text-sm text-[#0066FF] block">
                      ${totalRowFee.toLocaleString()}/wk
                    </span>
                    <span className="text-[10px] font-semibold text-[#64748B]">
                      {isFlat ? `Flat $${r.flatFee}/truck` : `${activePct}% of gross`}
                    </span>
                  </td>

                  {/* 9. Net Take-Home / Wk */}
                  <td className="py-3.5 px-4">
                    <span className="font-extrabold text-sm text-[#0F172A] block">
                      ${totalRowNet.toLocaleString()}/wk
                    </span>
                    <span className="text-[10px] font-bold text-emerald-700">
                      You keep {Math.round((totalRowNet / (r.gross * units)) * 100)}%
                    </span>
                  </td>

                  {/* 10. Direct Action */}
                  <td className="py-3.5 px-4 text-right" onClick={e => e.stopPropagation()}>
                    <button
                      type="button"
                      onClick={() => chooseTruckPlan(r.type, rowCfg.mode, activePct)}
                      className="px-3.5 py-2 rounded-full bg-[#0066FF] hover:bg-[#0052CC] text-white font-bold text-xs shadow-sm inline-flex items-center gap-1.5 transition cursor-pointer"
                    >
                      <span>Select {isFlat ? `$${r.flatFee}` : `${activePct}%`}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Bottom Selected Fleet Summary Bar */}
      <div className="p-4 sm:p-5 bg-[#F0F7FF] border-t border-blue-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 text-xs font-extrabold text-[#0F172A]">
            <CheckCircle2 className="w-4 h-4 text-[#0066FF]" />
            <span>
              Your Selected Fleet ({summary.totalUnits} {summary.totalUnits === 1 ? 'Truck' : 'Trucks'}):
            </span>
          </div>
          {selectedTrucks.length > 0 ? (
            <div className="flex flex-wrap gap-1.5">
              {selectedTrucks.map(tName => {
                const cfg = truckRowConfig[tName] || { mode: 'flat', pct: 5 };
                const r = marketRates.find(m => m.type === tName);
                const u = truckUnits[tName] || 1;
                return (
                  <span
                    key={tName}
                    className="px-2.5 py-1 rounded-full bg-white border border-blue-200 text-[11px] font-bold text-[#0F172A] shadow-2xs"
                  >
                    {u}× {tName.replace(' (Semi)', '')} ({cfg.mode === 'flat' ? `$${r?.flatFee}/wk` : `${cfg.pct}%`})
                  </span>
                );
              })}
            </div>
          ) : (
            <span className="text-xs text-[#64748B]">Click any row above to select your truck(s)</span>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-4">
          {summary.totalUnits > 0 && (
            <div className="text-right">
              <span className="block text-[11px] font-bold text-[#475569]">
                Est. Weekly Fee: <strong className="text-[#0066FF]">${summary.totalFee.toLocaleString()}/wk</strong>
              </span>
              <span className="block text-sm font-extrabold text-emerald-700">
                Est. Net Take-Home: ${summary.totalNet.toLocaleString()}/wk
              </span>
            </div>
          )}
          <button
            type="button"
            onClick={handleDispatchSelected}
            className="px-6 py-3 rounded-full bg-[#0066FF] hover:bg-[#0052CC] text-white font-extrabold text-xs sm:text-sm shadow-[0_8px_20px_rgba(0,102,255,0.28)] inline-flex items-center gap-2 transition cursor-pointer"
          >
            <Truck className="w-4 h-4" />
            <span>Dispatch My Selected Truck(s) →</span>
          </button>
        </div>
      </div>
    </div>
  );
}
