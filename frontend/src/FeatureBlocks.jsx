import React from 'react';

// =============================================================
// FeatureBlocks – renders the extensive list of new capabilities
// =============================================================

export default function FeatureBlocks() {
  return (
    <section id="features" className="py-12 bg-[#0A0F1D] text-white">
      <div className="max-w-5xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8">Automated Dispatch & Load Finding Tools</h2>
        <ul className="space-y-4 text-lg">
          <li>Smart Lane Matching Engine: Automatically cross‑references driver preferred home lanes and destination deadhead radiuses with incoming broker load posts.</li>
          <li>Instant Rate‑per‑Mile (RPM) Calculator: A dispatch tool that instantly factors fuel prices, tolls, and empty miles to calculate the exact net profit margin before accepting a broker load.</li>
          <li>Multi‑Board Aggregator Integration: Pulls active loads from DAT, Truckstop.com, 123Loadboard, and direct shipper portals into a single unified dispatch feed.</li>
          <li>Broker Credit & Pay‑Speed Scorecard: An internal rating system flagging slow‑paying brokers, credit holds, and high‑risk invoice factoring rejections.</li>
          <li>Backhaul Pre‑Planning Automation: Triggers search alerts for outbound loads in the delivery city 24 hours before a driver completes their current drop.</li>
          <li>Automated Rate Confirmation Markup & Verification: Scans broker rate confirmations to ensure no unauthorized broker fees or commission discrepancies were added.</li>
          <li>Spot Market Trend Analytics: Weekly report tracking regional rate fluctuations (e.g., West Coast produce season vs. Midwest dry‑van spikes) to guide driver lane selection.</li>
          <li>Power‑Only & Drop‑and‑Hook Matcher: Specialized filter for power‑only carriers seeking pre‑loaded trailers to minimize dock wait times.</li>
          <li>Expedited & Team Load Dispatcher: High‑priority alert system for time‑sensitive team loads requiring 5,000+ mi per week.</li>
          <li>Partial LTL Load Consolidation: Tooling for box truck and hotshot dispatchers to combine multiple partial shipments into a single high‑gross run.</li>
        </ul>

        <h2 className="text-3xl font-bold text-center mt-12 mb-8">Carrier Back‑Office & Administrative Automation</h2>
        <ul className="space-y-4 text-lg">
          <li>Instant Carrier Packet Generator: Pre‑fills W‑9s, MC authority letters, and insurance COIs to email brokers within 30 seconds of load verbal agreement.</li>
          <li>Automated Detention & TONU Invoice Bot: Tracks driver detention hours and generates formal $50/hr detention or $150–$250 TONU invoices automatically.</li>
          <li>Lumper & Scale Ticket Snap‑to‑Bill: Allows drivers to text photos of lumper receipts via WhatsApp for instant broker reimbursement filing.</li>
          <li>Factoring & Quick‑Pay Paperwork Packet Builder: Instantly bundles BOLs, Rate Cons, and lumper receipts into a clean PDF ready for factoring submission (OTR Capital, Triumph, etc.).</li>
          <li>MC Authority 21‑Day Vetting Tracker: Step‑by‑step milestone checklist guiding new carrier authorities through the FMCSA initial safety review period.</li>
          <li>IFTA State‑by‑State Mileage Logger: Tracks state border crossings via GPS and produces the required quarterly mileage reports.</li>
        </ul>
      </div>
    </section>
  );
}
