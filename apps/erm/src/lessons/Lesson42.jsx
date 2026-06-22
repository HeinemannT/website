import React from 'react';
import { getLesson } from '../curriculum.js';
import { LessonShell } from '../components/LessonShell.jsx';
import { Lead, Objectives, Stage } from '../components/prose.jsx';
import { Pathway, DoNow } from '../components/Pathway.jsx';
import { MonteCarlo } from '../tools/MonteCarlo.jsx';
import { MathBlock, ProblemSet } from '../components/MathBlock.jsx';
import { Rubric } from '../components/Rubric.jsx';
import { CodeExercise } from '../components/CodeExercise.jsx';
import { lognormal } from '../tools/statlib.js';
import { fmt } from '../tools/riskmath.js';

const lesson = getLesson('4.2');

const pathway = [
  { kind: 'watch', t: 'What a Monte Carlo simulation actually does', src: 'short practitioner explainer', min: 8, tier: 'warmup', why: 'See the “fog of futures condensing into a histogram” picture before the detail.' },
  { kind: 'course', t: 'Probabilistic Systems Analysis (6.041) — early lectures on random variables', src: 'MIT OpenCourseWare', href: 'https://ocw.mit.edu/courses/6-041sc-probabilistic-systems-analysis-and-applied-probability-fall-2013/', min: 40, tier: 'core', why: 'The grounding in distributions and expectation that simulation rests on.' },
  { kind: 'read', t: 'Random variables & probability distributions', src: 'Khan Academy', href: 'https://www.khanacademy.org/math/statistics-probability/random-variables-stats-library', min: 25, tier: 'core', why: 'Intuition for the shapes — normal, lognormal — that Monte Carlo samples from.' },
  { kind: 'do', t: 'Build the one-year loop, then run your register 10,000 times', src: 'the code exercise + simulator in this lesson → Artifact A11', tier: 'apply', why: 'Build the engine the next three lessons run on.' },
  { kind: 'book', t: 'How to Measure Anything — the Monte Carlo chapter', src: 'Hubbard (free companion spreadsheets)', tier: 'deeper', why: 'Monte Carlo for ordinary decisions, and the humility-about-models theme.' },
];

const retrieval = [
  { q: 'Monte Carlo simulation works by…', options: [
    { text: 'sampling many random scenarios and building up the distribution of outcomes.', correct: true },
    { text: 'solving an exact equation for the answer.' },
    { text: 'taking the average of the inputs.' }] },
  { q: 'A Monte Carlo result is only as good as…', options: [
    { text: 'the input distributions and assumptions you feed it.', correct: true },
    { text: 'the number of decimal places shown.' },
    { text: 'the speed of the computer.' }] },
];

export default function Lesson42() {
  return (
    <LessonShell lesson={lesson} retrieval={retrieval}>
      <Lead>Most real risks are too tangled to solve with a formula — but you can always <em>simulate</em> them. Monte Carlo is the workhorse that powers almost everything left in this part.</Lead>

      <p className="measure">The idea is almost embarrassingly simple. You cannot compute the exact distribution of next year’s total losses by hand — there are too many risks, each uncertain, and they interact. So you don’t. Instead you play out one random year: for each risk, roll the dice on whether it happens and how big it is, then add up the damage. Then you do that ten thousand times. The pile of simulated years <em>is</em> your loss distribution — and from it you read the average year, the bad year, and the catastrophic year straight off. No calculus required, just a fast machine and honest inputs.</p>

      <p className="measure">Here is how to work through the topic — the video for the shape of the idea, then the probability grounding (MIT 6.041 for depth, Khan for the distributions by silhouette), and the two builds at the end where you write the engine yourself.</p>

      <Pathway lessonId="4.2" items={pathway} />

      <Objectives items={[
        'Explain why simulation beats closed-form formulas for tangled, interacting, fat-tailed risks.',
        'State the law of large numbers and why error shrinks as σ/√N (so 4× the runs to halve it).',
        'Turn uniform random numbers into shapes — Box–Muller for normals, lognormal for severities.',
        'Read a simulated distribution as a whole: the mean, the bad-year percentile, the worst case.',
        'Simulate your own register’s annual loss, knowing Monte Carlo amplifies your assumptions (Artifact A11).',
      ]} />

      <Stage n={1} kicker="Understand the discipline" title="Play the year ten thousand times" />
      <p className="measure">A formula gives you one exact answer to one exact question — and for risk, that is rarely the question you have. The questions that matter are tangled: fourteen risks, each with its own chance of firing, each with a severity that is itself uncertain, several of them rising and falling together. The closed-form expressions that handle this exist only for textbook special cases — independent, well-behaved, thin-tailed. Real risk registers are none of those things, and the moment you add a heavy right tail or a dependency between two risks, the algebra stops having a clean solution. Simulation does not care. It never solves the distribution; it <em>samples</em> from it, one drawn year at a time, and lets ten thousand draws stack up into the shape you could not write down. Anything you can describe as a procedure — “if this fires, draw that, then add” — you can simulate, no matter how ugly the interactions.</p>

      <p className="measure">The second reason to simulate is that the answer it produces is the <em>honest</em> form of a risk answer: a whole distribution, not a single number. “Expected loss is €1.2m” tells a board almost nothing — it is a balance point that may correspond to no year that ever actually happens. The simulated distribution lets you read three different facts that a board genuinely needs and that a point estimate hides. The <em>mean</em> is the long-run average year, what you budget for. A <em>tail percentile</em> — the 95th, say — is the bad-but-plausible year you must survive without a crisis: “one year in twenty tops €6m.” And the <em>maximum</em> over the run is the catastrophe the model can imagine: “the worst we simulated was €14m.” Each is a different decision: the mean prices the risk, the percentile sizes the buffer, the worst case tests whether you would survive at all. One number can answer at most one of those.</p>

      <p className="measure">Make this concrete on the case we carry. <strong>Meridian Industries</strong> is a listed mid-cap consumer-goods maker, and its starter register lists fourteen risks, each with an annual probability and a euro impact — a resin supplier failing (8%, €9m), ransomware on the ERP (12%, €6m), a product contamination and recall (4%, €18m), the largest retailer walking (6%, €40m), a commodity spike (60%, €12m), a covenant breach in a downturn (10%, €25m), and so on down to a data breach (9%, €5m). Asked “what is Meridian’s loss exposure?”, the naïve answer sums the expected losses — probability times impact, risk by risk — and lands somewhere around €29m a year. That number is not wrong, but it is dangerously incomplete: it describes a year that essentially never occurs. Most years, only the high-frequency nuisances fire and Meridian loses a few million; the average is dragged upward by rare years when one of the big-impact, low-probability risks — the recall (R3), the retailer loss (R4), the covenant breach (R11) — actually lands. To see <em>that</em> shape, you have to play the year out, many times.</p>

      <p className="measure">So we model each risk as two independent draws. First a <em>Bernoulli</em> on its probability — a weighted coin that decides whether the risk fires this year at all (Meridian’s contamination risk comes up heads 4 times in 100 simulated years). If it fires, a <em>severity</em> draw decides how bad — not exactly its headline impact, but a random value scattered around it, because a recall could cost a little less or a great deal more than the €18m planning figure. Sum across all fourteen risks and you have one simulated year for Meridian. Repeat ten thousand times and the pile of years tells the real story: the average year sits near that €29m sum-of-expected-losses, reassuringly — but the distribution has a long right tail, and a handful of simulated years run far higher, every one of them a year in which R3, R4, or R11 fired. That tail is invisible to the naïve sum and is precisely what a board needs to plan for. This same engine — Meridian’s register played ten thousand times — is what the next three lessons reuse to read capital, Value-at-Risk, and stress.</p>

      <Stage n={2} kicker="Quantify — what the maths does" title="The law of large numbers, and turning uniforms into shapes" />
      <p className="measure">Two facts make simulation trustworthy rather than a guess, and both are worth understanding because they tell you how much to believe the output. The first is the <em>law of large numbers</em>: as you take more independent samples, their average converges on the true expectation. This is the entire licence to read a simulated mean as if it were the real one — the histogram is not an approximation you tolerate, it is an estimator that provably homes in on the truth as N grows. But it homes in <em>slowly</em>. The error of a Monte Carlo estimate shrinks like <span className="eq">σ / √N</span>, with that square root doing the damage: to halve your error you need not twice but <em>four times</em> the runs. A few thousand iterations are cheap and pin down the mean nicely; squeezing the last digit of precision out of a deep tail percentile costs you orders of magnitude more runs, which is why tail estimates are always the shakiest part of any simulation.</p>

      <p className="measure">The second fact is how the computer manufactures the shapes at all. A machine can only really produce one kind of randomness — a uniform draw between 0 and 1, every value equally likely. Every distribution you sample is built by bending that uniform stream into the shape you want. The classic recipe is <em>Box–Muller</em>, which takes two uniforms and trigonometrically twists them into a standard normal bell. From a normal you get a <em>lognormal</em> — its exponential — which is the natural model for a loss severity: it is never negative (a loss cannot be below zero) and it is right-skewed (a recall is occasionally far worse than typical, never far better than zero). That skew is not a quirk; it is exactly why a simulated average lands <em>above</em> the naïve “probability × headline impact” sum. The lognormal’s mean sits above its median, so each fired risk contributes a bit more than its sticker figure, and those bits accumulate into the gap between the honest simulated mean and the back-of-envelope sum.</p>

      <p className="measure">The simulation below takes your register, treats each risk as a coin-flip on occurrence and a lognormal spread on severity, and builds your annual loss distribution. Watch the mean land close to the simple sum of expected losses — reassuring — and then watch the tail stretch far beyond it. That tail is the entire reason to simulate. But hold the warning close: Monte Carlo is a magnificent amplifier of your assumptions, no more. Feed it guessed probabilities and a made-up spread and it returns beautifully rendered fiction — three-decimal answers from one-significant-figure inputs. It quantifies the uncertainty you <em>specified</em>, never the uncertainty that actually exists; the unknown unknowns stay invisible to it. The honesty is in the inputs; the simulation just makes their consequences visible, flattering and damning in equal measure.</p>

      <MathBlock>
        <p>Monte Carlo rests on the <em>law of large numbers</em>: the average of independent samples converges to the true expectation. Its error shrinks like <span className="eq">σ / √N</span> — so to <em>halve</em> the error you need <em>four times</em> the runs. That square-root is why a few thousand iterations are cheap but extreme precision is dear.</p>
        <p>To sample, you turn uniform randoms into the shape you want. The <em>Box–Muller</em> recipe takes two uniform draws and twists them into a standard normal bell — you don’t need the trigonometry, just the idea that a bell can be manufactured from flat randomness. A <em>lognormal</em> severity is then that normal run through an exponential: <span className="eq">median · e^(σ·Z)</span>. Its median is <span className="eq">median</span>, but its <em>mean</em> is <span className="eq">median · e^(σ²/2)</span> — higher, because the distribution is right-skewed. That gap is why your simulated average lands above the naïve “probability × median” sum, and it’s a feature of the tail, not a bug in your code.</p>
      </MathBlock>

      <DoNow>Before you build, skim the Khan Academy distributions module (pathway step 3, ~25 min) so you can recognise a lognormal by its silhouette — the right-skewed, never-negative shape you’re about to use for every severity in the simulation.</DoNow>

      <Stage n={3} kicker="Build it — write the model" title="Build the simulation engine" />
      <p className="measure">This is the centrepiece of the whole quantitative part: the loop that plays one random year. Write it yourself. For each risk, decide whether it happens, and if it does, draw a random severity. The tool below is just this function, run ten thousand times — so once you’ve built it, you’ve built the engine the next three lessons run on.</p>

      <CodeExercise
        id="4.2-mc"
        title="Write one simulated year"
        prompt="For each risk, it occurs with probability p%. When it occurs, add a random severity drawn from lognormal(i, 0.5). Return the year’s total loss."
        entry="simulateYear"
        helpers={{ lognormal }}
        starter={`// risks: array of { p, i }   (p percent chance; i euro impact)
// helper available:  lognormal(median, sigma)  ->  a random severity
function simulateYear(risks) {
  let total = 0;
  // TODO: for each risk, with probability p% it occurs;
  //       if it does, add lognormal(i, 0.5) to total
  return total;
}`}
        solution={`function simulateYear(risks) {
  let total = 0;
  for (const r of risks) {
    if (Math.random() < r.p / 100) {
      total += lognormal(r.i, 0.5);
    }
  }
  return total;
}`}
        fmtX={fmt}
        test={(fn) => {
          const sample = [{ p: 10, i: 5000000 }, { p: 70, i: 400000 }, { p: 35, i: 600000 }];
          const N = 8000, vals = new Array(N);
          for (let n = 0; n < N; n++) vals[n] = fn(sample);
          const mean = vals.reduce((s, x) => s + x, 0) / N;
          const elMean = 990000 * Math.exp(0.125);
          const ok = mean > elMean * 0.8 && mean < elMean * 1.25 && Math.max(...vals) > mean * 1.5 && vals.some(v => v === 0);
          return ok
            ? { pass: true, summary: `Looks right — average simulated year ${fmt(mean)}, with zero-loss years and a long right tail (worst ${fmt(Math.max(...vals))}).`, values: vals }
            : { pass: false, summary: `Average came out ${fmt(mean)}. Each risk should fire with chance p% (Math.random() < r.p/100); when it fires add lognormal(r.i, 0.5).`, values: vals };
        }}
      />

      <p className="measure">Now run the production version on your own register, change the severity spread, and watch the tail breathe. This engine returns in the next three lessons. Saved into Artifact A11.</p>
      <MonteCarlo lessonId="4.2" artifactId="A11-montecarlo" />

      <Rubric
        title="a trustworthy Monte Carlo run"
        criteria={[
          { c: 'Whole distribution, not one number', good: 'you read the mean, a bad-year percentile, and the worst case — and say what decision each one drives' },
          { c: 'Mean sanity-checked', good: 'the simulated average lands near the sum of probability × impact (a little above, from lognormal skew) — if it doesn’t, the model is wrong' },
          { c: 'Tail explained, not ignored', good: 'you can name which risks drive the right tail (for Meridian, R3/R4/R11) rather than treating the worst case as noise' },
          { c: 'Enough runs for the question', good: 'thousands of runs for the mean; many more before you trust a deep tail percentile, because error only falls as σ/√N' },
          { c: 'Honest about inputs', good: 'you state where the probabilities and spreads came from — Monte Carlo amplifies them, garbage in → garbage out' },
        ]}
        exemplar="Meridian: 14 risks, each a Bernoulli on its probability × a lognormal severity around its impact. Average year ≈ €29m (the sum of expected losses), but a long right tail runs far higher in the years R3, R4, or R11 fire. The board budgets the mean, sizes its buffer off the 95th percentile, and tests survival against the worst case."
      />

      <ProblemSet items={[
        { q: 'Your Monte Carlo error is too large. Why does quadrupling the number of iterations only roughly halve it?', solution: 'The Monte Carlo standard error scales as σ/√N. Halving it requires √N to double, i.e. N to quadruple. Precision is expensive — diminishing returns set in fast.' },
        { q: 'Your simulated average comes out about 13% above the sum of probability × impact. Bug or feature?', solution: 'Feature. Severities are lognormal(median = i, σ = 0.5), whose mean is i·e^(σ²/2) = i·e^0.125 ≈ 1.13·i — higher than the median i, because the lognormal is right-skewed. The extra 13% is the tail showing up in the average.' },
      ]} />

      <p className="measure">You now have the engine. The next lesson stops at the mean only long enough to split it: it separates the average loss you budget for (expected loss) from how much worse than average a year can plausibly get (unexpected loss), and reads the capital you must hold off the same tail you just simulated.</p>
    </LessonShell>
  );
}
