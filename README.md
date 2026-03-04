# VertexRisk: SME Alternative Data Credit Risk Scoring Engine

## Overview
VertexRisk is an MVP Loan Officer Dashboard and serverless credit risk scoring engine. It evaluates Small and Medium Enterprises (SMEs) by combining traditional mock financial health indicators (Runway, Profit Margins) with AI-driven sentiment analysis of their digital footprint and online customer reviews. 

This repository serves as a **Bring Your Own Key (BYOK)** portfolio demonstration. It is 100% safe to deploy publicly.

## Key Features
- **Enterprise Bloomberg-Style Dashboard:** A data-dense, dark-themed Command Center UI tailored for high-end commercial banking environments, built with Next.js and Tailwind.
- **API Integration Metadata:** Simulates real-world data ingestion pipelines by presenting mock live status metadata from Accounting/ERP platforms (e.g., Xero, QuickBooks) and Payment Gateways (e.g., Stripe, Adyen).
- **Synthetic Hong Kong Data Engine:** Pre-loaded with 3 fictional, localized SME personas featuring 12 months of derived financial cashflow alongside reviews from OpenRice and Instagram.
- **Serverless NLP Analysis:** Integrates with the Google Gemini API to parse unstructured "Raw Data Ingestion Streams" and extract actionable "NLP Risk Vectors" (Sentiment Scores, Key Red Flags).
- **Custom Basel-Style Risk Algebra:** A weighted calculation engine (Fin Score vs. Alt Score) translating diverse data inputs into an automatic Corporate Credit Risk Grade (A to D) with approval recommendations.
- **BYOK (Bring Your Own Key) Architecture:** Configured for 100% safe public demo deployment. No backend credentials required—recruiters and users provide their own session API key directly via the dashboard to execute live LLM inferences safely.

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
