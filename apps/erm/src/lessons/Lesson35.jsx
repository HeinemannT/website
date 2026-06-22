import React from 'react';
import { getLesson } from '../curriculum.js';
import { LessonShell } from '../components/LessonShell.jsx';
import { Lead, Objectives, Stage } from '../components/prose.jsx';
import { Pathway, DoNow } from '../components/Pathway.jsx';
import { MathBlock, ProblemSet } from '../components/MathBlock.jsx';
import { Rubric } from '../components/Rubric.jsx';
import { FamilyLens } from '../tools/FamilyLens.jsx';

const lesson = getLesson('3.5');

const pathway = [
  { kind: 'watch', t: 'Conduct vs compliance, explained', src: 'short practitioner explainer', min: 6, tier: 'warmup', why: 'Get the “legal but unfair” idea before the detail — it is the crux of the whole family.' },
  { kind: 'read', t: 'The 5 Conduct Questions programme', src: 'FCA (fca.org.uk)', href: 'https://www.fca.org.uk/firms/5-conduct-questions-programme', min: 15, tier: 'core', why: 'The regulator deliberately refuses a single definition of conduct risk; this is how it frames the obligation instead.' },
  { kind: 'read', t: 'Conduct, compliance & reputation — how they intertwine', src: 'NC State ERM Initiative (erm.ncsu.edu)', href: 'https://erm.ncsu.edu/library', min: 12, tier: 'core', why: 'Where reputational risk sits relative to the others, and why it is treated as second-order.' },
  { kind: 'read', t: 'Removing reputational risk as a supervisory category', src: 'US Federal Reserve press release, 23 Jun 2025', href: 'https://www.federalreserve.gov/newsevents/pressreleases/bcreg20250623a.htm', min: 10, tier: 'core', why: 'The live debate, from the primary source: is reputation a category or an amplifier?' },
  { kind: 'do', t: 'Add your conduct & compliance risks to the register', src: 'the lens in this lesson → Artifact A10', tier: 'apply', why: 'Find where your organization could break rules, treat customers unfairly, or face litigation.' },
  { kind: 'book', t: 'Fundamentals of Risk Management — conduct, compliance & reputation', src: 'Hopkin & Thompson', tier: 'deeper' },
];

const retrieval = [
  { q: 'What is the defining difference between compliance risk and conduct risk?', options: [
    { text: 'Compliance risk is breaking the letter of a law or rule; conduct risk is treating customers or markets unfairly even when you are within the letter of the rules.', correct: true },
    { text: 'They are the same thing measured by two different functions.' },
    { text: 'Compliance risk applies to retail customers; conduct risk applies to wholesale markets.' }] },
  { q: 'As of 2026, why did US banking regulators move to stop treating reputational risk as a standalone supervisory category?', options: [
    { text: 'The argument is that reputation is a consequence and amplifier of other failures (conduct, compliance, operational), not a thing managed directly — so you protect it by managing those.', correct: true },
    { text: 'Because reputational losses turned out to be trivially small in practice.' },
    { text: 'Because reputation can now be hedged with a liquid market instrument.' }] },
  { q: 'Why does this family lean on culture and leading indicators rather than a single point estimate of loss?', options: [
    { text: 'Fines and customer redress can be estimated, but the reputational fallout largely cannot — there is no credible value-at-risk for lost trust, so a false point estimate would mislead.', correct: true },
    { text: 'Because regulators forbid quantifying any conduct exposure.' },
    { text: 'Because these risks never produce measurable losses at all.' }] },
];

export default function Lesson35() {
  return (
    <LessonShell lesson={lesson} retrieval={retrieval}>
      <Lead>A firm can follow every rule to the letter, sell a product that is perfectly legal, and still destroy the trust that lets it operate. That gap — between what is permitted and what is fair — is the subject of this lesson, and it is where the damage runs slow, then sudden.</Lead>

      <p className="measure">Four related risks live here, and the discipline starts with refusing to blur them. <strong>Compliance risk</strong> is the risk of breaking a law or regulation — a hard, bright line you can be fined for crossing. <strong>Conduct risk</strong> is the risk of treating customers or markets unfairly <em>even within the letter of the rules</em>: mis-selling a product that is technically legal, exploiting an information asymmetry, market abuse that the rulebook did not anticipate. The FCA deliberately offers no single prescriptive definition of conduct risk and instead frames the obligation through its <em>5 Conduct Questions</em> programme (FCA, ongoing), because the moment you write a closed definition, behaviour migrates to whatever the definition leaves out — the older shorthand for the same idea is <em>treating customers fairly</em>. <strong>Legal risk</strong> is loss from contract weakness, litigation, and liability — an unenforceable clause, a dispute you lose, a duty you breached. And <strong>reputational risk</strong> is the erosion of the trust that lets you operate at all: the willingness of customers, regulators, investors, and counterparties to keep dealing with you.</p>

      <p className="measure">Here is how to work through the topic — the explainer for the legal-but-unfair distinction, then the FCA framing of conduct and the NC State treatment of how these intertwine, then the primary source on the live reputational-risk debate, and the register build at the end.</p>

      <Pathway lessonId="3.5" items={pathway} />

      <Objectives items={[
        'Define compliance, conduct, legal, and reputational risk, and state precisely how each differs from the others.',
        'Trace the escalation chain by which a conduct failure becomes a compliance breach, then litigation, then a reputational collapse that dwarfs the original fine.',
        'Engage with the live 2025–26 debate over whether reputational risk is a standalone category or an amplifier of other risks.',
        'Add conduct and compliance risks to your register, sizing the measurable part honestly and refusing a false point estimate for the rest (Artifact A10).',
      ]} />

      <Stage n={1} kicker="Understand the discipline" title="Rules, behaviour, trust — and how they feed each other" />
      <p className="measure">The reason these four are bundled rather than filed separately is that they sit on a single chain, and the chain runs one way. A <strong>conduct</strong> failure — an unfair practice that may not yet have broken any explicit rule — draws regulatory attention; the investigation finds it also breached a specific obligation, so it becomes a <strong>compliance</strong> breach with a fine attached; harmed customers and counterparties sue, so it becomes a <strong>legal</strong> liability; and the public account of all three erodes the trust of everyone who chose to deal with you, so it becomes a <strong>reputational</strong> event. The decisive fact for a risk manager is the relative size of the links: the reputational hit usually <em>dwarfs</em> the originating fine. The fine is bounded and known; the lost trust is unbounded — customers who quietly leave, a funding cost that rises, talent that will not join, a regulator that now reads every filing with suspicion. This is why you cannot manage these as four tidy silos: they are one failure mode observed at four stages.</p>

      <p className="measure">It follows that the lever sits early in the chain. You cannot directly repair a reputation, and you cannot stop a lawsuit once the harm is done; what you <em>can</em> control is the conduct and compliance that start the cascade. This is the practical reading of the entire family: trust is spent by behaviour, so trust is protected by governing behaviour — culture, controls, fair-outcome design, and the second-line compliance function that challenges the business before a practice becomes a breach. Reputational risk, in this light, is less a thing you hold a control against and more the running tally of how well you managed everything upstream of it.</p>

      <p className="measure">That reading is now an explicit, live regulatory debate, and it is worth attributing carefully because it is recent and still moving. As of 2025–26, US banking regulators moved to stop treating <strong>reputational risk as a standalone supervisory category</strong>: the Federal Reserve announced on 23 June 2025 that it would remove references to reputational risk from its examination programs, with the OCC and FDIC taking parallel steps, and a follow-on proposal in early 2026 to codify the removal. The stated argument is precisely the one above — reputation is not a separate risk a bank can manage directly, but a <em>consequence and amplifier</em> of conduct, compliance, and operational failures playing out in public, so supervising it as its own line item is both redundant and unmeasurable. The contrary view, worth holding alongside it, is that naming reputational risk explicitly keeps boards attentive to second-order fallout they would otherwise discount; removing the label risks letting that fallout fall through the cracks between the named categories. As of 2026 this is unsettled. For a practitioner the operative lesson survives either way: you protect reputation by managing the failures that spend it, not by managing “reputation” as an abstraction.</p>

      <p className="measure">Meridian carries two risks from this family, and they sit at opposite ends of the chain. <strong>R3</strong> is a contamination/recall risk (annual probability ~4%, illustrative impact €18m): a safety-and-conduct failure — shipping a product that harms customers — that becomes a regulatory matter and, in public, a reputational event. The case history is exact about how that plays out: four years ago a labelling error triggered a €4m precautionary recall of one product line, and the share price fell 9% for a month. Read the proportions there — the recall cost was bounded at €4m, but the market’s repricing of the whole firm’s trustworthiness was the larger and slower wound, and it is why Meridian’s board hardened its food-safety appetite to <em>averse</em> afterwards and now treats R3 rather than tolerating it. <strong>R8</strong> is bribery by an overseas agent (annual probability ~7%, illustrative impact €8m, owned by the General Counsel): a clean compliance-and-legal failure under anti-bribery law — a fine, a possible market ban, and litigation exposure — where the firm may be liable for an intermediary’s act it did not directly commit. R3 shows the conduct-to-reputation cascade; R8 shows the compliance-and-legal core. Together they map the family.</p>

      <DoNow>Before the build, read the Federal Reserve’s 23 June 2025 release (pathway step 4, ~10 min) and decide for yourself: is reputational risk a category your register should carry, or an amplifier you annotate onto the conduct and compliance lines? Your answer changes how you fill in the lens below.</DoNow>

      <Stage n={2} kicker="Quantify — what the maths does" title="Quantify the fine; refuse a false number for the trust" />
      <p className="measure">This is the family where intellectual honesty about measurement matters most, because the temptation to fabricate a number is strongest. Split the exposure in two. The parts you <em>can</em> estimate are the fine and the customer redress: a fine is bounded by statute and precedent, so you can build a credible range from comparable cases (the regulator’s published penalties, the relevant maximum, the firm’s own history); redress scales with the number of affected customers times an average per-customer remediation, which is an arithmetic estimate, not a guess. R8’s €8m and R3’s recall cost are exposures of this measurable kind — a probability times a sizeable but knowable impact. Treat those exactly as you would any operational loss: probability, impact, expected loss.</p>

      <p className="measure">The part you <em>cannot</em> credibly estimate is the reputational fallout — the lost customers, the higher funding cost, the talent that walks, the regulatory suspicion. There is no credible value-at-risk for lost trust: it has no stable distribution, no agreed unit, and a single event can move it by an order of magnitude in either direction depending on how the firm responds. Inventing a point estimate here is not rigour, it is false precision, and it is its own risk — a number on a board pack acquires an authority it has not earned and crowds out the judgement that should govern the decision. So this family is steered by <em>leading indicators</em> rather than a headline loss figure: complaint rates, breach counts, the trend in overdue audit actions — the early signals that conduct is drifting before it becomes a breach. Meridian’s own dashboard is built this way; its customer-complaint rate (per 100k units) has climbed 4 → 4 → 6 → 7 → 8 across five quarters against an amber threshold of 6, which is precisely the kind of leading signal that should prompt action long before any fine is in view. The discipline is to quantify the part that genuinely supports a number and to govern the rest by culture, control, and trend — not to pretend the trust has a tidy variance.</p>

      <MathBlock title="The math, properly">
        <p>The measurable exposure of a conduct/compliance event decomposes cleanly; the reputational part deliberately does not. Write the loss as</p>
        <p style={{ textAlign: 'center' }}><span className="eq">L = Fine + Redress + R</span></p>
        <p>where <span className="eq">Redress ≈ N_affected × c̄</span> (customers harmed times average per-customer remediation) and the fine is drawn from a distribution bounded by statutory maximum and shaped by precedent — both estimable. The term <span className="eq">R</span>, the reputational fallout, has no credible distribution: its expectation is undefined in practice and its tail is unbounded, which is exactly why no honest <span className="eq">VaR(L)</span> can be quoted. The correct response is not to set <span className="eq">R = 0</span> (it is often the largest term) nor to invent a figure, but to monitor a vector of leading indicators <span className="eq">k</span> — complaint rate, breach count, overdue actions — whose <em>trend</em> proxies the pressure on <span className="eq">R</span>. You manage the conditional: keep <span className="eq">k</span> in range and you reduce the probability that <span className="eq">R</span> ever fires.</p>
      </MathBlock>

      <Stage n={3} kicker="Build it on your organization" title="Add your conduct & compliance risks" />
      <p className="measure">Now find this family in your own organization. Ask three questions in order. Where could you <em>break a rule</em> (a regulatory obligation, a licence condition, a sanctions or anti-bribery law)? Where could you <em>treat a customer or market unfairly</em> while staying inside the rules (a product whose costs are buried, a default that exploits inertia, an asymmetry you profit from)? And where are you exposed to <em>litigation or contract weakness</em>? For each, name the owner — usually compliance, legal, or the General Counsel — and size only the part you honestly can, leaving the reputational amplification as an annotation, not a fabricated euro figure.</p>

      <FamilyLens lessonId="3.5" artifactId="A10-conduct" family="Compliance & conduct" ownerHint="compliance / legal"
        sizing="Fines and redress can be estimated; reputational fallout largely can't. Lean on judgement and leading indicators (complaints, breaches) rather than a false point estimate." />

      <p className="measure">Read each line back through the test that exposes a weak one: <em>if this risk fired tomorrow, do I know who owns it, what the measurable loss is, and which leading indicator would have warned me?</em> If the answer to any part is no, the line is decoration. The standard to hold it to:</p>

      <Rubric
        title="a strong conduct & compliance register entry"
        criteria={[
          { c: 'Correctly classified', good: 'each entry is tagged as compliance (rule-breaking), conduct (unfair-but-legal), or legal (litigation/contract) — not lumped together' },
          { c: 'Owned', good: 'a named function (compliance, legal, General Counsel) owns each line, not “the business” in general' },
          { c: 'Honestly sized', good: 'the fine/redress is estimated as a range; the reputational fallout is annotated as an amplifier, never given a false point estimate' },
          { c: 'Watched by a leading indicator', good: 'each line names a metric that moves before the loss does — complaint rate, breach count, overdue actions' },
          { c: 'Chain-aware', good: 'the entry notes how a conduct failure here could escalate into compliance, litigation, and a reputational hit larger than the fine' },
        ]}
        exemplar="Meridian R3 (contamination/recall): conduct+safety, owned by the Quality Director, recall cost ~€4m sized from the 4-years-ago precedent, reputational fallout annotated (a 9% share drop then), watched via the complaint-rate KRI (now 8 vs amber 6). R8 (agent bribery): compliance+legal, owned by the General Counsel, ~€8m fine/ban exposure, watched via third-party due-diligence breaches."
      />

      <p className="measure">A worked correction, because this is the most common mistake in this family. A team writes a single register line: “Reputational risk — High — €50m.” Three things are wrong. The category is the amplifier, not the cause, so the line is unmanageable — there is no control you can point a €50m number at. The €50m is invented; lost trust has no credible distribution, and the figure will anchor a board into false confidence. And it hides the actual lever. Apply the discipline: replace it with the upstream causes — a conduct line (“mis-selling of product X”, owned by compliance, redress estimated from affected-customer count) and a compliance line (“sanctions-screening gap”, owned by legal, fine sized from regulatory precedent) — each watched by a leading indicator, each annotated with how it would escalate. The reputational consequence becomes a note on those lines, governed by keeping the indicators in range. That move — from an unmanageable abstraction to owned, measurable, watched causes — is what makes the exposure governable.</p>

      <ProblemSet items={[
        { q: 'A product is fully compliant with every applicable regulation, yet the firm’s own complaint rate for it is rising sharply. Is there a risk here, and which family is it?', solution: 'Yes — this is conduct risk, the defining case of the family. Compliance (the letter of the rules) is satisfied, so a compliance-only lens sees nothing wrong. But a rising complaint rate is a leading indicator that customers are being treated unfairly in substance — the product may have buried costs, exploit inertia, or be sold to people it does not suit. The conduct question is about outcomes for customers, not box-ticking. Left alone, it escalates: the regulator notices the complaint trend, finds a specific breach, redress and litigation follow, and the reputational hit dwarfs any eventual fine. The action is to investigate the outcome now, while it is still only a leading indicator.' },
        { q: 'Meridian’s R8 (bribery by an overseas agent) carries an illustrative €8m fine exposure. The CFO asks for “the reputational number” to add to it for the board pack. What do you tell her, and what do you put in the pack instead?', solution: 'You decline to give a point estimate for the reputational fallout, and explain why: lost trust has no credible distribution, so any single figure is false precision that would anchor the board and crowd out judgement. What you can quantify — the ~€8m fine and any redress/legal cost — goes in as a range with its basis (anti-bribery statutory maxima and comparable cases). The reputational exposure goes in as a narrative annotation: the realistic escalation path (fine → market ban → loss of the emerging-market growth the firm is betting on → investor and regulator distrust), plus the leading indicators being watched (third-party due-diligence breaches, agent-onboarding controls). The board gets an honest measurable number, a named worst-case mechanism, and the early-warning metrics — which is more decision-useful than a fabricated €X0m that pretends to a precision nobody has.' },
      ]} />

      <p className="measure">This family is the limit case of the whole register: the risks that matter most are the ones you can measure least, and the temptation to fake a number is strongest exactly where a number is least defensible. The skill is to quantify the fine, govern the trust by trend and culture, and keep the chain in view — because the failure that starts as a small unfairness is the one that, left to run, ends as the event that reprices the firm. Next we turn to technology, cyber, and climate, where the opposite temptation appears: risks that feel un-quantifiable but, with the right method, genuinely are.</p>
    </LessonShell>
  );
}
