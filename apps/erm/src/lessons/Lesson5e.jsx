import React from 'react';
import { getLesson } from '../curriculum.js';
import { LessonShell } from '../components/LessonShell.jsx';
import { Lead, Objectives, Stage } from '../components/prose.jsx';
import { CapstoneAssembler } from '../tools/CapstoneAssembler.jsx';

const lesson = getLesson('5e');
const readings = [
  { kind: 'FREE', title: 'COSO ERM 2017 & ISO 31000 — the frameworks, revisited', note: 'Re-read the executive summaries now that every component means something concrete to you.' },
  { kind: 'BOOK', title: 'Enterprise Risk Management', note: 'James Lam — the closing chapters on a complete, integrated programme.' },
];

export default function Lesson5e() {
  return (
    <LessonShell lesson={lesson} readings={readings}>
      <Lead>There’s almost nothing new to learn here — and that’s the point. The capstone isn’t another topic. It’s the moment everything you’ve built clicks into a single, working whole.</Lead>
      <p className="measure">Look back at where you started: a blank organization and a vague sense that “risk” meant bad things happening. Since then you’ve written a charter, mapped how your organization creates value, set an appetite, built and evaluated a register, mapped controls, planned treatments, stood up indicators, classified and aggregated your whole risk universe, quantified the measurable parts, scored your data and maturity, built a board view, and audited your own judgement. Each was a real artifact for a real organization. The capstone simply assembles them — and shows you that they were a system all along.</p>

      <Objectives items={[
        'Assemble every artifact into one coherent risk operating model.',
        'Check it for completeness and internal coherence.',
        'Produce a board one-pager and export your model.',
        'See enterprise risk management as the integrated whole it was designed to be.',
      ]} />

      <Stage n={3} kicker="Assemble everything" title="Your risk operating model" />
      <p className="measure">The assembler pulls together everything in your operating model, checks that the pieces actually fit — do your top risks have owners, treatments, and a clear line back to your appetite? — and renders the board one-pager and a final score. Where it flags a gap, that gap <em>is</em> the remaining work; closing it is the last act of the course. When you’re done, export the whole model: it’s a genuine, defensible enterprise risk programme for your organization, built from first principles.</p>
      <CapstoneAssembler lessonId="5e" artifactId="CAP" />

      <p className="measure">That’s the course. You came in thinking risk management might be about avoiding bad things; you leave able to govern risk, run the process, map the universe, quantify what’s measurable, report it to a board, and stay honest about the limits of every number — organized judgement under uncertainty, which is what the discipline was always about. The math was only ever a tool for the measurable slice. The judgement is yours.</p>
    </LessonShell>
  );
}
