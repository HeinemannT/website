import React from 'react';
import { getLesson } from '../curriculum.js';
import { LessonShell } from '../components/LessonShell.jsx';
import { Lead, Objectives, Stage } from '../components/prose.jsx';
import { Pathway, DoNow } from '../components/Pathway.jsx';
import { MathBlock, ProblemSet } from '../components/MathBlock.jsx';
import { Rubric } from '../components/Rubric.jsx';
import { CodeExercise } from '../components/CodeExercise.jsx';
import { randn, studentT } from '../tools/statlib.js';
import { fmt } from '../tools/riskmath.js';

const lesson = getLesson('4.7');

const pathway = [
  { kind: 'watch', t: 'Fat tails, explained', src: 'short practitioner explainer', min: 8, tier: 'warmup', why: 'Lock the idea that the bell curve calls real disasters “impossible” before the formalism.' },
  { kind: 'read', t: 'The Fourth Quadrant / fat tails', src: 'Nassim Taleb (fooledbyrandomness.com)', href: 'https://www.fooledbyrandomness.com/quadrants.pdf', min: 18, tier: 'core', why: 'Where thin-tailed statistics are lethal — the case for not trusting the body.' },
  { kind: 'read', t: 'Extreme value theory — block maxima vs peaks-over-threshold', src: 'Wikipedia', href: 'https://en.wikipedia.org/wiki/Extreme_value_theory', min: 14, tier: 'core', why: 'The GEV / GPD split and what the tail index measures.' },
  { kind: 'do', t: 'Count threshold breaches on normal vs fat-tailed samples', src: 'the code build in this lesson → Artifact A11', tier: 'apply', why: 'See the fat tail breach a high line many times more often than the bell curve.' },
  { kind: 'book', t: 'Quantitative Risk Management — extremes & EVT', src: 'McNeil, Frey & Embrechts', tier: 'deeper' },
];

const retrieval = [
  { q: 'Why does a model fitted to the calm “body” of a distribution mislead about its extremes?', options: [
    { text: 'The body and the tail can follow different laws — a normal fit to the middle massively understates how often and how far the extremes reach.', correct: true },
    { text: 'The body is always wrong; only the tail can be measured.' },
    { text: 'It doesn’t — fitting the body always fits the tail.' }] },
  { q: 'Under a normal distribution, a 5-sigma daily loss is…', options: [
    { text: 'effectively impossible (about 1 in 3.5 million) — yet real markets produce them, so the normal understates extremes.', correct: true },
    { text: 'common, roughly once a month.' },
    { text: 'the worst loss that can ever occur.' }] },
  { q: 'For a heavy-tailed loss, the mean-excess function (average loss beyond a threshold) as the threshold rises…', options: [
    { text: 'keeps rising — the deeper you go, the worse the average overshoot, the opposite of a thin tail.', correct: true },
    { text: 'falls to zero, because losses run out.' },
    { text: 'stays flat at the mean.' }] },
];

export default function Lesson47() {
  return (
    <LessonShell lesson={lesson} retrieval={retrieval}>
      <Lead>Under a normal distribution, a five-sigma day happens about once every fourteen thousand years. Real markets serve up several a decade — which means the comfortable bell curve isn’t conservative about disasters, it denies they exist.</Lead>

      <p className="measure">Every risk number in Part 4 — VaR, Expected Shortfall, economic capital — is read off the <em>tail</em> of a distribution. And the tail is exactly the part you have least data about and are most tempted to guess. The seductive move is to fit a familiar curve to the mass of ordinary days, where you have thousands of observations, and then read the extremes off that same curve. It fits the body beautifully and lies about the tail catastrophically, because the body and the tail need not obey the same law. A normal distribution has a tail that decays so fast that anything past four or five standard deviations is, for practical purposes, ruled out — yet the events that bankrupt firms live precisely out there. This lesson is about taking the tail seriously on its own terms: why the body misleads, what “fat tails” actually means, and the one body of theory — extreme value theory — built to model the extremes directly instead of trusting an extrapolation from the calm.</p>

      <p className="measure">Here is how to work through it — the video for the shape of the idea, then Taleb on where thin-tailed statistics turn lethal and a primer on the two EVT approaches, and the code build at the end where you watch a fat tail breach a high line many times more often than the bell curve says it can.</p>

      <Pathway lessonId="4.7" items={pathway} />

      <Objectives items={[
        'Explain why a distribution’s body lies about its extremes, and why fitting the calm middle gets the tail catastrophically wrong.',
        'Contrast the thin Gaussian tail with fat / heavy (power-law) tails, and say why VaR, ES and capital are hostage to the tail assumption.',
        'State, at intuition level, what extreme value theory offers — block maxima → GEV, peaks-over-threshold → GPD — and what the tail index measures.',
        'Read the mean-excess function: rising = heavy tail, flat/falling = thin — and know why EVT is an honest extrapolation on scarce data.',
        'Build a tail-breach counter and watch a fat-tailed sample breach a high threshold far more often than a normal one (Artifact A11).',
      ]} />

      <Stage n={1} kicker="Understand the discipline" title="The body lies about the tail" />
      <p className="measure">Start with the failure that keeps recurring, because it explains the whole discipline. An analyst has years of daily returns, fits a normal distribution — it matches the histogram’s hump almost perfectly — and reports the risk. The fit is real, and it is real <em>about the body</em>: 99% of days really do look roughly normal. The deceit is that the normal’s tails decay like <span className="eq">e^(−x²/2)</span>, absurdly fast, so the curve assigns essentially zero probability to the events that actually do the damage. A normal calibrated to ordinary days says a five-sigma loss is a once-in-fourteen-thousand-year event. Real equity markets have produced moves of five, ten, even twenty “sigmas” repeatedly within a single career. The model wasn’t slightly off in the tail; it was off by many orders of magnitude, and confidently so. Fitting the body and trusting the tail is the original sin of quantitative risk.</p>

      <p className="measure">The honest alternative is the language of <strong>fat tails</strong> (equivalently <em>heavy tails</em>). A tail is fat when extreme outcomes are far more probable, and far larger, than a normal would allow — when the rare event is not vanishingly rare. The cleanest fat-tailed form is a <strong>power law</strong>: the probability of exceeding a level <span className="eq">x</span> falls off only as <span className="eq">x^(−ξ)</span>, a polynomial, rather than the normal’s exponential collapse. Polynomial decay is dramatically slower, so a power-law world produces extremes that a Gaussian world would call impossible, again and again. Financial returns, insurance losses, operational losses, city sizes, flood levels — heavy tails are the rule in the things risk managers care about, not the exception. The practical consequence is blunt: because every tail risk measure lives out where the two curves diverge most, <em>the single most important modelling choice you make is the tail assumption</em>, and a model fitted to the calm body has quietly made that choice in the worst possible way. This is the formal spine under Taleb’s argument (lesson 5d): in fat-tailed domains, the average of your data tells you little about the maximum, and the next observation can dwarf the entire history.</p>

      <p className="measure">So what do you do instead of trusting the body? You model the tail directly — and the remarkable fact that makes this possible is <strong>extreme value theory</strong>. Just as the central limit theorem says sums of almost anything converge to a normal, EVT says the <em>extremes</em> of almost anything converge to one of a small family of limiting shapes — regardless of the messy distribution underneath. There are two practical doors into it. <strong>Block maxima</strong>: chop the history into blocks (say, yearly), take the worst loss in each, and the distribution of those maxima converges to the <strong>Generalized Extreme Value (GEV)</strong> family. <strong>Peaks-over-threshold</strong>: pick a high threshold, keep every exceedance above it, and the distribution of those overshoots converges to the <strong>Generalized Pareto Distribution (GPD)</strong>. Peaks-over-threshold is usually the practitioner’s tool because it uses every extreme observation, not just one per block. Both are governed by a single number, the <strong>tail index</strong> <span className="eq">ξ</span> (shape parameter): <span className="eq">ξ &gt; 0</span> means a genuinely heavy, power-law tail (the heavier the worse); <span className="eq">ξ = 0</span> is the thin, exponential-type tail; <span className="eq">ξ &lt; 0</span> is a tail with a hard upper bound. Estimating <span className="eq">ξ</span> is, quite literally, measuring how dangerous your worst case is.</p>

      <p className="measure">A second EVT diagnostic earns its place in your toolkit because it is so quick to read: the <strong>mean-excess function</strong> — the <em>average</em> loss beyond a threshold, plotted as you raise the threshold. For a thin tail it is flat or falling: once you’re past a certain point, going further buys you little extra overshoot. For a heavy tail it <em>keeps rising</em> — the deeper into the tail you set the line, the worse the average loss beyond it. That upward slope is the visual fingerprint of a fat tail, and it is the same intuition that drives Expected Shortfall away from VaR in lesson 4.4: when the mean-excess climbs, the disaster past the line dwarfs the line. Be honest, though, about EVT’s catch. It is built on the scarcest data you have — the handful of observations that actually reached the tail — so every estimate is an <em>extrapolation</em>, and a confident-looking GPD fit on twelve exceedances is still a confident-looking guess. EVT does not manufacture data you don’t have; it disciplines how you reach beyond the data you do have, which is honest precisely because it admits that is what it’s doing.</p>

      <p className="measure">Watch this on the firm you’re carrying through the course. <strong>Meridian Industries’</strong> five-year operational loss log reads as a steady drizzle of small hits — a few losses a year around €0.2–0.6m — punctuated by one rare giant: the €4m precautionary recall in year four, after a labelling error pulled a product line and the share price fell 9% for a month. Fit a normal to those small annual losses and the €4m year sits absurdly far out in the tail — the body would call it a freak that shouldn’t recur in centuries. The loss history says otherwise: that is simply the shape of a fat tail — a quiet body with a rare, heavy overshoot, and the mean-excess of this log rises rather than flattens. Worse, the body doesn’t even see the truly strategic extreme. R4 in the register — the top retailer (18% of revenue) walking, a roughly <strong>€40m</strong> loss — is a tail event of a kind the operational loss curve has no observation of at all; a Gaussian fitted to the drizzle would price it at essentially zero probability. The recall is the tail Meridian has lived through; the €40m is the tail it has not. A risk function that capitalised Meridian to the body of its loss history would be holding a buffer for the drizzle and none for the deluge.</p>

      <DoNow>Before the build, skim Taleb’s “Fourth Quadrant” (pathway step 2, ~18 min) for where thin-tailed statistics turn lethal — then keep his test in mind: in your own domain, can a single future observation be larger than everything you’ve seen so far? If yes, you’re in a fat tail and the body cannot be trusted.</DoNow>

      <Stage n={2} kicker="Quantify — what the maths does" title="How fast the tail decays" />
      <p className="measure">The entire fat-tail story is a contest between two rates of decay. The normal’s survival probability — the chance of exceeding a level <span className="eq">x</span> — falls off like <span className="eq">e^(−x²/2)</span>, faster than exponential; push <span className="eq">x</span> out a little and that probability collapses toward nothing. A power-law (heavy) tail falls off only like <span className="eq">x^(−ξ)</span>, a polynomial, which is dramatically slower. Plot both on a log scale and the normal’s tail bends sharply down to the floor while the power law stays a straight, stubborn line. That gap <em>is</em> the risk: a five-sigma loss carries a normal probability around <span className="eq">3×10⁻⁷</span> — once in roughly fourteen thousand years of trading — yet shows up in real markets every few years. The tail index <span className="eq">ξ</span> is just the slope of that stubborn line, and EVT’s claim is that beyond a high enough threshold the overshoots are governed by <span className="eq">ξ</span> alone, whatever the body looks like.</p>

      <MathBlock>
        <p>Compare the two tails by their survival function <span className="eq">S(x) = P(L &gt; x)</span>. Normal: <span className="eq">S(x) ≈ e^(−x²/2)</span> — super-exponential decay, so extremes are crushed to ~0. Power law: <span className="eq">S(x) ≈ x^(−ξ)</span> — polynomial decay, so extremes survive.</p>
        <p>Extreme value theory makes this precise. Above a high threshold <span className="eq">u</span>, the exceedances <span className="eq">L − u</span> converge to a <em>Generalized Pareto</em>: <span className="eq">P(L − u &gt; y | L &gt; u) = (1 + ξ y / β)^(−1/ξ)</span>. The single shape parameter <span className="eq">ξ</span> (the tail index) decides everything: <span className="eq">ξ &gt; 0</span> heavy/power-law, <span className="eq">ξ = 0</span> thin/exponential, <span className="eq">ξ &lt; 0</span> bounded. The mean-excess <span className="eq">e(u) = E[L − u | L &gt; u]</span> rises in <span className="eq">u</span> exactly when <span className="eq">ξ &gt; 0</span> — its upward slope is the fat tail you can see by eye.</p>
      </MathBlock>

      <Stage n={3} kicker="Build it — write the model" title="Count the tail breaches" />
      <p className="measure">No formula makes the point like watching it happen. Below you’ll write one function: given a sample of losses and a high threshold, count how many observations breach it. The test runs your counter on two samples of equal size — one drawn from a <em>normal</em>, one from a heavy-tailed <em>Student-t</em> — at the same threshold, and the fat-tailed sample breaches many times more often. That ratio, on samples you didn’t design, is the whole lesson: same threshold, same sample size, wildly different tail.</p>

      <CodeExercise
        id="4.7-tail"
        title="Count threshold breaches: normal vs fat tail"
        prompt="Write tailBreaches(sample, threshold): return the number of values in sample that strictly exceed threshold. The test draws a large normal sample and an equal heavy-tailed (Student-t, ν=3) sample, counts breaches of the same high threshold in each, and checks the fat tail breaches far more often."
        entry="tailBreaches"
        helpers={{ randn, studentT }}
        starter={`// sample: array of losses;  threshold: a high cut-off
function tailBreaches(sample, threshold) {
  // TODO: count how many values strictly exceed threshold
  let count = 0;
  // ...
  return count;
}`}
        solution={`function tailBreaches(sample, threshold) {
  let count = 0;
  for (const x of sample) {
    if (x > threshold) count++;
  }
  return count;
}`}
        fmtX={(n) => n.toFixed(1) + 'σ'}
        test={(fn) => {
          const N = 20000, THRESH = 4; // 4 "sigma": normal almost never, fat tail often
          const normalSample = Array.from({ length: N }, () => Math.abs(randn()));
          const fatSample = Array.from({ length: N }, () => Math.abs(studentT(3)));
          // sanity: the function must actually count exceedances
          const sanity = fn([0, 5, 1, 9, 2], 4);
          if (sanity !== 2) {
            return { pass: false, summary: `Got ${sanity} breaches for [0,5,1,9,2] over 4 (expected 2). Count values strictly greater than the threshold.` };
          }
          const nBreach = fn(normalSample, THRESH);
          const fBreach = fn(fatSample, THRESH);
          const ok = nBreach < N * 0.001 && fBreach > nBreach * 3;
          return {
            pass: ok,
            summary: ok
              ? `Correct. At a ${THRESH}σ threshold the normal sample breached ${nBreach} times; the fat-tailed (t₃) sample breached ${fBreach} times — about ${(fBreach / Math.max(nBreach, 1)).toFixed(0)}× more, on samples you didn’t design. The histogram is the fat-tailed sample: note how far its tail reaches past the ${THRESH}σ line the normal almost never crosses.`
              : `Got normal ${nBreach}, fat-tailed ${fBreach} breaches at ${THRESH}σ. tailBreaches should return how many values strictly exceed the threshold — the fat tail should breach several times more often.`,
            values: fatSample.filter((x) => x < 12),
          };
        }}
      />

      <p className="measure">Look at what just happened. You changed nothing about the threshold, the sample size, or your counting code — only the distribution the numbers came from — and the breach count exploded. That is the fat tail, and it is why a VaR or capital figure read off a normal fit is not conservative but dangerous: it is calibrated to the sample on the left and will be paid out against the one on the right. The histogram drives it home — the fat-tailed sample keeps placing mass far out past a line the bell curve treats as the edge of the possible. Saved into Artifact A11. The standard to hold any tail estimate to:</p>

      <Rubric
        title="an honest tail estimate"
        criteria={[
          { c: 'Models the tail, not the body', good: 'the extreme is estimated from the extremes (EVT / threshold exceedances), not extrapolated from a curve fitted to the calm middle' },
          { c: 'States the tail assumption', good: 'names the tail index or distribution and shows the answer under a heavier tail too — the result is presented as hostage to that choice' },
          { c: 'Reads the mean-excess', good: 'checks whether average loss beyond the threshold rises (heavy) or flattens (thin) before trusting a thin-tailed number' },
          { c: 'Honest about scarcity', good: 'reports how few observations the tail estimate rests on, and treats the figure as an extrapolation with a range, not a fact' },
          { c: 'Stress-bridged', good: 'pairs the statistical tail with named scenarios (e.g. the loss with no precedent), since the worst case may be off the data entirely' },
        ]}
        exemplar="Meridian: fit the GPD to operational losses above a high threshold (POT), report ξ and the mean-excess slope; show the €4m recall as a tail observation the body would deny; and flag R4 (€40m, top retailer) as a strategic extreme with zero loss-history precedent — capitalise to the tail, never the drizzle."
      />

      <p className="measure">A worked correction, because this is the recurring mistake. An analyst reports: “our 99% one-year operational VaR is €1.1m, fitted to five years of loss data.” The €4m recall year is in that data — so either it was discarded as an outlier (it wasn’t an outlier; it was the tail) or it was averaged into a thin-tailed fit that smeared it away. The repair: set a high threshold, fit a GPD to the exceedances, estimate <span className="eq">ξ</span> (almost certainly &gt; 0 here), and read the 99% loss off the heavy tail — which will sit well above €1.1m. Then add the honesty the statistics can’t supply: note the estimate rests on a handful of tail points, and pair it with the €40m R4 scenario that has no statistical precedent at all. The number stops being a comfort and becomes a defensible range with its assumptions on the table.</p>

      <ProblemSet items={[
        { q: 'A risk analyst fits a normal to ten years of daily returns and reports that a −10% day is a “once in a billion years” event. Markets have delivered several −10% days in living memory. What went wrong, and what should they do?', solution: 'They fitted the body and trusted the tail. The normal’s tail decays super-exponentially, so a −10% (many-sigma) move is assigned a probability so small it reads as impossible — but real returns are fat-tailed, with polynomial (power-law) decay that makes such moves rare-but-real. The fix is to model the tail directly: pick a high threshold, fit a Generalized Pareto to the exceedances (peaks-over-threshold), estimate the tail index ξ (here clearly > 0), and read the extreme off the heavy tail. They should also report how few tail observations the estimate rests on and treat it as an extrapolation, not a measured fact.' },
        { q: 'You compute the mean-excess loss for Meridian’s operational losses at thresholds of €0.5m, €1m and €2m, and it rises at each step. What does that tell you, and what must you not do next?', solution: 'A rising mean-excess function is the signature of a heavy tail (ξ > 0): the deeper you set the threshold, the worse the average loss beyond it — the disaster past the line keeps dwarfing the line, exactly as ES pulls away from VaR. So you must not read capital or VaR off a thin-tailed (e.g. normal) fit, which would assume the opposite; use the GPD/EVT tail instead. And because the slope is estimated from very few large losses, you must not over-trust the precise number — report it as a range and bridge it to named scenarios (the €40m R4) that lie beyond the data entirely.' },
      ]} />

      <p className="measure">Tails are where every Part 4 number is finally decided, and where models are most confident and least trustworthy — which is why the next move is not another model but judgment about models: lesson 5d on cognitive bias, model risk, and the Taleb critique, where you’ll learn to distrust a clean tail fit on principle, and to ask what the body was hiding before you bet the firm on it.</p>
    </LessonShell>
  );
}
