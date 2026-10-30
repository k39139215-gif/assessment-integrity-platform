# 🎓 Assessment Integrity & Real-Time Code Proctoring Engine

[![Node.js](https://img.shields.io/badge/Node.js-Express-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-Strict-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?logo=prisma&logoColor=white)](https://prisma.io/)
[![Telemetry](https://img.shields.io/badge/Engine-Real--Time_Keystroke_Telemetry-blue)]()
[![License: Proprietary](https://img.shields.io/badge/License-Proprietary_All_Rights_Reserved-red.svg)](LICENSE)

A real-time behavioral telemetry and anti-cheat assessment engine designed for technical coding exams. Detects abnormal paste spikes, browser blur / focus-loss sequences, and typing velocity deviations to generate auditable integrity scores without invasive webcam monitoring.

---

## 📐 System Architecture

```mermaid
flowchart TD
    subgraph Client_Proctoring ["Candidate Assessment Environment"]
        IDE["In-Browser Code Editor"]
        Listener["DOM Event Listeners (Keystroke, Paste, Window Blur)"]
        Batcher["Buffered Telemetry Event Streamer"]
    end

    subgraph Backend_Telemetry ["Ingestion & Verification (Express + TypeScript)"]
        API["POST /api/assessments/:id/events"]
        RiskEngine["Real-Time Risk Scoring Engine (riskEngine.ts)"]
        PrismaORM["Prisma ORM (AssessmentSession & Event Records)"]
    end

    subgraph Proctor_Dashboard ["Integrity Scorecard & Analytics"]
        Score["Cheat Probability Score (0 - 100)"]
        Flags["Auditable Trigger Flags (Large Paste, High Focus Loss)"]
    end

    IDE --> Listener
    Listener --> Batcher
    Batcher -->|JSON Event Stream| API
    API --> PrismaORM
    API --> RiskEngine
    RiskEngine --> Score
    RiskEngine --> Flags
```

---

## 🌟 Key Capabilities

1. **Non-Invasive Keystroke Dynamics:**
   * Tracks incremental character deltas (`TYPE` events) versus external clipboard dumps (`PASTE` & `LARGE_PASTE` events).
   * Flags suspicious burst typing velocity exceeding standard human cadence.

2. **Window Focus Loss Tracking:**
   * Detects `blur` and `focus` events when candidates switch to secondary tabs (e.g. ChatGPT, documentation, or IDEs) and calculates total off-screen duration.

3. **Deterministic Integrity Risk Scoring:**
   * `riskEngine.ts` computes an auditable score ($0 - 100$) paired with discrete behavioral deduction reasons:
     * High paste-to-type character volume ratio
     * Repeated window blur interruptions
     * Multi-line paste injections without preceding draft iterations

4. **Split-Screen Proctoring Dashboard:**
   * Real-time dark UI in `public/index.html` displaying live candidate code, event stream timeline, and dynamic risk meters.

---

## 📁 Repository Structure

```text
assessment-integrity-platform/
├── prisma/
│   └── schema.prisma        # Database models for sessions & telemetry events
├── public/
│   └── index.html           # Real-time candidate IDE & proctoring dashboard
├── src/
│   ├── riskEngine.ts        # Pure deterministic risk assessment algorithm
│   └── server.ts            # Express REST API & event ingestion endpoints
├── package.json             # TypeScript & Prisma configuration
└── tsconfig.json            # Strict TypeScript configuration
```

---

## 🚀 How to Run

1. **Install Dependencies:**
   ```bash
   npm install
   ```

2. **Initialize Database:**
   ```bash
   npx prisma db push
   ```

3. **Start Assessment Server:**
   ```bash
   npm run dev
   ```
   *Access the candidate test environment at `http://localhost:3000`.*

---

## ⚖️ Intellectual Property & License

**Copyright (c) 2026 Kartik. All Rights Reserved.**

This repository and its source code are published for **viewing, evaluation, and portfolio demonstration purposes only**. No permission is granted to reproduce, distribute, modify, deploy, or commercially exploit this software. See the [LICENSE](LICENSE) file for complete legal terms.
