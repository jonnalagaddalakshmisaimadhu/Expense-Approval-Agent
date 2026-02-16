
import sys
import json
import requests


def query_ollama(model, prompt):
    """
    Send a prompt to the local Ollama instance for LLM inference.
    
    Uses the Ollama REST API to communicate with models like Mistral.
    Returns a JSON-formatted response string with the AI's decision.
    Falls back to a safe default if the model is offline or times out.
    """
    url = "http://localhost:11434/api/generate"
    data = {
        "model": model,
        "prompt": prompt,
        "stream": False,
        "format": "json"
    }

    try:
        response = requests.post(url, json=data, timeout=60)
        response.raise_for_status()
        return response.json().get("response", "{}")
    except requests.exceptions.Timeout:
        return json.dumps({
            "decision": "Flag",
            "reason": "AI Analysis Timed Out",
            "risk_score": 50
        })
    except Exception as e:
        return json.dumps({
            "error": str(e),
            "decision": "Reject",
            "reason": "Model failure"
        })


def construct_prompt(receipt_text, policies):
    """
    Build a structured prompt for the LLM expense auditor.
    
    Uses Chain-of-Thought prompting to guide the model through:
    1. Policy comparison
    2. Decision making
    3. Risk scoring
    """
    policy_text = "\n".join([f"- {p['title']}: {p['text']}" for p in policies])

    prompt = f"""
    You are an AI Expense Auditor. Analyze the following receipt against company policies.
    
    Receipt Text:
    {receipt_text}
    
    Company Policies:
    {policy_text}
    
    Task:
    1. Check if the expense violates any policy.
    2. Suggest an approval decision (Approve, Reject, or Flag for Manager).
    3. Provide a risk score (0-100).
    
    Output strictly valid JSON in this format:
    {{
      "decision": "Approve" | "Reject" | "Flag",
      "reason": "Brief explanation",
      "risk_score": <number>,
      "policy_violation": <boolean>
    }}
    """
    return prompt


if __name__ == "__main__":
    try:
        input_data = json.load(sys.stdin)
        receipt_text = input_data.get("receipt_text", "")
        policies = input_data.get("policies", [])
        model = input_data.get("model", "mistral")

        prompt = construct_prompt(receipt_text, policies)
        response_text = query_ollama(model, prompt)

        response_text = response_text.strip()
        if response_text.startswith("```json"):
            response_text = response_text[7:-3]
        elif response_text.startswith("```"):
            response_text = response_text[3:-3]

        print(response_text)

    except Exception as e:
        print(json.dumps({"error": str(e), "decision": "Reject"}))
