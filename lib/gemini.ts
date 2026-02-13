
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY || "");



export async function checkPolicyCompliance(expenseData: any, relevantPolicies: any[]) {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `You are an expense approval agent.

    Receipt Details:
    ${JSON.stringify(expenseData, null, 2)}

    Relevant Policies (Retrieved from Knowledge Base):
    ${relevantPolicies.map(p => `- ${p.title}: ${p.text}`).join("\n")}

    Decide:
    1. Approve or Reject
    2. Reason
    3. Risk Score (0-100)

    Return JSON format:
    {
        "decision": "Approve" | "Reject",
        "reason": "explanation string",
        "riskScore": number
    }
    Do not include markdown formatting. Just raw JSON.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    try {
        const jsonString = text.replace(/```json/g, "").replace(/```/g, "").trim();
        return JSON.parse(jsonString);
    } catch (error) {
        console.error("Error parsing policy check response:", error);
        return { decision: "Manual Review", reason: "AI parsing error", riskScore: 50 };
    }
}
