/**
 * ============================================================================
 * MediBridge AI - Standalone Frontend Controller
 * SIH 2026 Prototype
 * Zero external frameworks - Pure Vanilla JavaScript
 * ============================================================================
 */

// 1. Centralized Application State
const appState = {
  patient: {
    name: "Aarav Sharma",
    id: "DEMO-ABHA-001",
    age: 42,
    gender: "Male"
  },
  consent: false,
  language: "Hindi",
  symptoms: ["Fever", "Abdominal Discomfort"],
  documents: [
    { name: "blood_report_2025.pdf", type: "Lab Report", status: "OCR Ready" }
  ],
  extractedData: {
    hemoglobin: "13.2 g/dL",
    wbc: "15,700 /µL",
    platelets: "4.64 lakh/µL"
  },
  aiSummary: {
    chief: "Fever with abdominal discomfort for 3 days.",
    hpi: "Patient reports fever beginning approximately three days ago with associated abdominal discomfort.",
    pmh: "No known chronic ailments reported.",
    med: "Previous medication information extracted from uploaded document: Paracetamol 650mg SOS.",
    inv: "Previous laboratory report available. Elevated WBC 15,700 /µL; Platelets 4.64 lakh/µL; Hb 13.2 g/dL.",
    findings: "Abdominal discomfort localized to epigastric region by touch pointer; vitals stable."
  },
  verification: {
    1: { status: "pending", text: "Fever with abdominal discomfort for 3 days." },
    2: { status: "pending", text: "Patient reports fever beginning approximately three days ago with associated abdominal discomfort." },
    3: { status: "pending", text: "Previous laboratory report available. Elevated WBC 15,700 /µL; Platelets 4.64 lakh/µL; Hb 13.2 g/dL." }
  },
  currentStep: 1,
  currentSection: "home",
  auditTrail: [
    { time: "14:32", desc: "AI generated clinical intake summary" },
    { time: "14:33", desc: "Doctor opened patient record for review" }
  ]
};

// 2. Global Navigation Controller (SPA Behavior Without Page Reload)
const appNav = {
  goToSection: function(sectionId) {
    // Hide all sections
    const sections = document.querySelectorAll(".view-section");
    sections.forEach(sec => sec.classList.remove("active"));

    // Activate targeted section
    const targetSection = document.getElementById(`view-${sectionId}`);
    if (targetSection) {
      targetSection.classList.add("active");
      appState.currentSection = sectionId;
    }

    // Update active nav button
    const navLinks = document.querySelectorAll(".main-nav .nav-link");
    navLinks.forEach(link => {
      if (link.getAttribute("data-nav") === sectionId) {
        link.classList.add("active");
      } else {
        link.classList.remove("active");
      }
    });

    // Close mobile nav if open
    const mainNav = document.getElementById("mainNav");
    if (mainNav) {
      mainNav.classList.remove("mobile-active");
    }

    // Scroll to top of page smoothly
    window.scrollTo({ top: 0, behavior: "smooth" });
  },

  toggleMobileNav: function() {
    const mainNav = document.getElementById("mainNav");
    if (mainNav) {
      mainNav.classList.toggle("mobile-active");
    }
  }
};

// 3. Patient Intake Stepper Workflow Controller
const intakeFlow = {
  goToStep: function(stepNum) {
    if (stepNum < 1 || stepNum > 6) return;

    // Check step requirements
    if (stepNum > 2 && !appState.consent) {
      showToast("Please provide consent to proceed past Step 2", "warning");
      stepNum = 2;
    }

    appState.currentStep = stepNum;

    // Update cards visibility
    for (let i = 1; i <= 6; i++) {
      const card = document.getElementById(`stepCard${i}`);
      if (card) {
        card.classList.toggle("active", i === stepNum);
      }
    }

    // Update Stepper Progress UI
    const stepBtns = document.querySelectorAll("#stepperProgressBar .stepper-step");
    stepBtns.forEach(btn => {
      const stepVal = parseInt(btn.getAttribute("data-step"), 10);
      btn.classList.toggle("active", stepVal === stepNum);
      btn.classList.toggle("completed", stepVal < stepNum);
    });

    window.scrollTo({ top: 120, behavior: "smooth" });
  },

  submitIdentity: function() {
    const name = document.getElementById("patientNameInput").value.trim();
    const id = document.getElementById("patientIdInput").value.trim();
    const age = document.getElementById("patientAgeInput").value;
    const gender = document.getElementById("patientGenderInput").value;

    if (!name || !id || !age) {
      showToast("Please complete all patient identity fields", "warning");
      return;
    }

    appState.patient.name = name;
    appState.patient.id = id;
    appState.patient.age = age;
    appState.patient.gender = gender;

    // Reflect to summary banner
    const summaryPatientName = document.getElementById("summaryPatientName");
    const summaryPatientMeta = document.getElementById("summaryPatientMeta");
    if (summaryPatientName) summaryPatientName.textContent = name;
    if (summaryPatientMeta) summaryPatientMeta.textContent = `${age} / ${gender} • ${id}`;

    showToast("Patient identity recorded", "success");
    this.goToStep(2);
  },

  handleConsentChange: function() {
    const checkbox = document.getElementById("consentCheckbox");
    const submitBtn = document.getElementById("consentSubmitBtn");
    if (checkbox && submitBtn) {
      submitBtn.disabled = !checkbox.checked;
    }
  },

  submitConsent: function() {
    const checkbox = document.getElementById("consentCheckbox");
    if (!checkbox || !checkbox.checked) {
      showToast("Consent is required to continue", "warning");
      return;
    }
    appState.consent = true;
    showToast("Informed consent granted", "success");
    this.goToStep(3);
  },

  selectLanguage: function(lang) {
    appState.language = lang;
    const cards = document.querySelectorAll(".language-card");
    cards.forEach(card => {
      card.classList.toggle("active", card.getAttribute("data-lang") === lang);
    });
    showToast(`Language set to ${lang}`, "info");
  },

  submitLanguage: function() {
    this.goToStep(4);
  },

  triggerVoiceSimulation: function() {
    const micBtn = document.getElementById("micBtn");
    const micLabel = document.getElementById("micLabel");
    const transcriptBox = document.getElementById("speechTranscriptBox");
    const structuredBox = document.getElementById("structuredSymptomsOutput");

    if (!micBtn) return;

    micBtn.classList.add("listening");
    if (micLabel) micLabel.textContent = "Listening... (Simulating Audio Ingestion)";

    showToast("Listening to patient voice...", "info");

    setTimeout(() => {
      micBtn.classList.remove("listening");
      if (micLabel) micLabel.textContent = "Voice input captured";
      if (transcriptBox) transcriptBox.classList.add("active");
      if (structuredBox) structuredBox.style.display = "grid";

      // Ensure fever and abdominal discomfort are active in chips
      this.addSymptom("Fever");
      this.addSymptom("Abdominal Discomfort");

      showToast("Audio converted & structured into clinical terms", "success");
    }, 2000);
  },

  addSymptom: function(symptom) {
    if (!appState.symptoms.includes(symptom)) {
      appState.symptoms.push(symptom);
    }
    this.renderSymptomChips();
    this.checkRedFlags();
  },

  toggleSymptom: function(symptom) {
    const index = appState.symptoms.indexOf(symptom);
    if (index > -1) {
      appState.symptoms.splice(index, 1);
    } else {
      appState.symptoms.push(symptom);
    }
    this.renderSymptomChips();
    this.checkRedFlags();
  },

  renderSymptomChips: function() {
    const chips = document.querySelectorAll("#symptomsChipGrid .symptom-chip");
    chips.forEach(chip => {
      const sym = chip.getAttribute("data-symptom");
      const isSel = appState.symptoms.includes(sym);
      chip.classList.toggle("selected", isSel);
      chip.textContent = (isSel ? "✓ " : "+ ") + sym;
    });
  },

  checkRedFlags: function() {
    const redFlagBanner = document.getElementById("redFlagBanner");
    const hasChestPain = appState.symptoms.includes("Chest Pain");
    const hasBreathingDifficulty = appState.symptoms.includes("Breathing Difficulty");

    if (hasChestPain && hasBreathingDifficulty) {
      if (redFlagBanner) redFlagBanner.classList.add("active");
      showToast("Attention Required: Potential red-flag symptoms detected", "warning");
    } else {
      if (redFlagBanner) redFlagBanner.classList.remove("active");
    }
  },

  submitSymptoms: function() {
    if (appState.symptoms.length === 0) {
      showToast("Please describe or select at least one symptom", "warning");
      return;
    }
    this.goToStep(5);
  },

  submitDocuments: function() {
    this.goToStep(6);
  },

  completeConsultationPreparation: function() {
    showToast("Intake completed! Opening Doctor Dashboard...", "success");
    setTimeout(() => {
      appNav.goToSection("dashboard");
    }, 700);
  }
};

// 4. Medical Document & Mock OCR Controller
const docUpload = {
  selectDocType: function(type) {
    const btns = document.querySelectorAll(".doc-type-btn");
    btns.forEach(btn => {
      const span = btn.querySelector("span");
      if (span && span.textContent.includes(type)) {
        btn.classList.add("active");
      } else {
        btn.classList.remove("active");
      }
    });
  },

  triggerFileSelect: function() {
    const fileInput = document.getElementById("fileInputElem");
    if (fileInput) fileInput.click();
  },

  handleFileChosen: function(e) {
    const file = e.target.files[0];
    if (file) {
      const title = document.getElementById("dropzoneTitle");
      if (title) title.textContent = `Selected: ${file.name}`;
      showToast(`Selected document: ${file.name}`, "info");
    }
  },

  runDemoOCR: function() {
    const overlay = document.getElementById("ocrScanOverlay");
    const statusText = document.getElementById("scanStatusText");
    const progressFill = document.getElementById("scanProgressFill");
    const resultsCard = document.getElementById("ocrResultsCard");

    if (!overlay || !statusText || !progressFill) return;

    overlay.classList.add("active");
    resultsCard.classList.remove("active");

    const steps = [
      { text: "Scanning document...", progress: "25%" },
      { text: "Extracting text...", progress: "55%" },
      { text: "Identifying medical information...", progress: "80%" },
      { text: "Structuring clinical data...", progress: "100%" }
    ];

    let stepIndex = 0;

    const interval = setInterval(() => {
      if (stepIndex < steps.length) {
        statusText.textContent = steps[stepIndex].text;
        progressFill.style.width = steps[stepIndex].progress;
        stepIndex++;
      } else {
        clearInterval(interval);
        setTimeout(() => {
          overlay.classList.remove("active");
          resultsCard.classList.add("active");
          showToast("Document OCR extraction complete!", "success");
        }, 400);
      }
    }, 600);
  }
};

// 5. Timeline Detail Modal Controller
const timelineViewer = {
  events: {
    2024: {
      badge: "Doctor Verified • 2024",
      title: "Outpatient Consultation (General Viral Syndrome)",
      desc: "Patient presented with acute low-grade fever and myalgia. Attending physician evaluated and ruled out dengue/malaria via rapid test. Prescribed 5-day course of Paracetamol 650mg and oral hydration. Complete resolution documented."
    },
    20251: {
      badge: "Document Attached • 2025",
      title: "Hospital Day-care Visit (Dyspepsia Evaluation)",
      desc: "Patient attended clinic complaining of epigastric acidity following irregular meals. Abdominal ultrasound revealed mild mucosal gastritis with normal hepatobiliary architecture. Antacids and dietary advice provided."
    },
    20252: {
      badge: "AI Extracted OCR • 2025",
      title: "Laboratory Investigation (Complete Blood Count)",
      desc: "Routine diagnostic lab workup performed. Key values extracted: Hemoglobin 13.2 g/dL (normal range: 13.0-17.0), White Blood Cells 15,700 /µL (elevated leukocytosis, range: 4,000-11,000), Platelets 4.64 lakh/µL (normal)."
    },
    2026: {
      badge: "Patient Input • 2026 (Today)",
      title: "Current Intake: Acute Fever & Epigastric Discomfort",
      desc: "Patient self-reported 3-day history of persistent fever accompanied by upper abdominal fullness and discomfort. Hindi voice intake processed with high semantic confidence. Case compiled for physician review."
    }
  },

  openModal: function(id) {
    const data = this.events[id];
    if (!data) return;

    document.getElementById("modalBadge").textContent = data.badge;
    document.getElementById("modalTitle").textContent = data.title;
    document.getElementById("modalDesc").textContent = data.desc;

    const modal = document.getElementById("timelineModal");
    if (modal) modal.style.display = "flex";
  },

  closeModal: function() {
    const modal = document.getElementById("timelineModal");
    if (modal) modal.style.display = "none";
  }
};

// 6. Doctor Review & Clinical Governance Controller
const doctorReview = {
  switchSidebarTab: function(tab) {
    const items = document.querySelectorAll(".dash-nav-item");
    items.forEach(item => {
      if (item.textContent.toLowerCase().includes(tab)) {
        item.classList.add("active");
      } else {
        item.classList.remove("active");
      }
    });

    if (tab === "queue" || tab === "overview") {
      showToast(`Switched to Doctor Dashboard: ${tab}`, "info");
    } else {
      showToast(`Showing ${tab} view (Mock Hospital Tab)`, "info");
    }
  },

  openPatientReview: function(patientName) {
    showToast(`Opening clinical review for ${patientName}`, "info");
    appNav.goToSection("review");
  },

  verifyItem: function(index, title) {
    const statusBadge = document.getElementById(`statusBadge${index}`);
    if (statusBadge) {
      statusBadge.textContent = "Information verified by clinician";
      statusBadge.style.color = "var(--emerald-600)";
      statusBadge.style.fontWeight = "700";
    }

    const block = document.getElementById(`verifyBlock${index}`);
    if (block) {
      block.style.backgroundColor = "var(--cyan-50)";
      block.style.padding = "0.75rem";
      block.style.borderRadius = "var(--radius-md)";
    }

    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
    this.addAuditEntry(timeStr, `Doctor verified item: ${title}`);

    showToast(`Verified: ${title}`, "success");
  },

  openEdit: function(index) {
    const editBox = document.getElementById(`editBox${index}`);
    if (editBox) {
      editBox.classList.add("active");
    }
  },

  cancelEdit: function(index) {
    const editBox = document.getElementById(`editBox${index}`);
    if (editBox) {
      editBox.classList.remove("active");
    }
  },

  saveEdit: function(index) {
    const textarea = document.getElementById(`editText${index}`);
    const editBox = document.getElementById(`editBox${index}`);
    if (!textarea) return;

    const newText = textarea.value.trim();
    if (!newText) {
      showToast("Cannot save empty text", "warning");
      return;
    }

    // Update paragraph text
    const textElem = document.getElementById(index === 1 ? "reviewChiefText" : (index === 2 ? "reviewHpiText" : "reviewInvText"));
    if (textElem) {
      textElem.textContent = newText;
    }

    const statusBadge = document.getElementById(`statusBadge${index}`);
    if (statusBadge) {
      statusBadge.textContent = "Modified & verified by clinician";
      statusBadge.style.color = "var(--blue-600)";
      statusBadge.style.fontWeight = "700";
    }

    if (editBox) editBox.classList.remove("active");

    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
    this.addAuditEntry(timeStr, `Doctor edited item #${index}`);

    showToast("Clinical note updated by clinician", "success");
  },

  rejectItem: function(index, title) {
    const statusBadge = document.getElementById(`statusBadge${index}`);
    if (statusBadge) {
      statusBadge.textContent = "Rejected by clinician";
      statusBadge.style.color = "var(--rose-600)";
      statusBadge.style.fontWeight = "700";
    }

    const textElem = document.getElementById(index === 1 ? "reviewChiefText" : (index === 2 ? "reviewHpiText" : "reviewInvText"));
    if (textElem) {
      textElem.style.textDecoration = "line-through";
      textElem.style.opacity = "0.6";
    }

    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
    this.addAuditEntry(timeStr, `Doctor rejected item: ${title}`);

    showToast(`Marked as rejected: ${title}`, "warning");
  },

  addAuditEntry: function(timeStr, desc) {
    const list = document.getElementById("auditEventsList");
    if (!list) return;

    const row = document.createElement("div");
    row.className = "audit-event-row";
    row.innerHTML = `<span class="audit-time">${timeStr}</span><span class="audit-desc">${desc}</span>`;
    list.appendChild(row);
  },

  finalizeConsultation: function() {
    const banner = document.getElementById("finalSuccessBanner");
    if (banner) {
      banner.style.display = "block";
    }

    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
    this.addAuditEntry(timeStr, "Doctor completed consultation preparation");

    showToast("Patient history successfully prepared for doctor review.", "success");
  }
};

// 7. Toast Notification Service
function showToast(message, type = "info") {
  const container = document.getElementById("toastContainer");
  if (!container) return;

  const toast = document.createElement("div");
  toast.className = `toast ${type === "success" ? "toast-success" : (type === "warning" ? "toast-warning" : "")}`;
  toast.innerHTML = `
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <circle cx="12" cy="12" r="10"></circle>
      <polyline points="12 6 12 12 14 14"></polyline>
    </svg>
    <span>${message}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateX(50px)";
    toast.style.transition = "all 0.3s ease";
    setTimeout(() => {
      if (toast.parentNode) toast.parentNode.removeChild(toast);
    }, 300);
  }, 3500);
}

// 8. Keyboard Accessibility (Escape to close modals)
document.addEventListener("keydown", function(e) {
  if (e.key === "Escape") {
    timelineViewer.closeModal();
  }
});
