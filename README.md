# UXterity — AI Design Copilot

<div align="center">

**A privacy-first, locally-run AI platform that analyzes UI screenshots and produces expert-level UX audit reports — powered entirely by open-source models on your own hardware.**

[![Python](https://img.shields.io/badge/Python-3.11+-3776AB?style=flat&logo=python&logoColor=white)](https://python.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115-009688?style=flat&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![Next.js](https://img.shields.io/badge/Next.js-15-000000?style=flat&logo=next.js&logoColor=white)](https://nextjs.org)
[![Ollama](https://img.shields.io/badge/Ollama-Local_AI-F97316?style=flat)](https://ollama.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

</div>

---

## 🧠 What Is UXterity?

UXterity is an AI-powered UX audit tool built for designers and developers who want **actionable, expert-level feedback on their UI designs — without sending data to the cloud.**

Upload any UI screenshot and within minutes receive:

- 📊 **Overall UX Score** (0–100) with letter grade (A–F)
- 🔬 **6 Dimension Scores** — Visual Hierarchy, Navigation Clarity, Accessibility, Layout Consistency, Cognitive Load, Information Architecture
- ⚠️ **Prioritized Issues** — Critical / Warning / Info severity, each with specific findings and actionable recommendations
- ♿ **WCAG 2.1 AA Compliance** checks — contrast ratios, alt text, touch targets
- 📋 **Top 3 Recommendations** — the highest-impact fixes for your design

Everything runs **100% locally** on your machine via [Ollama](https://ollama.com). No API keys. No data leaves your device.

---

## 🏗️ How It Was Built

UXterity was built over multiple sessions using a **human-in-the-loop AI development workflow**, combining the developer's product vision with assistance from **Claude AI (Anthropic)** and **Gemini (Google DeepMind)** for architecture design, code generation, debugging, and code review.

### Development Approach

1. **Product Design** — Defined the UX audit pipeline architecture, identified the 6 evaluation dimensions, and designed the LangGraph state machine.
2. **AI-Assisted Development** — Used **Claude AI** and **Gemini** as pair-programming assistants to accelerate code generation, suggest design patterns, and catch bugs during review sessions.
3. **Iterative Testing** — Each pipeline stage was validated independently using manual test scripts (`test_v.py`, `test_vision.py`) before integration.
4. **Hardware Optimization** — The pipeline was tuned specifically for a **GTX 1650 (4GB VRAM)** using q4_K_M quantized models that swap sequentially via Ollama.

> **Note:** Claude AI and Gemini served as development accelerators — all architectural decisions, model choices, prompt engineering, and product direction were made by the developer.

---

## ⚙️ Architecture

```
┌─────────────────────────────────────────────┐
│              Next.js 15 Frontend             │
│  Upload Zone → Analyze → Report Dashboard   │
└──────────────────┬──────────────────────────┘
                   │ POST /analyze
┌──────────────────▼──────────────────────────┐
│           FastAPI Backend (Python)           │
│                                             │
│  ┌─────────────────────────────────────┐   │
│  │       LangGraph 6-Stage Pipeline    │   │
│  │                                     │   │
│  │  0. Backend Detection               │   │
│  │     └─ Ollama → vLLM → Mock        │   │
│  │                                     │   │
│  │  1. Vision Analysis                 │   │
│  │     └─ qwen2.5vl:3b (screenshot)   │   │
│  │                                     │   │
│  │  2. Component Detection             │   │
│  │     └─ Parse JSON → DesignNodes    │   │
│  │                                     │   │
│  │  3. Layout Parsing                  │   │
│  │     └─ Design Graph + Hierarchy    │   │
│  │                                     │   │
│  │  4. UX Rule Engine                  │   │
│  │     └─ 10 WCAG/Nielsen heuristics  │   │
│  │                                     │   │
│  │  5. LLM Reasoning                   │   │
│  │     └─ qwen3:4b → JSON audit       │   │
│  │                                     │   │
│  │  6. Report Generation               │   │
│  │     └─ Typed UXAuditReport         │   │
│  └─────────────────────────────────────┘   │
└──────────────────┬──────────────────────────┘
                   │
┌──────────────────▼──────────────────────────┐
│              Ollama (Local)                  │
│   qwen2.5vl:3b (3.2GB) ← Vision            │
│   qwen3:4b     (2.5GB) ← Reasoning         │
│   Sequential swap — never exceed 4GB VRAM  │
└─────────────────────────────────────────────┘
```

---

## 🛠️ Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Frontend** | Next.js 15, TypeScript | Upload UI, report dashboard |
| **Styling** | TailwindCSS, custom CSS | Glassmorphism dark-mode UI |
| **Backend** | Python 3.11+, FastAPI | REST API, file handling |
| **Pipeline** | LangGraph, LangChain Core | 6-stage stateful AI pipeline |
| **Vision AI** | `qwen2.5vl:3b` via Ollama | Multimodal screenshot analysis |
| **Reasoning AI** | `qwen3:4b` via Ollama | UX audit reasoning & scoring |
| **HTTP Client** | httpx (async) | Backend ↔ Ollama communication |
| **Validation** | Pydantic v2 | Typed data models throughout |
| **Image Processing** | Pillow | Resize + compress before inference |
| **Dev AI Assistants** | Claude AI + Gemini | Pair programming, architecture, review |

---

## 📁 Project Structure

```
UXterity AI Agent/
│
├── backend/
│   ├── main.py                    # FastAPI app, CORS, /analyze + /health endpoints
│   ├── .env                       # Model config, URLs (copy from .env.example)
│   ├── requirements.txt           # Python dependencies
│   │
│   ├── models/
│   │   ├── design_node.py         # DesignNode, BoundingBox, ComponentType enums
│   │   ├── report.py              # UXAuditReport, UXIssue, DimensionScore
│   │   ├── Modelfile.vision       # Ollama Modelfile for vision model
│   │   └── Modelfile.reasoning    # Ollama Modelfile for reasoning model
│   │
│   ├── services/
│   │   ├── ollama_client.py       # Async Ollama API calls (vision + reasoning)
│   │   ├── vllm_client.py         # Optional vLLM backend (OpenAI-compatible)
│   │   ├── model_router.py        # Auto-detect: Ollama → vLLM → Mock
│   │   └── context_optimizer.py   # Token budget management for 4GB VRAM
│   │
│   ├── prompts/
│   │   ├── vision_prompt.py       # Structured JSON prompt for vision model
│   │   └── ux_reasoning_prompt.py # UX audit schema prompt for reasoning model
│   │
│   └── pipeline/
│       ├── orchestrator.py        # LangGraph StateGraph — 6-stage pipeline
│       ├── component_detector.py  # Parse vision JSON → typed DesignNodes
│       ├── layout_parser.py       # Build Design Graph, ASCII hierarchy
│       ├── ux_rule_engine.py      # 10 heuristic rules (WCAG, Nielsen)
│       └── report_generator.py    # Build UXAuditReport from LLM output
│
└── frontend/
    ├── app/
    │   ├── page.tsx               # Home page — upload + analyze
    │   ├── layout.tsx             # Root layout, fonts, metadata
    │   ├── globals.css            # Design system, animations, glass effects
    │   └── report/page.tsx        # Report dashboard page
    │
    ├── components/
    │   ├── UploadZone.tsx         # Drag & drop image uploader
    │   ├── ScoreRing.tsx          # Animated SVG score ring
    │   ├── DimensionCard.tsx      # Per-dimension score card
    │   └── IssueList.tsx          # Filterable, expandable issue list
    │
    └── lib/
        └── api.ts                 # Typed API client (analyzeDesign, checkHealth)
```

---

## 🚀 Quick Start

### Prerequisites

- **Python 3.11+**
- **Node.js 18+**
- **[Ollama](https://ollama.com)** installed and running

---

### Step 1 — Install Ollama & Pull Models

```bash
# Download Ollama from https://ollama.com and install it

# Pull the vision model (3.2 GB — works on 4GB VRAM)
ollama pull qwen2.5vl:3b

# Pull the reasoning model (2.5 GB)
ollama pull qwen3:4b

# Verify both are installed
ollama list
```

> **Hardware note:** Both models load **sequentially** (never simultaneously). Max VRAM used at any point is 3.2 GB — safe for a GTX 1650 or any GPU with 4GB+ VRAM.

---

### Step 2 — Start the Backend

```bash
cd backend

# Create virtual environment
python -m venv .venv

# Activate (Windows)
.\.venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Copy environment config
cp .env.example .env

# Start the API server
uvicorn main:app --reload --port 8000
```

The backend will be available at `http://localhost:8000`.  
OpenAPI docs: `http://localhost:8000/docs`

---

### Step 3 — Start the Frontend

```bash
cd frontend
npm install
npm run dev
```

Open **`http://localhost:3000`** in your browser.

---

### Step 4 — Analyze a Design

1. Open `http://localhost:3000`
2. Make sure **Demo mode** is **OFF** (toggle above the Analyze button)
3. Drag & drop or click to upload any UI screenshot (PNG, JPG, WebP — max 10MB)
4. Click **✦ Analyze Design**
5. Wait 60–180 seconds for the pipeline to complete (first run loads models)
6. Review your full UX Audit Report

> **No Ollama?** Toggle **Demo mode ON** — the platform returns a realistic sample report instantly, no AI backend required.

---

## 🔧 Configuration

Edit `backend/.env` to configure models and settings:

```env
# Ollama server
OLLAMA_BASE_URL=http://localhost:11434

# Models (tuned for 4GB VRAM)
VISION_MODEL=qwen2.5vl:3b
REASONING_MODEL=qwen3:4b

# API limits
MAX_IMAGE_SIZE_MB=10
FRONTEND_URL=http://localhost:3000
```

---

## 🌐 API Reference

| Endpoint | Method | Description |
|---|---|---|
| `GET /health` | GET | Server status, active backend, model availability |
| `POST /analyze` | POST | Upload image → receive UX audit report |
| `POST /analyze?mock=true` | POST | Return sample report without AI (for development) |

**Example:**
```bash
# Real analysis
curl -X POST http://localhost:8000/analyze \
  -F "file=@screenshot.png"

# Mock mode (no Ollama needed)
curl -X POST "http://localhost:8000/analyze?mock=true" \
  -F "file=@screenshot.png"
```

---

## 🤖 AI Development Credits

UXterity was built with the assistance of two AI pair-programming tools:

- **[Claude AI](https://claude.ai) by Anthropic** — Used for architecture planning, LangGraph pipeline design, backend code generation, and debugging complex async patterns.
- **[Gemini](https://gemini.google.com) by Google DeepMind** — Used for code review, bug identification, frontend component design, and iterative refinement of the full stack.

All product decisions, model selection, prompt engineering, and final implementation were driven by the developer. Claude and Gemini accelerated the build — they did not replace the engineering judgment behind it.

---

## 📄 License

MIT © 2026 — Built with ❤️, local AI, and a lot of coffee.
