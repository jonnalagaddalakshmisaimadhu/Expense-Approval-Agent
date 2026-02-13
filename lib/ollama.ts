
import axios from 'axios';

// Interface for the structured response we expect from the LLM
interface PolicyDecision {
    decision: "Approve" | "Reject";
    reason: string;
    riskScore: number;
}

export async function checkPolicyComplianceOllama(expenseText: string, relevantPolicies: any[]): Promise<PolicyDecision> {
    try {
        const prompt = `
You are an Expense Approval Agent.

Receipt Text:
${expenseText}

Relevant Policies:
${relevantPolicies.length ? relevantPolicies.map(p => `- ${p.text}`).join("\n") : "- None"}

Your Task:
1. Compare the receipt text against the policies.
2. Decide if the expense should be Approved or Rejected.
3. Provide a short reason.
4. Assign a risk score (0-100).

Return ONLY valid JSON in this exact format:
{
  "decision": "Approve" | "Reject",
  "reason": "your explanation here",
  "riskScore": number
}
Do not add any markdown, notes, or extra text. Just the JSON string.
`;

        console.log("Ollama Request Sent... Waiting for Mistral...");
        const start = Date.now();
        const response = await axios.post("http://localhost:11434/api/generate", {
            model: "mistral",
            prompt: prompt,
            stream: false,
            format: "json" // Ollama supports forcing JSON mode
        }, {
            timeout: 60000 // 60 second timeout for slower local machines
        });
        console.log(`Ollama Response Received in ${(Date.now() - start) / 1000}s`);

        const output = response.data.response;

        // Parse the JSON output
        try {
            const parsed = JSON.parse(output);
            return {
                decision: parsed.decision || "Reject",
                reason: parsed.reason || "Unable to determine reason",
                riskScore: typeof parsed.risk_score === 'number' ? parsed.risk_score : (typeof parsed.riskScore === 'number' ? parsed.riskScore : 50)
            };
        } catch (e) {
            console.error("Failed to parse Ollama JSON:", output);
            // Fallback if JSON parsing fails (Mistral sometimes chats even with format: json)
            return {
                decision: "Reject",
                reason: "AI Response Error: " + output.substring(0, 50),
                riskScore: 50
            };
        }

    } catch (error) {
        console.error("Ollama API Error:", error);
        console.log("⚠️ Falling back to Mock Reasoner (Rule-Based) due to LLM failure/timeout.");
        return generateMockResponse(expenseText);
    }
}

// Fallback: Simple Rule-Based Decision if LLM is down/slow
function generateMockResponse(text: string): PolicyDecision {
    const t = text.toLowerCase();

    // 1. Meals
    if (t.includes('meal') || t.includes('food') || t.includes('restaurant')) {
        const amountMatch = t.match(/(\$|€|£|¥|₹)\s?(\d+)/);
        const amount = amountMatch ? parseInt(amountMatch[2]) : 0;

        if (amount > 50) { // $50 approx limit
            return { decision: "Reject", reason: "Meal expense exceeds $50 limit (Mock Decision)", riskScore: 80 };
        }
        return { decision: "Approve", reason: "Meal within limits (Mock Decision)", riskScore: 10 };
    }

    // 2. Travel
    if (t.includes('uber') || t.includes('lyft') || t.includes('cab')) {
        return { decision: "Approve", reason: "Travel expense (Mock Decision)", riskScore: 20 };
    }

    // 3. Office
    if (t.includes('office') || t.includes('supply')) {
        return { decision: "Approve", reason: "Office supplies (Mock Decision)", riskScore: 5 };
    }

    // Default
    return {
        decision: "Approve",
        reason: "Expense appears valid (Mock Decision - Ollama was unreachable)",
        riskScore: 30
    };
}
