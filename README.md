# MediBridge AI
**AI-Powered Multilingual Clinical Intake Platform**  
*Smart India Hackathon (SIH) 2026 Prototype & Standalone Demonstration*

> **IMPORTANT NOTICE:**  
> This repository contains a standalone frontend demonstration prototype using synthetic data. AI, OCR, ASR (speech recognition), and ABDM / FHIR integrations are represented through simulated demo workflows. It is not connected to live hospital databases or diagnostic models and is not intended for clinical diagnosis.

---

## 1. Problem
In modern outpatient departments (OPDs) and busy clinical setups:
- **Fragmented Medical History:** Prior prescriptions, laboratory investigations, and discharge summaries are scattered across physical paper slips, WhatsApp images, and multiple clinics.
- **Language & Communication Gaps:** In linguistically diverse regions like India, patients often struggle to explain nuances of their symptoms in English or non-native languages.
- **Unstructured Medical Documents:** Handwritten notes and diverse lab report templates cannot be rapidly digested during brief clinical consults.
- **Limited Clinical Time:** Physicians often spend 60% or more of an OPD encounter manually collecting and re-typing basic patient history rather than focusing on physical examination and treatment planning.

---

## 2. Solution
**MediBridge AI** standardizes and speeds up clinical intake before the patient even meets the doctor:
- Patients describe what they feel through **multilingual voice prompts** or intuitive touch selectors in their native language (Hindi, Marathi, Gujarati, Bengali, English).
- Previous physical records and lab PDFs are ingested via **document OCR scanning**.
- An AI structuring layer converts conversational complaints and lab values into a standardized, chronological **SOAP-compatible clinical summary**.
- The attending doctor reviews, edits, or verifies each observation with full **audit trail logging** before consultation begins.

---

## 3. Core Workflow

```
Patient Voice + Touch + Medical Documents
                    ↓
              AI Processing
                    ↓
       Structured Clinical History
                    ↓
          Doctor Verification
                    ↓
             Consultation
```

---

## 4. Key Features

1. **Standalone & Zero Dependencies:**
   - Engineered purely with **HTML5, CSS3, and Vanilla JavaScript**.
   - No npm, Node.js, React, backend servers, databases, or API keys required.
   - Runs out-of-the-box by double-clicking `index.html` or hosting on **GitHub Pages**.

2. **Interactive 6-Step Patient Intake:**
   - **01 Identity:** Synthetic patient identification (Aarav Sharma, ABHA: DEMO-ABHA-001).
   - **02 Consent:** Explicit digital consent-first gateway.
   - **03 Language:** Regional language selection (English, हिन्दी, मराठी, ગુજરાતી, বাংলা).
   - **04 Symptoms:** Simulated voice speech recognition + touch-based symptom tags.
   - **05 Documents:** Drag & drop document intake with simulated OCR scanning animation.
   - **06 Review:** Handover summary ready for doctor verification.

3. **Deterministic Red-Flag Demonstration:**
   - Demonstrates safety triage: If high-risk combinations like **Chest Pain + Breathing Difficulty** are detected, an immediate "Attention Required" clinical safety prompt is triggered (clearly marked as triage guidance, not a diagnosis).

4. **Medical Document Intelligence (Demo OCR):**
   - Simulated OCR scanner demonstrating laser beam animation and progressive status stages (*Scanning → Extracting → Identifying → Structuring*).
   - Extracts key synthetic hematology parameters (Hemoglobin, WBC Leukocytosis, Platelet count).

5. **Medical Timeline:**
   - Chronological patient timeline (2024 Viral Consultation → 2025 Dyspepsia Visit → 2025 Lab CBC Investigation → 2026 Current Fever & Epigastric Symptoms).
   - Interactive modal inspection with attribution source tags (`Patient Input`, `Document`, `AI Extracted`, `Doctor Verified`).

6. **AI Clinical Summary & Confidence Badges:**
   - Chief Complaint, History of Present Illness (HPI), Past Medical History (PMH), Medication History, and Relevant Findings.
   - Distinct source tags: `[PATIENT]`, `[DOCUMENT]`, `[AI STRUCTURED]`.
   - Clear confidence meters distinguishing syntactic parsing quality from medical certainty.

7. **Doctor Verification & Audit Trail:**
   - Physician workstation controls for each finding: **[✓ Verify]**, **[✎ Edit]**, **[× Reject]**.
   - Real-time timestamped audit log (`14:32 — AI generated`, `14:33 — Doctor reviewed`, `14:34 — Doctor verified`).

8. **Hospital Doctor Dashboard:**
   - Modern hospital layout with key daily metrics (Patients Today, Awaiting Review, Completed, Documents Processed) and triage queue.

---

## 5. Technology Stack & Architecture

- **Frontend:** Semantic HTML5, Modular CSS3 Design Tokens, Vanilla JavaScript (ES6+).
- **Icons & Graphics:** Clean inline SVG icons, zero external icon web-fonts or CDN requests.
- **AI Processing Layer (Architecture Model):**
  - **ASR:** Conceptualized for integration with Indian language models (such as Bhashini ASR).
  - **Document Intelligence:** Medical OCR & entity normalization architecture.
  - **Clinical Structuring:** LLM prompt-chaining with deterministic rule engines.
- **Interoperability (Architecture Model):**
  - Designed for **FHIR (Fast Healthcare Interoperability Resources)** data exchange.
  - Ready for **Ayushman Bharat Digital Mission (ABDM)** gateway integration.

---

## 6. Project Structure

```
MediBridge-AI-Demo/
│
├── index.html          # Complete Single-Page Application (SPA) layout
├── style.css           # Design tokens, typography, stepper, animations & responsive styling
├── script.js           # State management, SPA routing, voice simulation, OCR, & verification
├── README.md           # Project documentation and deployment guide
│
└── assets/
    └── logo.svg        # Clean vector branding mark
```

---

## 7. How to Run Locally

Because this project requires **no server and no build step**, running it is instant:

### Method 1: Double-Click
1. Download or clone this repository.
2. Navigate to the `MediBridge-AI-Demo` folder.
3. Double-click `index.html` to open it in your web browser (Chrome, Edge, Firefox, Safari).

### Method 2: Local Static Server (Optional)
If you prefer running through a lightweight local server:
```bash
# Using Python 3 built-in server
python -m http.server 8000
```
Then visit `http://localhost:8000` in your browser.

---

## 8. GitHub Pages Deployment Steps

Deploying this demo to GitHub Pages takes under 2 minutes:

1. **Create a GitHub Repository:**
   - Go to [github.com/new](https://github.com/new).
   - Name your repository (e.g., `medibridge-ai-demo`).
   - Choose **Public**.

2. **Push the Files to GitHub:**
   ```bash
   cd MediBridge-AI-Demo
   git init
   git add .
   git commit -m "Initial commit: MediBridge AI standalone demo"
   git branch -M main
   git remote add origin https://github.com/<your-username>/medibridge-ai-demo.git
   git push -u origin main
   ```

3. **Enable GitHub Pages:**
   - Open your repository on GitHub.
   - Navigate to **Settings** → **Pages** (in the left sidebar).
   - Under **Build and deployment** → **Source**, select `Deploy from a branch`.
   - Under **Branch**, select `main` and `/ (root)`, then click **Save**.

4. **Access Your Live Demo:**
   - In 1–2 minutes, your live demo will be published at:  
     `https://<your-username>.github.io/medibridge-ai-demo/`

---

## 9. Prototype Limitations & Future Scope

### Current Demonstration Prototype
- Uses synthetic demonstration data for patient identity, audio transcripts, and lab reports.
- Speech recognition, OCR, and AI summaries are simulated client-side to guarantee 100% offline availability and zero API credential failure during hackathon demonstrations.

### Future Scope for Live Production Deployment
- **Live Bhashini API Integration:** Seamless speech-to-text in 22 scheduled Indian languages with dialect adaptation.
- **Edge Vision OCR:** On-device camera capture for handwritten doctor scripts and regional lab receipts.
- **Production ABDM M1/M2/M3 Integration:** Direct linkage to Ayushman Bharat Health Account (ABHA) IDs for seamless longitudinal record retrieval across empaneled hospitals.
- **FHIR R4 Generation:** Automatic conversion of verified clinical summaries into FHIR `Bundle` and `Composition` resources for hospital EMR ingestion.

---

## 10. License & Attribution
Developed for the **Smart India Hackathon (SIH) 2026**. Designed and built for seamless demonstration, ethical clinical AI governance, and physician-in-the-loop validation.
