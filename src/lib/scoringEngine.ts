import { SMEPersona } from './mockData';

export type RiskScoreResult = {
    score: 'A' | 'B' | 'C' | 'D';
    financialScore: number;
    digitalScore: number;
    totalScore: number;
    recommendation: string;
};

// Returns a score from 0-100 based on financials
function calculateFinancialScore(persona: SMEPersona): number {
    let score = 0;

    // 1. Cash runway (up to 50 points)
    // > 12 months = 50 pts, > 6 months = 30 pts, > 3 months = 10 pts, else 0
    if (persona.cashRunwayMonths >= 12) score += 50;
    else if (persona.cashRunwayMonths >= 6) score += 30;
    else if (persona.cashRunwayMonths >= 3) score += 10;

    // 2. Profit margin trend (up to 50 points)
    const recentFinancials = persona.financials.slice(-3);
    const oldFinancials = persona.financials.slice(0, 3);

    const recentAvgProfit = recentFinancials.reduce((sum, f) => sum + (f.revenue - f.cogs), 0) / 3;
    const oldAvgProfit = oldFinancials.reduce((sum, f) => sum + (f.revenue - f.cogs), 0) / 3;

    if (recentAvgProfit > oldAvgProfit * 1.1) {
        score += 50; // Growing profit
    } else if (recentAvgProfit >= oldAvgProfit * 0.9) {
        score += 30; // Steady profit
    } else if (recentAvgProfit > 0) {
        score += 10; // Declining but still profitable
    }
    // Else 0 (Operating at a loss/severe decline)

    return score;
}

// Returns a score from 0-100 based on digital footprint
function calculateDigitalScore(persona: SMEPersona, aiSentimentScore: number | null): number {
    let score = 0;

    // 1. Social Engagement Trend (up to 40 points)
    const socialActivity = persona.socialActivity;
    if (socialActivity.length >= 2) {
        const latest = socialActivity[socialActivity.length - 1];
        const previous = socialActivity[socialActivity.length - 2];

        if (latest.posts === 0 && previous.posts === 0) {
            score += 20; // Stagnant/No presence (Neutral risk)
        } else if (latest.engagementScore > previous.engagementScore) {
            score += 40; // Growing engagement
        } else if (latest.posts < previous.posts / 2) {
            score += 0; // Sudden drop-off in posting (Risk signal)
        } else {
            score += 20; // Steady engagement
        }
    } else {
        score += 20; // Default if not enough data
    }

    // 2. AI Sentiment Score (up to 60 points)
    if (aiSentimentScore !== null) {
        // mapped 0-100 sentiment directly to 0-60 points
        score += (aiSentimentScore / 100) * 60;
    } else {
        // Fallback if AI hasn't run yet
        score += 40;
    }

    return Math.min(Math.round(score), 100);
}

export function calculateRiskScore(persona: SMEPersona, aiSentimentScore: number | null = null): RiskScoreResult {
    const financialScore = calculateFinancialScore(persona);
    const digitalScore = calculateDigitalScore(persona, aiSentimentScore);

    // Weighting: 60% Financial, 40% Digital
    const totalScore = Math.round((financialScore * 0.6) + (digitalScore * 0.4));

    let score: 'A' | 'B' | 'C' | 'D';
    let recommendation: string;

    if (totalScore >= 80) {
        score = 'A';
        recommendation = 'Approve with standard rate. Strong fundamentals and positive digital perception.';
    } else if (totalScore >= 60) {
        score = 'B';
        recommendation = 'Approve with monitored covenants. Stable, but watch for market shifts.';
    } else if (totalScore >= 40) {
        score = 'C';
        recommendation = 'Flag for manual review. Concerns in either financial trends or digital reputation.';
    } else {
        score = 'D';
        recommendation = 'Decline. High risk indicators across financial health and online reviews.';
    }

    return {
        score,
        financialScore,
        digitalScore,
        totalScore,
        recommendation
    };
}
