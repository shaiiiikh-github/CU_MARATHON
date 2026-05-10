

# CodeTrust AI: AI-Powered Secure Code Scanner & Auto-Fixer

A full-stack, AI-driven cybersecurity platform designed to detect, analyze, and automatically remediate security vulnerabilities in source code.

The system leverages a fine-tuned **GraphCodeBERT** model for highly accurate, line-level vulnerability detection, and integrates with **Ollama (Qwen 2.5 Coder)** to generate functional, secure code replacements. The frontend provides a seamless developer experience built on modern Next.js architecture, complete with authentication, scan history tracking, and API key management.

## 🚀 Key Features

* **Line-Level Vulnerability Detection:** Utilizes a custom GraphCodeBERT sequence classification model to pinpoint exact lines of vulnerable code.
* **Automated Code Remediation:** Integrates with a local Ollama LLM to rewrite vulnerable code snippets securely without altering original functionality.
* **Modern Web Interface:** Built with Next.js 16, React 19, and Tailwind CSS v4 for a highly responsive and fluid user experience.
* **Secure Authentication:** Features NextAuth.js for robust session management, user accounts, and OAuth integrations.
* **Persistent Scan History:** Automatically saves scan results, identified vulnerabilities, and applied fixes to a PostgreSQL database via Prisma ORM.
* **Developer API:** Allows users to generate personal API keys to integrate the scanning engine into external workflows.

## 🛠️ Tech Stack

### Frontend

* **Framework:** Next.js 16 (App Router), React 19
* **Styling & UI:** Tailwind CSS v4, Framer Motion, Lucide React, clsx
* **Authentication:** NextAuth.js (v5) with Prisma Adapter

### Backend (Python/Flask AI Engine)

* **API Framework:** Flask with Flask-CORS
* **Machine Learning:** PyTorch, Hugging Face Transformers (`AutoModelForSequenceClassification`)
* **Generative AI:** Local LLM integration via Ollama API (`qwen2.5-coder:1.5b`)

### Database & ORM

* **Database:** PostgreSQL
* **ORM:** Prisma Client & Prisma Postgres Adapter

## 🏗️ Architecture

1. **Client Layer (Next.js):** Users submit code snippets through the web dashboard.
2. **Database Layer (PostgreSQL):** Stores user profiles, generated API keys, and comprehensive logs of all scan results and fixed code histories.
3. **AI Microservice (Flask):** * The `/scan` endpoint processes the code using GraphCodeBERT, classifying individual lines as Safe, Vulnerable, or Hallucinated.
* The `/fix` endpoint passes identified vulnerabilities to the local Ollama instance, returning a securely rewritten version of the code.



## ⚙️ Local Development Setup

### Prerequisites

* Node.js (v18+)
* Python 3.10+
* PostgreSQL
* Ollama (with `qwen2.5-coder:1.5b` model pulled locally)

### 1. Database & Frontend Setup

Clone the repository and install the Next.js dependencies:

```bash
npm install

```

Configure your environment variables. Create a `.env` file in the root directory:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/codetrust_db"
NEXTAUTH_SECRET="your_nextauth_secret"
# Add other necessary keys for NextAuth providers or Nodemailer

```

Initialize the Prisma database schema:

```bash
npm run postinstall
npx prisma db push

```

Start the Next.js development server:

```bash
npm run dev

```

### 2. AI Backend Setup

Navigate to the `backend` directory and install the required Python packages:

```bash
cd backend
pip install -r requirements.txt

```

Ensure the fine-tuned GraphCodeBERT model is located at `backend/securecode_model_v5_final` as expected by the application.

Start the Flask API server:

```bash
python app.py

```

*(The backend will run on `http://0.0.0.0:7860`)*

### 3. Start Ollama

Ensure your local Ollama daemon is running in the background so the `/fix` endpoint can access it via `http://127.0.0.1:11434`.

## 📜 Database Schema

The platform relies on a relational schema featuring:

* `User`, `Account`, `Session` for authentication.
* `ScanResult` tracking original vs. fixed code states.
* `Vulnerability` mapping exact line numbers and model confidence scores.
* `ApiKey` for external integrations.
