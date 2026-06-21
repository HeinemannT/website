import React from 'react';
import { getLesson } from '../curriculum.js';
import { LessonShell } from '../components/LessonShell.jsx';
import { Lead, Objectives, Stage, Pull } from '../components/prose.jsx';
import { DataQualityScorecard } from '../tools/DataQualityScorecard.jsx';

const lesson = getLesson('5a');
const readings = [
  { kind: 'FREE', title: 'BCBS 239 — Principles for risk data aggregation & reporting (BIS)', note: 'The standard, born from 2008: banks couldn’t aggregate their own risk fast enough.' },
  { kind: 'FREE', title: 'BCBS progress reports on BCBS 239 adoption', note: 'Sobering evidence that even large banks struggle to comply.' },
  { kind: 'BOOK', title: 'Enterprise Risk Management', note: 'James Lam — risk data, technology, and the GRC infrastructure.' },
];
const retrieval = [
  { q: 'BCBS 239 exists because, in the 2008 crisis…', options: [
    { text: 'banks couldn’t aggregate their own exposures fast or accurately enough to see the danger.', correct: true },
    { text: 'there was too much capital.' },
    { text: 'models were too conservative.' }] },
  { q: 'An aggregated risk number is only as trustworthy as…', options: [
    { text: 'the quality and completeness of the data beneath it.', correct: true },
    { text: 'the seniority of who presents it.' },
    { text: 'the colour of the dashboard.' }] },
];

export default function Lesson5a() {
  return (
    <LessonShell lesson={lesson} retrieval={retrieval} readings={readings}>
      <Lead>The portfolio view in Part 3 assumed you could actually add your risks up. For many real organizations, that assumption is the weakest link of all.</Lead>
      <p className="measure">In the 2008 crisis, some of the world’s largest banks discovered they couldn’t answer a simple question — “what is our total exposure to this counterparty?” — for days, because the data lived in dozens of incompatible systems. The aggregation was sound in theory and impossible in practice. Out of that failure came BCBS 239, a set of principles for risk-data aggregation that boils down to an uncomfortable truth: an enterprise risk view is only as good as the plumbing underneath it, and the plumbing is usually worse than anyone admits.</p>

      <Objectives items={[
        'Explain why risk-data infrastructure is a risk in its own right.',
        'Summarise what BCBS 239 asks for: accuracy, completeness, timeliness, adaptability.',
        'Assess your organization’s data quality and find the gaps (Artifact A12).',
      ]} />

      <Stage n={1} kicker="Understand the discipline" title="The plumbing nobody sees until it bursts" />
      <p className="measure">BCBS 239 groups its principles into governance, the aggregation capability itself, and reporting. The themes are unglamorous and decisive: can you trust the numbers (accuracy), do they cover everything (completeness), can you get them when it matters — especially in a crisis — (timeliness), and can you answer a question you didn’t prepare for (adaptability)? GRC systems and data warehouses are the machinery, but the principle is what counts: data quality is not an IT housekeeping issue, it’s the foundation every aggregated risk number stands on. The progress reports are blunt — years on, full compliance remains rare even among the largest banks.</p>

      <Stage n={2} kicker="Quantify — what the maths does" title="Garbage in, aggregated garbage out" />
      <p className="measure">There’s a direct line from here back to Part 4: every simulation, every VaR, every aggregated capital figure consumes data, and feeds on its flaws silently. A beautifully built Monte Carlo on incomplete data produces a confident, wrong distribution — and you can’t see the error in the output, only in the inputs. So the “quantification” here is honest self-scoring: rate each data dimension and find where the foundation is thin, because that’s where your most impressive numbers are quietly least trustworthy.</p>
      <Pull>You can’t aggregate your way out of bad data. The cleverest model in the world, fed broken inputs, just makes the error harder to spot.</Pull>

      <Stage n={3} kicker="Build it on your organization" title="Score your data" />
      <p className="measure">Rate your organization against the BCBS 239 dimensions and see where the plumbing is weakest. Those gaps are a to-do list for the infrastructure that makes everything upstream trustworthy. Saved as Artifact A12.</p>
      <DataQualityScorecard lessonId="5a" artifactId="A12" />
    </LessonShell>
  );
}
