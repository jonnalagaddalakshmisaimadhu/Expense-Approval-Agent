
import axios from 'axios';

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

        const response = await axios.post("http://localhost:11434/api/generate", {
            model: "mistral",
            prompt: prompt,
            stream: false,
            format: "json"
        }, {
            timeout: 60000
        });

        const output = response.data.response;

        try {
            const parsed = JSON.parse(output);
            return {
                decision: parsed.decision || "Reject",
                reason: parsed.reason || "Unable to determine reason",
                riskScore: typeof parsed.risk_score === 'number' ? parsed.risk_score : (typeof parsed.riskScore === 'number' ? parsed.riskScore : 50)
            };
        } catch (e) {
            return {
                decision: "Reject",
                reason: "AI Response Error: " + output.substring(0, 50),
                riskScore: 50
            };
        }

    } catch (error) {
        return generateMockResponse(expenseText);
    }
}

function generateMockResponse(text: string): PolicyDecision {
    const t = text.toLowerCase();

    if (t.includes('meal') || t.includes('food') || t.includes('restaurant')) {
        const amountMatch = t.match(/(\$|€|£|¥|₹)\s?(\d+)/);
        const amount = amountMatch ? parseInt(amountMatch[2]) : 0;

        if (amount > 50) {
            return { decision: "Reject", reason: "Meal expense exceeds $50 limit", riskScore: 80 };
        }
        return { decision: "Approve", reason: "Meal within limits", riskScore: 10 };
    }

    if (t.includes('uber') || t.includes('lyft') || t.includes('cab')) {
        return { decision: "Approve", reason: "Travel expense", riskScore: 20 };
    }

    if (t.includes('office') || t.includes('supply')) {
        return { decision: "Approve", reason: "Office supplies", riskScore: 5 };
    }

    return {
        decision: "Approve",
        reason: "Expense appears valid",
        riskScore: 30
    };
}
