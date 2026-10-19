/**
 * Project Showcases, LeadHunter.AI 8-Stage Pipeline Visualizer & System Architecture Modals
 */

const pipelineData = {
  discover: {
    num: "01",
    title: "DISCOVER LEADS",
    desc: "Ingests target industry profiles and digital footprint signals across verified business directories and public APIs.",
    sample: '{ "source": "API_Crawler", "prospect": "TechCorp Logistics", "industry": "Supply Chain SaaS", "signals": ["Hiring +24%", "New Funding"] }'
  },
  save: {
    num: "02",
    title: "SAVE TO REPOSITORY",
    desc: "Persists raw prospect records with immutable timestamps, deduplicating contacts against the existing database.",
    sample: '{ "record_id": "REC_90823", "status": "staged", "dedup_checked": true, "created_at": "2026-10-05T12:00:00Z" }'
  },
  display: {
    num: "03",
    title: "DISPLAY FEED",
    desc: "Renders clean prospect summary cards in Dhruv's high-velocity review interface with rapid filter toggles.",
    sample: '{ "view": "grid_feed", "active_filters": ["tech_stack:Python", "location:US/EU"], "rendered_items": 12 }'
  },
  verify: {
    num: "04",
    title: "VERIFY DELIVERABILITY",
    desc: "Conducts multi-step MX-record queries, disposable domain checks, and live SMTP handshake validation.",
    sample: '{ "email": "director@techcorp.io", "mx_valid": true, "smtp_code": 250, "deliverability_confidence": 0.98 }'
  },
  score: {
    num: "05",
    title: "AI INTENT SCORING",
    desc: "Neural model evaluates firmographic fit, employee growth velocity, and technical relevance to assign a 0–100 score.",
    sample: '{ "fit_score": 94, "category": "HIGH_INTENT", "rationale": "High tech budget + active operational expansion" }'
  },
  personalize: {
    num: "06",
    title: "AI PERSONALIZATION",
    desc: "Synthesizes tailored, non-generic conversation angles referencing specific operational pain points of the business.",
    sample: '{ "subject": "Automating TechCorp\'s partner lead routing", "icebreaker": "Saw your team expanded delivery nodes by 30% this quarter..." }'
  },
  approval: {
    num: "07",
    title: "HUMAN-IN-THE-LOOP APPROVAL",
    desc: "Guarantees brand protection and strategic alignment: an operator can approve, tweak, or reject with a single hotkey.",
    sample: '{ "gate": "human_review", "approved_by": "Dhruv", "status": "APPROVED_FOR_SEND", "modifications": 0 }'
  },
  outreach: {
    num: "08",
    title: "DISPATCH OUTREACH",
    desc: "Routes approved communications through warm sender pools with automated deliverability pacing and analytics.",
    sample: '{ "queue": "priority_outbox", "scheduled_send": "OptimalTime_10:15AM", "tracking": { "clicks": true, "replies": true } }'
  }
};

const projectArchitectureSpecs = {
  leadhunter: {
    title: "LeadHunter.AI — System Architecture",
    category: "AI & Workflow Automation",
    overview: "LeadHunter.AI was engineered as an autonomous lead intelligence pipeline that removes hours of manual prospect scraping and replaces cold spam with verified, high-scoring intent outreach.",
    diagram: `
+------------------+      +------------------+      +---------------------+
| Discovery Engine | ---> |  Data Staging    | ---> | Email Deliverability|
| (API & Signals)  |      |  (Deduplication) |      | (MX & SMTP Handshake|
+------------------+      +------------------+      +---------------------+
                                                               |
                                                               v
+------------------+      +------------------+      +---------------------+
| Multi-Channel    | <--- | Human-in-Loop    | <--- | AI Intent Scoring   |
| Outreach Nodes   |      | Approval Gate    |      | & Personalization   |
+------------------+      +------------------+      +---------------------+
    `.trim(),
    techStack: ["Python", "FastAPI / Webhooks", "OpenAI / Claude APIs", "SMTP Deliverability Engine", "Tailored Frontend Dashboard"],
    keyDecisions: [
      "Built a strict human-in-the-loop review safeguard before sending to prevent hallucinated or repetitive AI copy.",
      "Embedded an asynchronous queue to prevent API rate limits when scoring hundreds of prospects simultaneously.",
      "Designed a real-time confidence metric that flags low-relevance leads before any outreach is scheduled."
    ]
  },
  mediacquire: {
    title: "MediAcquire — Healthcare Acquisition System",
    category: "Web Development & Conversion Systems",
    overview: "A conversion-focused web platform designed for healthcare practices and medical clinics to transition outdated, non-responsive websites into high-converting digital acquisition funnels.",
    diagram: `
[Mobile & Desktop Visitors]
         |
         v
[High-Speed Responsive Interface (Core Web Vitals Optimized)]
         |
         +---> [Interactive Clinic Service Navigator]
         |
         +---> [Secure HIPAA-Aware Patient Inquiry Form]
         |
         v
[Real-Time Clinic Staff SMS & Email Notification Hook]
    `.trim(),
    techStack: ["Semantic HTML5", "Responsive Vanilla CSS", "Vanilla JavaScript", "Form Validation & Anti-Spam", "Performance Optimization"],
    keyDecisions: [
      "Achieved sub-second initial load speeds on mobile networks to minimize patient drop-off.",
      "Designed a frictionless step-by-step intake form that increased appointment inquiry completion rates.",
      "Enforced accessible high-contrast typography suitable for patients of all age groups."
    ]
  }
};

class ProjectManager {
  constructor() {
    this.initPipelineVisualizer();
    this.initModals();
  }

  /* LeadHunter.AI 8-Stage Pipeline Visualizer */
  initPipelineVisualizer() {
    const nodes = document.querySelectorAll('.pipeline-step-node');
    const previewNum = document.getElementById('pipeline-preview-num');
    const previewTitle = document.getElementById('pipeline-preview-title');
    const previewDesc = document.getElementById('pipeline-preview-desc');
    const previewCode = document.getElementById('pipeline-preview-code');

    if (!nodes.length || !previewTitle) return;

    nodes.forEach(node => {
      node.addEventListener('click', () => {
        nodes.forEach(n => n.classList.remove('active'));
        node.classList.add('active');

        const stepKey = node.dataset.step;
        const data = pipelineData[stepKey];

        if (data) {
          if (previewNum) previewNum.textContent = data.num;
          previewTitle.textContent = data.title;
          previewDesc.textContent = data.desc;
          previewCode.textContent = data.sample;
        }
      });
    });
  }

  /* Architecture Deep Dive Modals */
  initModals() {
    const overlay = document.getElementById('architecture-modal');
    const closeBtn = document.getElementById('modal-close-btn');
    const modalTitle = document.getElementById('modal-project-title');
    const modalCategory = document.getElementById('modal-project-category');
    const modalOverview = document.getElementById('modal-project-overview');
    const modalDiagram = document.getElementById('modal-project-diagram');
    const modalTech = document.getElementById('modal-project-tech');
    const modalDecisions = document.getElementById('modal-project-decisions');

    if (!overlay) return;

    // Open modal triggers
    document.querySelectorAll('.open-arch-modal-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const projectId = btn.dataset.project;
        const spec = projectArchitectureSpecs[projectId];

        if (spec) {
          modalTitle.textContent = spec.title;
          modalCategory.textContent = spec.category;
          modalOverview.textContent = spec.overview;
          modalDiagram.textContent = spec.diagram;

          // Render tech stack
          modalTech.innerHTML = spec.techStack
            .map(tech => `<span class="tech-tag">${tech}</span>`)
            .join('');

          // Render key decisions
          modalDecisions.innerHTML = spec.keyDecisions
            .map(dec => `<li><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg> <span>${dec}</span></li>`)
            .join('');

          overlay.classList.add('active');
          document.body.style.overflow = 'hidden';
        }
      });
    });

    // Close modal
    const closeModal = () => {
      overlay.classList.remove('active');
      document.body.style.overflow = '';
    };

    if (closeBtn) closeBtn.addEventListener('click', closeModal);

    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) closeModal();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && overlay.classList.contains('active')) {
        closeModal();
      }
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new ProjectManager();
});
