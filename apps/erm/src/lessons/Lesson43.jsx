import React from 'react';
import { getLesson } from '../curriculum.js';
import { LessonShell } from '../components/LessonShell.jsx';
import { Lead, Objectives, Stage } from '../components/prose.jsx';
import { Pathway, DoNow } from '../components/Pathway.jsx';
import { MathBlock, ProblemSet } from '../components/MathBlock.jsx';
import { Rubric } from '../components/Rubric.jsx';
import { CodeExercise } from '../components/CodeExercise.jsx';
import { LossDistribution } from '../tools/LossDistribution.jsx';
import { poisson, lognormal } from '../tools/statlib.js';
import { fmt } from '../tools/riskmath.js';

const lesson = getLesson('4.3');

const pathway = [
  { kind: 'watch', t: 'Expected vs. unexpected loss, explained', src: 'short practitioner explainer', min: 8, tier: 'warmup', why: 'Get the provision-vs-capital split in pictures before the maths.' },
  { kind: 'read', t: 'Basel Framework — operational risk capital', src: 'Bank for International Settlements (bis.org)', href: 'https://www.bis.org/basel_framework/', min: 20, tier: 'core', why: 'How regulators turn a loss distribution into a binding capital requirement.' },
  { kind: 'read', t: 'Risk Capital Attribution and RAROC', src: 'AnalystPrep — FRM study notes', min: 18, tier: 'core', why: 'RAROC as a decision rule: return per unit of capital consumed.' },
  { kind: 'do', t: 'Estimate capital for one of your loss types', src: 'the loss-distribution lab in this lesson → Artifact A11', tier: 'apply', why: 'Turn the model into an EL/UL/capital number for a risk you actually run.' },
  { kind: 'book', t: 'Risk Management and Financial Institutions — economic capital', src: 'John Hull (6th ed.)', tier: 'deeper' },
];

const retrieval = [
  { q: 'Expected loss vs. unexpected loss:', options: [
    { text: 'expected loss is the average you provision for; unexpected loss is the surprise above it you hold capital against.', correct: true },
    { text: 'they are the same number.' },
    { text: 'unexpected loss is always smaller than expected loss.' }] },
  { q: 'Economic capital is, in essence…', options: [
    { text: 'enough of a buffer to survive losses up to a chosen high percentile.', correct: true },
    { text: 'the company’s share price.' },
    { text: 'the expected loss times two.' }] },
  { q: 'A business line earns high profit but consumes a great deal of capital. RAROC tells you…', options: [
    { text: 'it can still be the worse line — return per unit of capital, not raw return, is what creates value.', correct: true },
    { text: 'it is always the best line, because profit is what matters.' },
    { text: 'nothing, because RAROC ignores profit.' }] },
];

export default function Lesson43() {
  return (
    <LessonShell lesson={lesson} retrieval={retrieval}>
      <Lead>Once you have a loss distribution, two numbers fall out of it that run the financial side of risk: the loss you expect, and the loss you must survive.</Lead>

      <p className="measure">A loss distribution comes from combining how <em>often</em> losses happen (frequency) with how <em>big</em> they are (severity) — exactly what the simulator built last lesson. From its shape you read two distinct quantities. The <em>expected loss</em> is the average — the cost of doing business, which you provision for like any other expense. The <em>unexpected loss</em> is the distance from that average out to a bad-case percentile — the surprise you can’t provision for, only hold <em>capital</em> against. Confusing the two is how organizations end up adequately provisioned and still insolvent after one bad year: they budgeted for the average and met the surprise with nothing behind it.</p>

      <p className="measure">Here is how to work through the topic — the explainer for the shape of the idea, then the Basel source for how a distribution becomes a capital requirement and the RAROC notes for how capital gets priced, with the lab at the end where you read your own numbers off.</p>

      <Pathway lessonId="4.3" items={pathway} />

      <Objectives items={[
        'Build a loss distribution from frequency and severity (the compound model).',
        'Separate expected loss (provision) from unexpected loss (capital), and define economic capital.',
        'Explain risk-adjusted return (RAROC) and why a capital-hungry line can be the worse one.',
        'Estimate capital for a loss type in your organization (Artifact A11).',
      ]} />

      <Stage n={1} kicker="Understand the discipline" title="Provision for the average, capitalise for the surprise" />
      <p className="measure">Start with the model that produces the distribution everything else reads from. An aggregate annual loss is a <strong>compound</strong> quantity: in a year, some random <em>number</em> of loss events occur (the frequency), and each one costs a random <em>amount</em> (the severity); the year’s total is the sum. Model the two separately — frequency as a count process (a Poisson rate, “events per year”), severity as a right-skewed positive distribution (a lognormal, “most losses small, a few enormous”) — and then combine them by simulating thousands of years. The reason you simulate rather than solve is that the sum of a random number of random amounts has no tidy formula; it is a convolution, and the honest way to see its shape is to draw it. What comes out is not a forecast of next year but a <em>portrait of all the years you might have</em> — a histogram whose left bulk is the routine and whose long right tail is the rare catastrophe.</p>

      <p className="measure">From that portrait, the discipline reads two numbers that mean entirely different things, and the split between them is the backbone of how serious financial institutions think about solvency. The <strong>expected loss (EL)</strong> is the mean of the distribution — the long-run average cost of simply being in this business. Because it is expected, you treat it like any other cost: you <em>provision</em> for it, price it into products, and carry it as a line in the budget. It is not a risk in the dangerous sense; it is a known toll. The danger lives above it. The <strong>unexpected loss (UL)</strong> is how much worse than average a genuinely bad year can be — the distance from the mean out to a high percentile of the tail. You cannot provision for it, because by definition it is the surprise; you can only stand behind it with <em>capital</em>, a buffer of owners’ money whose entire job is to absorb the years that overshoot the average without rendering the firm insolvent. Provisions cover what you expect; capital covers what you don’t. Mistake one for the other and a single bad year ends you while your accounts looked fully reserved the day before.</p>

      <p className="measure">This is what <strong>economic capital</strong> means in one sentence: enough of a buffer to survive losses out to a chosen high percentile of the loss distribution. Choose 99% and you are holding enough to survive all but the worst one year in a hundred; choose 99.5% and you are buying survival through all but the worst one-in-two-hundred; 99.9% buys you the one-in-a-thousand year. Beyond some extreme percentile you stop — no firm holds capital against the meteor strike, because the capital required to insure the truly unimaginable would consume the whole business. The crucial point, and the reason this lesson sits <em>after</em> Part 2 rather than before it, is that <em>choosing the percentile is not a calculation</em>. The maths can size the buffer for any percentile you name; which percentile you want — how much survival you are willing to pay for — is a risk-appetite decision, the same board value judgment you met in lesson 2a dressed now in the language of capital. A regulator may set a floor (Basel uses high confidence levels for exactly this reason), but inside that floor, where to stand is a posture, not a fact.</p>

      <p className="measure">Watch the whole construction land on the carried case. <strong>Meridian Industries</strong> carries a five-year operational loss history (case bible §7): a steady drizzle of small losses — €0.4m, €0.1m, €1.2m, €0.2m, €0.3m, €0.2m, €0.1m, €0.6m, €0.3m across the years — punctuated by one large event, the <strong>€4.0m product recall</strong> in year four. Read as a compound model, that history is a low-rate frequency (a handful of small events a year) crossed with a severity that is mostly modest but occasionally enormous: a textbook fat tail. Simulate it and the picture is unmistakable. The <em>expected</em> operational loss — the mean of all the simulated years — sits well under a million euros; it is the cost of running plants and shipping food, and Meridian can simply budget for it. But the <em>capital</em> needed to survive to Meridian’s chosen <strong>99.5% percentile</strong> is several multiples of that, and almost all of the gap is the recall. The drizzle barely moves the capital number; the single €4m tail event is what drives it. That is the whole lesson in one history: provision for the drizzle, hold capital for the recall, and notice that the capital figure is essentially a statement about <em>one</em> rare event you cannot afford to be unprepared for. It is also exactly why Meridian’s appetite for food safety is <em>averse</em> rather than merely cautious (case bible §8) — the tail that sets the capital is the same tail the board refuses to tolerate.</p>

      <p className="measure">One discipline-level warning before the maths, and it is the spine of all of Part 4: every number in the previous paragraph came out of a distribution you <em>simulated from assumptions</em> — an assumed frequency rate, an assumed severity shape, fitted to a thin five-year history. Economic capital lives entirely in the tail, which is precisely where data is sparsest and model error largest. The 99.5% figure is an educated extrapolation, not a measurement; change the assumed tail and it moves a lot. So carry the capital number as a considered estimate with error bars, never as a measured fact — and treat the appetite decision about which percentile to hold as more robust than the precise euro figure it produces.</p>

      <DoNow>Before the build, skim the Basel operational-risk pages (pathway step 2, ~20 min) for how a regulator converts a loss distribution into a binding capital requirement — the same EL/UL/percentile machinery you’re about to run, made mandatory.</DoNow>

      <Stage n={2} kicker="Quantify — what the maths does" title="Capital, and the price of return" />
      <p className="measure">The tool simulates a loss type and marks the expected loss and the capital line at your chosen percentile; the gap between them is the unexpected loss. Push the severity spread and watch capital outrun expected loss — fat tails are expensive, and they are expensive in exactly the way Meridian’s recall is: a heavier tail leaves the mean almost untouched while dragging the high percentile far to the right. This is why two business lines with the <em>same</em> expected loss can demand wildly different capital, and it leads straight to the decision rule that allocates capital well.</p>

      <p className="measure">That rule is <strong>risk-adjusted return (RAROC)</strong>: not raw return, but return per unit of <em>capital consumed</em>. A line that earns handsome profit but ties up a fat capital buffer against its tail may create less value than a duller line that earns modestly while consuming almost no capital — because the capital it eats is owners’ money that could have backed something else. RAROC puts businesses with very different risk profiles on one comparable footing: revenue minus costs minus <em>expected</em> losses, divided by the <em>economic capital</em> the line requires, judged against the firm’s hurdle (its cost of capital). Above the hurdle the activity creates value; below it, it destroys value even while reporting a profit. For Meridian the lesson is direct: a high-growth emerging-market push that quietly fattens the operational-loss tail can score worse on RAROC than a steadier domestic line, and only a risk-adjusted view reveals it. But the same humility applies one layer down — RAROC inherits every fragility of the capital estimate sitting in its denominator, and that estimate can be gamed by quietly choosing a softer percentile. Treat the verdict as a considered estimate, not a measured fact.</p>

      <MathBlock>
        <p>An aggregate loss is a <em>compound</em> random variable: <span className="eq">S = X₁ + X₂ + … + X_N</span>, where the count <span className="eq">N</span> is itself random (often Poisson with rate <span className="eq">λ</span>) and each severity <span className="eq">Xᵢ</span> is drawn from the severity distribution.</p>
        <p>Its mean follows <em>Wald’s identity</em>: <span className="eq">E[S] = E[N] · E[X]</span>. Its variance carries both sources of uncertainty: <span className="eq">Var[S] = E[N]·Var[X] + Var[N]·E[X]²</span>.</p>
        <p>Expected loss is just <span className="eq">EL = E[S]</span>. Economic capital at confidence <span className="eq">α</span> is the quantile <span className="eq">qₐ(S)</span>, and unexpected loss is the gap <span className="eq">UL = qₐ(S) − EL</span>. There’s usually no closed form for the distribution of <span className="eq">S</span> — it’s a convolution — which is precisely why you simulate it rather than solve it.</p>
      </MathBlock>

      <Stage n={3} kicker="Build it — write the model" title="Build the aggregate-loss model" />
      <p className="measure">Build one year of a compound loss yourself: draw how many events occur, then sum their severities. Run it enough times and you have the loss distribution the lab below reads capital off.</p>

      <CodeExercise
        id="4.3-agg"
        title="Write the aggregate-loss function"
        prompt="Draw the number of events k from poisson(lambda), then add k severities, each from lognormal(median, sigma). Return the year’s total."
        entry="aggregateLoss"
        helpers={{ poisson, lognormal }}
        starter={`// helpers available:  poisson(lambda),  lognormal(median, sigma)
function aggregateLoss(lambda, median, sigma) {
  let total = 0;
  // TODO: draw k = poisson(lambda) events,
  //       then add k severities, each lognormal(median, sigma)
  return total;
}`}
        solution={`function aggregateLoss(lambda, median, sigma) {
  let total = 0;
  const k = poisson(lambda);
  for (let n = 0; n < k; n++) {
    total += lognormal(median, sigma);
  }
  return total;
}`}
        fmtX={fmt}
        test={(fn) => {
          const N = 8000, vals = new Array(N);
          for (let n = 0; n < N; n++) vals[n] = fn(3, 200000, 0.7);
          const mean = vals.reduce((s, x) => s + x, 0) / N;
          const target = 3 * 200000 * Math.exp(0.245);
          const ok = mean > target * 0.8 && mean < target * 1.25 && Math.max(...vals) > mean * 1.6 && vals.some(v => v === 0);
          return ok
            ? { pass: true, summary: `Right shape — mean aggregate ${fmt(mean)} (≈ λ·E[X]), with some loss-free years and a heavy tail (worst ${fmt(Math.max(...vals))}).`, values: vals }
            : { pass: false, summary: `Mean came out ${fmt(mean)} (expected ≈ ${fmt(target)}). Draw k = poisson(lambda), then loop k times adding lognormal(median, sigma).`, values: vals };
        }}
      />

      <p className="measure">Now use the lab on a loss type your organization faces, and read off the expected loss and the capital at your chosen survival percentile. Saved into Artifact A11.</p>
      <LossDistribution lessonId="4.3" artifactId="A11-loss" />

      <p className="measure">Read your result back through the questions that separate a capital estimate from a number you can defend. The standard to hold it to:</p>

      <Rubric
        title="a defensible capital estimate"
        criteria={[
          { c: 'Frequency and severity stated separately', good: 'a rate (events/year) and a severity shape, each justified from data or expert judgment — not one lumped guess' },
          { c: 'EL and capital distinguished', good: 'expected loss named as a provision; capital named as the gap out to a chosen percentile, not confused with the average' },
          { c: 'Percentile chosen on appetite', good: 'the survival confidence (99%, 99.5%, 99.9%) tied to a stated appetite, not picked to flatter the number (callback to 2a)' },
          { c: 'Tail driver identified', good: 'you can name the rare event that drives the capital, and confirm it dominates the routine drizzle' },
          { c: 'Held as an estimate, not a fact', good: 'stated as a range with its assumptions exposed, acknowledging the tail is the least reliable part' },
        ]}
        exemplar="Meridian operational losses: a low-rate frequency × a mostly-small severity with a €4m recall tail → EL well under €1m (provisioned), capital at 99.5% several multiples higher, driven almost entirely by the recall — held as an estimate because it rests on a thin five-year history."
      />

      <ProblemSet items={[
        { q: 'A loss type has λ = 4 events/year, each with mean severity €250k. What is the expected aggregate loss — and why doesn’t the severity’s spread change it?', solution: 'E[S] = E[N]·E[X] = 4 · 250,000 = €1,000,000. By Wald’s identity the mean depends only on the means of N and X, not their spread. The spread doesn’t touch the expected loss — but it drives the tail, and therefore the capital.' },
        { q: 'You raise the capital percentile from 99% to 99.9%. Why can the required capital jump sharply?', solution: 'You move further into a heavy (lognormal) tail, where the quantile rises steeply. A small step in confidence selects a much larger loss, so capital can climb fast — the cost of insuring against ever-rarer years grows faster than the rarity.' },
      ]} />

      <p className="measure">You now have the engine that turns a loss history into a capital number, and the judgment to hold that number lightly. The next lesson points the same machinery at the trading book: Value-at-Risk and Expected Shortfall are this distribution read from one more angle — the percentile as a threshold, and the average of everything beyond it.</p>
    </LessonShell>
  );
}
