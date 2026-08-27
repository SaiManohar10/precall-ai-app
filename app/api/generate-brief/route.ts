import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function POST(req: Request) {
  try {
    const { targetCompany, attendeeRole, attendeeName, meetingTitle, previousNotes, knowledgeBase, framework } = await req.json();

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "Missing GEMINI_API_KEY" }, { status: 500 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      generationConfig: { responseMimeType: 'application/json' }
    });

    const prompt = `
You are the PreCall AI Autonomous Sales Intelligence Engine. Your mandate is to eliminate manual sales prep and calculate precise, grounded pre-call execution intelligence.

[SELLER KNOWLEDGE BASE]
Company: ${knowledgeBase?.companyName || "PreCall AI"}
Product Pitch: ${knowledgeBase?.productDescription || "B2B Sales Intelligence Platform"}
Value Props: 
- ${knowledgeBase?.valueProp1 || "Cut prep time by 90%"}
- ${knowledgeBase?.valueProp2 || "Uncover unstated buyer pain"}
- ${knowledgeBase?.valueProp3 || "Align MEDDPICC discovery"}
Battlecards & Defensibility: ${knowledgeBase?.battlecards || "Native CRM delta engine, fast onboarding"}
Sales Methodology: ${framework || "MEDDPICC"}

[TARGET BUYER CONTEXT]
Target Company: ${targetCompany}
Key Stakeholder: ${attendeeName || "Key Decision Maker"} (${attendeeRole})
Upcoming Call: ${meetingTitle || "Executive Strategy Review"}
Recent Delta / CRM History: ${previousNotes || "Introductory evaluation stage"}

Return valid JSON adhering strictly to this production schema:
{
  "twoMinuteBrief": {
    "whoAreThey": "1 sentence defining ${targetCompany}'s core business and market footprint.",
    "whyMeeting": "Primary business objective for this conversation.",
    "whatChanged": "Recent delta signal or operational shift.",
    "topRisk": "Single biggest failure mode or trap in this meeting.",
    "meetingObjective": "The exact milestone this call must secure before dropping off."
  },
  "executiveSummary": "2 crisp paragraphs explaining their strategic posture, recent growth moves, and operational headwinds.",
  "recentTriggers": [
    {
      "signal": "Operational or market development 1",
      "impact": "Why this creates friction or urgency for ${targetCompany}",
      "confidence": "Verified"
    },
    {
      "signal": "Hiring, expansion, or tooling change 2",
      "impact": "Implication on ${attendeeRole}'s team performance",
      "confidence": "AI Inference"
    }
  ],
  "stakeholderInsight": {
    "rolePriorities": "What someone in ${attendeeRole}'s position is measured on in Q3/Q4.",
    "influenceLevel": "High",
    "likelyBuyingRole": "Champion / Evaluator"
  },
  "tailoredTalkingPoints": [
    {
      "point": "Executive value hook connecting their expansion directly to our product.",
      "whyThis": "Tied to their operational scale",
      "evidence": "Recent hiring & market expansion"
    },
    {
      "point": "Battlecard differentiator neutralizing competitor alternatives.",
      "whyThis": "Protects deal velocity against legacy vendors",
      "evidence": "Internal Seller Battlecards"
    }
  ],
  "discoveryQuestions": [
    {
      "question": "Strategic discovery question mapping current operational state to pain.",
      "intent": "Uncovers technical bottleneck and root cause.",
      "meddpiccStage": "Metrics / Implication"
    },
    {
      "question": "Discovery question probing decision criteria and economic buyer alignment.",
      "intent": "Validates budget authority and procurement timeline.",
      "meddpiccStage": "Economic Buyer"
    },
    {
      "question": "Urgency question linking unresolved friction to quarterly revenue impact.",
      "intent": "Forces buyer to quantify cost of doing nothing.",
      "meddpiccStage": "Decision Process"
    }
  ],
  "objectionHandling": {
    "likelyObjection": "Realistic hesitation ${attendeeRole} will raise regarding budget, timing, or existing tools.",
    "rootCause": "Why buyers actually say this (fear of friction, lack of perceived differentiation).",
    "recommendedPivot": "Exact talk track the rep should use to reframe and advance.",
    "whatNotToSay": "Generic defensive statement to strictly avoid."
  },
  "nextBestAction": {
    "action": "Immediate tactical step required right after this call.",
    "rationale": "Why this specific action unblocks the opportunity."
  }
}
`;

    const result = await model.generateContent(prompt);
    const data = JSON.parse(result.response.text());

    return NextResponse.json({ success: true, data });
  } catch (err: any) {
    console.error("API Engine Error:", err);
    return NextResponse.json({ error: err.message || "Execution engine failure" }, { status: 500 });
  }
}
