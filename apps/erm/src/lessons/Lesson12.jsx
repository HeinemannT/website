import React from 'react';
import { getLesson } from '../curriculum.js';
import { LessonShell } from '../components/LessonShell.jsx';
import { Lead, Objectives, Stage, Pull } from '../components/prose.jsx';
import { OrgValueSnapshot } from '../tools/OrgValueSnapshot.jsx';

const lesson = getLesson('1.2');

const readings = [
  { kind: 'FREE', title: 'Khan Academy / OpenLearn — reading financial statements', note: 'Free crash courses in the income statement, balance sheet, and cash flow — at the level this lesson needs.' },
  { kind: 'BOOK', title: 'Financial Intelligence', note: 'Berman & Knight (HBR) — financial literacy for managers; how to read the numbers without an accounting degree.' },
  { kind: 'BOOK', title: 'Enterprise Risk Management', note: 'James Lam — on tying risk to how the business actually creates and protects value.' },
];

const retrieval = [
  {
    q: 'Why must a risk manager understand how the business makes money?',
    options: [
      { text: 'Because risk is the effect of uncertainty on objectives — and you can’t protect value you don’t understand.', correct: true },
      { text: 'Because risk managers are responsible for the accounts.' },
      { text: 'Because every risk is ultimately financial.' },
    ],
  },
  {
    q: 'A company with a very thin operating margin is risky mainly because…',
    options: [
      { text: 'small adverse shocks can wipe out its profit entirely — there’s little cushion.', correct: true },
      { text: 'thin margins always mean fraud.' },
      { text: 'margin has nothing to do with risk.' },
    ],
  },
  {
    q: 'High debt-to-equity (high leverage) raises risk because…',
    options: [
      { text: 'there’s less buffer before losses breach covenants or threaten solvency.', correct: true },
      { text: 'debt is always cheaper than equity.' },
      { text: 'it improves the operating margin.' },
    ],
  },
];

export default function Lesson12() {
  return (
    <LessonShell lesson={lesson} retrieval={retrieval} readings={readings}>
      <Lead>You can’t protect what you don’t understand. Before you can manage an organization’s risk, you have to know how it actually creates value — and how to read the few numbers that say whether it can absorb a shock.</Lead>

      <p className="measure">A risk function that doesn’t understand the business produces a register of generic worries — “cyber,” “people,” “compliance” — disconnected from anything the company is trying to do. A risk function that <em>does</em> understand the business asks sharper questions: this margin is wafer-thin, so what could move it two points? We depend on one supplier for a critical input, so what happens if they fail? Half our revenue rides on one contract renewing — what would have to go wrong? That’s the difference between risk management as paperwork and risk management as foresight.</p>

      <Objectives items={[
        'Map how your organization creates value, from what it depends on to who pays for it.',
        'Read an income statement and balance sheet well enough to spot fragility.',
        'Interpret margin, profit, equity, and leverage as a risk manager — not an accountant.',
        'Capture a value map and financial snapshot for your organization (part of Artifact A1).',
      ]} />

      <Stage n={1} kicker="Understand the discipline" title="The business as a value machine" />
      <p className="measure">Every organization is a machine that turns inputs into something people will pay for. It takes in materials, money, people, and information; it does something with them; that something is worth more to a customer than it cost; and the customer pays. Trace that chain for your own organization and the risks announce themselves — they live wherever a link is thin, concentrated, or fragile. The single supplier, the one big customer, the key person who holds it all together, the regulation that could close a market overnight. You don’t need a strategy degree to see them; you need to follow the value.</p>

      <Stage n={2} kicker="Quantify — what the maths does" title="Reading the numbers, not deriving them" />
      <p className="measure">Three statements tell most of the story, and you only need to <em>read</em> them, not build them. The income statement shows whether the business makes money: revenue minus costs is profit, and profit over revenue is the margin — your shock absorber. A 2% margin means a small cost rise erases your profit; a 20% margin gives you room to take a hit and survive. The balance sheet shows what you own and owe: assets minus liabilities is equity, the cushion that losses eat into first, and liabilities over equity is leverage — how much borrowed money is amplifying both your returns and your risks. The cash-flow statement shows whether money is actually coming in, because profitable companies still die when they run out of cash. None of this is hard maths. It’s pattern recognition, and the tool below does the arithmetic so you can practise the reading.</p>

      <Pull>Margin is your cushion. Leverage is your amplifier. Cash is your oxygen. Three numbers, and you already know more about an organization’s fragility than most of its managers.</Pull>

      <Stage n={3} kicker="Build it on your organization" title="Map the value, read the snapshot" />
      <p className="measure">Sketch how your organization creates value, then drop in rough financial figures — they don’t have to be exact. Watch what the snapshot says about fragility: a thin margin, heavy leverage, a negative cushion. Keep this; in later parts, when you size financial and strategic risks, you’ll come straight back to these numbers.</p>

      <OrgValueSnapshot lessonId="1.2" artifactId="A1-value" />
    </LessonShell>
  );
}
