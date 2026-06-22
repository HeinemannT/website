import React from 'react';
import { getLesson } from '../curriculum.js';
import { LessonShell } from '../components/LessonShell.jsx';
import { Lead, Objectives, Stage } from '../components/prose.jsx';
import { Pathway, DoNow } from '../components/Pathway.jsx';
import { MathBlock, ProblemSet } from '../components/MathBlock.jsx';
import { Rubric } from '../components/Rubric.jsx';
import { CultureRadar } from '../tools/CultureRadar.jsx';

const lesson = getLesson('2b');

const pathway = [
  { kind: 'watch', t: 'Why tone at the top decides everything', src: 'short practitioner explainer', min: 8, tier: 'warmup', why: 'Get the behaviour-beats-statements idea before the detail.' },
  { kind: 'read', t: 'Risk Culture: Resources for Practitioners — read the Aspects Model', src: 'Institute of Risk Management (2012)', min: 18, tier: 'core', why: 'Names the eight aspects so culture stops being “vibes” and becomes scorable.' },
  { kind: 'read', t: 'Tone at the top & dealing with bad news', src: 'NC State ERM Initiative', href: 'https://erm.ncsu.edu/', min: 10, tier: 'core', why: 'How culture actually shifts — through what leaders reward, not posters.' },
  { kind: 'do', t: 'Score your culture against the aspects, then take the calibration test', src: 'the tool in this lesson → Artifact A3', tier: 'apply', why: 'Draw the profile, then feel your own overconfidence once — it sticks.' },
  { kind: 'book', t: 'The Failure of Risk Management — the calibration chapters', src: 'Douglas Hubbard, 2nd ed. (Wiley, 2020)', tier: 'deeper' },
];

const retrieval = [
  { q: 'The single most diagnostic aspect of a risk culture is…', options: [
    { text: 'how it deals with bad news — whether a near-miss or honest error is met with curiosity or punishment.', correct: true },
    { text: 'whether it has a written values statement.' },
    { text: 'the size of the risk function.' }] },
  { q: 'A “just culture” distinguishes…', options: [
    { text: 'honest error and near-misses (to be learned from) from recklessness (to be sanctioned) — so people still report.', correct: true },
    { text: 'managers from staff in who gets blamed.' },
    { text: 'compliance breaches from everything else.' }] },
  { q: 'When ten experts give “90% confident” ranges and the truth lands inside only ~5 of them, the problem is…', options: [
    { text: 'overconfidence: their ranges are too narrow, so every probability and impact they feed the register is suspect — but calibration is trainable.', correct: true },
    { text: 'that they are not clever enough.' },
    { text: 'bad luck that will average out.' }] },
];

export default function Lesson2b() {
  return (
    <LessonShell lesson={lesson} retrieval={retrieval}>
      <Lead>Read the post-mortem of almost any large risk failure and the same line appears: someone saw it. The information rarely goes missing — the willingness to say it out loud, or to hear it without shooting the messenger, does. That willingness is risk culture, and it is the medium every framework in this course runs on.</Lead>

      <p className="measure">Culture is the substrate beneath appetite, register, and controls: the same risk register, run in a fear-driven “shoot the messenger” culture, produces sanitised garbage, while the identical register run in a psychologically safe culture surfaces real exposures. This is not a soft add-on. The dominant failure mode in real ERM is not bad math — it is unspoken appetite, weak culture, and theatrical process, which is exactly why the course front-loads culture before the mechanical steps of identify, evaluate, and treat. And something practitioners dismiss as unmeasurable turns out to be nameable, scorable, and actionable.</p>

      <p className="measure">Work through it in order — the video for the core posture, then the IRM resource (the eight-aspect vocabulary you will score against) and the NC State piece (how tone actually moves), then the build.</p>

      <Pathway lessonId="2b" items={pathway} />

      <Objectives items={[
        'Read a culture from what it rewards, tolerates, and punishes — not from its values statement.',
        'Name the IRM Risk Culture Aspects and explain why “dealing with bad news” and leadership tone lead.',
        'Distinguish a just culture from both a blame culture and a no-blame culture, and explain how incentives bend culture.',
        'Explain calibration and why overconfidence corrupts every probability and impact in the register at the source.',
        'Assess your organization across the aspects and test your own calibration (Artifact A3).',
      ]} />

      <Stage n={1} kicker="Understand the discipline" title="Reading a culture from its incentives" />
      <p className="measure">To read a culture, do not read its values statement; watch what happens when a value collides with a target. Does raising an awkward risk help a career or quietly end one? When a control slows a profitable deal, which one gives way? When bad news climbs the hierarchy, does it arrive intact or sanded smooth at every level? Those answers describe the culture because they describe <em>incentives</em> — and incentives are what people follow when no one is watching. A risk culture is the set of values and behaviours that <em>enables and rewards individuals for taking the right risks in an informed manner</em> (IRM); a box-ticking compliance culture, by contrast, optimises for the appearance of control — the policy is signed, the form is filed — and is fully compatible with everyone in the building knowing the real exposure and saying nothing. The two look identical on an audit; they diverge completely the first time a quarter goes bad.</p>

      <p className="measure">The IRM Risk Culture Aspects Model gives this structure so it stops dissolving into vibes. It names eight aspects across two families: the “hard,” governance-related ones — <strong>tone at the top</strong> (and “tone in the middle,” since culture is set by leadership but lived by middle management), <strong>governance</strong>, <strong>competency</strong>, <strong>decision-making</strong>, and <strong>accountability</strong> — and the “soft,” behavioural ones, of which the most diagnostic is <strong>dealing with bad news</strong>, alongside how skills and reward are handled. Tone leads because culture is set mostly by what senior people reward, tolerate, and attend to, and people learn from behaviour fast: a chief executive who meets a near-miss with curiosity teaches a different lesson in one meeting than the values poster teaches in a year. The mechanism that actually gets bad news heard has a name — <strong>psychological safety</strong>, the shared belief that speaking up about a problem, an error, or a doubt will not be punished. Where it is present, the speak-up channel carries real signal; where it is absent, the channel exists on paper and is silent.</p>

      <p className="measure">There is a specific design that protects speak-up under pressure: a <strong>just culture</strong>. It sits between two failures. A pure <em>blame culture</em> punishes anyone associated with a bad outcome, which teaches people to hide errors and near-misses — the most valuable early signals — until they detonate. A pure <em>no-blame culture</em> sanctions nothing, which fails to deter genuine recklessness. A just culture draws the line at intent and choice: honest error and near-misses are to be reported, protected, and learned from — even rewarded — while reckless or willful violations are sanctioned. The same act that gets you thanked when it was an honest mistake gets you disciplined when you knowingly skipped the control; that distinction is what lets an organisation collect bad news without becoming negligent about it. And all of this is downstream of incentives: when a target and a risk conflict, culture is decided by which one the bonus, the promotion, and the next meeting actually reward. If the line manager who hit cost targets by deferring maintenance is promoted, no speak-up policy will survive the lesson everyone just learned.</p>

      <p className="measure"><strong>How Meridian learned this (worked example).</strong> Four years ago a labelling error triggered a €4m precautionary recall of one product line, and the share price fell 9% for a month. The painful part of the post-mortem was that the signal had been visible: complaint rates on that line had been drifting up for two quarters — from 4 to 6 to 7 per 100,000 units, through the amber threshold — and a junior quality analyst had flagged it. But the report was softened on its way up, because the line was hitting its cost targets and no one wanted to be the manager who halted a line that was making its numbers. That is not an information failure; the information was in the building. It is a culture failure: an incentive (cost targets) outranked a risk, and an absence of psychological safety let the warning be sanded smooth at each level of escalation. Meridian’s response was not a new framework or a new register field — it was tone and incentives. The CEO now opens every risk committee by asking, “what are we <em>not</em> telling each other?”, which legitimises the awkward disclosure before anyone has to be brave; and the analyst who flagged it was, visibly, promoted — the single clearest signal a culture can send about what raising a risk does to a career.</p>

      <DoNow>Before scoring your own organization, skim the IRM Aspects Model (pathway step 2) and, for each of the eight aspects, recall one concrete thing that happened at work in the last year that is evidence for or against it — incidents, near-misses, who got promoted. You will score against those aspects, and evidence beats aspiration.</DoNow>

      <Stage n={2} kicker="Quantify — what the maths does" title="Calibration: the overconfidence that poisons every estimate" />
      <p className="measure">Culture resists measurement but does not defeat it. A culture survey turns each aspect into scored Likert statements and aggregates them into a per-aspect profile you can compare across teams and track over time — but the mean is the least interesting output. Read the <em>dispersion</em>: high disagreement within a unit (some staff score “speak-up” a 5, others a 1) is itself a signal that the culture is uneven or that some people are afraid to answer honestly. And triangulate the survey against <em>behavioural indicators</em> that are harder to game — near-miss reporting rates (a rising rate is usually good news, meaning people now report what they used to hide), speak-up and whistleblowing volumes, the time it takes bad news to reach the board, and who actually got promoted after raising something inconvenient.</p>

      <p className="measure">The deeper quantitative idea is <strong>calibration</strong>, and it sits underneath the whole rest of the course. Almost every number in the register — the probabilities and impacts you attach to each risk — originates in a human judgment, and humans are systematically, directionally overconfident: when people are asked for a range they are “90% confident” contains the true answer, the truth lands inside far less than 90% of the time — Hubbard’s testing puts typical hit rates around 50–70%. This is not random noise that averages out; it is a bias in one direction, which is exactly why it is dangerous when you aggregate estimates. It means the probability–impact pairs feeding your heat map and your loss model are quietly too narrow at the source, and no amount of downstream math repairs an overconfident input. The genuinely good news, established by Hubbard and the calibration literature, is that calibration is <em>trainable</em>: a few rounds of estimating, then seeing the true answer, then adjusting, measurably widen people’s ranges until their stated confidence matches their hit rate. The tool in this lesson lets you feel your own overconfidence once, which tends to stick harder than any lecture.</p>

      <MathBlock title="Calibration as a measurable hit rate">
        <p>Calibration has a number. If a forecaster states many <span className="eq">90%</span> confidence intervals, then over the long run the true value should fall inside about <span className="eq">90%</span> of them. Define the <strong>hit rate</strong> over <span className="eq">n</span> intervals:</p>
        <p style={{ textAlign: 'center' }}><span className="eq">ĥ = (number of intervals containing the truth) / n</span>.</p>
        <p>A perfectly calibrated forecaster has <span className="eq">ĥ ≈ 0.90</span>; the overconfident norm is <span className="eq">ĥ ≈ 0.50–0.70</span> — the intervals are too narrow. Because each interval either contains the truth or not, the count of hits is <span className="eq">Binomial(n, p)</span> with true confidence <span className="eq">p</span>, so even a well-calibrated person scatters around <span className="eq">0.90</span>; you need enough questions to tell skill from luck. With <span className="eq">n = 10</span> and true <span className="eq">p = 0.90</span>, the <em>expected</em> hits are <span className="eq">9</span>, and seeing only <span className="eq">5</span> is overwhelmingly unlikely by chance — that gap is real overconfidence, not noise.</p>
        <p>This is why the register’s inputs are suspect before any model touches them: if an analyst’s <span className="eq">90%</span> impact range is really a <span className="eq">60%</span> range, the “1-in-20” tail you set in the appetite tolerance (lesson 2a) is mis-stated at the source. Calibration training raises <span className="eq">ĥ</span> toward the stated confidence — it is the cheapest accuracy gain in the whole process.</p>
      </MathBlock>

      <p className="measure">This connects directly back to Meridian. Before the recall, no one had ever measured the quality analysts’ calibration, so their confident, too-narrow estimates of contamination and recall likelihood (risks R3 and R4 in the register) went unchallenged — the team was confidently wrong, not carelessly wrong. Measuring calibration would not have prevented the labelling error, but it would have widened the stated probability on that line enough to make the rising complaint trend impossible to wave away.</p>

      <Stage n={3} kicker="Build it — your organization" title="Assess the culture, then test yourself" />
      <p className="measure">Now score your own organization across the IRM aspects to draw its culture profile, then take the calibration exercise. Score from evidence, not aspiration: for each aspect, anchor to the concrete thing you recalled in the Do-Now — an incident, a near-miss, a promotion — rather than to how the culture is supposed to feel. Then run the calibration exercise and note how often the truth actually fell inside your “90% sure” ranges; treat a hit rate well below 0.9 not as a personal failing but as a measurement that now applies to every estimate you have ever fed a register.</p>

      <CultureRadar lessonId="2b" artifactId="A3" />

      <p className="measure">Read the radar back through one question: does its weakest aspect name a <em>behaviour</em> someone could change next quarter, or only a value you could reprint? A useful assessment ends in “we will protect and act on speak-up reports, and we will promote the next person who raises a real risk,” not “we will value openness.” The standard to hold it to:</p>

      <Rubric
        title="an honest culture assessment"
        criteria={[
          { c: 'Evidence-based', good: 'each aspect score points to something that actually happened — an incident, a near-miss, who got promoted — not to aspiration' },
          { c: 'Reads dispersion, not just the mean', good: 'flags aspects where respondents disagree sharply, treating high disagreement as its own signal' },
          { c: 'Differentiated', good: 'the radar has a real shape — strong on competence, thin on speak-up, say — not a flat row of 4s' },
          { c: 'Calibration faced', good: 'you ran the exercise and recorded where your 90% ranges actually missed' },
          { c: 'Actionable on incentives', good: 'the weakest aspect names a behaviour and the reward/sanction behind it, not a value to print' },
        ]}
        exemplar="Meridian scores high on competency, low on dealing-with-bad-news (the softened report) with high dispersion (the analyst saw it, the line manager didn’t), and is honest that calibration was untested before the recall — so its actions are a protected speak-up channel, a just-culture line that rewards honest flags, and calibration training, not a new poster."
      />

      <p className="measure">A worked correction, because it is the most common self-deception. A board states: “we have a strong risk culture — no major incidents in three years.” Apply the discipline. Absence of incidents over a short window is consistent with good luck <em>and</em> with a blame culture that suppresses reporting right up until the big one — the two are indistinguishable from the outcome alone. So you cannot read culture from outcomes; you read it from leading signals (near-miss reporting rates, speak-up volumes, dispersion in the survey) and from the just-culture test: the last time someone raised an uncomfortable risk, were they thanked or sidelined? Rewrite the claim as a measurable one — “near-miss reports are up 30% year-on-year and the last three escalations reached the board within a week” — and now it says something a poster cannot.</p>

      <ProblemSet items={[
        { q: 'A CEO says “we have a strong risk culture — we’ve had no major incidents in three years.” Why is that reasoning dangerous, and what evidence would actually support the claim?', solution: 'Absence of incidents over a short window can mean good luck rather than good culture — and a blame culture that punishes bad news will *also* show few *reported* incidents, right up until a large one, so the metric is consistent with the opposite of what is claimed. You cannot infer culture from outcomes; read leading signals instead: near-miss and speak-up reporting rates (rising is usually good), survey dispersion, time for bad news to reach the board, and the just-culture test — was the last person to raise a risk rewarded or sidelined? Meridian had exactly this false comfort before the recall.' },
        { q: 'You ask ten managers for a “90% confident” range for next year’s biggest loss and the truth lands inside only 4 of the 10. What does this tell you, and what do you do?', solution: 'They are badly overconfident: at true p = 0.90 you expect 9 hits in 10, so 4 is far outside chance — their ranges are too narrow, which means every probability and impact they feed the register is biased toward false precision, and the bias is directional, not noise, so it does not wash out in aggregation. Fix it with calibration training (estimate → see the truth → adjust, repeated until the hit rate approaches 0.90); in the meantime, widen their point estimates into ranges and stress decisions against the wider, worse end rather than the comforting point.' },
        { q: 'A new “anonymous whistleblowing hotline” receives almost zero reports in its first year. Management calls it proof the culture is clean. Give the more likely reading and one fix.', solution: 'Near-zero volume on a fresh channel usually signals the opposite: people do not yet trust that speaking up is safe (no psychological safety) or have learned from past episodes that reports go nowhere or rebound on the reporter. Benchmark against peer reporting rates — clean cultures still generate a steady flow of minor reports and near-misses. The fix is a just-culture commitment made visible: protect and act on reports, close the loop so reporters see something changed, and — as Meridian did — visibly reward someone who raised a real risk, since one promotion teaches more than the hotline’s existence.' },
      ]} />

      <p className="measure">Culture is the ground the rest of the operating model grows on: with appetite set (2a) and the culture honestly assessed, you are ready for the act that depends on both — getting people to actually surface the risks in the first place, which, as the next lesson shows, is far more a problem of facilitation and group dynamics than of technique.</p>
    </LessonShell>
  );
}
