import React from 'react';
import { getLesson } from '../curriculum.js';
import { LessonShell } from '../components/LessonShell.jsx';
import { Lead, Objectives, Stage, Pull } from '../components/prose.jsx';
import { MathBlock } from '../components/MathBlock.jsx';
import { MarkComplete } from '../components/MarkComplete.jsx';

const lesson = getLesson('0.2');
const readings = [
  { kind: 'FREE', title: 'Khan Academy — Statistics & Probability', note: 'The friendliest free course on probability, mean, spread, and distributions. Start here if any term below is new.', href: 'https://www.khanacademy.org/math/statistics-probability' },
  { kind: 'FREE', title: 'Seeing Theory (Brown University)', note: 'A beautiful, visual, interactive intro to probability and distributions.', href: 'https://seeing-theory.brown.edu/' },
  { kind: 'FREE', title: 'MIT OpenCourseWare 18.05 — Introduction to Probability and Statistics', note: 'If you want it done properly, with problem sets.', href: 'https://ocw.mit.edu/courses/18-05-introduction-to-probability-and-statistics-spring-2014/' },
];

export default function LessonMathPrimer() {
  return (
    <LessonShell lesson={lesson} readings={readings}>
      <Lead>This isn’t a maths course, and you won’t be asked to prove anything. But a handful of ideas show up again and again, and ten minutes here will make every later lesson click. If probability and averages are old friends, skip ahead.</Lead>

      <p className="measure">Risk lives in the gap between “what might happen” and “what did happen,” so the language of risk is the language of <em>uncertainty</em> — probability and its close relatives. None of it is harder than careful arithmetic; the trick is just knowing what each idea is <em>for</em>.</p>

      <Objectives items={[
        'Read a probability and an expected value, and know the difference.',
        'Understand what a distribution is and why an average can mislead.',
        'Know what mean, spread (standard deviation), and a percentile tell you.',
        'Recognise the handful of symbols the optional “math, properly” boxes use.',
      ]} />

      <Stage n={1} kicker="Chance" title="Probability and expected value" />
      <p className="measure">A <em>probability</em> is just how likely something is, on a scale from 0 (never) to 1 (certain) — the same thing as 0% to 100%. A coin lands heads with probability 0.5; a risk might materialise with probability 0.1, or 10%, in a year.</p>
      <p className="measure">The single most useful idea built on that is <em>expected value</em>: the average outcome if you faced a situation many times, found by weighting each outcome by its probability. A risk with a 10% chance of a €5,000,000 loss has an expected loss of 0.10 × 5,000,000 = €500,000. You’d never actually lose exactly that — most years you lose nothing, occasionally you lose the full five million — but €500,000 is the long-run average, and it’s the honest number to budget against. This one calculation is the seed of the entire quantitative half of the course.</p>

      <Stage n={2} kicker="Shapes" title="Distributions, and why the average lies" />
      <p className="measure">An average collapses a whole world of possibilities into one number, and that’s exactly its danger. A <em>distribution</em> keeps the whole picture: it shows every possible outcome and how likely each is. Drawn as a histogram — bars showing how often each range of outcomes occurs — it’s the most honest summary of a risk you can give.</p>
      <p className="measure">Why does the average lie? Because many risks are <em>lopsided</em>: lots of small or zero outcomes, and a rare enormous one. The average sits in a gap where almost nothing actually lands, and it completely hides the catastrophe in the tail. That’s why, later, you’ll simulate thousands of possible years and look at the <em>whole</em> distribution — the typical year, the bad year, the disaster — rather than trusting a single mean.</p>
      <Pull>The mean tells you the centre. Risk lives in the tail. A number that reports only the centre is hiding exactly what you most need to see.</Pull>

      <Stage n={3} kicker="Reading a distribution" title="Spread and percentiles" />
      <p className="measure">Two more words let you describe any distribution. <em>Spread</em> — measured by the <em>standard deviation</em> — is how widely outcomes scatter around the average; a wide spread means more uncertainty, and in finance it’s often just called <em>volatility</em>. A <em>percentile</em> answers “how bad is a bad case?”: the 95th percentile (P95) is the level only 5% of outcomes exceed, the 99th (P99) the level only 1% exceed. When you later read that a portfolio’s “99% loss is €4m,” it means: in the worst 1 year in 100, losses pass €4m. Percentiles are how risk turns “the tail” into a concrete number you can hold capital against.</p>

      <MathBlock title="The symbols the optional boxes use">
        <p>The deeper “math, properly” sections (all optional) use a little standard shorthand — here it is, once, in plain terms:</p>
        <p><span className="eq">Σ</span> — “add up.” <span className="eq">Σ xᵢ</span> means “add up all the x values.”</p>
        <p><span className="eq">E[X]</span> — the expected value (mean) of a quantity X.</p>
        <p><span className="eq">σ</span> (sigma) — standard deviation, i.e. spread/volatility; <span className="eq">σ²</span> is the variance (spread squared).</p>
        <p><span className="eq">P(A)</span> — the probability of A. <span className="eq">√</span> — square root. <span className="eq">e^x</span> / <span className="eq">ln</span> — the exponential and natural log, which turn up because some risks grow multiplicatively rather than by addition.</p>
        <p>That’s the whole alphabet. Whenever a symbol appears later, it means one of these.</p>
      </MathBlock>

      <p className="measure">That’s the toolkit: probability, expected value, the distribution behind the average, and the spread and percentiles that describe it. You now have everything the course assumes — and the free resources below are there whenever you want a term explained more slowly.</p>

      <MarkComplete lessonId="0.2" label="I’m comfortable with these — mark complete" />
    </LessonShell>
  );
}
