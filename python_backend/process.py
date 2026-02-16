
import sys
import json
import os
from ocr import extract_text
from rag import find_relevant_policies, load_policies
from reasoner import construct_prompt, query_ollama

SEEN_RECEIPTS_FILE = "seen_receipts.json"


def load_seen_file():
    """Load previously seen receipt signatures for duplicate detection."""
    if os.path.exists(SEEN_RECEIPTS_FILE):
        try:
            with open(SEEN_RECEIPTS_FILE, 'r') as f:
                return json.load(f)
        except Exception:
            return []
    return []


def save_seen_receipt(signature):
    """Save a receipt signature to the duplicate tracking file."""
    try:
        seen = load_seen_file()
        seen.append(signature)
        with open(SEEN_RECEIPTS_FILE, 'w') as f:
            json.dump(seen, f)
    except Exception:
        pass


def process_expense(input_payload):
    """
    Main orchestration function that coordinates all agents.
    
    Pipeline:
    1. OCR Agent -> extracts text from receipt image
    2. RAG Agent -> retrieves relevant company policies
    3. Reasoner Agent -> LLM-based decision making
    4. Fraud Agent -> duplicate detection
    5. Approval Router -> final routing decision
    """
    receipt_data = {}

    # Check if pre-extracted text was provided (fallback recovery path)
    try:
        if input_payload.strip().startswith("{"):
            payload = json.loads(input_payload)
            if "provided_text" in payload:
                receipt_data = payload["provided_text"]
    except Exception:
        pass

    # If no pre-extracted text, run the OCR agent
    if not receipt_data:
        try:
            receipt_data = extract_text(input_payload)
            if "error" in receipt_data:
                return {"error": receipt_data["error"]}
        except Exception as e:
            return {"error": f"OCR Critical Failure: {str(e)}"}

    # Extract key fields for downstream processing
    merchant = receipt_data.get('merchant', 'Unknown')
    date = receipt_data.get('date', 'Unknown')
    total = receipt_data.get('total', 0)

    # Fraud Detection Agent: check for duplicate submissions
    signature = f"{merchant}|{date}|{total}"
    seen = load_seen_file()
    is_flagged = signature in seen
    fraud_result = {
        "isFlagged": is_flagged,
        "reason": "Duplicate receipt detected" if is_flagged else "No anomalies detected"
    }

    # RAG Agent: retrieve relevant company policies
    base_dir = os.path.dirname(os.path.abspath(__file__))
    policy_path = os.path.join(base_dir, "..", "lib", "policies.json")
    policies = load_policies(policy_path)
    relevant_policies = find_relevant_policies(receipt_data.get("text", ""), policies)

    # Reasoner Agent: query the local LLM for a decision
    prompt = construct_prompt(receipt_data.get("text", ""), relevant_policies)
    decision_json = query_ollama("mistral", prompt)

    # Parse the LLM response
    try:
        if isinstance(decision_json, str):
            clean_json = decision_json.strip()
            if clean_json.startswith("```json"):
                clean_json = clean_json[7:-3]
            elif clean_json.startswith("```"):
                clean_json = clean_json[3:-3]
            decision_data = json.loads(clean_json)
        else:
            decision_data = decision_json
    except Exception:
        decision_data = {
            "decision": "Reject",
            "reason": "Failed to parse AI response",
            "risk_score": 100
        }

    # Approval Router: determine final routing based on decision + rules
    decision_val = decision_data.get("decision", "Reject")
    risk_score = decision_data.get("risk_score", decision_data.get("riskScore", 0))

    if decision_val == "Approve" and float(total) < 800 and risk_score < 50:
        approval_route = {"status": "Auto-Approved", "approver": "System"}
    elif decision_val == "Approve":
        approval_route = {"status": "Needs Manager Approval", "approver": "Line Manager (High Value/Risk)"}
    else:
        approval_route = {"status": "Rejected", "approver": "AI Assistant"}

    # Save signature for future duplicate detection (only if approved)
    if not is_flagged and decision_val == "Approve":
        save_seen_receipt(signature)

    return {
        "receipt": receipt_data,
        "retrievedPolicies": relevant_policies,
        "policyDecision": decision_data,
        "fraudCheck": fraud_result,
        "approval": approval_route
    }


if __name__ == "__main__":
    try:
        input_data = sys.stdin.read()
        if not input_data:
            print(json.dumps({"error": "No input data provided"}))
            sys.exit(1)

        result = process_expense(input_data)
        print(json.dumps(result))
    except Exception as e:
        print(json.dumps({"error": str(e)}))
