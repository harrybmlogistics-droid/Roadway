import React, { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import {
  Truck, ShieldCheck, DollarSign, Calculator, Users, Clock,
  Globe, Phone, Mail, MapPin, ArrowRight, CheckCircle2,
  X, Menu, Check, ChevronDown, Zap, Layers, Monitor, FileCheck,
  Loader2, AlertCircle, BarChart3, Database, RefreshCw,
  Play, Pause, RotateCcw, Home, ChevronRight, Star, UserCheck,
  Container, MonitorSmartphone
} from 'lucide-react';
import { api } from './api';
import RwDispatchHero from './RwDispatchHero';
import KvFreightShowcase from './KvFreightShowcase';
import RoadwayTruckTable from './RoadwayTruckTable';

// ============================================================================
// CONSTANTS
// ============================================================================

const COMPANY = {
  name: 'Roadway Logistics Group LLC',
  phone: '(209) 202-3080',
  phoneHref: 'tel:+12092023080',
  email: 'Admin@roadwaylogisticsgroupllc.com',
  address: 'Gustine, California',
  stats: [
    { value: '5+', label: 'Years Experience' },
    { value: '80+', label: 'Carriers Served' },
    { value: '50', label: 'States Covered' },
    { value: '24/7', label: 'Support' }
  ]
};

const VISUALS = {
  hero:     'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=1400&q=85',
  about:    'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1000&q=80',
  compare:  'https://images.unsplash.com/photo-1519003722824-194d4455a60c?auto=format&fit=crop&w=1200&q=80',
  driver:   'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1200&q=80',
  desk:     'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1000&q=80',
  highway:  'https://images.unsplash.com/photo-1501700493788-fa1a4fc9fe62?auto=format&fit=crop&w=1600&q=85'
};

const CORE_SERVICES = [
  { id:'dispatch',      title:'Dispatch Service',       price:'$500–$800/wk Flat or 5%–9% by Truck', icon:'dispatch', popular: true,  img:'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80', desc:'24/7 load booking, aggressive rate negotiation, choose Flat Weekly Rate or Flat Percentage by truck type.',
    scope:['24/7 load finding & booking','Rate negotiation with brokers','Broker communication','Route planning','Paperwork & rate confirmations','Load tracking'],
    benefits:['Choose Flat Weekly or Flat % by truck','Access premium load boards','No forced dispatch','Keep 100% of rate increases'] },
  { id:'mc-authority',  title:'MC Authority Setup',     price:'$250 one-time',  icon:'mc',          popular: false, img:'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=600&q=80', desc:'USDOT, MC, BOC-3, UCR, permits & more.',
    scope:['USDOT registration','MC authority application','BOC-3 filing','UCR registration','State permits guidance','Insurance consultation'],
    benefits:['Start hauling legally','Identify missing info early','Expert guidance','No delays'] },
  { id:'factoring',     title:'Factoring Assistance',   price:'$120 one-time',  icon:'factoring',   popular: false, img:'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?auto=format&fit=crop&w=600&q=80', desc:'Compare factors, setup docs, get paid faster.',
    scope:['Factoring company comparison','Invoice & POD management','Broker credit checks','Collections assistance','QuickPay vs factoring analysis','Cash flow optimization'],
    benefits:['Same-day / 24-hr funding','Improve weekly cash flow','Compare advance rates','Focus on driving'] },
  { id:'compliance',    title:'Compliance & Permits',   price:'From $150/mo',   icon:'compliance',  popular: false, img:'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=600&q=80', desc:'IFTA, IRP, DOT, drug & alcohol, safety audits.',
    scope:['DOT compliance monitoring','IFTA reporting','IRP registration','Drug & alcohol program','Safety audit prep','Permit management'],
    benefits:['Track all deadlines','Peace of mind on the road','Organize required records','Proactive management'] },
  { id:'accounting',    title:'Accounting Services',    price:'From $150',      icon:'accounting',  popular: false, img:'https://images.unsplash.com/photo-1554224154-26032ffc0d07?auto=format&fit=crop&w=600&q=80', desc:'Bookkeeping, tax prep, P&L reports.',
    scope:['Bookkeeping','Per-truck expense tracking','P&L reporting','Tax prep','Fuel tax reporting','Financial planning'],
    benefits:['Know true profitability/mile','Simplify tax time','Make informed lane decisions','Understand your numbers'] },
  { id:'driver-hiring', title:'Driver Hiring',          price:'$500 solo - $750 team', icon:'hiring', popular: false, img:'https://images.unsplash.com/photo-1580674285054-bed31e145f59?auto=format&fit=crop&w=600&q=80', desc:'CDL-A recruitment, MVR checks, placement.',
    scope:['CDL-A & non-CDL recruitment','Background checks','MVR & PSP verification','Drug testing setup','Driver onboarding','Retention strategies'],
    benefits:['Placement in 2–3 business days','Free replacement guarantee','Reduce hiring costs','Proper document vetting'] },
  { id:'logbook',       title:'Logbook Management',     price:'From $100',      icon:'logbook',     popular: false, img:'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=600&q=80', desc:'ELD, HOS, log audits, training & support.',
    scope:['ELD compliance monitoring','HOS tracking','Daily log auditing','HOS issues review','Training on rules','ELD troubleshooting'],
    benefits:['Stay HOS compliant','Identify issues early','Maximize legal drive time','Reduce DOT audit stress'] },
  { id:'trailer-rental',title:'Trailer Rental',         price:'From $800/week', icon:'trailer',     popular: false, img:'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=600&q=80', desc:'Dry van, reefer, flatbed, step deck & more.',
    scope:['Weekly/monthly options','Dry Van, Reefer, Flatbed','Written maintenance terms','Flexible terms','Availability check','Match to your loads'],
    benefits:['Scale your fleet flexibly','Well-maintained equipment','Compare cash requirements','Match equipment to loads'] }
];

const MARKET_RATES = [
  { type:'Dry Van (Semi)',      category:'semi', rate:3.45, range:'$11k – $13k',   source:'DAT Spot 2026', fee:'$500/wk', flatFee:500, pct:5, pctOptions:[4,5,6],   gross:12000 },
  { type:'Reefer (Semi)',       category:'semi', rate:3.95, range:'$14k – $15k',   source:'DAT Spot 2026', fee:'$500/wk', flatFee:500, pct:5, pctOptions:[4,5,6],   gross:14500 },
  { type:'Flatbed (Semi)',      category:'semi', rate:3.85, range:'$12k – $14.5k', source:'DAT Spot 2026', fee:'$500/wk', flatFee:500, pct:6, pctOptions:[5,6,7],   gross:13200 },
  { type:'Step Deck (Semi)',    category:'semi', rate:3.90, range:'$12.5k – $15k', source:'Est. 2026',     fee:'$500/wk', flatFee:500, pct:6, pctOptions:[5,6,7],   gross:13500 },
  { type:'Power Only (Semi)',   category:'semi', rate:3.25, range:'$10k – $12k',   source:'Est. 2026',     fee:'$500/wk', flatFee:500, pct:5, pctOptions:[4,5,6],   gross:11000 },
  { type:'Car Hauler (Semi)',   category:'semi', rate:4.20, range:'$13k – $16k',   source:'Est. 2026',     fee:'$500/wk', flatFee:500, pct:7, pctOptions:[6,7,8],   gross:14500 },
  { type:'Heavy Haul (Semi)',   category:'semi', rate:4.65, range:'$15k – $18.5k', source:'Est. 2026',     fee:'$500/wk', flatFee:500, pct:8, pctOptions:[7,8,9],   gross:16500 },
  { type:'Drayage (Semi)',      category:'semi', rate:3.50, range:'$10.5k – $13k', source:'Est. 2026',     fee:'$500/wk', flatFee:500, pct:6, pctOptions:[5,6,7],   gross:11800 },
  { type:'Box Truck',           category:'box',  rate:2.95, range:'$4k – $7k',     source:'Expedited 2026',fee:'$800/wk', flatFee:800, pct:8, pctOptions:[7,8,9,10],gross:5500 },
  { type:'Hotshot (40ft)',      category:'box',  rate:2.85, range:'$6k – $8k',     source:'Hotshot 2026',  fee:'$800/wk', flatFee:800, pct:8, pctOptions:[7,8,9,10],gross:7000 },
  { type:'Sprinter Van',        category:'box',  rate:2.65, range:'$3.8k – $5.8k', source:'Expedited 2026',fee:'$800/wk', flatFee:800, pct:9, pctOptions:[8,9,10],  gross:4800 },
  { type:'Straight Truck',      category:'box',  rate:3.05, range:'$4.5k – $7.2k', source:'Expedited 2026',fee:'$800/wk', flatFee:800, pct:8, pctOptions:[7,8,9,10],gross:5800 }
];

const DRIVER_JOBS = [
  { id:'otr-dv',   title:'OTR Driver',           equipment:'Dry Van',   location:'All 50 States',          experience:'1+ Year CDL-A',  pay:'$0.60–$0.70/mi',    est:'$1,950–$2,450/wk', homeTime:'2–3 weeks' },
  { id:'reg-ref',  title:'Regional Driver',       equipment:'Reefer',    location:'Midwest / Southeast',    experience:'1+ Year CDL-A',  pay:'$0.60–$0.75/mi',    est:'$2,100–$2,650/wk', homeTime:'Weekly' },
  { id:'loc-box',  title:'Local Driver',          equipment:'Box Truck', location:'Texas / Tri-State / CA', experience:'Non-CDL/CDL-B',  pay:'$25–$35/hr',         est:'$1,250–$1,650/wk', homeTime:'Daily' },
  { id:'flat-otr', title:'OTR / Regional Flatbed',equipment:'Flatbed',   location:'South / Midwest',        experience:'1+ Year Flatbed',pay:'$0.68–$0.82/mi+Tarp',est:'$2,300–$2,850/wk', homeTime:'Every 10–14 days' },
  { id:'hot-exp',  title:'Hotshot 40ft Driver',   equipment:'Hotshot',   location:'TX / OK / Southeast',    experience:'CDL-A or Non-CDL',pay:'30%–35% of Gross',  est:'$1,600–$2,200/wk', homeTime:'Weekly' },
  { id:'team-dv',  title:'Dedicated Team Drivers', equipment:'Dry Van',  location:'Coast-to-Coast I-40',    experience:'CDL-A Team',     pay:'$0.82–$0.90/mi split',est:'$4,400–$5,400/wk team', homeTime:'Scheduled' }
];

const GLOSSARY = [
  { id:'factoring',    term:'Factoring',     short:'Same-day / 24-hr load payment',  definition:'Freight factoring lets a carrier sell unpaid invoices to a factoring company for immediate cash instead of waiting 30–60 days.', example:'We help you compare non-recourse vs. recourse contracts and advance rates for a flat $120 fee.' },
  { id:'mc-authority', term:'MC Authority',  short:'Federal interstate operating permit', definition:'Motor Carrier (MC) Authority is FMCSA permission to haul regulated freight across state lines for hire.', example:'Our $250 setup covers your USDOT, MC application, BOC-3, and UCR alignment.' },
  { id:'deadhead',     term:'Deadhead',      short:'Empty miles to next pickup',     definition:'Unpaid empty miles driven from your drop-off to the next shipper pickup.', example:'Our dispatchers pre-book reload lanes before you unload to keep deadhead under 8%.' },
  { id:'detention-pay',term:'Detention Pay', short:'Dock wait compensation ($40–$75/hr)', definition:'Compensation billed to the broker when a shipper delays loading beyond the 2-hour free window.', example:'We track your in/out timestamps on the BOL to enforce every detention claim.' },
  { id:'tonu',         term:'TONU',          short:'Truck Ordered Not Used fee',     definition:'When a broker cancels a load after dispatch, we bill a TONU fee ($150–$250) on an updated rate confirmation.', example:'You keep 100% of every TONU fee our dispatch desk recovers.' },
  { id:'eld',          term:'ELD',           short:'Electronic Logging Device',     definition:'An ELD syncs with your truck ECM to auto-track driving time and HOS compliance.', example:'Our Logbook Management service (from $100) audits your ELD daily to prevent violations.' },
  { id:'quickpay',     term:'QuickPay',      short:'Broker fast-pay (1–3 days, 1.5–5% fee)', definition:'An expedited payment option offered directly by a broker without a third-party factor.', example:'Compare QuickPay vs. full factoring using our free Resources calculator.' },
  { id:'layover',      term:'Layover Pay',   short:'Overnight wait compensation ($250–$500)', definition:'A flat daily fee paid when a shipper delays your load overnight for 24+ hours.', example:'Our dispatchers secure written layover addendums before your truck sits.' }
];

const HIRE_STATES = {
  Northeast: ['MD','MA','NJ','NY','PA'],
  Southeast: ['AL','FL','GA','KY','NC','SC','TN','VA'],
  Midwest:   ['IL','IN','IA','KS','MI','MN','MO','OH','WI'],
  South:     ['LA','OK','TX'],
  Southwest: ['AZ','NM','NV'],
  West:      ['CA','CO','OR','WA']
};

// ============================================================================
// ICON RENDERER
// ============================================================================
function ServiceIcon({ type, size = 'md' }) {
  const box  = size === 'sm' ? 'w-11 h-11 rounded-xl' : 'w-12 h-12 rounded-2xl';
  const icon = size === 'sm' ? 'w-5 h-5' : 'w-6 h-6';
  return (
    <div className={`${box} icon-box flex items-center justify-center text-white relative shrink-0`}>
      {type === 'dispatch'   && <Truck             className={icon} strokeWidth={2} />}
      {type === 'mc'         && <ShieldCheck       className={icon} strokeWidth={2} />}
      {type === 'factoring'  && <DollarSign        className={icon} strokeWidth={2} />}
      {type === 'compliance' && <FileCheck         className={icon} strokeWidth={2} />}
      {type === 'accounting' && <Calculator        className={icon} strokeWidth={2} />}
      {type === 'hiring'     && <UserCheck         className={icon} strokeWidth={2} />}
      {type === 'logbook'    && <Clock             className={icon} strokeWidth={2} />}
      {type === 'trailer'    && <Container         className={icon} strokeWidth={2} />}
      {type === 'web'        && <Globe             className={icon} strokeWidth={2} />}
    </div>
  );
}

// ============================================================================
// REUSABLE FORM HOOK
// ============================================================================
function useForm(initial) {
  const [values,  setValues]  = useState(initial);
  const [loading, setLoading] = useState(false);
  const [result,  setResult]  = useState(null); // { ok: bool, message: string }

  const set = (field) => (e) => setValues(v => ({ ...v, [field]: e.target.value }));
  const setValue = (field, val) => setValues(v => ({ ...v, [field]: val }));
  const reset = () => { setValues(initial); setResult(null); };

  return { values, set, setValue, loading, setLoading, result, setResult, reset };
}

// ============================================================================
// MAIN APP
// ============================================================================
export default function App() {
  const [page,          setPage]          = useState('home');
  const [mobileOpen,    setMobileOpen]    = useState(false);
  const [selService,    setSelService]    = useState(null);
  const [selTerm,       setSelTerm]       = useState(null);
  const [pricingTab,    setPricingTab]    = useState('semi');
  const [cardPlanMode,  setCardPlanMode]  = useState({ semi: 'flat', box: 'flat' });
  const [cardTruckType, setCardTruckType] = useState({ semi: 'Dry Van (Semi)', box: 'Box Truck' });
  const [truckRowConfig, setTruckRowConfig] = useState(() =>
    Object.fromEntries(MARKET_RATES.map(r => [r.type, { mode: 'flat', pct: r.pct }]))
  );
  const [startTruck,    setStartTruck]    = useState('Dry Van (Semi)');
  const [startBilling,  setStartBilling]  = useState('flat');
  const [showCalc,      setShowCalc]      = useState(true);
  const [calcGross,     setCalcGross]     = useState(12000);
  const [calcPct,       setCalcPct]       = useState(8);
  const [calcPlan,      setCalcPlan]      = useState('semi');
  const [jobEquip,      setJobEquip]      = useState('All');
  const [hireRegion,    setHireRegion]    = useState('South');
  const [resourceTool,  setResourceTool]  = useState('ifta');
  const [dotQuery,      setDotQuery]      = useState('MC-1492810');
  const [dotResult,     setDotResult]     = useState(null);
  const [dotLoading,    setDotLoading]    = useState(false);
  const [toast,         setToast]         = useState(null);
  const [iftaMiles,     setIftaMiles]     = useState(12000);
  const [iftaGallons,   setIftaGallons]   = useState(1850);
  const [rpmMiles,      setRpmMiles]      = useState(600);
  const [rpmDH,         setRpmDH]         = useState(40);
  const [rpmPay,        setRpmPay]        = useState(2100);
  const [adminData,     setAdminData]     = useState(null);
  const [adminLoading,  setAdminLoading]  = useState(false);

  // ─── FORMS ────────────────────────────────────────────────────────────────
  const contactF  = useForm({ fullName:'', email:'', phone:'', equipmentType:'Dry Van', mcNumber:'', reason:'Dispatch for my truck(s)', message:'' });
  const startF    = useForm({ fullName:'', phone:'', mcNumber:'', serviceType:'Dry Van (Semi) — Flat Rate ($500/wk)' });
  const applyF    = useForm({ driverName:'', phone:'', cityState:'' });
  const websiteF  = useForm({ businessName:'', phone:'' });
  const hireF     = useForm({ companyName:'', phone:'', equipment:'Dry Van Driver' });

  const nav = useCallback((p) => {
    setPage(p); setMobileOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const setTruckMode = useCallback((truckType, mode) => {
    setTruckRowConfig(prev => ({
      ...prev,
      [truckType]: { ...(prev[truckType] || { pct: 5 }), mode }
    }));
  }, []);

  const setTruckPct = useCallback((truckType, pct) => {
    setTruckRowConfig(prev => ({
      ...prev,
      [truckType]: { ...(prev[truckType] || { mode: 'pct' }), mode: 'pct', pct: Number(pct) }
    }));
  }, []);

  const setAllTrucksMode = useCallback((mode) => {
    setTruckRowConfig(prev =>
      Object.fromEntries(MARKET_RATES.map(r => [r.type, { mode, pct: prev[r.type]?.pct ?? r.pct }]))
    );
  }, []);

  const chooseTruckPlan = useCallback((truckType, mode, pctVal) => {
    const truckObj = MARKET_RATES.find(r => r.type === truckType) || MARKET_RATES[0];
    const chosenPct = pctVal ?? truckRowConfig[truckType]?.pct ?? truckObj.pct;
    setStartTruck(truckObj.type);
    setStartBilling(mode);
    setTruckRowConfig(prev => ({
      ...prev,
      [truckObj.type]: { mode, pct: chosenPct }
    }));
    const label = mode === 'flat'
      ? `${truckObj.type} — Flat Rate ($${truckObj.flatFee}/wk)`
      : `${truckObj.type} — Flat Percentage (${chosenPct}% per load)`;
    startF.setValue('serviceType', label);
    nav('get-started');
  }, [truckRowConfig, startF, nav]);

  const showToast = useCallback((title, desc, ok = true) => {
    setToast({ title, desc, ok });
    setTimeout(() => setToast(null), 5000);
  }, []);

  const openTerm = (id) => {
    setSelTerm(GLOSSARY.find(t => t.id === id) || { id, term: id, short: 'RLG Guide', definition: 'Our dispatchers apply strict carrier-first protocols on every load.', example: `Call ${COMPANY.phone} for a free 1-on-1 walkthrough.` });
  };

  // ─── SAVINGS MATH ─────────────────────────────────────────────────────────
  const savings = useMemo(() => {
    const flat   = calcPlan === 'semi' ? 500 : 800;
    const comm   = Math.round(calcGross * calcPct / 100);
    const saved  = comm - flat;
    return { flat, comm, keepComm: calcGross - comm, keepFlat: calcGross - flat, weeklySaved: saved, yearlySaved: saved * 52 };
  }, [calcGross, calcPct, calcPlan]);

  // ─── FILTERED JOBS ────────────────────────────────────────────────────────
  const filteredJobs = useMemo(() =>
    jobEquip === 'All' ? DRIVER_JOBS : DRIVER_JOBS.filter(j => j.equipment === jobEquip),
  [jobEquip]);

  // ─── ADMIN DATA ───────────────────────────────────────────────────────────
  const loadAdmin = async () => {
    setAdminLoading(true);
    const [statsRes, subRes] = await Promise.all([api.stats(), api.submissions({ limit: 20 })]);
    setAdminData({ stats: statsRes.success ? statsRes.data : null, submissions: subRes.success ? subRes.data : [] });
    setAdminLoading(false);
  };

  // ─── DOT LOOKUP ───────────────────────────────────────────────────────────
  const handleDotLookup = async () => {
    if (!dotQuery.trim()) return;
    setDotLoading(true); setDotResult(null);
    const res = await api.dotLookup(dotQuery.trim());
    setDotResult(res);
    setDotLoading(false);
  };

  // ─── FORM SUBMITTERS ──────────────────────────────────────────────────────
  const submitContact = async (e) => {
    e.preventDefault();
    contactF.setLoading(true);
    const res = await api.contact(contactF.values);
    contactF.setLoading(false);
    if (res.success) { contactF.setResult({ ok: true, message: res.message }); contactF.reset(); showToast('Message Sent!', res.message); }
    else contactF.setResult({ ok: false, message: res.error || 'Failed. Please call us.' });
  };

  const submitGetStarted = async (e) => {
    e.preventDefault();
    startF.setLoading(true);
    const res = await api.getStarted(startF.values);
    startF.setLoading(false);
    if (res.success) { startF.setResult({ ok: true, message: res.message }); startF.reset(); showToast('Onboarding Started!', res.message); setPage('home'); }
    else startF.setResult({ ok: false, message: res.error || 'Failed. Please call us.' });
  };

  const submitApplyJob = async (e, job) => {
    e.preventDefault();
    applyF.setLoading(true);
    const res = await api.applyJob({ ...applyF.values, jobTitle: job?.title, equipment: job?.equipment, pay: job?.pay });
    applyF.setLoading(false);
    if (res.success) { applyF.setResult({ ok: true, message: res.message }); applyF.reset(); showToast('Application Submitted!', res.message); setSelService(null); }
    else applyF.setResult({ ok: false, message: res.error || 'Failed. Please call us.' });
  };

  const submitWebsite = async (e) => {
    e.preventDefault();
    websiteF.setLoading(true);
    const res = await api.websiteInquiry(websiteF.values);
    websiteF.setLoading(false);
    if (res.success) { websiteF.setResult({ ok: true, message: res.message }); websiteF.reset(); showToast('Request Received!', res.message); setPage('home'); }
    else websiteF.setResult({ ok: false, message: res.error || 'Failed. Please call us.' });
  };

  const submitHire = async (e) => {
    e.preventDefault();
    hireF.setLoading(true);
    const res = await api.hireDrivers(hireF.values);
    hireF.setLoading(false);
    if (res.success) { hireF.setResult({ ok: true, message: res.message }); hireF.reset(); showToast('Requirement Logged!', res.message); }
    else hireF.setResult({ ok: false, message: res.error || 'Failed. Please call us.' });
  };

  // ─── RESULT ALERT ─────────────────────────────────────────────────────────
  const ResultAlert = ({ result }) => !result ? null : (
    <div className={`flex items-start gap-2.5 p-3.5 rounded-xl text-xs font-medium ${result.ok ? 'bg-emerald-50 border border-emerald-200 text-emerald-800' : 'bg-rose-50 border border-rose-200 text-rose-800'}`}>
      {result.ok ? <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600" /> : <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />}
      <span>{result.message}</span>
    </div>
  );

  const Btn = ({ loading: ld, children, ...props }) => (
    <button disabled={ld} {...props} className={`${props.className || ''} disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2`}>
      {ld ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
      {children}
    </button>
  );

  // ════════════════════════════════════════════════════════════════════════════
  // SECTION RENDERERS
  // ════════════════════════════════════════════════════════════════════════════

  // ─── CINEMATIC HERO SCROLL SEQUENCE (240 FRAMES) ─────────────────────────
  const TOTAL_HERO_FRAMES = 240;

  const CinematicHeroCanvas = ({ onNav }) => {
    const canvasRef = useRef(null);
    const containerRef = useRef(null);
    const imagesRef = useRef([]);
    const [currentFrame, setCurrentFrame] = useState(1);
    const [loadedCount, setLoadedCount] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isReady, setIsReady] = useState(false);
    const animFrameId = useRef(null);

    // Preload frames progressively
    useEffect(() => {
      let mounted = true;
      const imgs = [];
      let loaded = 0;

      for (let i = 1; i <= TOTAL_HERO_FRAMES; i++) {
        const img = new Image();
        const padded = String(i).padStart(3, '0');
        img.src = `/hero-frames/ezgif-frame-${padded}.jpg`;
        img.onload = () => {
          if (!mounted) return;
          loaded++;
          setLoadedCount(loaded);
          if (i === 1) {
            setIsReady(true);
            renderFrame(1, img);
          }
        };
        imgs.push(img);
      }
      imagesRef.current = imgs;

      return () => {
        mounted = false;
        if (animFrameId.current) cancelAnimationFrame(animFrameId.current);
      };
    }, []);

    const renderFrame = useCallback((frameIdx, overrideImg = null) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const img = overrideImg || imagesRef.current[frameIdx - 1];
      if (!img || !img.complete || img.naturalWidth === 0) return;

      const dpr = window.devicePixelRatio || 1;
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;

      if (canvas.width !== Math.round(w * dpr) || canvas.height !== Math.round(h * dpr)) {
        canvas.width = Math.round(w * dpr);
        canvas.height = Math.round(h * dpr);
      }

      ctx.save();
      ctx.scale(dpr, dpr);

      // Object-fit: cover math
      const hRatio = w / img.naturalWidth;
      const vRatio = h / img.naturalHeight;
      const ratio = Math.max(hRatio, vRatio);
      const cx = (w - img.naturalWidth * ratio) / 2;
      const cy = (h - img.naturalHeight * ratio) / 2;

      ctx.clearRect(0, 0, w, h);
      ctx.drawImage(img, cx, cy, img.naturalWidth * ratio, img.naturalHeight * ratio);
      ctx.restore();
    }, []);

    // Listen to window scroll to scrub frames
    useEffect(() => {
      let ticking = false;

      const onScroll = () => {
        if (isPlaying) return; // Don't interrupt auto-playback
        if (!ticking) {
          window.requestAnimationFrame(() => {
            if (!containerRef.current) {
              ticking = false;
              return;
            }
            const rect = containerRef.current.getBoundingClientRect();
            const windowH = window.innerHeight;
            // Calculate visibility progress: 0 when just entering bottom, 1 when scrolling past top
            const progress = Math.max(0, Math.min(1, (windowH - rect.top) / (windowH + rect.height * 0.75)));
            const target = Math.min(TOTAL_HERO_FRAMES, Math.max(1, Math.round(progress * (TOTAL_HERO_FRAMES - 1)) + 1));

            setCurrentFrame(target);
            renderFrame(target);
            ticking = false;
          });
          ticking = true;
        }
      };

      window.addEventListener('scroll', onScroll, { passive: true });
      const onResize = () => renderFrame(currentFrame);
      window.addEventListener('resize', onResize, { passive: true });
      return () => {
        window.removeEventListener('scroll', onScroll);
        window.removeEventListener('resize', onResize);
      };
    }, [isPlaying, currentFrame, renderFrame]);

    // Handle Auto-Play animation loop (~30 fps)
    useEffect(() => {
      if (!isPlaying) {
        if (animFrameId.current) cancelAnimationFrame(animFrameId.current);
        return;
      }

      const fpsInterval = 1000 / 30; // 30 FPS playback
      let lastTime = performance.now();

      const loop = (currentTime) => {
        const elapsed = currentTime - lastTime;
        if (elapsed > fpsInterval) {
          lastTime = currentTime - (elapsed % fpsInterval);
          setCurrentFrame((prev) => {
            const next = prev >= TOTAL_HERO_FRAMES ? 1 : prev + 1;
            renderFrame(next);
            return next;
          });
        }
        animFrameId.current = requestAnimationFrame(loop);
      };

      animFrameId.current = requestAnimationFrame(loop);
      return () => {
        if (animFrameId.current) cancelAnimationFrame(animFrameId.current);
      };
    }, [isPlaying, renderFrame]);

    // Manual scrubber change
    const handleScrub = (e) => {
      setIsPlaying(false);
      const val = parseInt(e.target.value, 10);
      setCurrentFrame(val);
      renderFrame(val);
    };

    const progressPct = Math.round((currentFrame / TOTAL_HERO_FRAMES) * 100);

    return (
      <div ref={containerRef} className="relative rounded-3xl overflow-hidden border-2 border-white shadow-[0_20px_60px_rgba(15,23,42,0.18)] aspect-[16/11] bg-slate-900 group">
        {/* Canvas */}
        <canvas
          ref={canvasRef}
          className="w-full h-full block object-cover transition-opacity duration-300"
          style={{ opacity: isReady ? 1 : 0.4 }}
        />

        {/* Cinematic Vignette Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A]/40 via-transparent to-[#0F172A]/10 pointer-events-none" />
      </div>
    );
  };

  const Hero = () => (
    <section className="glass-panel rounded-3xl p-6 sm:p-10 lg:p-12 relative overflow-hidden">
      <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-[#0066FF]/10 blur-3xl pointer-events-none" />
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
        <div className="lg:col-span-6 space-y-5">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#E6F0FF] border border-blue-200 text-[#0066FF] text-xs font-semibold">
            Your Success. Our Dispatch.
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-[#0F172A] tracking-tight leading-[1.12]">
            Roadway Logistics<span className="block">Group LLC</span>
          </h1>
          <p className="text-sm sm:text-base text-[#475569] leading-relaxed">
            We help <strong className="text-[#0F172A]">owner-operators</strong> and small fleets find better loads, reduce deadhead, and increase profits — with flat-rate dispatch, compliance, factoring, and driver support all in one place.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {['Flat Rate Dispatch ($500/$800/wk)','Flat Percentage by Truck (5%–9%)','No Contracts — Cancel Anytime','24/7 Live Dispatch Support'].map(t => (
              <div key={t} className="flex items-center gap-2.5 text-sm font-medium text-[#0F172A]">
                <div className="w-5 h-5 rounded-full bg-[#E6F0FF] text-[#0066FF] flex items-center justify-center shrink-0"><Check className="w-3.5 h-3.5 stroke-[3]" /></div>
                <span>{t}</span>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap gap-3.5 pt-2">
            <button onClick={() => nav('get-started')} className="px-7 py-3.5 rounded-full font-semibold text-sm text-white bg-[#0066FF] hover:bg-[#0052CC] shadow-[0_8px_24px_rgba(0,102,255,0.32)] flex items-center gap-2 transition hover:-translate-y-0.5 cursor-pointer">
              <span>Get Started Now</span><ArrowRight className="w-4 h-4" />
            </button>
            <a href={COMPANY.phoneHref} className="px-6 py-3.5 rounded-full font-semibold text-sm text-[#0F172A] bg-white/90 border border-blue-100 shadow-sm flex items-center gap-2 transition">
              <Phone className="w-4 h-4 text-[#0066FF]" /><span>{COMPANY.phone}</span>
            </a>
          </div>
        </div>
        <div className="lg:col-span-6 relative">
          <CinematicHeroCanvas onNav={nav} />
        </div>
      </div>

      {/* Service Quick Bar */}
      <div className="mt-10 pt-8 border-t border-blue-100/80">
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          {CORE_SERVICES.map(s => ({ id: s.id, label: s.title.replace(' Service','').replace(' Setup','').replace(' Assistance','').replace(' Management',''), icon: s.icon })).map(item => (
            <button key={item.id} onClick={() => setSelService(CORE_SERVICES.find(s => s.id === item.id))}
              className="glass-card rounded-2xl p-3 flex flex-col items-center gap-2 text-center group cursor-pointer">
              <ServiceIcon type={item.icon} size="sm" />
              <span className="text-[11px] font-bold text-[#0F172A] group-hover:text-[#0066FF] transition leading-tight">{item.label}</span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );

  const Services = () => (
    <section
      className="glass-panel rounded-3xl p-4 sm:p-8 relative"
      style={{
        fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif"
      }}
    >
      {/* HERO SECTION */}
      <div className="relative rounded-3xl overflow-hidden mb-8 min-h-[270px] flex items-center">
        {/* Right-side Highway & Truck Background */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=1800&q=85"
            alt="Blue Semi Truck on Highway"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 hero-fade"></div>
        </div>

        {/* Subtle USA Route Map SVG Overlay */}
        <svg className="hidden lg:block absolute left-[38%] top-4 w-72 h-44 opacity-80 z-10 pointer-events-none" viewBox="0 0 300 180" fill="none">
          <path d="M30,40 L260,30 L280,90 L240,150 L140,160 L40,130 Z" fill="#60a5fa" fillOpacity="0.28" stroke="#93c5fd" strokeWidth="1.5" />
          <path d="M55,85 Q140,40 230,75" stroke="#ffffff" strokeWidth="2" strokeDasharray="4 2" fill="none" />
          <path d="M85,115 Q160,80 220,125" stroke="#ffffff" strokeWidth="1.5" fill="none" />
          <circle cx="55" cy="85" r="5" fill="#ffffff" />
          <circle cx="85" cy="115" r="5" fill="#ffffff" />
          <circle cx="230" cy="75" r="5" fill="#ffffff" />
          <circle cx="220" cy="125" r="5" fill="#ffffff" />
        </svg>

        {/* Left Hero Content */}
        <div className="relative z-10 max-w-xl py-6 px-2 sm:px-6">
          {/* Pill Badge */}
          <button
            onClick={() => nav('services')}
            className="inline-flex items-center gap-2 bg-white/90 backdrop-blur-md border border-blue-100 shadow-sm px-4 py-1.5 rounded-full text-xs sm:text-sm font-semibold text-blue-600 mb-5 hover:bg-white transition cursor-pointer"
          >
            <Home className="w-4 h-4 fill-blue-600 text-blue-600" />
            <span>Complete Trucking Business Stack</span>
            <ChevronRight className="w-4 h-4" />
          </button>

          {/* Main Heading */}
          <h2 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-slate-900 mb-4">
            Our <span className="text-blue-600">Services</span>
          </h2>

          {/* Subtitle */}
          <p className="text-slate-700 text-sm sm:text-base font-medium leading-relaxed max-w-md mb-5">
            Everything you need to keep your business moving. Click any card to review full scope and pricing.
          </p>

          {/* Blue Accent Line */}
          <div className="w-16 h-1.5 bg-blue-600 rounded-full"></div>
        </div>
      </div>

      {/* 8-CARD SERVICES GRID */}
      <div id="services-grid" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
        {CORE_SERVICES.map(srv => (
          <div
            key={srv.id}
            onClick={() => setSelService(srv)}
            className="glass-card rounded-3xl p-5 relative overflow-hidden flex flex-col justify-between min-h-[250px] cursor-pointer group"
          >
            {/* Right Background Visual */}
            <img
              src={srv.img}
              alt={srv.title}
              className="absolute right-0 top-0 h-full w-3/5 object-cover opacity-35 group-hover:opacity-45 transition card-img-mask pointer-events-none"
            />

            {srv.popular && (
              <div className="absolute top-3.5 right-3.5 bg-blue-600 text-white text-[11px] font-bold px-3 py-1 rounded-full flex items-center gap-1 shadow-sm z-10">
                <Star className="w-3 h-3 fill-white" />
                <span>Most Popular</span>
              </div>
            )}

            {/* Top Card Content */}
            <div className="relative z-10 pr-12">
              <div className="mb-4">
                <ServiceIcon type={srv.icon} />
              </div>

              <h3 className="text-lg font-extrabold text-slate-900 leading-snug">{srv.title}</h3>
              <p className="text-blue-600 font-bold text-sm mt-1 leading-snug">{srv.price}</p>
              <p className="text-slate-600 text-xs mt-2.5 leading-relaxed">{srv.desc}</p>
            </div>

            {/* Bottom Action Pill */}
            <div className="relative z-10 mt-5">
              <span className="inline-flex items-center gap-2 bg-white/90 group-hover:bg-blue-600 group-hover:text-white text-blue-700 border border-blue-300 text-xs font-bold px-3.5 py-1.5 rounded-full transition shadow-sm">
                <span>View Scope</span>
                <span className="w-4 h-4 rounded-full bg-blue-600 text-white group-hover:bg-white group-hover:text-blue-600 flex items-center justify-center transition">
                  <ArrowRight className="w-3 h-3" />
                </span>
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* INTERACTIVE ROADWAY BRANDED TRUCK SELECTION TABLE */}
      <RoadwayTruckTable
        marketRates={MARKET_RATES}
        truckRowConfig={truckRowConfig}
        setTruckMode={setTruckMode}
        setTruckPct={setTruckPct}
        setAllTrucksMode={setAllTrucksMode}
        chooseTruckPlan={chooseTruckPlan}
      />
    </section>
  );

  const Pricing = () => (
    <section className="glass-panel rounded-3xl p-6 sm:p-10 lg:p-12 space-y-8">
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E6F0FF] text-[#0066FF] text-xs font-bold">
          <span>Select Flat Weekly Rate or Truck-Specific Flat Percentage (%) · Unlimited Loads</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0F172A]">Dispatch Pricing 2026</h2>
        <p className="text-sm text-[#475569]">Every truck can choose between a <strong className="text-[#0F172A]">Flat Weekly Rate</strong> ($500/wk Semis · $800/wk Box &amp; Hotshot) or a <strong className="text-[#0066FF]">Flat Percentage (%) tailored to your truck type</strong> (5%–9% depending on equipment). <strong className="text-[#0F172A]">Unlimited loads.</strong> No forced dispatch, no contracts.</p>
        <div className="inline-flex gap-2 p-1.5 rounded-full bg-[#E6F0FF]/90 border border-blue-200 flex-wrap">
          {['semi','box'].map(tab => (
            <button key={tab} onClick={() => setPricingTab(tab)} className={`px-5 py-2 rounded-full text-xs font-bold transition cursor-pointer ${pricingTab === tab ? 'bg-[#0066FF] text-white shadow-sm' : 'bg-white/80 text-[#0F172A]'}`}>
              {tab === 'semi' ? 'Semi Trucks ($500/wk or 5%–8%)' : 'Box Truck & Hotshot ($800/wk or 8%–9%)'}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[
          { tab:'semi', title:'Semi Truck Dispatch', sub:'Dry Van • Reefer • Flatbed • Step Deck • Power Only • Car Hauler • Heavy Haul • Drayage', flatPrice:500, badge:'Most Popular — All Semi Trucks ($11k–$18.5k/wk Gross)',
            baseFeatures:['Unlimited loads (Dry Van $11k–$13k, Reefer $14k–$15k avg gross)','No setup fee & no forced dispatch','No contract — cancel anytime','Same-day carrier onboarding','Aggressive rate negotiation (15–20% above market)','24/7 dispatch & broker credit checks','Paperwork, carrier packets & rate confirmations'] },
          { tab:'box', title:'Box Truck & Hotshot Dispatch', sub:'Box Truck • Hotshot (CDL & non-CDL) • Sprinter Van • Straight Truck', flatPrice:800, badge:'Expedited & Hotshot Desk ($4k–$8k/wk Gross)',
            baseFeatures:['Unlimited loads (Box Truck $4k–$7k, Hotshot $6k–$8k avg gross)','No setup fee & no forced dispatch','No contract — cancel anytime','Same-day carrier onboarding','LTL partial pairing & full-load negotiation','24/7 dispatch & broker credit vetting','Paperwork, carrier packets & rate confirmations'] }
        ].map(card => {
          const trucksForCard = MARKET_RATES.filter(r => r.category === card.tab);
          const selectedTruckName = cardTruckType[card.tab] || trucksForCard[0].type;
          const activeTruck = trucksForCard.find(r => r.type === selectedTruckName) || trucksForCard[0];
          const mode = cardPlanMode[card.tab] || 'flat';
          const activePct = truckRowConfig[activeTruck.type]?.pct ?? activeTruck.pct;
          const estPctWeekly = Math.round(activeTruck.gross * activePct / 100);
          const selectedWeeklyFee = mode === 'flat' ? card.flatPrice : estPctWeekly;
          const estNetTakeHome = activeTruck.gross - selectedWeeklyFee;

          return (
            <div key={card.tab} className={`glass-card rounded-3xl p-5 sm:p-7 border-2 flex flex-col justify-between transition ${pricingTab === card.tab ? 'border-[#0066FF] shadow-[0_16px_40px_rgba(0,102,255,0.12)]' : 'border-white opacity-95'}`}>
              <div className="space-y-4">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <span className="text-[11px] font-bold uppercase px-3 py-1 rounded-full bg-[#E6F0FF] text-[#0066FF]">{card.badge}</span>
                  <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">24/7 Live Dispatch</span>
                </div>
                <div>
                  <h3 className="text-2xl font-extrabold text-[#0F172A]">{card.title}</h3>
                  <p className="text-xs text-[#64748B] mt-1">{card.sub}</p>
                </div>

                {/* Step 1: Select Truck Type */}
                <div className="p-3.5 rounded-2xl bg-[#F8FBFF] border border-blue-100 space-y-2.5">
                  <div className="flex items-center justify-between gap-2">
                    <label className="text-[11px] font-extrabold uppercase tracking-wider text-[#0F172A]">1. Select Your Truck Equipment:</label>
                    <span className="text-[11px] font-bold text-[#0066FF]">Default Pct: {activeTruck.pct}%</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {trucksForCard.map(t => {
                      const isSel = t.type === activeTruck.type;
                      const tPct = truckRowConfig[t.type]?.pct ?? t.pct;
                      return (
                        <button
                          key={t.type}
                          type="button"
                          onClick={() => {
                            setPricingTab(card.tab);
                            setCardTruckType(prev => ({ ...prev, [card.tab]: t.type }));
                          }}
                          className={`px-2.5 py-1.5 rounded-xl text-[11px] font-bold transition cursor-pointer border ${
                            isSel
                              ? 'bg-[#0066FF] text-white border-[#0066FF] shadow-sm'
                              : 'bg-white text-[#334155] border-slate-200 hover:border-blue-300'
                          }`}
                        >
                          {t.type.replace(' (Semi)', '')} <span className={isSel ? 'text-blue-100' : 'text-[#0066FF]'}>({tPct}%)</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Step 2: Select Flat Weekly vs Flat Percentage */}
                  <div className="pt-1 space-y-2">
                    <label className="text-[11px] font-extrabold uppercase tracking-wider text-[#0F172A] block">2. Choose Plan for {activeTruck.type}:</label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setCardPlanMode(prev => ({ ...prev, [card.tab]: 'flat' }));
                          setTruckMode(activeTruck.type, 'flat');
                        }}
                        className={`py-2 px-3 rounded-xl text-xs font-extrabold border transition cursor-pointer flex flex-col items-center ${
                          mode === 'flat'
                            ? 'bg-[#0066FF] text-white border-[#0066FF] shadow-sm'
                            : 'bg-white text-[#0F172A] border-slate-200 hover:border-blue-300'
                        }`}
                      >
                        <span>Flat Weekly Rate</span>
                        <span className={`text-[11px] font-semibold ${mode === 'flat' ? 'text-blue-100' : 'text-[#0066FF]'}`}>${card.flatPrice}/week flat</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setCardPlanMode(prev => ({ ...prev, [card.tab]: 'pct' }));
                          setTruckMode(activeTruck.type, 'pct');
                        }}
                        className={`py-2 px-3 rounded-xl text-xs font-extrabold border transition cursor-pointer flex flex-col items-center ${
                          mode === 'pct'
                            ? 'bg-[#0066FF] text-white border-[#0066FF] shadow-sm'
                            : 'bg-white text-[#0F172A] border-slate-200 hover:border-blue-300'
                        }`}
                      >
                        <span>Flat Percentage (%)</span>
                        <span className={`text-[11px] font-semibold ${mode === 'pct' ? 'text-blue-100' : 'text-emerald-700'}`}>{activePct}% of load gross</span>
                      </button>
                    </div>

                    {/* Truck-Specific Flat Percentage Option Selector */}
                    {mode === 'pct' && (
                      <div className="flex items-center justify-between gap-2 pt-1 bg-white px-3 py-2 rounded-xl border border-blue-100">
                        <span className="text-[11px] font-bold text-[#475569]">Select {activeTruck.type.replace(' (Semi)', '')} Flat %:</span>
                        <div className="flex items-center gap-1">
                          {activeTruck.pctOptions.map(pOpt => (
                            <button
                              key={pOpt}
                              type="button"
                              onClick={() => setTruckPct(activeTruck.type, pOpt)}
                              className={`px-2.5 py-1 rounded-lg text-xs font-extrabold transition cursor-pointer ${
                                activePct === pOpt
                                  ? 'bg-[#0066FF] text-white'
                                  : 'bg-slate-100 text-[#0F172A] hover:bg-blue-50'
                              }`}
                            >
                              {pOpt}%
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Dynamic Price Display */}
                <div className="flex items-baseline justify-between flex-wrap gap-2 pt-2 border-t border-slate-100">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-4xl sm:text-5xl font-extrabold text-[#0066FF]">
                      {mode === 'flat' ? `$${card.flatPrice}` : `${activePct}%`}
                    </span>
                    <span className="text-sm font-bold text-[#475569]">
                      {mode === 'flat' ? '/ week flat' : `flat % (${activeTruck.type.replace(' (Semi)', '')})`}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="block text-[11px] font-bold text-emerald-700">
                      Est. Take-Home: ${estNetTakeHome.toLocaleString()}/wk
                    </span>
                    <span className="block text-[10px] text-[#64748B]">
                      Avg Gross ${activeTruck.gross.toLocaleString()}/wk · Fee: ${selectedWeeklyFee.toLocaleString()}/wk
                    </span>
                  </div>
                </div>

                <ul className="space-y-2 text-xs text-[#0F172A]">
                  <li className="flex items-center gap-2.5 font-bold text-[#0066FF]">
                    <Check className="w-4 h-4 text-[#0066FF] stroke-[2.5] shrink-0" />
                    <span>
                      Selected: {activeTruck.type} — {mode === 'flat' ? `Flat $${card.flatPrice}/wk` : `${activePct}% Flat Percentage`}
                    </span>
                  </li>
                  {card.baseFeatures.map(f => (
                    <li key={f} className="flex items-center gap-2.5">
                      <Check className="w-4 h-4 text-[#0066FF] stroke-[2.5] shrink-0" /><span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <button
                type="button"
                onClick={() => chooseTruckPlan(activeTruck.type, mode, activePct)}
                className="mt-6 w-full py-3.5 rounded-full bg-[#0066FF] hover:bg-[#0052CC] text-white font-bold text-sm shadow-[0_8px_20px_rgba(0,102,255,0.28)] flex items-center justify-center gap-2 transition cursor-pointer"
              >
                <span>Select Plan &amp; Start ({activeTruck.type.replace(' (Semi)', '')} · {mode === 'flat' ? `$${card.flatPrice}/wk` : `${activePct}%`})</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          );
        })}
      </div>

      {/* Calculator */}
      <div className="rounded-3xl overflow-hidden relative border border-blue-200 shadow-lg">
        <img src={VISUALS.compare} alt="Compare and Save" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/90 to-slate-900/40" />
        <div className="relative z-10 p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase text-[#0066FF]">The Math Doesn't Lie</span>
            <h3 className="text-2xl font-extrabold text-[#0F172A]">Compare Flat Weekly vs. Percentage by Truck</h3>
            <p className="text-sm font-semibold text-[#475569]">Compare your weekly take-home under our <strong className="text-[#0066FF]">Flat Weekly Rate ($500/$800)</strong> vs. <strong className="text-[#0F172A]">Truck-Specific Percentage (%)</strong>.</p>
          </div>
          <button onClick={() => setShowCalc(c => !c)} className="px-6 py-3 rounded-full bg-[#0066FF] text-white text-xs font-bold shadow-md flex items-center gap-2 transition self-start md:self-auto cursor-pointer">
            {showCalc ? 'Hide Calculator' : 'Open Calculator'} <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {showCalc && (
        <div className="space-y-6">
          <div className="bg-[#F0F7FF] rounded-3xl p-6 sm:p-8 border border-blue-200 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <h4 className="text-xl font-extrabold text-[#0F172A]">Weekly &amp; Annual Plan Comparison</h4>
                <span className="text-[11px] font-bold text-[#0066FF] bg-blue-100/80 px-2.5 py-1 rounded-full">Flat Rate vs. Percentage</span>
              </div>
              <div className="flex gap-2">
                {['semi','box'].map(p => (
                  <button key={p} onClick={() => setCalcPlan(p)} className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${calcPlan === p ? 'bg-[#0066FF] text-white' : 'bg-white text-slate-700'}`}>
                    {p === 'semi' ? 'Semi ($500/wk Flat)' : 'Box/Hotshot ($800/wk Flat)'}
                  </button>
                ))}
              </div>
              <div className="bg-white p-4 rounded-2xl border border-blue-100 space-y-2">
                <div className="flex justify-between text-xs font-bold">
                  <span>Weekly Gross Revenue:</span><span className="text-[#0066FF]">${calcGross.toLocaleString()}/wk</span>
                </div>
                <input type="range" min={4000} max={20000} step={500} value={calcGross} onChange={e => setCalcGross(Number(e.target.value))} className="w-full accent-[#0066FF]" />
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>$4,000/wk</span>
                  <span>$12,000/wk (Dry Van Avg)</span>
                  <span>$20,000/wk</span>
                </div>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-blue-100 space-y-2">
                <div className="flex justify-between text-xs font-bold">
                  <span>Selected Truck Percentage (%):</span><span className="text-rose-600">{calcPct}% per load</span>
                </div>
                <input type="range" min={4} max={12} step={1} value={calcPct} onChange={e => setCalcPct(Number(e.target.value))} className="w-full accent-rose-600" />
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>4% (Semi Fleet)</span>
                  <span>5%–6% (Standard Semi)</span>
                  <span>8%–9% (Box / Hotshot)</span>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-rose-200 space-y-2">
                <span className="text-[11px] font-bold text-rose-600 uppercase">{calcPct}% Flat Percentage</span>
                <p className="text-xs text-slate-500">Fee: -${savings.comm.toLocaleString()}/wk</p>
                <p className="text-2xl font-extrabold text-slate-800">Keep: ${savings.keepComm.toLocaleString()}</p>
              </div>
              <div className="bg-white p-5 rounded-2xl border-2 border-[#0066FF] space-y-2">
                <span className="text-[11px] font-bold text-[#0066FF] uppercase">Flat Weekly Rate</span>
                <p className="text-xs text-emerald-600 font-semibold">Fee: -${savings.flat}/wk</p>
                <p className="text-2xl font-extrabold text-[#0F172A]">Keep: ${savings.keepFlat.toLocaleString()}</p>
              </div>
              <div className="col-span-2 bg-[#0F172A] text-white p-5 rounded-2xl flex items-center justify-between">
                <div>
                  <p className="text-xs text-sky-400 font-bold uppercase">Annual Difference (52 Weeks)</p>
                  <p className="text-3xl font-extrabold text-emerald-400 mt-0.5">+${Math.max(0, savings.yearlySaved).toLocaleString()}/yr</p>
                </div>
                <span className="text-xs bg-white/10 px-3 py-1.5 rounded-full font-bold">+${Math.max(0, savings.weeklySaved).toLocaleString()}/wk</span>
              </div>
            </div>
          </div>

          {/* Interactive Fleet Table with Roadway Logo on Every Truck */}
          <RoadwayTruckTable
            marketRates={MARKET_RATES}
            truckRowConfig={truckRowConfig}
            setTruckMode={setTruckMode}
            setTruckPct={setTruckPct}
            setAllTrucksMode={setAllTrucksMode}
            chooseTruckPlan={chooseTruckPlan}
          />
        </div>
      )}
    </section>
  );

  const About = () => (
    <section className="glass-panel rounded-3xl p-6 sm:p-10 lg:p-12 space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <div className="lg:col-span-7 space-y-5">
          <span className="inline-block px-3 py-1 rounded-full bg-[#E6F0FF] text-[#0066FF] text-xs font-bold">Est. 2021 · Registered LLC · Gustine, CA</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0F172A]">About Roadway Logistics Group LLC</h2>
          <p className="text-sm text-[#475569] leading-relaxed">We are a <strong className="text-[#0F172A]">professional dispatch</strong> and trucking business services company built by industry experts for owner-operators and small fleets — providing reliable, transparent, and affordable solutions.</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-3">
            {COMPANY.stats.map(s => (
              <div key={s.label} className="bg-white/90 rounded-2xl p-4 border border-blue-100 shadow-sm text-center">
                <p className="text-3xl font-extrabold text-[#0F172A]">{s.value}</p>
                <p className="text-xs text-[#64748B] mt-1 font-medium">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="lg:col-span-5">
          <div className="relative rounded-3xl overflow-hidden border-2 border-white shadow-xl aspect-[4/3]">
            <img src={VISUALS.about} alt="Your Partner in Trucking Success" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A]/85 via-[#0F172A]/20 to-transparent" />
            <div className="absolute bottom-5 left-5 right-5 text-white">
              <p className="text-2xl font-extrabold">Your Partner in Trucking Success</p>
              <p className="text-xs text-slate-200 mt-1">{COMPANY.address}</p>
            </div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {[{title:'Our Values',desc:'Integrity, reliability, and long-term relationships with every carrier we serve.'},{title:'Our Mission',desc:'Help truckers succeed with transparent flat-rate pricing and 24/7 support.'},{title:'Our Vision',desc:'A stronger, more profitable independent trucking community across all 50 states.'}].map(item => (
          <div key={item.title} className="glass-card rounded-2xl p-5 flex items-start gap-3.5">
            <div className="w-9 h-9 rounded-xl bg-[#E6F0FF] text-[#0066FF] flex items-center justify-center shrink-0"><CheckCircle2 className="w-5 h-5" /></div>
            <div>
              <h4 className="font-bold text-sm text-[#0F172A]">{item.title}</h4>
              <p className="text-xs text-[#64748B] mt-1 leading-relaxed">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );

  const DriverJobs = () => (
    <section className="glass-panel rounded-3xl p-6 sm:p-10 lg:p-12 space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-2">
          <span className="inline-block px-3 py-1 rounded-full bg-[#E6F0FF] text-[#0066FF] text-xs font-bold">CDL-A, CDL-B & Non-CDL Positions</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0F172A]">Driver Jobs</h2>
          <p className="text-sm text-[#475569]">Find your next opportunity across <strong className="text-[#0F172A]">all 50 states</strong> with consistent loads and competitive pay.</p>
        </div>
        <button onClick={() => nav('hire-drivers')} className="px-4 py-2.5 rounded-full bg-white border border-blue-200 text-xs font-bold text-[#0066FF] hover:bg-blue-50 transition self-start">
          Fleet Owner? Hire Drivers ($500) →
        </button>
      </div>

      {/* Filter */}
      <div className="glass-card rounded-2xl p-4 flex flex-wrap gap-2 items-center">
        <span className="text-xs font-bold text-[#475569]">Filter by Equipment:</span>
        {['All','Dry Van','Reefer','Box Truck','Flatbed','Hotshot'].map(t => (
          <button key={t} onClick={() => setJobEquip(t)} className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition ${jobEquip === t ? 'bg-[#0066FF] text-white' : 'bg-white border border-blue-100 text-[#475569] hover:border-blue-300'}`}>{t}</button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {filteredJobs.map(job => (
          <div key={job.id} className="glass-card rounded-2xl p-6 flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-extrabold text-[#0F172A]">{job.title}</h3>
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#E6F0FF] text-[#0066FF]">{job.experience}</span>
              </div>
              <p className="text-xs font-semibold text-[#475569] flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5 text-[#0066FF]" />{job.equipment} · {job.location}
              </p>
              <div className="pt-1">
                <p className="text-xl font-extrabold text-[#0F172A]">{job.pay}</p>
                <p className="text-xs text-emerald-700 font-semibold">Est: {job.est}</p>
                <p className="text-xs text-[#64748B] mt-0.5">Home Time: {job.homeTime}</p>
              </div>
            </div>
            <button onClick={() => { applyF.setResult(null); setSelService({ _applyJob: job }); }} className="w-full py-2.5 rounded-full bg-[#0066FF] hover:bg-[#0052CC] text-white text-xs font-bold transition">
              Apply Now
            </button>
          </div>
        ))}
      </div>

      <div className="rounded-3xl overflow-hidden relative border border-blue-200 min-h-[180px] flex items-center">
        <img src={VISUALS.driver} alt="Ready to Drive" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0F172A]/90 via-[#0F172A]/70 to-transparent" />
        <div className="relative z-10 p-6 sm:p-8 text-white space-y-2 max-w-lg">
          <h3 className="text-2xl font-extrabold">Ready to Drive?</h3>
          <p className="text-sm text-slate-200">Get matched with top-paying fleets across the nation.</p>
          <button onClick={() => { applyF.setResult(null); setSelService({ _applyJob: DRIVER_JOBS[0] }); }} className="mt-2 px-6 py-2.5 rounded-full bg-[#0066FF] text-white text-xs font-bold inline-flex items-center gap-2 transition hover:bg-[#0052CC]">
            Apply Now <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </section>
  );

  const HireDrivers = () => (
    <section className="glass-panel rounded-3xl p-6 sm:p-10 lg:p-12 space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <div className="lg:col-span-7 space-y-4">
          <span className="inline-block px-3 py-1 rounded-full bg-[#E6F0FF] text-[#0066FF] text-xs font-bold">Done-For-You Driver Recruiting</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0F172A]">Need Drivers for Your Fleet?</h2>
          <p className="text-sm text-[#475569] leading-relaxed">Pre-qualified candidates in <strong className="text-[#0F172A]">2–3 business days</strong>. <strong className="text-[#0066FF]">$500 solo · $750 team</strong> — free replacement guarantee.</p>
        </div>
        <div className="lg:col-span-5 grid grid-cols-2 gap-3.5">
          <div className="glass-card p-5 rounded-2xl border-2 border-[#0066FF]">
            <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-[#E6F0FF] text-[#0066FF]">Best Value</span>
            <h4 className="font-extrabold text-base text-[#0F172A] mt-2">Solo Driver</h4>
            <p className="text-3xl font-extrabold text-[#0066FF] mt-1">$500</p>
            <p className="text-[11px] text-[#64748B]">per placement · Free replacement</p>
          </div>
          <div className="glass-card p-5 rounded-2xl">
            <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-slate-100 text-slate-700">Team</span>
            <h4 className="font-extrabold text-base text-[#0F172A] mt-2">Team Drivers</h4>
            <p className="text-3xl font-extrabold text-[#0F172A] mt-1">$750</p>
            <p className="text-[11px] text-[#64748B]">both drivers · Free replacement</p>
          </div>
        </div>
      </div>

      {/* State Tabs */}
      <div className="space-y-3">
        <h3 className="text-lg font-extrabold text-[#0F172A]">Hire By Region</h3>
        <div className="flex flex-wrap gap-1.5">
          {Object.keys(HIRE_STATES).map(reg => (
            <button key={reg} onClick={() => setHireRegion(reg)} className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition ${hireRegion === reg ? 'bg-[#0066FF] text-white' : 'bg-white text-[#475569] border border-blue-100'}`}>{reg}</button>
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          {HIRE_STATES[hireRegion].map(st => <span key={st} className="px-3.5 py-2 rounded-xl bg-white border border-blue-100 text-xs font-semibold text-[#0F172A] shadow-sm">{st}</span>)}
        </div>
      </div>

      {/* Hire Form */}
      <form onSubmit={submitHire} className="bg-[#F0F7FF] rounded-3xl p-6 sm:p-8 border border-blue-200 space-y-5">
        <div>
          <h3 className="text-xl font-extrabold text-[#0F172A]">Submit Driver Requirement <span className="text-sm font-medium text-[#64748B]">(Free — you pay $500 only when you hire)</span></h3>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-blue-100 grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { label:'Company Name *', field:'companyName', type:'text', ph:'Your Carrier LLC' },
            { label:'Contact Phone *', field:'phone', type:'tel', ph:'+1 (682) 000-0000' }
          ].map(f => (
            <div key={f.field}>
              <label className="text-xs font-bold text-[#475569] block mb-1">{f.label}</label>
              <input type={f.type} required value={hireF.values[f.field]} onChange={hireF.set(f.field)} placeholder={f.ph} className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#0066FF]" />
            </div>
          ))}
          <div>
            <label className="text-xs font-bold text-[#475569] block mb-1">Equipment & Driver Type</label>
            <select value={hireF.values.equipment} onChange={hireF.set('equipment')} className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs bg-white">
              {MARKET_RATES.map(r => <option key={r.type}>{r.type} Driver</option>)}
            </select>
          </div>
        </div>
        <ResultAlert result={hireF.result} />
        <div className="flex justify-end">
          <Btn loading={hireF.loading} type="submit" className="px-7 py-3 rounded-full bg-[#0066FF] hover:bg-[#0052CC] text-white text-xs font-bold shadow-md transition">
            {!hireF.loading && 'Submit Requirement (Free) →'}
          </Btn>
        </div>
      </form>
    </section>
  );

  const Contact = () => (
    <section className="glass-panel rounded-3xl p-6 sm:p-10 lg:p-12 space-y-8">
      <div className="space-y-2">
        <span className="inline-block px-3 py-1 rounded-full bg-[#E6F0FF] text-[#0066FF] text-xs font-bold">24/7 Dispatch & Onboarding Desk</span>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0F172A]">Contact Us</h2>
        <p className="text-sm text-[#475569]">Have questions? <strong className="text-[#0F172A]">We're here to help.</strong></p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-5 space-y-4">
          {[
            { href: COMPANY.phoneHref, icon: <Phone className="w-5 h-5" />, title:'Call Us', val: COMPANY.phone, sub:'Speak directly with our dispatch team' },
            { href: `mailto:${COMPANY.email}`, icon: <Mail className="w-5 h-5" />, title:'Email Us', val: COMPANY.email, sub:'Send us your questions anytime' }
          ].map(c => (
            <a key={c.href} href={c.href} className="glass-card rounded-2xl p-4 flex items-start gap-3.5 block">
              <div className="w-10 h-10 rounded-xl bg-[#E6F0FF] text-[#0066FF] flex items-center justify-center shrink-0">{c.icon}</div>
              <div>
                <h4 className="font-bold text-sm text-[#0F172A]">{c.title}</h4>
                <p className="text-xs sm:text-sm font-extrabold text-[#0066FF] mt-0.5">{c.val}</p>
                <p className="text-xs text-[#64748B]">{c.sub}</p>
              </div>
            </a>
          ))}
          <div className="glass-card rounded-2xl p-4 flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-[#E6F0FF] text-[#0066FF] flex items-center justify-center shrink-0"><Clock className="w-5 h-5" /></div>
            <div>
              <h4 className="font-bold text-sm text-[#0F172A]">24/7 Support</h4>
              <p className="text-xs text-[#64748B]">Available around the clock</p>
              <p className="text-xs font-extrabold text-emerald-600 mt-0.5">Always Open</p>
            </div>
          </div>
          <div className="glass-card rounded-2xl p-4 space-y-2">
            <p className="text-xs text-[#475569] flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-[#0066FF] shrink-0" />{COMPANY.address}
            </p>
            <div className="h-32 rounded-xl bg-gradient-to-br from-[#E6F0FF] via-sky-50 to-emerald-50 border border-blue-200 flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 opacity-25" style={{ backgroundImage:'linear-gradient(to right,#93C5FD 1px,transparent 1px),linear-gradient(to bottom,#93C5FD 1px,transparent 1px)', backgroundSize:'22px 22px' }} />
              <div className="relative z-10 flex flex-col items-center">
                <div className="w-9 h-9 rounded-full bg-[#0066FF] text-white flex items-center justify-center shadow-lg animate-bounce"><MapPin className="w-5 h-5" /></div>
                <span className="mt-1 px-2.5 py-0.5 rounded-full bg-white/95 text-[10px] font-bold text-[#0F172A] shadow">Gustine, CA Operations Desk</span>
              </div>
            </div>
          </div>
        </div>

        <form onSubmit={submitContact} className="lg:col-span-7 glass-card rounded-3xl p-6 sm:p-8 space-y-4">
          <h3 className="text-xl font-extrabold text-[#0F172A]">Send Us a Message</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { label:'Full Name *', field:'fullName', type:'text', ph:'Your full name', req: true },
              { label:'Email Address *', field:'email', type:'email', ph:'you@company.com', req: true },
              { label:'Phone Number *', field:'phone', type:'tel', ph:'(209) 202-3080', req: true },
              { label:'MC Number (Optional)', field:'mcNumber', type:'text', ph:'MC-#######', req: false }
            ].map(f => (
              <div key={f.field}>
                <label className="text-xs font-bold text-[#475569] block mb-1">{f.label}</label>
                <input type={f.type} required={f.req} value={contactF.values[f.field]} onChange={contactF.set(f.field)} placeholder={f.ph} className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-xs focus:outline-none focus:border-[#0066FF]" />
              </div>
            ))}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-[#475569] block mb-1">Equipment Type</label>
              <select value={contactF.values.equipmentType} onChange={contactF.set('equipmentType')} className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-xs">
                {['Dry Van','Reefer','Flatbed','Step Deck','Power Only','Box Truck','Hotshot','RGN / Other'].map(o => <option key={o}>{o}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-[#475569] block mb-1">Reason for Contact *</label>
              <select value={contactF.values.reason} onChange={contactF.set('reason')} className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-xs">
                {['Dispatch for my truck(s)','MC authority / compliance help','Factoring','Website design ($274)','Hiring drivers','I\'m a driver looking for work','Partnership inquiry'].map(o => <option key={o}>{o}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="text-xs font-bold text-[#475569] block mb-1">Message *</label>
            <textarea rows={4} required value={contactF.values.message} onChange={contactF.set('message')} placeholder="Tell us about your truck(s), preferred lanes, or questions..." className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-xs focus:outline-none focus:border-[#0066FF]" />
          </div>
          <ResultAlert result={contactF.result} />
          <Btn loading={contactF.loading} type="submit" className="w-full py-3.5 rounded-full bg-[#0066FF] hover:bg-[#0052CC] text-white font-bold text-sm shadow-[0_8px_20px_rgba(0,102,255,0.28)] transition">
            {!contactF.loading && <><span>Send Message</span><ArrowRight className="w-4 h-4" /></>}
          </Btn>
        </form>
      </div>
    </section>
  );

  const Resources = () => (
    <section className="glass-panel rounded-3xl p-6 sm:p-10 lg:p-12 space-y-8">
      <div className="space-y-2">
        <span className="inline-block px-3 py-1 rounded-full bg-[#E6F0FF] text-[#0066FF] text-xs font-bold">No Paywalls · Built by Dispatchers</span>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0F172A]">Resources</h2>
        <p className="text-sm text-[#475569]">Free guides, calculators, and knowledge to help you succeed in trucking.</p>
      </div>

      {/* Glossary Pills */}
      <div className="space-y-3">
        <h3 className="text-lg font-extrabold text-[#0F172A]">Trucking Glossary</h3>
        <div className="flex flex-wrap gap-2">
          {GLOSSARY.map(item => (
            <button key={item.id} onClick={() => setSelTerm(item)} className="px-3.5 py-2 rounded-full bg-white hover:bg-[#E6F0FF] border border-blue-100 text-xs font-semibold text-[#0F172A] shadow-sm flex items-center gap-1.5 transition">
              <span className="w-2 h-2 rounded-full bg-[#0066FF]" />{item.term}
            </button>
          ))}
        </div>
      </div>

      {/* Free Tools */}
      <div className="bg-[#F0F7FF] rounded-3xl p-6 border border-blue-200 space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h4 className="text-lg font-extrabold text-[#0F172A]">Free Trucking Tools — No Signup</h4>
          <div className="flex gap-2 flex-wrap">
            {[['ifta','IFTA MPG'],['rpm','Load RPM'],['dot','DOT Lookup']].map(([id, label]) => (
              <button key={id} onClick={() => setResourceTool(id)} className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition ${resourceTool === id ? 'bg-[#0066FF] text-white' : 'bg-white text-[#475569]'}`}>{label}</button>
            ))}
          </div>
        </div>

        {resourceTool === 'ifta' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-white p-5 rounded-2xl border border-blue-100">
            <div>
              <label className="text-xs font-bold text-[#475569] block mb-1">Quarterly Miles Driven</label>
              <input type="number" value={iftaMiles} onChange={e => setIftaMiles(Number(e.target.value))} className="w-full px-3 py-2 rounded-xl border border-slate-200 font-bold text-sm" />
            </div>
            <div>
              <label className="text-xs font-bold text-[#475569] block mb-1">Fuel Gallons Purchased</label>
              <input type="number" value={iftaGallons} onChange={e => setIftaGallons(Number(e.target.value))} className="w-full px-3 py-2 rounded-xl border border-slate-200 font-bold text-sm" />
            </div>
            <div className="p-4 rounded-xl bg-[#E6F0FF]">
              <p className="text-xs text-[#0066FF] font-bold">Fleet IFTA MPG:</p>
              <p className="text-3xl font-extrabold text-[#0F172A]">{iftaGallons > 0 ? (iftaMiles / iftaGallons).toFixed(2) : '0.00'}</p>
            </div>
          </div>
        )}

        {resourceTool === 'rpm' && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-white p-5 rounded-2xl border border-blue-100">
            {[['Loaded Miles', rpmMiles, setRpmMiles],['Deadhead Miles', rpmDH, setRpmDH],['Load Rate ($)', rpmPay, setRpmPay]].map(([label, val, setter]) => (
              <div key={label}>
                <label className="text-xs font-bold text-[#475569] block mb-1">{label}</label>
                <input type="number" value={val} onChange={e => setter(Number(e.target.value))} className="w-full px-3 py-2 rounded-xl border border-slate-200 font-bold text-sm" />
              </div>
            ))}
            <div className="p-4 rounded-xl bg-[#E6F0FF] flex flex-col justify-center">
              <p className="text-xs text-[#0066FF] font-bold">True Rate/Mile:</p>
              <p className="text-3xl font-extrabold text-[#0F172A]">${rpmMiles + rpmDH > 0 ? (rpmPay / (rpmMiles + rpmDH)).toFixed(2) : '0.00'}</p>
            </div>
          </div>
        )}

        {resourceTool === 'dot' && (
          <div className="bg-white p-5 rounded-2xl border border-blue-100 space-y-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <input type="text" value={dotQuery} onChange={e => setDotQuery(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleDotLookup()} placeholder="Enter USDOT or MC Number (e.g. MC-1492810)" className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold" />
              <Btn loading={dotLoading} onClick={handleDotLookup} className="px-6 py-2.5 rounded-full bg-[#0066FF] text-white text-xs font-bold shrink-0">
                {!dotLoading && 'Look Up Carrier'}
              </Btn>
            </div>
            {dotResult && (
              <div className={`p-4 rounded-xl text-xs ${dotResult.success ? 'bg-emerald-50 border border-emerald-200' : 'bg-rose-50 border border-rose-200'}`}>
                {dotResult.success ? (
                  <div className="grid grid-cols-2 gap-2">
                    {Object.entries(dotResult.data).filter(([k]) => k !== 'note').map(([k, v]) => (
                      <div key={k}><span className="font-bold text-[#475569] capitalize">{k.replace(/([A-Z])/g,' $1')}: </span><span className="text-[#0F172A] font-semibold">{String(v)}</span></div>
                    ))}
                    {dotResult.data.note && <div className="col-span-2 text-amber-700 mt-1">⚠ {dotResult.data.note}</div>}
                  </div>
                ) : <span className="text-rose-700">{dotResult.error}</span>}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="rounded-3xl overflow-hidden relative border border-blue-200 min-h-[180px] flex items-center">
        <img src={VISUALS.desk} alt="Learn Grow Succeed" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/90 to-white/40" />
        <div className="relative z-10 p-6 sm:p-8 space-y-2 max-w-lg">
          <h3 className="text-2xl font-extrabold text-[#0F172A]">Learn. Grow. Succeed.</h3>
          <p className="text-sm text-[#475569]">Trusted resources built from 5+ years of real dispatch desk experience.</p>
          <button onClick={() => setSelTerm(GLOSSARY[0])} className="mt-2 px-6 py-2.5 rounded-full bg-[#0066FF] text-white text-xs font-bold inline-flex items-center gap-2 transition hover:bg-[#0052CC]">
            Browse Glossary <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </section>
  );

  // ─── GET STARTED PAGE (full form) ─────────────────────────────────────────
  const GetStarted = () => {
    const selectedTruckObj = MARKET_RATES.find(r => r.type === startTruck) || MARKET_RATES[0];
    const activePct = truckRowConfig[selectedTruckObj.type]?.pct ?? selectedTruckObj.pct;
    const dispatchOptionLabels = MARKET_RATES.flatMap(r => [
      `${r.type} — Flat Rate ($${r.flatFee}/wk)`,
      `${r.type} — Flat Percentage (${truckRowConfig[r.type]?.pct ?? r.pct}% per load)`
    ]);
    const otherServices = [
      'MC Authority Setup — $250 one-time',
      'Factoring Assistance — $120 one-time',
      'Driver Hiring — $500 per placement',
      'Compliance / Accounting / Logbook'
    ];

    return (
      <section className="glass-panel rounded-3xl p-5 sm:p-10 lg:p-12 space-y-6 sm:space-y-8 max-w-2xl mx-auto">
        <div className="space-y-2">
          <span className="inline-block px-3 py-1 rounded-full bg-[#E6F0FF] text-[#0066FF] text-xs font-bold">Same-Day Onboarding · No Setup Fee · No Contract</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0F172A]">Get Started</h2>
          <p className="text-sm text-[#475569]">Select your truck type below and choose either its <strong className="text-[#0F172A]">Flat Weekly Rate ($500/$800/wk)</strong> or its <strong className="text-[#0066FF]">Truck-Specific Flat Percentage ({selectedTruckObj.pct}%)</strong>. Our dispatch team will call you right away to complete onboarding.</p>
        </div>

        {/* Interactive Truck & Flat vs Percentage Picker */}
        <div className="p-4 sm:p-5 rounded-2xl bg-[#F8FBFF] border border-blue-200 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-[#0F172A] block mb-1.5">1. Select Your Truck Type *</label>
              <select
                value={selectedTruckObj.type}
                onChange={e => {
                  const newTruck = MARKET_RATES.find(r => r.type === e.target.value) || MARKET_RATES[0];
                  const pctForNew = truckRowConfig[newTruck.type]?.pct ?? newTruck.pct;
                  setStartTruck(newTruck.type);
                  const newLabel = startBilling === 'flat'
                    ? `${newTruck.type} — Flat Rate ($${newTruck.flatFee}/wk)`
                    : `${newTruck.type} — Flat Percentage (${pctForNew}% per load)`;
                  startF.setValue('serviceType', newLabel);
                }}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-xs font-bold text-[#0F172A] focus:outline-none focus:border-[#0066FF]"
              >
                {MARKET_RATES.map(r => (
                  <option key={r.type} value={r.type}>
                    {r.type} — Flat ${r.flatFee}/wk or {r.pct}% Pct
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-[#0F172A] block mb-1.5">2. Choose Flat Rate or Percentage *</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setStartBilling('flat');
                    setTruckMode(selectedTruckObj.type, 'flat');
                    startF.setValue('serviceType', `${selectedTruckObj.type} — Flat Rate ($${selectedTruckObj.flatFee}/wk)`);
                  }}
                  className={`py-2 px-3 rounded-xl text-xs font-extrabold border transition cursor-pointer ${
                    startBilling === 'flat'
                      ? 'bg-[#0066FF] text-white border-[#0066FF]'
                      : 'bg-white text-[#0F172A] border-slate-200 hover:border-blue-300'
                  }`}
                >
                  Flat (${selectedTruckObj.flatFee}/wk)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setStartBilling('pct');
                    setTruckMode(selectedTruckObj.type, 'pct');
                    startF.setValue('serviceType', `${selectedTruckObj.type} — Flat Percentage (${activePct}% per load)`);
                  }}
                  className={`py-2 px-3 rounded-xl text-xs font-extrabold border transition cursor-pointer ${
                    startBilling === 'pct'
                      ? 'bg-emerald-600 text-white border-emerald-600'
                      : 'bg-white text-[#0F172A] border-slate-200 hover:border-blue-300'
                  }`}
                >
                  Percentage ({activePct}%)
                </button>
              </div>
            </div>
          </div>

          {startBilling === 'pct' && (
            <div className="flex items-center justify-between flex-wrap gap-2 pt-2 border-t border-blue-100">
              <span className="text-xs font-bold text-[#475569]">Select Flat Percentage for {selectedTruckObj.type}:</span>
              <div className="flex items-center gap-1.5">
                {selectedTruckObj.pctOptions.map(pOpt => (
                  <button
                    key={pOpt}
                    type="button"
                    onClick={() => {
                      setTruckPct(selectedTruckObj.type, pOpt);
                      startF.setValue('serviceType', `${selectedTruckObj.type} — Flat Percentage (${pOpt}% per load)`);
                    }}
                    className={`px-3 py-1 rounded-lg text-xs font-extrabold transition cursor-pointer ${
                      activePct === pOpt
                        ? 'bg-[#0066FF] text-white'
                        : 'bg-white text-[#0F172A] border border-slate-200 hover:border-blue-300'
                    }`}
                  >
                    {pOpt}%
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <form onSubmit={submitGetStarted} className="space-y-4">
          {[
            { label:'Full Name *', field:'fullName', type:'text', ph:'Your full name', req: true },
            { label:'Phone Number *', field:'phone', type:'tel', ph:'(209) 202-3080', req: true },
            { label:'MC or USDOT # (Optional)', field:'mcNumber', type:'text', ph:'MC-#######', req: false }
          ].map(f => (
            <div key={f.field}>
              <label className="text-xs font-bold text-[#475569] block mb-1">{f.label}</label>
              <input type={f.type} required={f.req} value={startF.values[f.field]} onChange={startF.set(f.field)} placeholder={f.ph} className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-sm focus:outline-none focus:border-[#0066FF]" />
            </div>
          ))}
          <div>
            <label className="text-xs font-bold text-[#475569] block mb-1">Selected Plan / Service *</label>
            <select value={startF.values.serviceType} onChange={startF.set('serviceType')} className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-sm font-semibold text-[#0F172A]">
              {[...dispatchOptionLabels, ...otherServices].map(o => <option key={o} value={o}>{o}</option>)}
            </select>
          </div>
          <ResultAlert result={startF.result} />
          <Btn loading={startF.loading} type="submit" className="w-full py-4 rounded-full bg-[#0066FF] hover:bg-[#0052CC] text-white font-bold text-sm shadow-[0_8px_20px_rgba(0,102,255,0.28)] transition cursor-pointer">
            {!startF.loading && 'Start Dispatch Service →'}
          </Btn>
          <p className="text-center text-xs text-[#64748B]">
            Prefer to call? <a href={COMPANY.phoneHref} className="text-[#0066FF] font-bold">{COMPANY.phone}</a>
          </p>
        </form>
      </section>
    );
  };

  // ─── WEBSITE PAGE ─────────────────────────────────────────────────────────
  const Website = () => (
    <section className="glass-panel rounded-3xl p-6 sm:p-10 lg:p-12 space-y-8 max-w-2xl mx-auto">
      <div className="space-y-2">
        <span className="inline-block px-3 py-1 rounded-full bg-[#E6F0FF] text-[#0066FF] text-xs font-bold">$274 One-Time · 1st Year Hosting Included</span>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0F172A]">Professional Website Design</h2>
        <p className="text-sm text-[#475569]">Custom, mobile-responsive websites for any business — trucking, construction, restaurants, healthcare, and more.</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {['Mobile & Desktop Responsive','SEO Optimized Pages','Contact Form & Google Maps','Google Analytics Included','1st Year Hosting Free','Delivered in 5–7 Business Days'].map(f => (
          <div key={f} className="flex items-center gap-2.5 text-sm"><Check className="w-4 h-4 text-[#0066FF] stroke-[2.5] shrink-0" /><span>{f}</span></div>
        ))}
      </div>
      <form onSubmit={submitWebsite} className="space-y-4">
        {[
          { label:'Business / Company Name *', field:'businessName', type:'text', ph:'Your Company LLC', req: true },
          { label:'Phone Number *', field:'phone', type:'tel', ph:'(209) 202-3080', req: true }
        ].map(f => (
          <div key={f.field}>
            <label className="text-xs font-bold text-[#475569] block mb-1">{f.label}</label>
            <input type={f.type} required={f.req} value={websiteF.values[f.field]} onChange={websiteF.set(f.field)} placeholder={f.ph} className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-sm focus:outline-none focus:border-[#0066FF]" />
          </div>
        ))}
        <ResultAlert result={websiteF.result} />
        <Btn loading={websiteF.loading} type="submit" className="w-full py-4 rounded-full bg-[#0066FF] hover:bg-[#0052CC] text-white font-bold text-sm shadow-[0_8px_20px_rgba(0,102,255,0.28)] transition">
          {!websiteF.loading && 'Request My $274 Website →'}
        </Btn>
      </form>
    </section>
  );

  // ─── ADMIN DASHBOARD ──────────────────────────────────────────────────────
  const Admin = () => (
    <section className="glass-panel rounded-3xl p-6 sm:p-10 lg:p-12 space-y-8">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="space-y-1">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 text-white text-xs font-bold"><Database className="w-3.5 h-3.5" /> Admin Dashboard</span>
          <h2 className="text-3xl font-extrabold text-[#0F172A]">Submissions & Stats</h2>
          <p className="text-xs text-[#64748B]">All form submissions stored in <code className="bg-slate-100 px-1 rounded">rlg-backend/data/rlg-db.json</code></p>
        </div>
        <button onClick={loadAdmin} disabled={adminLoading} className="px-5 py-2.5 rounded-full bg-[#0066FF] text-white text-xs font-bold flex items-center gap-2 transition hover:bg-[#0052CC] disabled:opacity-60">
          {adminLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
          {adminLoading ? 'Loading…' : 'Load Data'}
        </button>
      </div>

      {!adminData && !adminLoading && (
        <div className="text-center py-12 text-[#64748B]">
          <Database className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p className="font-medium">Click "Load Data" to fetch live submissions from the backend</p>
        </div>
      )}

      {adminData && (
        <>
          {/* Stats Cards */}
          {adminData.stats && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { label:'Total Submissions', val: adminData.stats.total, color:'text-[#0066FF]' },
                { label:'Today', val: adminData.stats.today, color:'text-emerald-600' },
                { label:'This Week', val: adminData.stats.thisWeek, color:'text-amber-600' },
                { label:'Form Types', val: adminData.stats.byType?.length || 0, color:'text-purple-600' }
              ].map(s => (
                <div key={s.label} className="glass-card rounded-2xl p-5 text-center">
                  <p className={`text-4xl font-extrabold ${s.color}`}>{s.val}</p>
                  <p className="text-xs text-[#64748B] mt-1 font-medium">{s.label}</p>
                </div>
              ))}
            </div>
          )}

          {/* By Type breakdown */}
          {adminData.stats?.byType?.length > 0 && (
            <div className="glass-card rounded-2xl p-5 space-y-3">
              <h4 className="font-bold text-sm text-[#0F172A] flex items-center gap-2"><BarChart3 className="w-4 h-4 text-[#0066FF]" /> Submissions by Type</h4>
              <div className="space-y-2">
                {adminData.stats.byType.map(({ type, count }) => {
                  const pct = adminData.stats.total > 0 ? Math.round(count / adminData.stats.total * 100) : 0;
                  return (
                    <div key={type} className="flex items-center gap-3">
                      <span className="text-xs font-bold text-[#0F172A] w-32 shrink-0 capitalize">{type}</span>
                      <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-[#0066FF] rounded-full transition-all" style={{ width: `${pct}%` }} />
                      </div>
                      <span className="text-xs text-[#64748B] font-semibold w-12 text-right">{count} ({pct}%)</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Recent Submissions Table */}
          {adminData.submissions?.length > 0 ? (
            <div className="bg-white rounded-2xl border border-blue-100 overflow-hidden shadow-sm">
              <div className="p-4 bg-[#F8FBFF] border-b border-blue-100">
                <h4 className="font-extrabold text-sm text-[#0F172A]">Recent Submissions (last 20)</h4>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead><tr className="border-b border-slate-200 text-[#64748B] bg-slate-50/70">
                    <th className="py-3 px-4 font-bold">Type</th>
                    <th className="py-3 px-4 font-bold">Name / Company</th>
                    <th className="py-3 px-4 font-bold">Phone</th>
                    <th className="py-3 px-4 font-bold">Email</th>
                    <th className="py-3 px-4 font-bold">Details</th>
                    <th className="py-3 px-4 font-bold">Submitted</th>
                  </tr></thead>
                  <tbody className="divide-y divide-slate-100">
                    {adminData.submissions.map(sub => {
                      const d = sub.data || {};
                      const name  = d.fullName || d.companyName || d.businessName || d.driverName || '—';
                      const phone = d.phone || '—';
                      const email = d.email || '—';
                      const detail = d.serviceType || d.equipment || d.reason || d.jobTitle || '—';
                      return (
                        <tr key={sub.id} className="hover:bg-blue-50/40">
                          <td className="py-3 px-4">
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#E6F0FF] text-[#0066FF] capitalize">{sub.type}</span>
                          </td>
                          <td className="py-3 px-4 font-semibold text-[#0F172A]">{name}</td>
                          <td className="py-3 px-4 text-[#0066FF]"><a href={`tel:${phone}`}>{phone}</a></td>
                          <td className="py-3 px-4 text-[#475569]">{email}</td>
                          <td className="py-3 px-4 text-[#64748B]">{String(detail).slice(0,40)}</td>
                          <td className="py-3 px-4 text-[#64748B]">{new Date(sub.created_at).toLocaleString()}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="text-center py-10 text-[#64748B]">
              <p className="font-medium">No submissions yet. Fill out a form to see data appear here!</p>
            </div>
          )}
        </>
      )}
    </section>
  );

  // ════════════════════════════════════════════════════════════════════════════
  // LAYOUT
  // ════════════════════════════════════════════════════════════════════════════
  const NAV_ITEMS = [
    { id:'home',         label:'Home' },
    { id:'dispatch',     label:'Dispatch' },
    { id:'services',     label:'Services' },
    { id:'pricing',      label:'Pricing' },
    { id:'about',        label:'About' },
    { id:'driver-jobs',  label:'Driver Jobs' },
    { id:'hire-drivers', label:'Hire Drivers' },
    { id:'resources',    label:'Resources' },
    { id:'contact',      label:'Contact' },
    { id:'admin',        label:'⚙ Admin' }
  ];

  const VIDEO_SRC = 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260423_084718_72a17915-4964-4059-afcd-22d59399b72e.mp4';

  const RwVideoHero = () => (
    <section className="rw-hero">
      {/* Background Video */}
      <video
        className="rw-hero-video"
        src={VIDEO_SRC}
        autoPlay
        loop
        muted
        playsInline
      />

      {/* Ambient Roadway Logo Watermark */}
      <div className="rw-hero-logo-bg" aria-hidden="true" />

      {/* Foreground Content */}
      <div className="rw-hero-content">
        <h1>ROADWAY LOGISTICS GROUP LLC</h1>
        <p>Nationwide Dispatch &amp; Integrated Freight Solutions</p>
      </div>
    </section>
  );

  return (
    <div className="min-h-screen liquid-glass-bg text-[#0F172A] font-sans selection:bg-[#0066FF] selection:text-white relative w-full max-w-full" style={{ overflowX: 'clip' }}>
      {/* Full-Website Fixed Background Video + Ambient Roadway Logo Watermark */}
      <div className="rw-site-bg" aria-hidden="true">
        <video
          className="rw-hero-video"
          src={VIDEO_SRC}
          autoPlay
          loop
          muted
          playsInline
        />
        <div className="rw-hero-logo-bg" aria-hidden="true" />
      </div>

      {/* Floating Fluid Ambient Orbs for Liquid Glass Refraction */}
      <div className="fixed top-[-10%] left-[-8%] w-[55vw] h-[55vw] rounded-full bg-gradient-to-tr from-[#0066FF]/14 via-[#38BDF8]/12 to-transparent blur-[120px] pointer-events-none animate-pulse-slow z-0" />
      <div className="fixed bottom-[-15%] right-[-10%] w-[65vw] h-[65vw] rounded-full bg-gradient-to-bl from-[#0052CC]/12 via-[#60A5FA]/14 to-transparent blur-[140px] pointer-events-none animate-pulse-slow-reverse z-0" />
      <div className="fixed top-[45%] right-[10%] w-[42vw] h-[42vw] rounded-full bg-gradient-to-br from-[#0066FF]/08 via-[#93C5FD]/10 to-transparent blur-[110px] pointer-events-none animate-pulse-slow z-0" />
      <div className="fixed top-[70%] left-[5%] w-[35vw] h-[35vw] rounded-full bg-gradient-to-tr from-[#38BDF8]/10 via-[#0066FF]/08 to-transparent blur-[100px] pointer-events-none animate-pulse-slow-reverse z-0" />

      {/* NAV */}
      <header className="sticky top-0 z-40 bg-white/75 backdrop-blur-3xl border-b border-white/85 shadow-[0_6px_30px_rgba(0,102,255,0.06),inset_0_1px_1px_rgba(255,255,255,0.9)] transition-all">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <button onClick={() => nav('home')} className="flex items-center gap-3 group cursor-pointer border-0 outline-none bg-transparent p-0 shadow-none">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl overflow-hidden bg-[#0A0E17] shadow-[0_8px_20px_rgba(0,102,255,0.32)] border border-blue-200/80 group-hover:scale-105 transition-transform shrink-0 flex items-center justify-center p-1">
                <img src="/rlg-logo.jpg" alt="Roadway Logistics Group LLC Logo" className="w-full h-full object-contain rounded-xl" />
              </div>
              <div className="leading-tight text-left">
                <span className="block font-extrabold text-sm sm:text-base text-[#0F172A] group-hover:text-[#0066FF] transition">Roadway Logistics</span>
                <span className="block font-bold text-xs text-[#0066FF]/80">Group LLC</span>
              </div>
            </button>

            <nav className="hidden lg:flex items-center gap-1.5 bg-white/60 backdrop-blur-xl border border-white/80 p-1.5 rounded-full shadow-[inset_0_1px_1px_rgba(255,255,255,0.8),0_4px_16px_rgba(0,102,255,0.04)]">
              {NAV_ITEMS.map(item => (
                <button
                  key={item.id}
                  onClick={() => nav(item.id)}
                  className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                    page === item.id
                      ? 'bg-gradient-to-r from-[#0066FF] to-[#0052CC] text-white shadow-[0_6px_18px_rgba(0,102,255,0.35),inset_0_1px_1px_rgba(255,255,255,0.4)]'
                      : 'text-[#334155] hover:text-[#0066FF] hover:bg-white/80'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </nav>

            <div className="hidden md:flex items-center gap-2.5">
              <a href={COMPANY.phoneHref} className="px-4 py-2.5 rounded-full text-xs font-bold liquid-btn-secondary flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-[#0066FF]" />Call
              </a>
              <button onClick={() => nav('get-started')} className="px-5 py-2.5 rounded-full text-xs font-bold liquid-btn-primary flex items-center gap-1.5 cursor-pointer">
                Get Started
              </button>
            </div>

            <div className="flex lg:hidden items-center gap-2">
              <button onClick={() => nav('get-started')} className="px-4 py-2 rounded-full text-xs font-bold liquid-btn-primary">Get Started</button>
              <button onClick={() => setMobileOpen(o => !o)} className="p-2 rounded-2xl bg-white/80 backdrop-blur-lg border border-white shadow-sm text-[#0F172A] border-0 outline-none hover:bg-white transition cursor-pointer">
                {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
        {mobileOpen && (
          <div className="lg:hidden bg-white/95 backdrop-blur-2xl border-b border-white px-4 py-4 shadow-xl space-y-3">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {NAV_ITEMS.map(item => (
                <button
                  key={item.id}
                  onClick={() => nav(item.id)}
                  className={`px-3.5 py-2.5 rounded-xl text-xs font-bold text-left transition ${
                    page === item.id
                      ? 'bg-[#0066FF] text-white shadow-md'
                      : 'bg-white/90 text-[#0F172A] border border-blue-100 hover:border-blue-300'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200/80">
              <a
                href={COMPANY.phoneHref}
                className="py-2.5 px-4 rounded-xl bg-[#E6F0FF] text-[#0066FF] font-extrabold text-xs flex items-center justify-center gap-1.5"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>{COMPANY.phone}</span>
              </a>
              <button
                onClick={() => nav('get-started')}
                className="py-2.5 px-4 rounded-xl bg-[#0066FF] text-white font-extrabold text-xs flex items-center justify-center gap-1.5"
              >
                <span>Get Started Now</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </header>

      {/* MAIN */}
      <main className="max-w-[1440px] mx-auto px-3 sm:px-6 lg:px-8 py-5 sm:py-8 space-y-8 sm:space-y-12 relative z-10">
        {page === 'home' && (
          <div className="space-y-8 sm:space-y-12">
            <RwVideoHero />
            <Hero />
            <RwDispatchHero />
            <Services />
            <Pricing />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 items-start"><About /><DriverJobs /></div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 items-start"><Contact /><Resources /></div>
          </div>
        )}
        {page === 'dispatch' && (
          <div className="space-y-8 sm:space-y-10">
            <RwVideoHero />
            <Hero />
            <RwDispatchHero />
            <Pricing />
          </div>
        )}
        {page === 'services'     && <Services />}
        {page === 'pricing'      && <Pricing />}
        {page === 'about'        && <About />}
        {page === 'driver-jobs'  && <DriverJobs />}
        {page === 'hire-drivers' && <div className="space-y-8 sm:space-y-10"><HireDrivers /><DriverJobs /></div>}
        {page === 'resources'    && <Resources />}
        {page === 'contact'      && <Contact />}
        {page === 'get-started'  && <GetStarted />}
        {page === 'website'      && <Website />}
        {page === 'admin'        && <Admin />}

        {/* Global CTA Banner */}
        <section className="rounded-3xl overflow-hidden relative border-2 border-white shadow-[0_20px_50px_rgba(15,23,42,0.12)] min-h-[240px] sm:min-h-[260px] flex items-center justify-center text-center">
          <img src={VISUALS.highway} alt="Ready to Grow" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-white/85 via-white/65 to-[#0F172A]/75" />
          <div className="relative z-10 max-w-2xl mx-auto px-5 sm:px-6 py-10 sm:py-12 space-y-4">
            <h2 className="text-2xl sm:text-4xl font-extrabold text-[#0F172A]">Ready to Grow Your Trucking Business?</h2>
            <p className="text-xs sm:text-sm font-medium text-[#1E293B]">Choose Flat Weekly Rate ($500/wk Semis · $800/wk Box &amp; Hotshot) or Truck-Specific Flat Percentage (5%–9%). Start hauling higher-paying loads today.</p>
            <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 pt-2">
              <a href={COMPANY.phoneHref} className="px-6 sm:px-7 py-3.5 rounded-full bg-[#0066FF] text-white font-bold text-xs sm:text-sm shadow-[0_8px_24px_rgba(0,102,255,0.35)] flex items-center gap-2 transition hover:bg-[#0052CC]">
                <Phone className="w-4 h-4" />{COMPANY.phone}
              </a>
              <button onClick={() => nav('get-started')} className="px-6 sm:px-7 py-3.5 rounded-full bg-[#0F172A]/90 text-white font-bold text-xs sm:text-sm shadow-lg flex items-center gap-2 transition hover:bg-[#0F172A] cursor-pointer">
                Get Started Now <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="bg-white/60 backdrop-blur-lg border-t border-white/70 mt-10 sm:mt-12 pt-12 sm:pt-14 pb-24 sm:pb-10 relative z-10">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 text-xs text-[#475569]">
            <div className="lg:col-span-2 space-y-3.5">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl overflow-hidden bg-[#0A0E17] border border-blue-200 shadow-md shrink-0 flex items-center justify-center p-1">
                  <img src="/rlg-logo.jpg" alt="Roadway Logistics Group LLC Logo" className="w-full h-full object-contain rounded-xl" />
                </div>
                <div><span className="block font-extrabold text-base text-[#0F172A]">Roadway Logistics</span><span className="block font-bold text-xs text-[#475569]">Group LLC</span></div>
              </div>
              <p className="text-xs leading-relaxed max-w-sm">Professional Dispatch & Trucking Business Services. 5+ years experience, 80+ carriers served.</p>
              <div className="space-y-1.5 text-xs font-medium text-[#0F172A]">
                <a href={COMPANY.phoneHref} className="flex items-center gap-2 hover:text-[#0066FF]"><Phone className="w-3.5 h-3.5 text-[#0066FF]" />{COMPANY.phone}</a>
                <a href={`mailto:${COMPANY.email}`} className="flex items-center gap-2 hover:text-[#0066FF]"><Mail className="w-3.5 h-3.5 text-[#0066FF]" />{COMPANY.email}</a>
                <p className="flex items-center gap-2"><MapPin className="w-3.5 h-3.5 text-[#0066FF]" />{COMPANY.address}</p>
                <p className="flex items-center gap-2 text-emerald-700 font-bold"><Clock className="w-3.5 h-3.5 text-emerald-600" />Available 24/7</p>
              </div>
            </div>
            {[
              { title:'Services', links:CORE_SERVICES.slice(0,6).map(s => ({ label: s.title, page: 'services' })) },
              { title:'Dispatch', links:['Dry Van','Reefer','Flatbed','Box Truck','Hotshot','Step Deck'].map(d => ({ label:`${d} Dispatch`, page:'pricing' })) },
              { title:'Company',  links:[{label:'About Us',page:'about'},{label:'Pricing',page:'pricing'},{label:'Driver Jobs',page:'driver-jobs'},{label:'Hire Drivers',page:'hire-drivers'},{label:'Resources',page:'resources'},{label:'Contact',page:'contact'},{label:'⚙ Admin',page:'admin'}] }
            ].map(col => (
              <div key={col.title} className="space-y-2.5">
                <h4 className="font-extrabold text-sm text-[#0F172A]">{col.title}</h4>
                <ul className="space-y-2">{col.links.map(l => <li key={l.label}><button onClick={() => nav(l.page)} className="hover:text-[#0066FF] transition text-left">{l.label}</button></li>)}</ul>
              </div>
            ))}
          </div>
          <div className="pt-6 mt-8 border-t border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#64748B]">
            <p>© 2026 Roadway Logistics Group LLC. All rights reserved.</p>
            <div className="flex items-center gap-5">
              <button onClick={() => nav('about')} className="hover:text-[#0F172A]">Privacy</button>
              <button onClick={() => nav('about')} className="hover:text-[#0F172A]">Terms</button>
              <button onClick={() => nav('admin')} className="hover:text-[#0F172A]">Admin</button>
            </div>
          </div>
        </div>
      </footer>

      {/* KV FREIGHT GROUP SCROLL SHOWCASE AT END OF WEBSITE */}
      <KvFreightShowcase onNav={nav} />

      {/* ─── MODALS ─────────────────────────────────────────────────────────── */}

      {/* Service Detail Modal */}
      {selService && !selService._applyJob && (
        <div className="fixed inset-0 z-50 bg-[#0F172A]/40 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white/92 backdrop-blur-3xl rounded-3xl max-w-2xl w-full p-6 sm:p-8 border border-white/95 shadow-[0_30px_90px_rgba(0,102,255,0.25),inset_0_1px_2px_rgba(255,255,255,1)] space-y-5 relative my-8">
            <button onClick={() => setSelService(null)} className="absolute top-5 right-5 p-2 rounded-full bg-slate-100/80 hover:bg-slate-200/80 text-[#0F172A] transition cursor-pointer"><X className="w-5 h-5" /></button>
            <div className="flex items-center gap-4">
              <ServiceIcon type={selService.icon} />
              <div>
                <h3 className="text-2xl font-extrabold text-[#0F172A]">{selService.title}</h3>
                <p className="text-sm font-bold text-[#0066FF]">{selService.price}</p>
              </div>
            </div>
            <p className="text-sm text-[#334155] leading-relaxed">{selService.desc}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-white/70 backdrop-blur-lg border border-blue-100/80 space-y-2 shadow-sm">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#0066FF]">Scope to Discuss</h4>
                <ul className="space-y-1.5 text-xs text-[#334155]">
                  {selService.scope?.map(s => <li key={s} className="flex gap-2 items-start"><CheckCircle2 className="w-3.5 h-3.5 text-[#0066FF] shrink-0 mt-0.5" />{s}</li>)}
                </ul>
              </div>
              <div className="p-4 rounded-2xl bg-emerald-50/70 backdrop-blur-lg border border-emerald-200/80 space-y-2 shadow-sm">
                <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-800">Benefits</h4>
                <ul className="space-y-1.5 text-xs text-emerald-900">
                  {selService.benefits?.map(b => <li key={b} className="flex gap-2 items-start"><Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />{b}</li>)}
                </ul>
              </div>
            </div>
            <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
              <a href={COMPANY.phoneHref} className="px-5 py-2.5 rounded-full liquid-btn-secondary text-xs font-bold flex items-center gap-2"><Phone className="w-4 h-4 text-[#0066FF]" />{COMPANY.phone}</a>
              <div className="flex items-center gap-2">
                <button onClick={() => setSelService(null)} className="px-4 py-2.5 rounded-full text-xs font-bold text-slate-600 hover:bg-slate-100 transition cursor-pointer">Close</button>
                <button onClick={() => { const isWeb = selService._isWebsite; setSelService(null); nav(isWeb ? 'website' : 'get-started'); }} className="px-6 py-2.5 rounded-full liquid-btn-primary text-xs font-bold shadow-md cursor-pointer">Get Started →</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Job Application Modal */}
      {selService?._applyJob && (
        <div className="fixed inset-0 z-50 bg-[#0F172A]/40 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white/92 backdrop-blur-3xl rounded-3xl max-w-lg w-full p-6 sm:p-8 border border-white/95 shadow-[0_30px_90px_rgba(0,102,255,0.25),inset_0_1px_2px_rgba(255,255,255,1)] space-y-4 relative">
            <button onClick={() => setSelService(null)} className="absolute top-5 right-5 p-2 rounded-full bg-slate-100/80 hover:bg-slate-200/80 text-[#0F172A] transition cursor-pointer"><X className="w-5 h-5" /></button>
            <span className="text-xs font-bold px-3 py-1 rounded-full liquid-pill">Driver Application · {selService._applyJob.equipment}</span>
            <h3 className="text-2xl font-extrabold text-[#0F172A]">Apply for {selService._applyJob.title}</h3>
            <p className="text-xs font-bold text-emerald-700">{selService._applyJob.pay} · Est {selService._applyJob.est} · Home Time: {selService._applyJob.homeTime}</p>
            <form onSubmit={e => submitApplyJob(e, selService._applyJob)} className="space-y-3">
              {[
                { label:'Driver Full Name *', field:'driverName', type:'text', ph:'Your full name' },
                { label:'Mobile Phone *', field:'phone', type:'tel', ph:'(209) 202-3080' },
                { label:'City & State *', field:'cityState', type:'text', ph:'Dallas, TX' }
              ].map(f => (
                <div key={f.field}>
                  <label className="text-xs font-bold text-[#475569] block mb-1">{f.label}</label>
                  <input type={f.type} required value={applyF.values[f.field]} onChange={applyF.set(f.field)} placeholder={f.ph} className="liquid-input w-full px-3.5 py-2.5 rounded-xl text-xs focus:outline-none" />
                </div>
              ))}
              <ResultAlert result={applyF.result} />
              <Btn loading={applyF.loading} type="submit" className="w-full py-3 rounded-full liquid-btn-primary font-bold text-xs shadow-md transition cursor-pointer">
                {!applyF.loading && 'Submit Application →'}
              </Btn>
            </form>
          </div>
        </div>
      )}

      {/* Glossary Modal */}
      {selTerm && (
        <div className="fixed inset-0 z-50 bg-[#0F172A]/40 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white/92 backdrop-blur-3xl rounded-3xl max-w-lg w-full p-6 sm:p-8 border border-white/95 shadow-[0_30px_90px_rgba(0,102,255,0.25),inset_0_1px_2px_rgba(255,255,255,1)] space-y-4 relative">
            <button onClick={() => setSelTerm(null)} className="absolute top-5 right-5 p-2 rounded-full bg-slate-100/80 hover:bg-slate-200/80 text-[#0F172A] transition cursor-pointer"><X className="w-5 h-5" /></button>
            <span className="text-xs font-bold px-3 py-1 rounded-full liquid-pill">Roadway Knowledge Base</span>
            <h3 className="text-2xl font-extrabold text-[#0F172A]">{selTerm.term}</h3>
            <p className="text-xs font-semibold text-[#0066FF]">{selTerm.short}</p>
            <p className="text-sm text-[#475569] leading-relaxed">{selTerm.definition}</p>
            <div className="p-4 rounded-2xl bg-white/70 backdrop-blur-md border border-blue-200/80 text-xs text-[#0F172A]">
              <strong className="text-[#0066FF] block mb-1">Real-World Application:</strong>
              {selTerm.example}
            </div>
            <div className="flex justify-between items-center pt-2">
              <button onClick={() => { setSelTerm(null); nav('contact'); }} className="text-xs font-bold text-[#0066FF] hover:underline cursor-pointer">Have questions? Contact us →</button>
              <button onClick={() => setSelTerm(null)} className="px-6 py-2.5 rounded-full liquid-btn-primary text-white text-xs font-bold cursor-pointer">Got It</button>
            </div>
          </div>
        </div>
      )}

      {/* TOAST */}
      {toast && (
        <div className={`fixed bottom-16 sm:bottom-5 right-4 sm:right-5 z-50 max-w-sm p-4 rounded-2xl shadow-2xl border flex items-start gap-3 transition-all ${toast.ok ? 'bg-[#0F172A] border-blue-400/40 text-white' : 'bg-rose-900 border-rose-500/40 text-white'}`}>
          {toast.ok ? <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" /> : <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />}
          <div className="text-xs">
            <p className="font-bold">{toast.title}</p>
            <p className="text-slate-300 mt-0.5">{toast.desc}</p>
          </div>
        </div>
      )}

      {/* STICKY PHONE QUICK-ACTION BAR (<640px) */}
      <div className="fixed bottom-0 inset-x-0 z-40 sm:hidden bg-[#0F172A]/95 backdrop-blur-xl border-t border-white/15 px-3 py-2.5 flex items-center gap-2 shadow-[0_-8px_24px_rgba(0,0,0,0.45)]">
        <a
          href={COMPANY.phoneHref}
          className="flex-1 py-2.5 px-3 rounded-xl bg-white/10 border border-white/20 text-white font-extrabold text-xs flex items-center justify-center gap-1.5"
        >
          <Phone className="w-3.5 h-3.5 text-sky-400 shrink-0" />
          <span>Call Dispatch</span>
        </a>
        <button
          type="button"
          onClick={() => nav('pricing')}
          className="flex-1 py-2.5 px-3 rounded-xl bg-emerald-600 text-white font-extrabold text-xs flex items-center justify-center gap-1.5"
        >
          <Truck className="w-3.5 h-3.5 shrink-0" />
          <span>Select Truck</span>
        </button>
        <button
          type="button"
          onClick={() => nav('get-started')}
          className="flex-1 py-2.5 px-3 rounded-xl bg-[#0066FF] text-white font-extrabold text-xs flex items-center justify-center gap-1"
        >
          <span>Get Started</span>
          <ArrowRight className="w-3.5 h-3.5 shrink-0" />
        </button>
      </div>
    </div>
  );
}
