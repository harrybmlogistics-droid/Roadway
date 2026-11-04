import React, { useEffect, useRef } from 'react';
import './KvFreightShowcase.css';

const SRC_1080 = 'https://d2ol7oe51mr4n9.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/409763c0-95f4-49d3-a601-dc564d55072b.mp4';
const SRC_720 = 'https://d2ol7oe51mr4n9.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/b3718419-7a0a-478d-bfb0-0ff8bef7f3f7.mp4';
const POSTER_URL = 'https://d2ol7oe51mr4n9.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/2307e4bf-be39-42b4-b579-e168aeccabf0.jpg';

export default function KvFreightShowcase({ onNav }) {
  const wrapperRef = useRef(null);
  const trackRef = useRef(null);
  const videoRef = useRef(null);
  const giantLettersRef = useRef(null);
  const readoutRef = useRef(null);
  const stripRef = useRef(null);
  const cardsRef = useRef(null);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const track = trackRef.current;
    const video = videoRef.current;
    const giantLetters = giantLettersRef.current;
    const readout = readoutRef.current;
    const strip = stripRef.current;
    const cardsContainer = cardsRef.current;

    if (!wrapper || !track || !video || !giantLetters || !readout || !strip || !cardsContainer) {
      return;
    }

    const cardEls = Array.from(cardsContainer.querySelectorAll('.card'));
    const rootStyle = wrapper.style;

    const A = 2.4; // 2.4 viewports for the clip
    let B = 2.5;   // Dynamically computed from strip width

    let vw = window.innerWidth;
    let vh = window.innerHeight;
    let stripWidth = 0;
    let lettersWidth = 0;
    let activeSrc = '';

    // Video scrubbing state
    let clipDuration = 4.04;
    let curTime = 0;
    let targetTime = 0;
    let pendingSeek = false;

    // Speed readout state
    let lastScrollY = 0;
    let lastFrameTime = performance.now();
    let smoothedSpeed = 0;
    let rafId = null;

    // Recorder mode detection (?rec=1)
    const isRecorder = new URLSearchParams(window.location.search).get('rec') === '1';
    let recModeManual = false;

    function clamp(val, min, max) {
      return Math.max(min, Math.min(max, val));
    }

    function getTrackScrollY() {
      const rect = track.getBoundingClientRect();
      return Math.max(0, -rect.top);
    }

    // Select 720p at 900px wide and below, 1080p above
    function selectVideoSource() {
      const desired = window.innerWidth <= 900 ? SRC_720 : SRC_1080;
      if (activeSrc !== desired) {
        activeSrc = desired;
        video.src = desired;
        video.load();
      }
    }

    // Measure and position video, band edge, and track height
    function layout() {
      vw = window.innerWidth;
      vh = window.innerHeight;
      selectVideoSource();

      const isPortraitOrNarrow = vw < 768 || vw <= vh;
      let clipW, clipH, clipLeft, clipTop;

      if (!isPortraitOrNarrow) {
        // Wide screens: cover (scale = max(vw/1920, vh/1080), centred)
        const scale = Math.max(vw / 1920, vh / 1080);
        clipW = 1920 * scale;
        clipH = 1080 * scale;
        clipLeft = (vw - clipW) * 0.5;
        clipTop = (vh - clipH) * 0.5;
      } else {
        // Portrait or narrow screens: width 155vw, 40% of frame at mid-screen,
        // final band edge (44.8% of clip height) lands at 36% of the viewport
        clipW = 1.55 * vw;
        clipH = clipW * (1080 / 1920);
        clipLeft = 0.5 * vw - 0.4 * clipW;
        clipTop = 0.36 * vh - 0.448 * clipH;
      }

      video.style.width = clipW + 'px';
      video.style.height = clipH + 'px';
      video.style.left = clipLeft + 'px';
      video.style.top = clipTop + 'px';

      // Final band edge sits at 44.8% of clip height
      const edgePx = clipTop + 0.448 * clipH;
      rootStyle.setProperty('--edge-px', edgePx.toFixed(2) + 'px');

      // Background split line placed inside the clip so white is above and #111 is below
      const splitPx = clipTop + 0.85 * clipH;
      rootStyle.setProperty('--split-px', splitPx.toFixed(2) + 'px');

      // Measure strip and giant letters widths
      stripWidth = strip.scrollWidth;
      lettersWidth = giantLetters.scrollWidth;

      // B = (strip width + 0.45 * vw) / vw * 1.1 viewports
      B = ((stripWidth + 0.45 * vw) / Math.max(1, vw)) * 1.1;

      // Track height = (1 + A + B) * viewport
      const totalHeight = (1 + A + B) * vh;
      track.style.height = Math.round(totalHeight) + 'px';
    }

    // Seek handling with fast keyframe scrubbing
    function attemptSeek() {
      if (!video.readyState) return;
      const diff = Math.abs(video.currentTime - curTime);
      if (diff > 1 / 60) {
        if (!video.seeking) {
          try {
            video.currentTime = clamp(curTime, 0, Math.max(0, clipDuration - 1 / 48));
          } catch (err) {
            // Ignore DOMException if metadata not ready
          }
        } else {
          pendingSeek = true;
        }
      }
    }

    function onLoadedMetadata() {
      if (video.duration && isFinite(video.duration)) {
        clipDuration = video.duration;
      }
      layout();
      attemptSeek();
    }

    function onSeeked() {
      if (pendingSeek) {
        pendingSeek = false;
        attemptSeek();
      }
    }

    video.addEventListener('loadedmetadata', onLoadedMetadata);
    video.addEventListener('seeked', onSeeked);

    // Update card text gradient reveal based on each card's viewport position
    function updateCardReveals(stripX) {
      for (let i = 0; i < cardEls.length; i++) {
        const card = cardEls[i];
        const cardLeft = stripX + card.offsetLeft;
        const s = clamp((0.98 - cardLeft / vw) / 0.3, -0.4, 1.6) * 100;
        card.style.setProperty('--s', s.toFixed(2) + '%');
      }
    }

    // Apply scene transforms for a given scrollY
    function updateSceneForScroll(scrollY, dt, overrideSpeed) {
      const aPx = A * vh;
      const bPx = B * vh;

      // Clip progress q
      const q = clamp(scrollY / Math.max(1, aPx), 0, 1);
      const maxTime = Math.max(0, clipDuration - 1 / 48);
      targetTime = q * maxTime;

      // Settled flag (--ph = 1 when q >= 0.94)
      const settled = q >= 0.94 ? 1 : 0;
      rootStyle.setProperty('--ph', String(settled));

      // Strip & Giant Letters progress r
      const r = clamp((scrollY - aPx) / Math.max(1, bPx), 0, 1);
      const stripX = vw - r * (stripWidth + 0.45 * vw);
      const lettersX = vw - r * (lettersWidth + vw);

      strip.style.transform = 'translate3d(' + stripX.toFixed(2) + 'px, 0, 0)';
      giantLetters.style.transform = 'translate3d(' + lettersX.toFixed(2) + 'px, 0, 0)';

      updateCardReveals(stripX);

      // Speed readout calculation: |Δy|/Δt / 32, capped at 99, two digits
      if (typeof overrideSpeed === 'number') {
        const kmh = clamp(Math.round(overrideSpeed), 0, 99);
        readout.textContent = String(kmh).padStart(2, '0') + ' KM/H';
      } else if (dt > 0) {
        const dy = Math.abs(scrollY - lastScrollY);
        const rawSpeed = (dy / (dt / 1000)) / 32;
        smoothedSpeed += (rawSpeed - smoothedSpeed) * 0.18;
        if (smoothedSpeed < 0.4) smoothedSpeed = 0;
        const kmh = clamp(Math.round(smoothedSpeed), 0, 99);
        readout.textContent = String(kmh).padStart(2, '0') + ' KM/H';
      }

      lastScrollY = scrollY;
    }

    // Single requestAnimationFrame loop
    function tick(now) {
      const dt = Math.max(1, now - lastFrameTime);
      lastFrameTime = now;

      if (!recModeManual) {
        const scrollY = getTrackScrollY();
        updateSceneForScroll(scrollY, dt);

        // Ease current video time toward targetTime
        curTime += (targetTime - curTime) * 0.2;
        attemptSeek();
      }

      rafId = requestAnimationFrame(tick);
    }

    // Cubic-bezier(x1, y1, x2, y2) evaluator for deterministic ?rec=1 mode
    function solveCubicBezier(x1, y1, x2, y2, x) {
      if (x <= 0) return 0;
      if (x >= 1) return 1;
      let t = x;
      for (let i = 0; i < 8; i++) {
        const cx = 3 * x1;
        const bx = 3 * (x2 - x1) - cx;
        const ax = 1 - cx - bx;
        const currentX = ((ax * t + bx) * t + cx) * t - x;
        if (Math.abs(currentX) < 1e-6) break;
        const derivative = (3 * ax * t + 2 * bx) * t + cx;
        if (Math.abs(derivative) < 1e-6) break;
        t -= currentX / derivative;
      }
      const cy = 3 * y1;
      const by = 3 * (y2 - y1) - cy;
      const ay = 1 - cy - by;
      return ((ay * t + by) * t + cy) * t;
    }

    // 11s Recorder curve: hold to 4% (0..0.44s), cubic-bezier(.4,.05,.55,.95) to 96% (0.44..10.56s), then hold
    function getRecorderProgress(tSec) {
      const total = 11.0;
      const u = clamp(tSec / total, 0, 1);
      if (u <= 0.04) return 0;
      if (u >= 0.96) return 1;
      const local = (u - 0.04) / (0.96 - 0.04);
      return solveCubicBezier(0.4, 0.05, 0.55, 0.95, local);
    }

    // Deterministic frame-by-frame recorder API: window.__recTime(video, t)
    window.__recTime = function (vidEl, tSec) {
      recModeManual = true;
      layout();

      const maxScroll = (A + B) * vh;
      const pNow = getRecorderProgress(tSec);
      const pPrev = getRecorderProgress(Math.max(0, tSec - 1 / 60));
      const scrollY = pNow * maxScroll;
      const prevScrollY = pPrev * maxScroll;

      const scriptedVelocity = Math.abs(scrollY - prevScrollY) * 60;
      const scriptedKmh = scriptedVelocity / 32;

      updateSceneForScroll(scrollY, 16.67, scriptedKmh);
      const trackTop = track.getBoundingClientRect().top + window.scrollY;
      window.scrollTo(0, trackTop + scrollY);

      const maxTime = Math.max(0, clipDuration - 1 / 48);
      const q = clamp(scrollY / Math.max(1, A * vh), 0, 1);
      const exactClipTime = q * maxTime;
      curTime = exactClipTime;
      targetTime = exactClipTime;

      const targetVideo = vidEl || video;
      try {
        targetVideo.currentTime = exactClipTime;
      } catch (e) {}

      return exactClipTime;
    };

    // If ?rec=1 is active, also start an 11s Web Animation driving progress
    function initRecorderAnimation() {
      if (!isRecorder) return;
      const dummy = document.createElement('div');
      dummy.style.cssText = 'position:fixed;left:0;top:0;width:0;height:0;opacity:0;pointer-events:none;';
      document.body.appendChild(dummy);

      const anim = dummy.animate(
        [
          { offset: 0, transform: 'translateX(0px)', easing: 'linear' },
          { offset: 0.04, transform: 'translateX(0px)', easing: 'cubic-bezier(.4,.05,.55,.95)' },
          { offset: 0.96, transform: 'translateX(1000px)', easing: 'linear' },
          { offset: 1, transform: 'translateX(1000px)' }
        ],
        { duration: 11000, fill: 'forwards' }
      );

      function syncRec() {
        if (recModeManual) return;
        const currentTimeMs = anim.currentTime || 0;
        const tSec = Number(currentTimeMs) / 1000;
        const maxScroll = (A + B) * vh;
        const progress = getRecorderProgress(tSec);
        const trackTop = track.getBoundingClientRect().top + window.scrollY;
        window.scrollTo(0, trackTop + progress * maxScroll);
        if (tSec < 11) {
          requestAnimationFrame(syncRec);
        }
      }
      requestAnimationFrame(syncRec);
    }

    function onResize() {
      layout();
      const scrollY = getTrackScrollY();
      updateSceneForScroll(scrollY, 16.67);
    }

    window.addEventListener('resize', onResize);

    layout();
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => {
        layout();
        const scrollY = getTrackScrollY();
        updateSceneForScroll(scrollY, 16.67);
      });
    }

    const initialScrollY = getTrackScrollY();
    lastScrollY = initialScrollY;
    updateSceneForScroll(initialScrollY, 16.67, 0);
    initRecorderAnimation();
    rafId = requestAnimationFrame(tick);

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      window.removeEventListener('resize', onResize);
      video.removeEventListener('loadedmetadata', onLoadedMetadata);
      video.removeEventListener('seeked', onSeeked);
    };
  }, []);

  const handleNavClick = (e, targetPage) => {
    if (onNav && targetPage) {
      e.preventDefault();
      onNav(targetPage);
    }
  };

  return (
    <div className="kv-freight-showcase" ref={wrapperRef}>
      {/* Scroll-Driven KV Freight Hero & Services Track */}
      <div className="track" id="track" ref={trackRef}>
        {/* Top Navigation (Scrolls away with track) */}
        <header className="nav">
          <a href="#track" className="nav-logo">KV</a>
          <nav className="nav-right" aria-label="Primary Navigation">
            <a href="#services-grid" onClick={e => handleNavClick(e, 'services')} className="nav-item">&rarr; Menu</a>
            <a href="#kv-footer" className="nav-item nav-follow">Follow</a>
            <a href="#kv-footer" onClick={e => handleNavClick(e, 'get-started')} className="nav-item nav-pill">Work with us</a>
          </nav>
        </header>

        {/* Sticky Viewport Scene */}
        <section className="scene" id="scene" aria-label="KV Freight Handling and Services">
          {/* 1. Scrubbed Handling Video */}
          <video
            id="clip"
            ref={videoRef}
            className="clip"
            muted
            playsInline
            preload="auto"
            poster={POSTER_URL}
          />

          {/* 2. Giant "OUR SERVICES" Letters (mix-blend-mode: darken) */}
          <div className="giant-letters" id="giantLetters" ref={giantLettersRef} aria-hidden="true">
            OUR SERVICES
          </div>

          {/* 3. Speed Readout */}
          <div className="readout" id="readout" ref={readoutRef} aria-live="off">
            00 KM/H
          </div>

          {/* 4. Dark Band Holding Strip and Pill */}
          <div className="band" id="band">
            <div className="strip" id="strip" ref={stripRef}>
              {/* Lead Block */}
              <div className="lead">
                <h2 className="lead-headline">
                  EVERYTHING YOUR<br />
                  FREIGHT NEEDS.<br />
                  <span className="cobalt">UNDER ONE GROUP.</span>
                </h2>
                <div className="lead-copy">
                  <p>From air to sea, from customs clearance to the last mile, we bring decades of practice to every freight discipline.</p>
                  <p>One integrated network means one partner, one point of contact and full visibility from origin to destination.</p>
                </div>
              </div>

              {/* Five Service Cards */}
              <div className="cards" id="cards" ref={cardsRef}>
                {/* Card 1: Air freight */}
                <article className="card">
                  <div className="card-icon" aria-hidden="true">
                    <svg viewBox="0 0 38 38">
                      <path d="M4 23L16 18V8.5C16 6.8 17.3 5.5 19 5.5C20.7 5.5 22 6.8 22 8.5V18L34 23V26.5L22 23.5V30L26 32.5V35L19 33.5L12 35V32.5L16 30V23.5L4 26.5V23Z" />
                    </svg>
                  </div>
                  <h3 className="card-title">AIR<br />FREIGHT</h3>
                  <p className="card-body">Express, priority and deferred options across global lanes, booked and tracked end to end.</p>
                </article>

                {/* Card 2: Ocean freight */}
                <article className="card">
                  <div className="card-icon" aria-hidden="true">
                    <svg viewBox="0 0 38 38">
                      <path d="M6 22L9 30H29L32 22L19 17L6 22Z" />
                      <path d="M11 19V11H27V19" />
                      <path d="M16 11V7H22V11" />
                      <path d="M4 33C6.5 33 7.5 31.5 10 31.5C12.5 31.5 13.5 33 16 33C18.5 33 19.5 31.5 22 31.5C24.5 31.5 25.5 33 28 33C30.5 33 31.5 31.5 34 31.5" />
                    </svg>
                  </div>
                  <h3 className="card-title">OCEAN<br />FREIGHT</h3>
                  <p className="card-body">FCL and LCL sailings on every major trade lane, with carrier choice based on cost and transit time.</p>
                </article>

                {/* Card 3: Customs brokerage */}
                <article className="card">
                  <div className="card-icon" aria-hidden="true">
                    <svg viewBox="0 0 38 38">
                      <path d="M9 5H23L29 11V33H9V5Z" />
                      <path d="M23 5V11H29" />
                      <path d="M14 16H24" />
                      <path d="M14 21H20" />
                      <path d="M14.5 27L17.5 30L24 23.5" />
                    </svg>
                  </div>
                  <h3 className="card-title">CUSTOMS<br />BROKERAGE</h3>
                  <p className="card-body">Licensed in-house brokers for classification, duties and inspections, so goods clear first time.</p>
                </article>

                {/* Card 4: Warehousing and 3PL */}
                <article className="card">
                  <div className="card-icon" aria-hidden="true">
                    <svg viewBox="0 0 38 38">
                      <path d="M4 15L19 6L34 15V32H4V15Z" />
                      <path d="M11 32V20H27V32" />
                      <path d="M11 24H27" />
                      <path d="M11 28H27" />
                    </svg>
                  </div>
                  <h3 className="card-title">WAREHOUSING<br />AND 3PL</h3>
                  <p className="card-body">Bonded and general storage, pick and pack, and distribution that plugs straight into transport.</p>
                </article>

                {/* Card 5: Project cargo */}
                <article className="card">
                  <div className="card-icon" aria-hidden="true">
                    <svg viewBox="0 0 38 38">
                      <path d="M19 4V11" />
                      <path d="M15 11H23L21 16H17L15 11Z" />
                      <path d="M19 16C21.5 16 22.5 18 22.5 19.8C22.5 21.6 21 23 19 23C17.3 23 16 21.8 16 20.2" />
                      <path d="M19 23L9 28M19 23L29 28" />
                      <rect x="6" y="28" width="26" height="6" />
                    </svg>
                  </div>
                  <h3 className="card-title">PROJECT<br />CARGO</h3>
                  <p className="card-body">Oversized and heavy-lift moves, engineered, permitted and escorted from factory to foundation.</p>
                </article>
              </div>
            </div>

            {/* Bottom Centered Outline Pill */}
            <div className="services-pill" id="servicesPill">
              Our services
            </div>
          </div>
        </section>
      </div>

      {/* Website Closing Footer (Continues the #111 dark band seamlessly at the end of the page) */}
      <footer className="site-footer" id="kv-footer">
        <div className="footer-inner">
          <div className="footer-top">
            <div className="footer-cta-title">
              READY TO MOVE YOUR NEXT<br />
              <span>SHIPMENT WITH KV?</span>
            </div>
            <a
              href="#get-started"
              onClick={e => handleNavClick(e, 'get-started')}
              className="footer-cta-btn"
            >
              Request a Quote &rarr;
            </a>
          </div>
          <div className="footer-bottom">
            <div>&copy; 2026 Roadway Logistics Group LLC &middot; KV Freight Group. All rights reserved.</div>
            <div className="footer-links">
              <a
                href="#top"
                onClick={e => {
                  e.preventDefault();
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              >
                Back to Top &uarr;
              </a>
              <a href="#services" onClick={e => handleNavClick(e, 'services')}>Global Network</a>
              <a href="#resources" onClick={e => handleNavClick(e, 'resources')}>Track &amp; Trace</a>
              <a href="#about" onClick={e => handleNavClick(e, 'about')}>Terms</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
