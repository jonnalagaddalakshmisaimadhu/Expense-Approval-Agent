# Expense Approval Agent 🤖

> A **Local-First, Privacy-Preserving** Agentic AI system for automating corporate expense approvals. 

![Project Status](https://img.shields.io/badge/Status-Completed-success)
![Stack](https://img.shields.io/badge/Stack-Next.js_|_Ollama_|_Tesseract-blue)

This project demonstrates a fully functional **Agentic RAG (Retrieval-Augmented Generation)** pipeline that runs entirely on your local machine using open-source models. It automates receipt processing, policy verification, and fraud detection without sending sensitive financial data to the cloud.

## 🌟 Key Features

*   **🕵️‍♂️ Local Perception (OCR Agent)**: Extracts text from receipts using **Tesseract.js** directly in the backend.
*   **📚 Context Awareness (RAG Agent)**: Dynamically retrieves relevant company policies from a local knowledge base based on receipt content.
*   **🧠 Intelligent Reasoning (Reasoner Agent)**: Uses **Ollama + Mistral** to perform semantic analysis, comparing the expense against retrieved policies to make approval decisions.
*   **🛡️ Robust Resiliency**: Features a custom "Mock Fallback" system. If local AI models are slow or offline, the system degrades gracefully to strict rule-based logic, ensuring the demo **never fails**.
*   **🚨 Fraud Detection**: Automatically flags duplicate receipts and suspicious patterns.

---

## 🏗️ Architecture

The system employs a multi-agent orchestration pattern:

1.  **Receipt Upload** -> **OCR Agent** (Extracts Text)
2.  **Text** -> **RAG Agent** (Fetches Policy Context)
3.  **Context + Text** -> **Reasoner Agent** (LLM Decision)
4.  **Decision** -> **Approval Router** (Final Verdict)

👉 [Read full Architecture Documentation](docs/architecture.md)

---

## 🚀 Getting Started

### Prerequisites

*   **Node.js** (v18+)
*   **Ollama**: [Download Here](https://ollama.com) (Required for local AI reasoning)

### Installation

1.  **Clone the Repository**
    ```bash
    git clone https://github.com/jonnalagaddalakshmisaimadhu/Expense-Approval-Agent.git
    cd Expense-Approval-Agent
    ```

2.  **Install Dependencies**
    ```bash
    npm install
    ```

3.  **Setup Local AI (Ollama)**
    *   Pull the Mistral model:
        ```bash
        ollama pull mistral
        ```
    *   Start the Ollama server:
        ```bash
        ollama serve
        ```

4.  **Run the Application**
    ```bash
    npm run dev
    ```
    Open [http://localhost:3000](http://localhost:3000) (or the port shown in terminal).

---

## 💡 How It Works (Demo Guide)

1.  **Upload a Receipt**: The System accepts images. Use a sample receipt for a meal or travel.
2.  **Watch the Agents**:
    *   **Extracted Data**: Shows exactly what the OCR read.
    *   **Retrieved Policies**: Shows which specific rules were applied.
    *   **Decision**: Shows the Local AI's approval verdict and reasoning.
3.  **Test Resiliency**: Stop the `ollama serve` process and upload again. The system will switch to "Resilient Fallback Mode" and still provide a valid result!

---

## 🛠️ Technology Stack

*   **Frontend**: Next.js 14 (App Router), Tailwind CSS, Lucide Icons
*   **Backend**: Next.js API Routes (Serverless Functions)
*   ** AI Models**:
    *   **Vision**: Tesseract.js (WASM)
    *   **LLM**: Mistral 7B (via Ollama)
*   **Orchestration**: Custom Agentic Workflow in TypeScript

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
