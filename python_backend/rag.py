
import sys
import json
import os


def load_policies(filepath):
    """Load the company expense policies from a JSON file."""
    try:
        with open(filepath, 'r') as f:
            return json.load(f)
    except Exception:
        return []


def find_relevant_policies(text, policies):
    """
    Lightweight keyword-based retrieval (RAG without a vector DB).
    
    Matches receipt text against known policy keywords to retrieve
    only the relevant policies. This avoids sending the entire policy
    document to the LLM, reducing token usage and improving accuracy.
    """
    relevant = []
    text_lower = text.lower()

    # Keyword mapping for each policy category
    keywords = {
        "travel_3_2": ["meal", "food", "lunch", "dinner", "breakfast", "restaurant"],
        "office_1_1": ["office", "supplies", "stationery", "paper", "pen"],
        "transport_2_1": ["cab", "taxi", "uber", "lyft", "ride"],
        "alcohol_policy": ["alcohol", "wine", "beer", "liquor", "drink"]
    }

    for policy in policies:
        pid = policy.get("id")
        policy_keywords = keywords.get(pid, [])

        # Direct keyword match (high confidence)
        if any(k in text_lower for k in policy_keywords):
            relevant.append(policy)
            continue

        # Fuzzy word overlap match (lower confidence, needs 3+ common words)
        policy_words = set(policy.get("text", "").lower().split())
        text_words = set(text_lower.split())
        common = policy_words.intersection(text_words)
        if len(common) > 2:
            relevant.append(policy)

    return relevant


if __name__ == "__main__":
    if len(sys.argv) > 1:
        text_input = sys.argv[1]
    else:
        try:
            data = json.load(sys.stdin)
            text_input = data.get("text", "")
        except Exception:
            sys.exit(1)

    base_dir = os.path.dirname(os.path.abspath(__file__))
    policy_path = os.path.join(base_dir, "..", "lib", "policies.json")

    policies = load_policies(policy_path)
    relevant = find_relevant_policies(text_input, policies)

    print(json.dumps(relevant))
