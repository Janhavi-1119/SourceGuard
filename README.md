# VerifAI — AI-Powered Information Verification Platform

> **"Know what's true. Understand why."**
> An autonomous multi-source intelligence verification platform built for hackathons, investigative analysts, researchers, and decision-makers.

---

## 🌟 Executive Summary

VerifAI fundamentally shifts how users verify information. Rather than simply declaring what is true via a black-box AI summary, VerifAI decomposes questions into atomic claims, cross-references claims against independent sources, flags direct factual contradictions, monitors information freshness, and displays an evidence-backed comparison matrix.

---

## 🛠️ Tech Stack

- **Framework**: [React 19](https://react.dev/) + [Vite 8](https://vite.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/) (strict mode, zero build warnings)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Typography**: [Plus Jakarta Sans](https://fonts.google.com/specimen/Plus+Jakarta+Sans) & JetBrains Mono
- **Icons**: [Lucide React](https://lucide.dev/)
- **Routing**: [React Router DOM v7](https://reactrouter.com/)
- **Storage**: Local persistence engine (`localStorage`)

---

## 🎨 Visual Identity & Design Language

- **Primary Background**: Warm off-white (`#F8F9FC`)
- **Primary Text**: Deep navy (`#172033`)
- **Accent**: Electric Indigo (`#4F46E5`)
- **Secondary Surfaces**: Clean White (`#FFFFFF`) with subtle slate borders and soft shadows
- **Design Influences**: Linear, Notion, Perplexity, and Stripe Dashboard

---

## 🚀 Application Screens & Architecture

### 1. Landing / Overview Dashboard (`/`)
- Hero section: *"Know what's true. Understand why."*
- Prominent verification input area: add research questions, attach URLs, paste raw text excerpts, or pick curated prompt presets.
- Real-time KPI counters: Total Analyses, Sources Analyzed, Conflicts Detected, Reports Generated.
- Recent analysis stream with status indicators.
- 4-stage interactive "How VerifAI Works" workflow diagram.

### 2. New Analysis Workspace (`/new-analysis`)
- Research question input with sample preloading.
- Multi-source ingestion (web URLs, PDFs/articles, and verbatim pasted transcripts).
- Ingestion options:
  - *Detect Conflicting Claims*
  - *Check Information Freshness*
  - *Identify Missing Evidence*
  - *Compare Source Reliability*
- Realistic multi-stage verification pipeline with live progress indicators.

### 3. Analysis Results & Dossier (`/results`)
- Top verdict header: Supported, Partially Supported, Conflicting, Insufficient Evidence.
- Seven deep-dive verification tabs:
  1. **Key Findings**: Collective synthesis and verified takeaways.
  2. **Claim Comparison**: Expandable claims with individual source stances.
  3. **Conflicts Detected**: Side-by-side comparison of conflicting quotes with severity flags.
  4. **Information Freshness**: Publication timeline and stale information detection.
  5. **Missing Evidence**: Identified blind spots and recommended next steps.
  6. **Final Conclusion**: Evidence-backed verdict.
  7. **Source References**: Canonical URLs, domains, publication dates, and reliability scores.
- Save report button with local persistence.

### 4. Cross-Source Comparison Matrix (`/comparison`)
- Comprehensive cross-examination grid:
  - **Rows**: Decomposed atomic claims.
  - **Columns**: Independent sources.
  - **Color-coded cells**: Green (Supports), Red (Contradicts), Amber (Partially Supports), Gray (No Info).
- Clickable cells that open cited verbatim quotes and proof.
- Claim search filter and status filtering.
- One-click CSV export for reports.

### 5. Saved Reports (`/saved-reports`)
- Full dossier management with search, status filtering, and one-click deletion.
- Persisted locally with demo seeds available.

### 6. Audit & History (`/history`)
- Chronological run log of all verified queries and ingestion tasks.

### 7. Engine Settings (`/settings`)
- AI Model selection (GPT-4o, Claude 3.7 Sonnet, Gemini 2.5 Pro, Local Ollama).
- Confidence threshold sliders and information stale horizon controls.
- Zero-hallucination strict mode toggle.
- Local cache management.

---

## 🏃 Running the Application

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start development server**:
   ```bash
   npm run dev
   ```

3. **Build for production**:
   ```bash
   npm run build
   ```

4. **Preview production build**:
   ```bash
   npm run preview
   ```
