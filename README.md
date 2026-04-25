
<div align="center">

# 🛺 মামা, চলেন (Mama, Cholen) 
**Protocol: Borgo — Built for Hacker Den Presents: FRICTION**

[![Next.js](https://img.shields.io/badge/Next.js-Black?logo=next.js&style=for-the-badge)](https://nextjs.org/)
[![Groq API](https://img.shields.io/badge/Groq%20AI-Llama_3.3_70B-f55036?style=for-the-badge)](https://groq.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?logo=tailwind-css&logoColor=white&style=for-the-badge)](https://tailwindcss.com/)
[![Deployed on Vercel](https://img.shields.io/badge/Deployed_on-Vercel-000000?logo=vercel&logoColor=white&style=for-the-badge)](https://vercel.com/)

</div>

---

## 🛑 The Philosophy: Why We Built This
*“Your job is not to remove friction. Your job is to understand it. Build something that takes a position.”*

For the past decade, tech has obsessively removed friction from our lives—one-click payments, instant bookings, seamless interfaces. But in doing so, we didn't just remove the wait time; **we removed the human connection.** Before ride-sharing apps, negotiating a fare with a local rickshaw or CNG driver in Dhaka wasn't just a transaction; it was a social ritual. It required communication, logic, and a bit of street-smart bargaining. 

**"মামা, চলেন" (Mama, Cholen)** is a ride-sharing prototype that intentionally injects **Cognitive and Social Friction** back into the booking process. The app doesn't give you a fixed fare. Instead, you have to bargain with an AI driver who is stubborn, local, and demands a premium. You don't just book a ride—you earn it. 

**Because connection is earned, not just transacted.**

---

## ✨ Features

* 🗺️ **Live Dhaka Map:** Built with React Leaflet, featuring live-simulated vehicles (Cars, CNGs, Bikes, Auto-rickshaws) roaming around your location.
* 🤖 **The Stubborn Persona (Groq AI):** Drivers are powered by the blazing-fast Groq API (`llama-3.3-70b-versatile`). They speak authentic "Banglish," understand local context, and actively resist your initial price offers.
* 🌡️ **The Friction Meter:** A live bargaining progress bar. It stays red (high friction) when the driver is stubborn and turns green as you reach a mutual agreement.
* 🤝 **The Handshake Protocol:** The ride isn't confirmed with a "button click." It's confirmed when the AI logic detects a fair deal, triggering a digital handshake animation.
* 📱 **Mobile-First Design:** Fluid animations (Framer Motion) and touch-friendly bottom sheets designed to feel like a native app.

---

## 🛠️ Tech Stack

* **Framework:** Next.js (App Router)
* **AI & Logic:** Groq API (Llama 3.3 70B Versatile Model)
* **Styling:** Tailwind CSS & Framer Motion
* **Maps:** React-Leaflet & OpenStreetMap
* **Deployment:** Vercel (Serverless Edge Functions)

---

## 🚀 Run Locally

Want to experience the friction yourself? Follow these steps to run the app on your machine.

**Prerequisites:** * Node.js installed on your machine.
* A free API key from [Groq Console](https://console.groq.com/).

### 1. Clone the repository & Install dependencies
```bash
git clone https://github.com/NawrizTurjo/MamaCholen.git
cd MamaCholen
npm install
```

### 2. Set up Environment Variables
Create a `.env.local` file in the root directory and add your Groq API key:
```env
GROQ_API_KEY=your_groq_api_key_here
```

### 3. Start the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser to see the app.

---

## 🏆 Team Dynamic Duo
* **Nawriz Ahmed Turjo** - Frontend Developer & UX Designer
* **Ahmed Sajid Hasan** - AI Integration & Backend Logic
>Built against the clock (under 72 hours) for the Hacker Den **FRICTION** Hackathon. 
