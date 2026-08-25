import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

export async function POST(req: Request) {
  try {
    const { targetCompany, attendeeRole, meetingTitle, previousNotes, knowledgeBase } = await req.json();

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "Missing GEMINI_API_KEY in environment" }, { status: 500 });
    }

    const ai = new GoogleGenAI({ apiKey });

    const prompt = `
You are the PreCall AI Autonomous Sales Intelligence & Meeting Brief Agent.

[SELLER CONTEXT - OUR COMPANY & PRODUCT]
Company Name: ${knowledgeBase?.companyName || "Our SaaS Product"}
Value Proposition: ${knowledgeBase?.valueProp || "Leading enterprise solution for productivity"}
Key Battlecards & Differentiators: ${knowledgeBase?.battlecards || "Fast onboarding, robust automation, superior ROI"}

[PROSPECT CONTEXT]
Target Company: ${targetCompany}
Attendee Role: ${attendeeRole}
Meeting Goal: ${meetingTitle || "Discovery & Strategy Call"}
Recent Context / Delta Notes: ${previousNotes || "First introductory meeting"}

Generate a high-impact, professional pre-meeting sales brief in valid JSON format:
{
  "executiveSummary": "2-3 crisp sentences summarizing what ${targetCompany} does, their market position, and likely current initiatives.",
  "recentTriggers": ["Key business trigger 1", "Industry movement or hiring signal 2", "Recent growth milestone 3"],
  "tailoredTalkingPoints": [
    "Talking point specifically addressing ${attendeeRole}'s priorities tied to our value prop",
    "Value-based hook connecting our product to their workflow",
    "Differentiation anchor"
  ],
  "discoveryQuestions": [
    "Question uncovering their current operational bottleneck",
    "Question regarding decision timeline and executive buy-in",
    "Question regarding ROI expectations"
  ],
  "objectionHandling": {
    "likelyObjection": "Anticipated hesitation from a ${attendeeRole}",
    "recommendedPivot": "How the sales rep should confidently address it"
  },
  "citations": ["Public Market Context", "Industry Data", "Internal Seller Knowledge Base"]
}
`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      }
    });

    const text = response.text || "{}";
    const data = JSON.parse(text);

    return NextResponse.json({ success: true, data });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: err.message || "Failed to generate brief" }, { status: 500 });
  }
}
