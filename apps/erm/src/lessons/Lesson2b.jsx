import React from 'react';
import { getLesson } from '../curriculum.js';
import { LessonShell } from '../components/LessonShell.jsx';
import { Lead, Objectives, Stage, Pull } from '../components/prose.jsx';
import { Pathway, DoNow } from '../components/Pathway.jsx';
import { ProblemSet } from '../components/MathBlock.jsx';
import { Rubric } from '../components/Rubric.jsx';
import { CultureRadar } from '../tools/CultureRadar.jsx';

const lesson = getLesson('2b');

const pathway = [
  { kind: 'watch', t: 'Risk culture & tone at the top', src: 'short practitioner explainer', min: 8, tier: 'warmup', why: 'See why culture, not frameworks, decides whether risk management works.' },
  { kind: 'read', t: 'Risk Culture resources & the Aspects Model', src: 'Institute of Risk Management', min: 15, tier: 'core', why: 'The standard vocabulary for something that otherwise dissolves into vibes.' },
  { kind: 'read', t: 'Tone at the top & speak-up culture', src: 'NC State ERM Initiative', href: 'https://erm.ncsu.edu/', min: 10, tier: 'core', why: 'How culture actually shifts — through behaviour, not posters.' },
  { kind: 'do', t: 'Assess your culture + test your calibration', src: 'the tool below → Artifact A3', tier: 'apply', why: 'Score the aspects, then feel your own overconfidence once.' },
  { kind: 'book', t: 'The Failure of Risk Management — overconfidence & calibration', src: 'Douglas Hubbard, 2nd ed.', tier: 'deeper' },
];

const readings = [
  { kind: 'FREE', title: 'Risk Culture Aspects Model — IRM', note: 'The standard framework and a usable scorecard.' },
  { kind: 'FREE', title: 'NC State ERM Initiative — culture & tone', note: 'Practical, evidence-based.', href: 'https://erm.ncsu.edu/' },
  { kind: 'BOOK', title: 'The Failure of Risk Management', note: 'Hubbard, 2nd ed. — overconfidence, calibration, fixing human judgment.' },
];

const retrieval = [
  { q: 'Why is leadership tone the most important cultural aspect?', options: [
    { text: 'Culture is set mostly by what senior people reward, tolerate, and attend to — and people learn from behaviour fast.', correct: true },
    { text: 'Because executives write the values statement.' },
    { text: 'Because tone is the only measurable aspect.' }] },
  { q: 'Calibration training improves…', options: [
    { text: 'how honestly people report the range of what they actually know — countering overconfidence.', correct: true },
    { text: 'how fast people answer.' },
    { text: 'the accuracy of the accounts.' }] },
  { q: 'At Meridian, the warning before the recall was…', options: [
    { text: 'visible in the data, but not acted on — a culture failure, not an information failure.', correct: true },
    { text: 'genuinely impossible to foresee.' },
    { text: 'a problem with the risk framework’s wording.' }] },
];

export default function Lesson2b() {
  return (
    <LessonShell lesson={lesson} retrieval={retrieval} readings={readings}>
      <Lead>Pick any large risk failure and read the post-mortem. Someone saw it coming. The information almost never went missing — the willingness to say it, or to hear it, did.</Lead>

      <Pathway lessonId="2b" items={pathway} />

      <p className="measure">Before the banks fell in 2008, before Deepwater Horizon, before Enron — the warning was already in the building, in somebody’s inbox or somebody’s gut. That is why culture is not a soft add-on to risk management. It is the medium the whole discipline runs on. You can have a flawless framework, a tidy register, and a board-approved appetite, and still be one bad culture away from disaster — because every one of those depends on people choosing to tell the truth about uncertainty.</p>
      <p className="measure">Avoid two traps: the cynic who calls culture unmeasurable hand-waving, and the optimist who thinks a poster of values changes anything. Culture is real, it leaves fingerprints, and it shifts — slowly, and mostly in response to what leaders do, not what they say.</p>

      <Objectives items={[
        'Read a culture from what it rewards and punishes, not its values statement.',
        'Name the main aspects of risk culture and why leadership tone leads.',
        'Explain calibration and why overconfidence corrupts risk estimates at the source.',
        'Assess your organization’s culture and test your own calibration (Artifact A3).',
      ]} />

      <Stage n={1} kicker="Understand the discipline" title="Reading a culture" />
      <p className="measure">Want to read a culture? Don’t read the values statement. Watch what happens when it counts. Does raising an awkward risk help a career or quietly end one? When a control slows a profitable deal, which gives way? When bad news climbs the hierarchy, does it arrive intact or sanded smooth at every level? Those answers describe the culture, because they describe incentives — and incentives are what people follow when no one is watching. The IRM breaks this into aspects — leadership tone, decision-making, accountability, competence — and tone leads, because a chief executive who meets a near-miss with curiosity teaches a different lesson than one who meets it with irritation.</p>

      <p className="measure"><strong>How Meridian learned this (worked example).</strong> Four years ago a labelling error led to a €4m recall and a 9% share-price fall. The painful part of the post-mortem: the signal had been visible. Complaint rates on that line had been drifting up for two quarters, and a junior quality analyst had flagged it — but the report was softened on its way up, because the line was hitting its cost targets and nobody wanted to be the one to halt it. That is not an information failure; it is a culture failure. Meridian’s response wasn’t a new framework — it was tone: the CEO now opens the risk committee by asking “what are we not telling each other?”, and the analyst who flagged it was, visibly, promoted. Watch what changed — behaviour and incentives, not words.</p>

      <DoNow>Before scoring your own culture, skim the IRM Aspects Model (pathway step 2) — you’ll score against those aspects in the tool below.</DoNow>

      <Stage n={2} kicker="Quantify — what the maths does" title="Surveys, and the overconfidence that poisons everything" />
      <p className="measure">Culture resists measurement but doesn’t defeat it. A culture survey turns the aspects into scored statements and gives you a profile to compare across teams and track over time — the score isn’t the point, the variation is. A unit far below the rest is where to look; a score drifting down over quarters is an early warning no slogan gives you.</p>
      <p className="measure">The deeper quantitative idea is <em>calibration</em>. Almost every estimate in the register — the probabilities and impacts you’ll attach to risks — comes from a human, and humans are badly overconfident: asked for a range they’re “90% sure” contains an answer, most are right far less than 90% of the time. That single bias poisons risk estimation at its source. Meridian’s analysts were confidently wrong about the recall’s likelihood precisely because no one had ever measured their calibration. The good news, from Hubbard and others: calibration is <em>trainable</em> — a few rounds of feedback measurably tighten it. The tool lets you feel your own overconfidence once, which tends to stick harder than any lecture.</p>
      <Pull>The rarest, most valuable trait in risk estimation isn’t cleverness. It’s honesty about the width of what you don’t know — and it can be trained.</Pull>

      <Stage n={3} kicker="Build it — your organization" title="Assess the culture, test yourself" />
      <p className="measure">Score your organization across the aspects to draw its culture profile, then take the calibration exercise and see how often the truth actually fell inside your “90% sure” ranges. Saved as Artifact A3, this sits behind the whole operating model as the honest answer to one question: when all of this is tested, will any of it hold?</p>

      <CultureRadar lessonId="2b" artifactId="A3" />

      <Rubric
        title="an honest culture assessment"
        criteria={[
          { c: 'Evidence-based', good: 'scores reflect what actually happens (incidents, near-misses, who got promoted), not aspiration' },
          { c: 'Differentiated', good: 'the radar has a real shape — strong somewhere, thin elsewhere — not flat 4s' },
          { c: 'Calibration faced', good: 'you actually ran the exercise and noted where your 90% ranges missed' },
          { c: 'Actionable', good: 'the weakest aspect names a behaviour to change, not a value to print' },
        ]}
        exemplar="Meridian scores high on competence, low on openness/speak-up (the softened report), and is honest that its calibration was untested before the recall — so its action is a speak-up mechanism and calibration training, not a new poster."
      />

      <ProblemSet items={[
        { q: 'A CEO says “we have a strong risk culture — we’ve had no major incidents in three years.” Why is that reasoning dangerous?', solution: 'Absence of incidents can mean good luck, not good culture — and a culture that punishes bad news will *also* show few reported incidents, right up until a big one. You can’t infer culture from outcomes over a short window; you read it from behaviours and near-misses (the leading signals), exactly what Meridian missed.' },
        { q: 'You ask ten managers for a “90% confident” range for next year’s biggest loss and the truth lands inside only 4 of the 10. What does this tell you, and what do you do?', solution: 'They’re badly overconfident — their ranges are far too narrow, so every probability/impact estimate they feed the register is suspect. The fix is calibration training (feedback rounds), and meanwhile treating their point estimates as ranges and stress-testing decisions against the wider end.' },
      ]} />

      <p className="measure">Culture is the ground everything grows on. With appetite set and the culture honestly assessed, you’re ready for the act that depends on both: getting people to actually surface the risks — which, as the next lesson shows, is far more social than analytical.</p>
    </LessonShell>
  );
}
