# Decision Logic & Agents

## 1. OCR Agent
Responsible for converting unstructured image data into structured text.
- **Library**: `tesseract.js` v5
- **Optimization**: Uses a race condition against a timer to ensure the UI never hangs.

## 2. RAG Agent (Retrieval)
A lightweight retrieval system that avoids vector database overhead for simplicity.
- **Method**: Keyword Density Matching.
- **Logic**: If receipt contains "meal", fetch "Travel & Meal Policy". If receipt contains "monitor", fetch "Office Supplies Policy".

## 3. Reasoner Agent (The "Brain")
Orchestrated via Ollama (Mistral).
- **Why Mistral?**: It is efficient enough to run on consumer hardware while capable of following strict JSON output instructions.
- **Prompt Strategy**: We use "Chain of Thought" prompting to ask the model to first *compare*, then *decide*, then *score*.

## 4. Fraud Detection Agent
A deterministic agent.
- **Logic**: Creates a hash of `merchant + date + amount`. If this hash has been seen in the current session, it flags the receipt as a duplicate.

## 5. Approval Router
The final gatekeeper.
- **Rule**:
    - IF `LLM Decision` == "Approve"
    - AND `Risk Score` < 50
    - AND `Amount` < $800
    - THEN `Auto-Approve`
    - ELSE `Escalate to Manager`
