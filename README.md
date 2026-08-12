# MedFlow AI

Hospital Workflow Intelligence & Automation Platform — hackathon prototype.

## Run
```bash
npm install
npm run dev
```

Open the Vite URL shown in the terminal.

## Demo flow
1. Dashboard → Bottleneck Radar.
2. Find OT-02 / S-1024 with consent + instrument bottlenecks.
3. Click **Resolve Bottleneck**.
4. The patient checklist is completed, an available CSSD pack is reserved, alerts are cleared, and the intelligence recalculates.
5. Open Analytics → **Simulate Bottleneck Resolution** to show 72% → 84%.
6. Use Reset Demo Data (bottom-right circular button) to restore the starting scenario.

## Notes
- No backend or external API is required.
- State persists in localStorage.
- Workflow intelligence is deliberately rule-based for the prototype.
- This is a Prototype / Decision Support Demonstration, not a clinical system.
