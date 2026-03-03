# VertexRisk: SME Alternative Data Credit Risk Scoring Engine

## Overview
VertexRisk is an MVP Loan Officer Dashboard and serverless credit risk scoring engine. It evaluates Small and Medium Enterprises (SMEs) by combining traditional mock financial health indicators (Runway, Profit Margins) with AI-driven sentiment analysis of their digital footprint and online customer reviews. 

This repository serves as a **Bring Your Own Key (BYOK)** portfolio demonstration. It is 100% safe to deploy publicly.

## Key Features
- **Synthetic Data Engine:** Pre-loaded with 3 fictional SME personas (Low, Medium, and High Risk) featuring 12 months of generated financial data and social media reviews.
- **Serverless AI Analysis:** Integrates with the Google Gemini API to parse customer reviews and extract intelligent "Sentiment Scores" and prioritized "Operational Red Flags."
- **Custom Risk Scoring Algorithm:** A weighted engine (60% Financials, 40% Digital Sentiment) translating raw data into an actionable Alternative Risk Grade (A to D) with systemic recommendations.
- **Interactive UI Dashboard:** Built with Next.js, React, Tailwind CSS, and Recharts for a clean, bank-grade Loan Officer experience.
- **BYOK Architecture:** No backend credentials required for public deployments. Users provide their own Google Gemini API key directly via the dashboard to execute live LLM inferences safely.

## Tech Stack
- Frontend: Next.js (App Router), React, TypeScript, Tailwind CSS
- Data Visualization: Recharts, Lucide React
- Backend & AI: Next.js API Routes, Google Generative AI SDK (gemini-2.5-flash)

## Running Locally

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/sme-risk-engine.git
   cd sme-risk-engine
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) inside your browser. Enter your Gemini API Key in the top right corner to start analyzing the mock SME reviews!

## Deployment

This project is configured out-of-the-box for deployment on [Vercel](https://vercel.com).
Simply import this repository into your Vercel dashboard as a standard Next.js project. **No environment variables need to be configured**, as the AI operations depend entirely on the client-provided BYOK functionality.

---
*Disclaimer: Created exclusively for portfolio demonstration purposes. All data, companies, and financial scenarios contained within this application are purely synthetic.*
