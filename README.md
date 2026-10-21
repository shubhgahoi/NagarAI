# 🏛️ NAGAR-AI: Next-Gen Autonomous Governance & AI-Driven Municipal Framework

![Build Status](https://img.shields.io/badge/Status-Live-success) ![Tech Stack](https://img.shields.io/badge/Stack-React_19_|_Node.js_|_Gemini_2.5-blue) ![License](https://img.shields.io/badge/License-MIT-green)

> **Speak in Bagheli. Snap a photo. Get it fixed, and verified.**
> 
> NAGAR-AI is a voice-first, AI-verified civic grievance platform engineered for the Rewa Municipal Corporation. It eliminates municipal delivery bottlenecks by allowing citizens to report issues in their native dialect, automatically routing tickets with high-precision GPS, and utilizing AI to ensure repairs are actually completed before closing a ticket.

### 🚀 Quick Links
* **🌐 Live Web App (PWA):** [nagar-ai2-0.onrender.com](https://nagar-ai2-0.onrender.com)
* **🎥 Full Demo Video:** [Watch on YouTube](https://youtu.be/X8ntPH9rzGk)

---

## 🛑 The Problem: Municipal Delivery Bottlenecks

Today's civic grievance pipelines break at almost every step, leading to wasted budgets and public safety hazards:

1. **The Language Barrier:** 70%+ of Rewa residents speak Bagheli, yet existing portals demand formal English and complex dropdowns, shutting out the majority of citizens.
2. **Vague Location Dispatch:** "Near college road" sends field crews to the wrong crossing or ward, breaking Service Level Agreements (SLAs).
3. **Duplicate Overload:** Dozens of identical complaints for a single pothole swamp ward officers.
4. **Ghost Resolutions:** Tickets are often marked "Resolved" by officials with zero proof that the repair actually happened.
5. **Reactive Firefighting:** Drains are cleared *after* waterlogging, not before.

---

## 💡 The Solution: A Closed-Loop AI Workflow

NAGAR-AI replaces the broken system with a streamlined, 4-step civic pipeline: **Speak ➡️ Snap ➡️ Pin ➡️ Verify.**

### ✨ Key Features
* **🎙️ Local Dialect AI (Bagheli/Hindi/English):** Powered by the Web Speech API and Gemini 2.5 Flash, citizens simply tap the mic and speak in their local dialect. The AI extracts the defect, severity, and landmark automatically.
* **📍 High-Precision Geotagging & Auto-Routing:** Captures $\pm4m$ GPS accuracy and automatically assigns the ticket to the correct officer in 1 of 9 wards.
* **🚫 Smart Deduplication Engine:** Uses the Haversine formula to merge any new reports within a $250m$ radius of an existing active ticket. No more duplicate overload!
* **🤖 AI Before/After Verification:** Field crews *must* upload a post-repair photo. The Gemini Vision AI requires a **90%+ match/resolution score** before a ticket can be closed. No more ghost resolutions.
* **🏆 Gamified Civic Karma:** Citizens earn points (+25 for a verified closure, +10 for a report) and unlock badges (e.g., *Pothole Hunter*, *Neighborhood Watch*) on the public leaderboard.

---

## ⚙️ Technical Architecture

NAGAR-AI is built for speed, offline-capability (PWA), and scale, achieving an intake-to-dispatch time of `<800 ms`.

### Frontend
* **Core:** React 19, TypeScript, Vite 8
* **Styling:** Tailwind CSS v4
* **Mapping:** Leaflet.js
* **Native APIs:** HTML5 Geolocation, Web Speech API, Progressive Web App (PWA) Service Workers

### Backend & AI Engine
* **Server:** Node.js & Express 4 (Statutory SLA rule matrix and ticket dispatch)
* **AI Vision & NLP:** Gemini 2.5 Flash (`@google/genai` SDK) for voice-to-text parsing, image severity rating, and dual-image verification.
* **Spatial Logic:** Custom 9-ward index with $250m$ Haversine spatial deduplication.
* **Hosting:** Render.com (Global edge CDN, automatic HTTPS)

---

## 🔄 How It Works (The 6-Step Loop)

1. **Voice Intake:** Citizen speaks in Bagheli; live Devanagari/English text appears.
2. **AI Inspection:** Gemini rates the defect type, depth, and public-safety hazard from an uploaded photo.
3. **Geotag & Dedupe:** GPS maps to the nearest ward. If an active ticket exists within $250m$, the system adds an upvote instead of a new ticket.
4. **Dispatch & SLA:** Ticket is routed to the ward officer portal; 12/24/72-hour statutory clock starts.
5. **Field Repair:** Crew navigates to the exact GPS point and uploads an after-photo.
6. **AI Audit:** The system scores the before/after images. If it passes ($90\%+$), the citizen confirms with 1 tap and earns Civic Karma.

---

## 👨‍💻 Team: Binary Unit
Developed for the Computex Governance Theme.
* **Lead Architect & Developer:** Shubh Gahoi 
* **Team Member:** Ridima Singh 
* **Institution:** Rewa Engineering College, Rewa 

---
*Built to make civic infrastructure smarter, faster, and accountable.*
