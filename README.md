# Expense Approval Agent 🤖

An intelligent, multi-agent system for automating expense approvals. This project demonstrates a **Local Agentic RAG** architecture using open-source models to process receipts, verify policy compliance, and detect fraud—all without relying on expensive cloud APIs.

## 🌟 Features

*   **OCR Agent**: Extracts text from receipt images using **Tesseract.js** (Local OCR).
*   **RAG Agent**: Retrieves relevant company policies dynamically from a local knowledge base (`policies.json`).
*   **Reasoner Agent**: Uses a local LLM (**Ollama + Mistral**) to analyze the receipt against the retrieved policies.
*   **Fraud Detection**: Detects duplicate submissions and anomalies.
*   **Resilient Architecture**: Includes robust fallbacks (Mock/Rule-based) to ensure the demo works even if local models are slow or unresponsive.

## 🏗️ Architecture

1.  **Perception**: The receipt image is processed by the **OCR Agent** to extract raw text.
2.  **Retrieval**: The **RAG Agent** queries the policy database to find rules relevant to the specific expense keywords (e.g., "taxi", "dinner").
3.  **Reasoning**: The **Reasoner Agent** (Mistral) receives the receipt text and 3-4 specific policy clauses. It "thinks" about whether the expense is compliant.
4.  **Decision**: The output is routed (Auto-Approve, Manager Review, or Reject) based on the risk score and amount.

## 🚀 Getting Started

### Prerequisites

*   **Node.js** (v18 or higher)
*   **Ollama** (for local LLM reasoning)
    *   Download from [ollama.com](https://ollama.com)
    *   Run `ollama pull mistral`

### Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/jonnalagaddalakshmisaimadhu/Expense-Approval-Agent.git
    cd Expense-Approval-Agent
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

3.  Start the Local LLM Server:
    ```bash
    ollama serve
    ```

4.  Run the Application:
    ```bash
    npm run dev
    ```

5.  Open [http://localhost:3000](http://localhost:3000) to view the agent in action.

## 🛠️ Tech Stack

*   **Frontend**: Next.js (React), Tailwind CSS, Framer Motion
*   **Backend**: Next.js API Routes
*   **AI/ML**: Tesseract.js (OCR), Ollama/Mistral (LLM)

## 📸 Screenshots

*(Add screenshots of your dashboard here)*

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
