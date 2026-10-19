/**
 * Hero Developer Workspace & Automation Simulator
 */

const codeSnippets = {
  python: `
<span class="code-comment"># LeadHunter.AI Pipeline Engine — Dhruv Joshi</span>
<span class="code-keyword">import</span> yrex_ai, webhooks

<span class="code-keyword">async def</span> <span class="code-func">process_incoming_lead</span>(payload):
    lead = <span class="code-keyword">await</span> yrex_ai.verify(payload.email)
    score = <span class="code-keyword">await</span> yrex_ai.score_intent(lead.firmographics)
    
    <span class="code-keyword">if</span> score >= 85:
        crm_record = <span class="code-keyword">await</span> crm.create_lead(lead, priority=<span class="code-string">"HIGH"</span>)
        <span class="code-keyword">await</span> notifications.send_alert(f<span class="code-string">"Qualified lead: {lead.name}"</span>)
    <span class="code-keyword">return</span> {<span class="code-string">"status"</span>: <span class="code-string">"active"</span>, <span class="code-string">"score"</span>: score}
`.trim(),

  javascript: `
<span class="code-comment">// High-Velocity CRM Lead Sync Hook</span>
<span class="code-keyword">export async function</span> <span class="code-func">onLeadReceived</span>(req, res) {
  <span class="code-keyword">const</span> { leadId, company, source } = req.body;
  
  <span class="code-comment">// Dispatch to automated qualification queue</span>
  <span class="code-keyword">const</span> qualified = <span class="code-keyword">await</span> queue.dispatch(<span class="code-string">'lead.qualify'</span>, {
    leadId,
    timestamp: Date.now(),
    routedBy: <span class="code-string">'Yrex Automation'</span>
  });

  <span class="code-keyword">return</span> res.status(200).json({ synced: <span class="code-keyword">true</span>, qualified });
}
`.trim(),

  json: `
{
  <span class="code-string">"system"</span>: <span class="code-string">"Yrex AI Automation Engine"</span>,
  <span class="code-string">"architect"</span>: <span class="code-string">"Dhruv Joshi"</span>,
  <span class="code-string">"role"</span>: <span class="code-string">"Co-Founder &amp; CEO"</span>,
  <span class="code-string">"capabilities"</span>: [
    <span class="code-string">"Web Development"</span>,
    <span class="code-string">"AI Process Automation"</span>,
    <span class="code-string">"CRM Pipeline Architecture"</span>
  ],
  <span class="code-string">"uptime"</span>: <span class="code-string">"99.98%"</span>
}
`.trim()
};

class HeroTerminal {
  constructor() {
    this.tabs = document.querySelectorAll('.window-tab');
    this.codeContainer = document.getElementById('hero-code-snippet');
    this.nodes = document.querySelectorAll('.flow-node');
    this.activeNodeIndex = 0;
    
    this.initTabs();
    this.initNodeCycle();
  }

  initTabs() {
    if (!this.tabs || !this.codeContainer) return;

    this.tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        this.tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        const lang = tab.dataset.lang;
        if (codeSnippets[lang]) {
          this.codeContainer.innerHTML = codeSnippets[lang];
        }
      });
    });
  }

  initNodeCycle() {
    if (!this.nodes.length) return;

    setInterval(() => {
      this.nodes.forEach(n => n.classList.remove('active'));
      this.activeNodeIndex = (this.activeNodeIndex + 1) % this.nodes.length;
      this.nodes[this.activeNodeIndex].classList.add('active');
    }, 2400);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new HeroTerminal();
});
