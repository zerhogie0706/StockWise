import { GoogleGenAI, Type } from "@google/genai";
import { Stock, StrategyType } from "../types";

// Safe access to process.env to prevent runtime errors if process is undefined
const apiKey = (typeof process !== 'undefined' && process.env && process.env.API_KEY) ? process.env.API_KEY : '';

// Mock data fallback in case API key is missing or fails, to ensure UI works for demo
const MOCK_STOCKS: Stock[] = [
  { symbol: 'AAPL', name: 'Apple Inc.', price: 175.43, change: 1.25, changePercent: 0.72, volume: '54M', market: 'US', strategyMatch: ['Large Trading Volume'], aiReasoning: 'Consistent high volume trading observed near support levels.' },
  { symbol: 'TSM', name: 'Taiwan Semiconductor', price: 124.50, change: -0.80, changePercent: -0.64, volume: '12M', market: 'TW', strategyMatch: ['MACD Golden Cross'], aiReasoning: 'Recent crossover of MACD line above signal line indicates bullish momentum.' },
  { symbol: 'NVDA', name: 'NVIDIA Corp', price: 875.20, change: 15.30, changePercent: 1.78, volume: '45M', market: 'US', strategyMatch: ['RSI Divergence', 'Large Trading Volume'], aiReasoning: 'Price made lower low while RSI made higher low, suggesting reversal.' },
  { symbol: '2330.TW', name: 'TSMC', price: 780.00, change: 12.00, changePercent: 1.56, volume: '32M', market: 'TW', strategyMatch: ['Moving Average Support'], aiReasoning: 'Bounced off the 50-day moving average strongly.' },
];

export const getAIStockRecommendations = async (strategies: StrategyType[]): Promise<Stock[]> => {
  if (!apiKey) {
    console.warn("No API Key provided, returning mock data.");
    return new Promise(resolve => setTimeout(() => resolve(MOCK_STOCKS.filter(s => strategies.some(strat => s.strategyMatch?.includes(strat)))), 1000));
  }

  const ai = new GoogleGenAI({ apiKey });

  const prompt = `
    Act as a financial technical analyst. 
    Generate a JSON list of 5 fictional or representative stock examples (mix of US and Taiwan market) that would theoretically match the following technical strategies right now: ${strategies.join(', ')}.
    For each stock, provide a realistic price, change, volume, and a brief "aiReasoning" explaining why it fits the strategy.
    
    The response must strictly follow the JSON schema.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              symbol: { type: Type.STRING },
              name: { type: Type.STRING },
              price: { type: Type.NUMBER },
              change: { type: Type.NUMBER },
              changePercent: { type: Type.NUMBER },
              volume: { type: Type.STRING },
              market: { type: Type.STRING, enum: ['US', 'TW'] },
              strategyMatch: { 
                type: Type.ARRAY,
                items: { type: Type.STRING }
              },
              aiReasoning: { type: Type.STRING }
            },
            required: ['symbol', 'name', 'price', 'market', 'aiReasoning']
          }
        }
      }
    });

    const text = response.text;
    if (!text) return MOCK_STOCKS;
    
    // Clean up potential markdown code blocks if the model includes them
    const cleanText = text.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim();
    
    return JSON.parse(cleanText) as Stock[];
  } catch (error) {
    console.error("Gemini API Error:", error);
    return MOCK_STOCKS;
  }
};

export const getMarketAnalysis = async (): Promise<string> => {
    if (!apiKey) return "Market sentiment appears neutral to bullish as tech sector leads recovery. (Mock Analysis)";

    const ai = new GoogleGenAI({ apiKey });
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: "Write a very brief (2 sentences) daily market sentiment summary for US and Taiwan markets focusing on tech and semi-conductors.",
        });
        return response.text || "Analysis unavailable.";
    } catch (e) {
        return "Market sentiment unavailable.";
    }
}