# FlyitGo - Client-Ready Flight Ticket PDFs

FlyitGo is a web app for travel agents to turn raw GDS PNR text into clean,
branded flight itinerary PDFs that are easy to share with clients on WhatsApp.
It supports free daily usage, PRO upgrades, and admin-only access controls.

Live site: http://flyitgo.com/

## Project overview

This project delivers:
- A marketing landing page with pricing, benefits, and WhatsApp CTA.
- A PNR parser that converts GDS text into structured flight data.
- A PDF ticket preview with branded design and download support.
- Admin tools to enable PRO access per travel agent and generate unique links.

## Who is this for?

This is built for:
- Travel agents who need professional client-ready itineraries.
- Agencies that want branded PDFs and fewer client follow-up calls.
- WhatsApp-first workflows for fast ticket delivery.

## Key features

- Paste GDS PNR text and generate a ticket.
- Download a polished PDF in seconds.
- Daily free limit with PRO upgrade flow.
- Admin panel for per-agent PRO access links.
- Landing page optimized for sales conversion.

## Tech stack

- React + Vite
- Material UI (MUI)
- html2canvas + jsPDF

## Local development

```bash
npm install
npm run dev
```

## Routes

- `/` Landing page
- `/app` Ticket generator

## Deployment (Netlify)

Netlify redirect is configured via `public/_redirects` for SPA routing.

## License

Private project. All rights reserved.

---

## বাংলা সারসংক্ষেপ

FlyitGo একটি ওয়েব অ্যাপ যা ট্রাভেল এজেন্টদের জন্য বানানো—GDS PNR টেক্সট থেকে
পরিষ্কার ও ব্র্যান্ডেড ফ্লাইট টিকিট PDF তৈরি করতে সাহায্য করে। এটি WhatsApp‑এ
ক্লায়েন্টকে দ্রুত পাঠানো যায় এবং ফলো‑আপ কল কমে।

### প্রকল্পটি কী কাজ করে
- ল্যান্ডিং পেজে প্রাইসিং ও সুবিধাগুলো দেখায়
- GDS PNR টেক্সট পার্স করে টিকিট ডেটা তৈরি করে
- সুন্দর PDF টিকিট প্রিভিউ ও ডাউনলোড দেয়
- অ্যাডমিন প্যানেল থেকে নির্দিষ্ট এজেন্টকে PRO অ্যাক্সেস দেওয়া যায়

### কাদের জন্য
- ট্রাভেল এজেন্ট যারা ক্লায়েন্ট‑রেডি itinerary চান
- এজেন্সি যারা ব্র্যান্ডেড PDF দিতে চায়
- WhatsApp‑ফার্স্ট ডেলিভারি ফ্লো

### মূল ফিচার
- GDS PNR টেক্সট পেস্ট করে টিকিট জেনারেট
- দ্রুত PDF ডাউনলোড
- দৈনিক ফ্রি লিমিট + PRO আপগ্রেড ফ্লো
- এজেন্ট‑ভিত্তিক PRO লিংক জেনারেশন

### লোকাল রান

```bash
npm install
npm run dev
```

### রাউটসমূহ

- `/` ল্যান্ডিং পেজ
- `/app` টিকিট জেনারেটর
