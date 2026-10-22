import React, { useRef, useEffect, useState } from 'react';
import './RwDispatchHero.css';

export default function RwDispatchHero() {
  const sectionRef = useRef(null);
  const videoRef = useRef(null);
  const animIdRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  // 1. Scroll-Triggered Entrance Animation (IntersectionObserver at 0.2 threshold)
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    if (!('IntersectionObserver' in window)) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.2 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // 2. Unitless scale fallback for responsive desktop stage scaling (targeted to .rw-dispatch-hero)
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    function syncScale() {
      if (!el) return;
      const frameEl = el.querySelector('.frame') || el;
      const s = Math.min(frameEl.clientHeight / 800, frameEl.clientWidth / 1280);
      el.style.setProperty('--s', s.toFixed(5));
    }

    syncScale();
    window.addEventListener('resize', syncScale, { passive: true });
    return () => {
      window.removeEventListener('resize', syncScale);
    };
  }, []);

  // 3. Real-time top-down aerial moving semi-truck procedural canvas stream piped to <video>
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const canvas = document.createElement('canvas');
    const W = 1280;
    const H = 800;
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    /* Pre-generate procedural volcanic/coal terrain boulders & road texture strips */
    const rocks = [];
    for (let i = 0; i < 160; i++) {
      const side = i % 2 === 0 ? -1 : 1;
      const distFromCenter = 105 + Math.pow(Math.random(), 0.85) * 535;
      rocks.push({
        x: W / 2 + side * distFromCenter,
        y: Math.random() * H,
        r: 4 + Math.random() * 28,
        stretch: 0.7 + Math.random() * 0.9,
        shade: 11 + Math.floor(Math.random() * 14),
        highlight: Math.random() * 0.08
      });
    }

    /* Secondary convoy semi-trucks in the right/left highway lane */
    const convoy = [
      { laneOffset: 30, y: 120, speedRel: 0.55, color: '#d8dad7', cabColor: '#25292e', code: 'RW-204' },
      { laneOffset: 30, y: -420, speedRel: 0.55, color: '#c4c7c9', cabColor: '#8d3627', code: 'RW-519' }
    ];

    function drawRoundedRect(c, x, y, w, h, r) {
      c.beginPath();
      c.moveTo(x + r, y);
      c.lineTo(x + w - r, y);
      c.quadraticCurveTo(x + w, y, x + w, y + r);
      c.lineTo(x + w, y + h - r);
      c.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
      c.lineTo(x + r, y + h);
      c.quadraticCurveTo(x, y + h, x, y + h - r);
      c.lineTo(x, y + r);
      c.quadraticCurveTo(x, y, x + r, y);
      c.closePath();
    }

    function drawSemiTruck(c, cx, cy, cabColor, trailerColor, unitLabel, isHero, time) {
      const sway = Math.sin(time * 2.1 + (isHero ? 0 : 1.7)) * 1.1;
      const tx = cx + sway;
      const ty = cy;

      c.save();
      c.translate(tx, ty);

      /* Warm dual headlight cones projecting forward up the highway */
      const beamGrad = c.createLinearGradient(0, -145, 0, -340);
      beamGrad.addColorStop(0, isHero ? 'rgba(255, 244, 214, 0.24)' : 'rgba(255, 244, 214, 0.14)');
      beamGrad.addColorStop(0.5, isHero ? 'rgba(255, 235, 190, 0.08)' : 'rgba(255, 235, 190, 0.04)');
      beamGrad.addColorStop(1, 'rgba(255, 235, 190, 0)');
      c.fillStyle = beamGrad;
      c.beginPath();
      c.moveTo(-13, -142);
      c.lineTo(-42, -335);
      c.lineTo(42, -335);
      c.lineTo(13, -142);
      c.closePath();
      c.fill();

      /* Deep directional ground shadow under tractor + 53ft trailer */
      c.fillStyle = 'rgba(0, 0, 0, 0.68)';
      drawRoundedRect(c, -16, -140, 42, 294, 5);
      c.fill();

      /* Dual tandem axles & tires protruding slightly at edges */
      c.fillStyle = '#070809';
      const wheelY = [-126, -78, -62, 102, 118];
      for (let w = 0; w < wheelY.length; w++) {
        c.fillRect(-19, wheelY[w], 4, 11);
        c.fillRect(15, wheelY[w], 4, 11);
      }

      /* Fifth-wheel chassis & catwalk deck between cab and trailer */
      c.fillStyle = '#181b1f';
      c.fillRect(-12, -88, 24, 34);
      c.strokeStyle = '#2e333a';
      c.lineWidth = 1;
      c.strokeRect(-10, -84, 20, 22);

      /* Chrome dual fuel saddle tanks */
      c.fillStyle = '#8b929a';
      c.fillRect(-16, -104, 3, 18);
      c.fillRect(13, -104, 3, 18);

      /* Tractor Cab (hood + sleeper + aerodynamic roof fairing) */
      c.fillStyle = cabColor;
      drawRoundedRect(c, -14, -142, 28, 58, 5);
      c.fill();

      /* Hood engine louvers & front chrome grille */
      c.fillStyle = '#d8dde2';
      c.fillRect(-9, -142.5, 18, 2.5);
      c.strokeStyle = 'rgba(0, 0, 0, 0.35)';
      c.lineWidth = 1;
      c.beginPath();
      c.moveTo(-10, -120);
      c.lineTo(-11, -138);
      c.moveTo(10, -120);
      c.lineTo(11, -138);
      c.stroke();

      /* Curved dark wrap-around windshield */
      c.fillStyle = '#0d1116';
      drawRoundedRect(c, -12, -121, 24, 9, 2);
      c.fill();

      /* Sleeper roof wind deflector ribs */
      c.strokeStyle = 'rgba(255, 255, 255, 0.22)';
      c.lineWidth = 1.1;
      c.strokeRect(-11, -108, 22, 19);
      c.beginPath();
      c.moveTo(-7, -108);
      c.lineTo(-9, -89);
      c.moveTo(7, -108);
      c.lineTo(9, -89);
      c.stroke();

      /* West-coast side mirrors */
      c.strokeStyle = '#cfd4d8';
      c.lineWidth = 1.2;
      c.beginPath();
      c.moveTo(-14, -118);
      c.lineTo(-19, -119);
      c.moveTo(14, -118);
      c.lineTo(19, -119);
      c.stroke();

      /* Amber roof clearance LEDs */
      c.fillStyle = '#ff9d2e';
      for (let m = -8; m <= 8; m += 4) {
        c.fillRect(m - 0.8, -122.5, 1.6, 1.6);
      }

      /* 53-Foot Dry-Van Trailer (slightly articulated with subtle highway oscillation) */
      const trailerSwing = Math.sin(time * 1.6) * 0.008;
      c.save();
      c.translate(0, -64);
      c.rotate(trailerSwing);

      /* Trailer body */
      c.fillStyle = trailerColor;
      drawRoundedRect(c, -16, 0, 32, 212, 2);
      c.fill();

      /* Top-down corrugated aluminum roof ribs */
      c.strokeStyle = 'rgba(0, 0, 0, 0.13)';
      c.lineWidth = 1;
      for (let ry = 6; ry < 208; ry += 6.5) {
        c.beginPath();
        c.moveTo(-14.5, ry);
        c.lineTo(14.5, ry);
        c.stroke();
      }

      /* Side rail extrusion trim */
      c.fillStyle = 'rgba(255, 255, 255, 0.45)';
      c.fillRect(-16, 0, 1.6, 212);
      c.fillRect(14.4, 0, 1.6, 212);

      /* Subtle roof weathering & longitudinal seam */
      const roofGrad = c.createLinearGradient(-16, 0, 16, 0);
      roofGrad.addColorStop(0, 'rgba(0,0,0,0.12)');
      roofGrad.addColorStop(0.5, 'rgba(255,255,255,0.06)');
      roofGrad.addColorStop(1, 'rgba(0,0,0,0.16)');
      c.fillStyle = roofGrad;
      c.fillRect(-16, 0, 32, 212);

      /* Roof fleet identification stencil ("ROADWAY") */
      c.save();
      c.translate(0, 96);
      c.rotate(-Math.PI / 2);
      c.fillStyle = 'rgba(18, 20, 24, 0.62)';
      c.font = '800 11px Impact, Oswald, Arial Narrow, sans-serif';
      c.textAlign = 'center';
      c.textBaseline = 'middle';
      c.fillText('ROADWAY · ' + unitLabel, 0, 0);
      c.restore();

      /* Active GPS / ELD telematics roof transponder dome */
      c.fillStyle = '#1d2126';
      c.fillRect(-4.5, 8, 9, 5);
      if (isHero) {
        c.fillStyle = '#D6523A';
        c.beginPath();
        c.arc(0, 10.5, 1.6, 0, Math.PI * 2);
        c.fill();
      }

      /* Rear DOT bumper bar & red tail/brake marker glow */
      c.fillStyle = '#202429';
      c.fillRect(-15, 212, 30, 3);
      c.fillStyle = '#d63a2f';
      c.fillRect(-14, 211.5, 5, 2);
      c.fillRect(9, 211.5, 5, 2);

      const tailGlow = c.createRadialGradient(0, 216, 2, 0, 224, 28);
      tailGlow.addColorStop(0, 'rgba(214, 60, 45, 0.28)');
      tailGlow.addColorStop(1, 'rgba(214, 60, 45, 0)');
      c.fillStyle = tailGlow;
      c.fillRect(-28, 210, 56, 34);

      c.restore();
      c.restore();
    }

    let lastTime = performance.now();
    let roadScroll = 0;
    let isCancelled = false;

    function renderFrame(now) {
      if (isCancelled) return;
      const dt = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;
      const t = now * 0.001;
      const speed = 290; /* Highway ground scroll speed in px/s */
      roadScroll = (roadScroll + speed * dt) % 80;

      /* 1. Dark coal/basalt terrain base */
      ctx.fillStyle = '#0b0d0f';
      ctx.fillRect(0, 0, W, H);

      /* Subtle terrain elevation contours on left and right of highway */
      const terrainGradL = ctx.createLinearGradient(0, 0, W * 0.44, 0);
      terrainGradL.addColorStop(0, '#07080a');
      terrainGradL.addColorStop(0.7, '#111418');
      terrainGradL.addColorStop(1, '#0a0b0d');
      ctx.fillStyle = terrainGradL;
      ctx.fillRect(0, 0, W * 0.44, H);

      const terrainGradR = ctx.createLinearGradient(W * 0.56, 0, W, 0);
      terrainGradR.addColorStop(0, '#0a0b0d');
      terrainGradR.addColorStop(0.3, '#111418');
      terrainGradR.addColorStop(1, '#07080a');
      ctx.fillStyle = terrainGradR;
      ctx.fillRect(W * 0.56, 0, W * 0.44, H);

      /* Scrolling terrain rocks & coal ridges */
      for (let i = 0; i < rocks.length; i++) {
        const rk = rocks[i];
        rk.y += speed * dt;
        if (rk.y - rk.r * 2 > H) {
          rk.y = -rk.r * 2;
        }
        ctx.fillStyle = 'rgb(' + rk.shade + ',' + (rk.shade + 1) + ',' + (rk.shade + 3) + ')';
        ctx.beginPath();
        ctx.ellipse(rk.x, rk.y, rk.r, rk.r * rk.stretch, 0, 0, Math.PI * 2);
        ctx.fill();
      }

      /* 2. Central Roadway Corridor (aligned dead-center at x = 640) */
      const roadCenter = W / 2;
      const roadHalfW = 74;

      /* Gravel embankment shoulders */
      const shoulderGrad = ctx.createLinearGradient(roadCenter - roadHalfW - 26, 0, roadCenter + roadHalfW + 26, 0);
      shoulderGrad.addColorStop(0, 'rgba(10, 11, 12, 0)');
      shoulderGrad.addColorStop(0.14, '#181b1f');
      shoulderGrad.addColorStop(0.86, '#181b1f');
      shoulderGrad.addColorStop(1, 'rgba(10, 11, 12, 0)');
      ctx.fillStyle = shoulderGrad;
      ctx.fillRect(roadCenter - roadHalfW - 26, 0, (roadHalfW + 26) * 2, H);

      /* Dark asphalt roadbed */
      const asphaltGrad = ctx.createLinearGradient(roadCenter - roadHalfW, 0, roadCenter + roadHalfW, 0);
      asphaltGrad.addColorStop(0, '#13161a');
      asphaltGrad.addColorStop(0.18, '#1b1f25');
      asphaltGrad.addColorStop(0.5, '#161a1f');
      asphaltGrad.addColorStop(0.82, '#1b1f25');
      asphaltGrad.addColorStop(1, '#13161a');
      ctx.fillStyle = asphaltGrad;
      ctx.fillRect(roadCenter - roadHalfW, 0, roadHalfW * 2, H);

      /* High-speed longitudinal tire wear tracks in both lanes */
      ctx.fillStyle = 'rgba(8, 9, 11, 0.36)';
      ctx.fillRect(roadCenter - 43, 0, 9, H);
      ctx.fillRect(roadCenter - 21, 0, 9, H);
      ctx.fillRect(roadCenter + 16, 0, 9, H);
      ctx.fillRect(roadCenter + 38, 0, 9, H);

      /* Highway outer fog lines & shoulder rumble strips */
      ctx.fillStyle = 'rgba(247, 245, 239, 0.28)';
      ctx.fillRect(roadCenter - roadHalfW + 6, 0, 2, H);
      ctx.fillRect(roadCenter + roadHalfW - 8, 0, 2, H);

      /* Steel highway guardrails & scrolling posts */
      ctx.fillStyle = '#2a2f37';
      ctx.fillRect(roadCenter - roadHalfW - 4, 0, 2.2, H);
      ctx.fillRect(roadCenter + roadHalfW + 1.8, 0, 2.2, H);

      /* Scrolling dashed center lane divider & reflective cat-eye studs */
      for (let dy = -80 + roadScroll; dy < H + 80; dy += 80) {
        /* Center lane dash */
        ctx.fillStyle = 'rgba(247, 245, 239, 0.55)';
        ctx.fillRect(roadCenter - 1.2, dy, 2.4, 34);

        /* Amber reflective road stud between dashes */
        ctx.fillStyle = 'rgba(214, 82, 58, 0.65)';
        ctx.fillRect(roadCenter - 1.5, dy + 54, 3, 3);

        /* Guardrail posts */
        ctx.fillStyle = '#3a404a';
        ctx.fillRect(roadCenter - roadHalfW - 6, dy, 4, 4);
        ctx.fillRect(roadCenter + roadHalfW + 2, dy, 4, 4);
      }

      /* 3. Secondary dispatched convoy trucks moving in right lane */
      for (let cIdx = 0; cIdx < convoy.length; cIdx++) {
        const tr = convoy[cIdx];
        tr.y += speed * tr.speedRel * dt;
        if (tr.y > H + 260) {
          tr.y = -360;
        }
        drawSemiTruck(ctx, roadCenter + tr.laneOffset, tr.y, tr.cabColor, tr.color, tr.code, false, t + cIdx);
      }

      /* 4. Primary Hero Roadway Logistics Semi-Truck (tracked by aerial camera along center-left lane, aligned with .mark at x=575.5, y=519.6) */
      const heroX = roadCenter - 32;
      const heroY = 472 + Math.sin(t * 1.15) * 6;
      drawSemiTruck(ctx, heroX, heroY, '#D6523A', '#F2F0EA', 'RW-408', true, t);

      /* 5. Subtle radial vignette to blend seamlessly with stage typography */
      const vig = ctx.createRadialGradient(W / 2, H / 2, H * 0.25, W / 2, H / 2, W * 0.65);
      vig.addColorStop(0, 'rgba(10, 11, 12, 0)');
      vig.addColorStop(1, 'rgba(10, 11, 12, 0.48)');
      ctx.fillStyle = vig;
      ctx.fillRect(0, 0, W, H);

      animIdRef.current = requestAnimationFrame(renderFrame);
    }

    animIdRef.current = requestAnimationFrame(renderFrame);

    /* Attach live 60fps aerial semi-truck canvas stream directly to <video class="bg"> */
    try {
      if (canvas.captureStream) {
        const stream = canvas.captureStream(60);
        video.removeAttribute('src');
        video.srcObject = stream;
        const playPromise = video.play();
        if (playPromise && playPromise.catch) {
          playPromise.catch(() => {});
        }
      }
    } catch (e) {}

    return () => {
      isCancelled = true;
      if (animIdRef.current) {
        cancelAnimationFrame(animIdRef.current);
      }
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className={`rw-dispatch-hero ${isVisible ? 'is-visible' : ''}`}
      aria-label="Roadway Logistics — Dispatch Advantage Showcase"
    >
      <div className="frame">
        <video
          ref={videoRef}
          className="bg"
          src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20261005_115944_095d91d4-030f-4e82-b42b-a388c0816d24.mp4"
          autoPlay
          muted
          loop
          playsInline
          disablePictureInPicture
          aria-label="Aerial view of a Roadway Logistics semi-truck moving along a dark asphalt corridor"
        />
        <div className="tint" />
        <div className="stage">
          <p className="eyebrow">
            <span>ROADWAY LOGISTICS · DISPATCH</span>
          </p>

          <h2 className="headline">
            <span className="hl1">DISPATCH</span>
            <span className="hl2">THAT WORKS</span>
            <span className="hl3">AS HARD AS</span>
            <span className="hl4">YOU DO.</span>
          </h2>

          <svg className="mark" viewBox="0 0 52 52" fill="none" aria-hidden="true">
            <circle
              cx="26"
              cy="26"
              r="23"
              stroke="#D6523A"
              strokeWidth="1.6"
              strokeDasharray="98.3 46.3"
              transform="rotate(2.5 26 26)"
            />
            <g stroke="#D6523A" strokeWidth="1.6" strokeLinecap="round">
              <circle cx="26.5" cy="26.1" r="2.3" />
              <path d="M28.9 27.6C31.6 29 32.9 31.2 31.8 33.3 30.7 35.4 27.2 36.1 24.2 35.1" />
            </g>
          </svg>

          <section className="feature f-left">
            <svg className="icon" viewBox="0 0 35 34" fill="none" aria-hidden="true">
              <defs>
                <clipPath id="rw-gclip">
                  <circle cx="17.5" cy="17" r="9.80" />
                </clipPath>
              </defs>
              <circle cx="17.5" cy="17" r="16.5" stroke="#F9F9F9" strokeWidth="1.9" strokeDasharray="3.6 3" />
              <circle cx="17.5" cy="17" r="9.80" fill="#F9F9F9" />
              <g stroke="#101215" strokeWidth="0.90" clipPath="url(#rw-gclip)">
                <path d="M11.90 7.20 V26.80 M17.5 7.20 V26.80 M23.10 7.20 V26.80 M7.70 11.40 H27.30 M7.70 17 H27.30 M7.70 22.60 H27.30" />
              </g>
            </svg>
            <h3>
              <span className="t1">One point of</span>
              <span className="t2">dispatch</span>
            </h3>
            <p>
              <span className="b1">No more chasing multiple brokers. One</span>
              <span className="b2">team dispatches your entire end-to-end flow</span>
              <span className="b3">origin to destination.</span>
            </p>
          </section>

          <section className="feature f-right">
            <svg className="icon" viewBox="0 0 35 38" fill="none" aria-hidden="true">
              <rect x="0.5" y="0.5" width="17" height="9.6" rx="0.5" fill="#F9F9F9" />
              <rect x="10.5" y="13.5" width="13.5" height="10.9" rx="0.5" fill="#F9F9F9" />
              <rect x="17.5" y="28.3" width="17" height="9.7" rx="0.5" fill="#F9F9F9" />
              <g fill="#101215">
                {/* Top trailer box door ticks */}
                <rect x="2.50" y="2.50" width="1.10" height="1.90" />
                <rect x="5.60" y="2.50" width="1.10" height="1.90" />
                <rect x="8.70" y="2.50" width="1.10" height="1.90" />
                <rect x="11.80" y="2.50" width="1.10" height="1.90" />
                <rect x="14.90" y="2.50" width="1.10" height="1.90" />
                <rect x="2.50" y="6.50" width="1.10" height="1.90" />
                <rect x="5.60" y="6.50" width="1.10" height="1.90" />
                <rect x="8.70" y="6.50" width="1.10" height="1.90" />
                <rect x="11.80" y="6.50" width="1.10" height="1.90" />
                <rect x="14.90" y="6.50" width="1.10" height="1.90" />
                {/* Mid trailer box door ticks */}
                <rect x="12.50" y="15.20" width="1.10" height="1.90" />
                <rect x="15.60" y="15.20" width="1.10" height="1.90" />
                <rect x="18.70" y="15.20" width="1.10" height="1.90" />
                <rect x="21.80" y="15.20" width="1.10" height="1.90" />
                <rect x="12.50" y="20.40" width="1.10" height="1.90" />
                <rect x="15.60" y="20.40" width="1.10" height="1.90" />
                <rect x="18.70" y="20.40" width="1.10" height="1.90" />
                <rect x="21.80" y="20.40" width="1.10" height="1.90" />
                {/* Bottom trailer box door ticks */}
                <rect x="19.50" y="30.30" width="1.10" height="1.90" />
                <rect x="22.60" y="30.30" width="1.10" height="1.90" />
                <rect x="25.70" y="30.30" width="1.10" height="1.90" />
                <rect x="28.80" y="30.30" width="1.10" height="1.90" />
                <rect x="31.90" y="30.30" width="1.10" height="1.90" />
                <rect x="19.50" y="34.40" width="1.10" height="1.90" />
                <rect x="22.60" y="34.40" width="1.10" height="1.90" />
                <rect x="25.70" y="34.40" width="1.10" height="1.90" />
                <rect x="28.80" y="34.40" width="1.10" height="1.90" />
                <rect x="31.90" y="34.40" width="1.10" height="1.90" />
              </g>
            </svg>
            <h3>
              <span className="t1">Full supply chain</span>
              <span className="t2">visibility</span>
            </h3>
            <p>
              <span className="b1">Track your trucks in real time and get</span>
              <span className="b2">proactive updates before issues become</span>
              <span className="b3">delays.</span>
            </p>
          </section>
        </div>
      </div>
    </section>
  );
}
