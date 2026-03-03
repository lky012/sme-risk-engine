import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

// In production, instantiate with your API key from .env.local
const ai = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(req: Request) {
    try {
        const { reviews, personaName, apiKey } = await req.json();

        if (!reviews || !Array.isArray(reviews)) {
            return NextResponse.json({ error: 'Missing or invalid reviews array' }, { status: 400 });
        }

        const activeKey = apiKey || process.env.GEMINI_API_KEY;

        if (!activeKey) {
            console.warn('No GEMINI_API_KEY found. Returning mock AI response for MVP demo purposes.');
            // Return a simulated structured response if API key is missing
            return NextResponse.json({
                Sentiment_Score: 50,
                Key_Red_Flags: ['Simulated warning: Missing API Key'],
                Positive_Highlights: ['System gracefully fell back to mock data']
            });
        }

        const ai = new GoogleGenerativeAI(activeKey);
        const model = ai.getGenerativeModel({ model: 'gemini-2.5-flash' });

        const prompt = `
    You are an expert Credit Risk Analyst for a commercial bank.
    Analyze the following 20 customer reviews for an SME named "${personaName}".
    
    Extract the overall sentiment and operational signals.
    
    Return a strictly formatted JSON object with EXACTLY these three keys:
    1. "Sentiment_Score": A number from 0 to 100 representing the overall positive sentiment (0 = universally hated/bankrupt, 100 = universally loved/flawless).
    2. "Key_Red_Flags": An array of strings detailing specific operational issues or complaints (e.g., "slow service", "dirty tables", "overpriced"). Max 3 items. If none, return empty array.
    3. "Positive_Highlights": An array of strings detailing specific strengths or praises (e.g., "great aesthetic", "friendly staff"). Max 3 items. If none, return empty array.
    
    REVIEWS:
    ${JSON.stringify(reviews)}
    
    OUTPUT JSON ONLY. No markdown, no prefixes.
    `;

        const result = await model.generateContent(prompt);
        const responseText = result.response.text();

        // Clean up potential markdown formatting from Gemini
        const cleanJson = responseText.replace(/```json/g, '').replace(/```/g, '').trim();

        const data = JSON.parse(cleanJson);

        return NextResponse.json(data);

    } catch (error) {
        console.error('Error in AI Analysis Route:', error);
        return NextResponse.json({ error: 'Failed to analyze reviews' }, { status: 500 });
    }
}
