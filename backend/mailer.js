/**
 * Mailer module — Nodemailer
 * Falls back to Ethereal (preview in console) when no SMTP is configured.
 */

'use strict';

const nodemailer = require('nodemailer');

const COMPANY = process.env.COMPANY_NAME  || 'Roadway Logistics Group LLC';
const CEO     = process.env.COMPANY_CEO   || 'Awais';
const PHONE   = process.env.COMPANY_PHONE || '(209) 202-3080';
const NOTIFY  = process.env.NOTIFY_EMAIL  || 'Admin@roadwaylogisticsgroupllc.com';

let _transporter = null;

/**
 * Lazily create (or re-use) the transporter.
 * If EMAIL_USER is not set → auto-create an Ethereal test account.
 */
async function getTransporter() {
  if (_transporter) return _transporter;

  if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
    _transporter = nodemailer.createTransport({
      host:   process.env.EMAIL_HOST || 'smtp.gmail.com',
      port:   parseInt(process.env.EMAIL_PORT || '587'),
      secure: false,
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
    });
    console.log('📧  Mailer: using configured SMTP account');
  } else {
    // Dev mode: Ethereal fake SMTP
    const testAccount = await nodemailer.createTestAccount();
    _transporter = nodemailer.createTransport({
      host:   'smtp.ethereal.email',
      port:   587,
      secure: false,
      auth: { user: testAccount.user, pass: testAccount.pass }
    });
    console.log(`📧  Mailer: using Ethereal test account → ${testAccount.user}`);
  }

  return _transporter;
}

/**
 * Send a single email; logs preview URL in dev mode.
 */
async function sendMail({ from, to, subject, html, text }) {
  const t    = await getTransporter();
  const info = await t.sendMail({
    from: from || `"${COMPANY}" <Admin@roadwaylogisticsgroupllc.com>`,
    to, subject, html, text
  });
  const preview = nodemailer.getTestMessageUrl(info);
  if (preview) console.log(`   📬  Email preview: ${preview}`);
  return info;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────
const header = `
<div style="background:#0066FF;padding:24px 32px;border-radius:12px 12px 0 0;">
  <span style="color:#fff;font-size:22px;font-weight:900;letter-spacing:-0.5px;">RLG</span>
  <span style="color:#fff;font-size:14px;font-weight:600;margin-left:12px;">Roadway Logistics Group LLC</span>
</div>
<div style="background:#fff;border:1px solid #E6F0FF;border-top:none;border-radius:0 0 12px 12px;padding:28px 32px;font-family:system-ui,sans-serif;">
`;
const footer = `
  <hr style="border:none;border-top:1px solid #E6F0FF;margin:24px 0;"/>
  <p style="color:#64748B;font-size:11px;margin:0;">
    ${COMPANY} · Gustine, California<br/>
    ${PHONE} · Admin@roadwaylogisticsgroupllc.com
  </p>
</div>`;

const row = (label, value) => value
  ? `<tr><td style="padding:4px 0;color:#64748B;font-size:13px;width:160px;"><b>${label}</b></td><td style="padding:4px 0;color:#0F172A;font-size:13px;">${value}</td></tr>`
  : '';

// ─── Contact Form ─────────────────────────────────────────────────────────────
async function sendContactNotification(d) {
  return sendMail({
    to: NOTIFY,
    subject: `🚛 New Contact Form — ${d.fullName} (${d.reason || 'General'})`,
    html: `${header}
      <h2 style="color:#0F172A;margin:0 0 16px;">New Contact Form Submission</h2>
      <table style="border-collapse:collapse;width:100%;">
        ${row('Name', d.fullName)}
        ${row('Email', d.email)}
        ${row('Phone', d.phone)}
        ${row('Company', d.companyName)}
        ${row('Equipment', d.equipmentType)}
        ${row('MC Number', d.mcNumber)}
        ${row('Reason', d.reason)}
        ${row('Message', `<i>${d.message}</i>`)}
      </table>
    ${footer}`
  });
}

async function sendContactAutoReply(d) {
  return sendMail({
    to: d.email,
    subject: `We received your message — ${COMPANY}`,
    html: `${header}
      <h2 style="color:#0F172A;margin:0 0 12px;">Thanks, ${d.fullName}! ✅</h2>
      <p style="color:#475569;font-size:14px;line-height:1.6;">We received your message and our dispatch team will respond within <b>1–2 hours</b>. Need an immediate answer? Call us at <b>${PHONE}</b>.</p>
    ${footer}`
  });
}

// ─── Get Started ──────────────────────────────────────────────────────────────
async function sendGetStartedNotification(d) {
  return sendMail({
    to: NOTIFY,
    subject: `🚀 New Free Trial Request — ${d.fullName}`,
    html: `${header}
      <h2 style="color:#0F172A;margin:0 0 16px;">New Free Trial / Get Started Request</h2>
      <table style="border-collapse:collapse;width:100%;">
        ${row('Name', d.fullName)}
        ${row('Phone', d.phone)}
        ${row('MC Number', d.mcNumber)}
        ${row('Service', d.serviceType)}
      </table>
    ${footer}`
  });
}

async function sendGetStartedAutoReply(d) {
  return sendMail({
    to: d.phone, // phone — no email collected in this form
    subject: `Your 3-Day Free Trial — ${COMPANY}`,
    html: `${header}
      <h2 style="color:#0F172A;margin:0 0 12px;">3-Day Free Dispatch Trial Activated! 🎉</h2>
      <p style="color:#475569;font-size:14px;line-height:1.6;">Hi ${d.fullName}, our dispatch team has received your details and will call you shortly at <b>${d.phone}</b> to complete onboarding.</p>
    ${footer}`
  });
}

// ─── Job Application ──────────────────────────────────────────────────────────
async function sendJobApplicationNotification(d) {
  return sendMail({
    to: NOTIFY,
    subject: `👤 New Driver Application — ${d.driverName} (${d.equipment || 'N/A'})`,
    html: `${header}
      <h2 style="color:#0F172A;margin:0 0 16px;">New Driver Job Application</h2>
      <table style="border-collapse:collapse;width:100%;">
        ${row('Driver Name', d.driverName)}
        ${row('Phone', d.phone)}
        ${row('City / State', d.cityState)}
        ${row('Job Title', d.jobTitle)}
        ${row('Equipment', d.equipment)}
        ${row('Pay', d.pay)}
      </table>
    ${footer}`
  });
}

// ─── Website Inquiry ──────────────────────────────────────────────────────────
async function sendWebsiteInquiryNotification(d) {
  return sendMail({
    to: NOTIFY,
    subject: `🌐 New Website Design Inquiry — ${d.businessName}`,
    html: `${header}
      <h2 style="color:#0F172A;margin:0 0 16px;">New Website Design Request ($274)</h2>
      <table style="border-collapse:collapse;width:100%;">
        ${row('Business Name', d.businessName)}
        ${row('Phone', d.phone)}
        ${row('Email', d.email)}
      </table>
    ${footer}`
  });
}

// ─── Hire Drivers ─────────────────────────────────────────────────────────────
async function sendHireDriversNotification(d) {
  return sendMail({
    to: NOTIFY,
    subject: `🏢 New Driver Hiring Requirement — ${d.companyName}`,
    html: `${header}
      <h2 style="color:#0F172A;margin:0 0 16px;">New Driver Hiring Requirement</h2>
      <table style="border-collapse:collapse;width:100%;">
        ${row('Company', d.companyName)}
        ${row('Phone', d.phone)}
        ${row('Email', d.email)}
        ${row('Equipment', d.equipment)}
        ${row('Fleet Size', d.fleetSize)}
        ${row('State', d.state)}
      </table>
    ${footer}`
  });
}

module.exports = {
  sendContactNotification,
  sendContactAutoReply,
  sendGetStartedNotification,
  sendGetStartedAutoReply,
  sendJobApplicationNotification,
  sendWebsiteInquiryNotification,
  sendHireDriversNotification
};
