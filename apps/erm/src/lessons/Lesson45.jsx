import React from 'react';
import { getLesson } from '../curriculum.js';
import { LessonShell } from '../components/LessonShell.jsx';
import { Lead, Objectives, Stage } from '../components/prose.jsx';
import { Pathway, DoNow } from '../components/Pathway.jsx';
import { StressSandbox } from '../tools/StressSandbox.jsx';
import { MathBlock, ProblemSet } from '../components/MathBlock.jsx';
import { CodeExercise } from '../components/CodeExercise.jsx';
import { Rubric } from '../components/Rubric.jsx';

const lesson = getLesson('4.5');

const pathway = [
  { kind: 'watch', t: 'What a stress test is, and why 2008 made it mandatory', src: 'short practitioner explainer', min: 6, tier: 'warmup', why: 'Get the “what if?” posture before the arithmetic.' },
  { kind: 'read', t: 'Supervisory stress test scenarios & DFAST', src: 'Federal Reserve (federalreserve.gov)', href: 'https://www.federalreserve.gov/supervisionreg/dfa-stress-tests.htm', min: 15, tier: 'core', why: 'The real baseline / adverse / severely-adverse scenarios the Fed runs on the largest U.S. banks.' },
  { kind: 'read', t: 'Guidelines on institutions’ stress testing (incl. reverse stress)', src: 'European Banking Authority (eba.europa.eu)', href: 'https://www.eba.europa.eu/', min: 18, tier: 'core', why: 'The European supervisory take, and the authoritative definition of reverse stress testing.' },
  { kind: 'do', t: 'Stress-test your organization and find its breaking point', src: 'the sandbox in this lesson → Artifact A11', tier: 'apply', why: 'Draw a severe-but-coherent scenario, then reverse-stress it to your own breaking multiple.' },
  { kind: 'book', t: 'Risk Management and Financial Institutions — scenario analysis & stress testing', src: 'John C. Hull', tier: 'deeper' },
];

const retrieval = [
  { q: 'Stress testing differs from VaR/Monte Carlo because it…', options: [
    { text: 'asks “what if this specific severe scenario happens?” rather than relying on the distribution of the past.', correct: true },
    { text: 'is always more accurate.' },
    { text: 'needs no assumptions.' }] },
  { q: 'Reverse stress testing starts from…', options: [
    { text: 'the failure, and works backward to what scenario would cause it.', correct: true },
    { text: 'a mild scenario and works up.' },
    { text: 'the expected loss.' }] },
];

export default function Lesson45() {
  return (
    <LessonShell lesson={lesson} retrieval={retrieval}>
      <Lead>Every model so far leans on the past. Stress testing is how you prepare for the futures the past never showed you — and reverse stress testing is how you find your own breaking point before the world does.</Lead>

      <p className="measure">Monte Carlo and VaR learn from history: they sample from distributions calibrated on what has happened. That is their power and their blind spot. The losses that actually kill organizations are usually the ones with no precedent in the data — the supplier nobody thought could fail failing in the same quarter the currency moved and the largest customer walked. A distribution fitted to calm years simply does not contain that future, so a model trained on it will rate the lethal scenario as near-impossible right up until it arrives. Stress testing exists to cover exactly that gap, and it does so by changing the question. Instead of asking “across everything that has happened, how bad is the 1-in-100 loss?”, it abandons probability for a while and asks something blunter and more useful: “suppose <em>this</em> happens — volumes down a fifth, a key market frozen, a major customer gone — do we survive?” You do not ask how likely. You ask how it would feel, and whether you would still be standing when it was over.</p>

      <p className="measure">Here is how to work through the topic — the video for the posture, then the two supervisory sources that define the discipline (the Fed’s scenarios for how a real stress test is structured, the EBA for the European framing and for reverse stress), and the sandbox build at the end where you find your own breaking point.</p>

      <Pathway lessonId="4.5" items={pathway} />

      <Objectives items={[
        'Explain why stress testing complements distribution-based methods rather than competing with them.',
        'Run a multi-factor, severe-but-coherent scenario against a capital buffer or covenant.',
        'Use reverse stress testing to find the scenario that breaks you, and read the breaking multiple as a fragility signal.',
        'Stress-test your organization and find its breaking point (Artifact A11).',
      ]} />

      <Stage n={1} kicker="Understand the discipline" title="Imagining the unprecedented" />
      <p className="measure">The defining move of a stress test is that it is <em>conditional</em>, not probabilistic. A VaR figure is a statement about a whole distribution — the loss you won’t exceed 99 times out of 100. A stress test fixes one specific state of the world and computes the consequence <em>given</em> that state: “in this scenario, this is what happens to earnings and capital.” That is why a stress test needs no probability for the scenario at all, which is precisely the point — the scenarios worth fearing are often the ones you can’t honestly assign a probability to, because there is no relevant history to estimate one from. Refusing to quantify likelihood is not a weakness of the method; it is what lets the method reach the futures the data can’t.</p>

      <p className="measure">Regulators lean hard on this discipline for exactly that reason: after 2008 they stopped trusting capital numbers calibrated on benign years, because every one of those models had said the system was safe. In the United States the Federal Reserve now runs annual <strong>supervisory stress tests</strong> — the Dodd-Frank Act Stress Test, DFAST, and the related CCAR — projecting each large bank’s capital ratio through a prescribed <em>severely adverse</em> scenario: a deep recession, unemployment spiking toward 10%, asset prices and corporate credit collapsing together. The bank must show its capital stays above the minimum all the way through. The European Banking Authority runs the parallel exercise across EU banks and, importantly, also mandates <em>reverse</em> stress testing — fixing the outcome at non-viability and working backward to the scenario that would cause it. Two regulators, the same conviction: a model that has only ever seen good weather cannot be trusted to tell you what the storm does.</p>

      <p className="measure">What separates a real stress test from a comforting one is the quality of the scenario, and there are two non-negotiable properties. It must be <strong>severe</strong> — a scenario the firm would shrug off teaches nothing — and it must be <strong>coherent</strong>: a single causal story in which several things fail <em>together</em>, the way they actually do in a crisis. Real downturns are not one bad number; they are a recession that simultaneously cuts demand, spikes input costs, weakens the currency and topples the customer who was already stretched. A scenario that moves one variable in isolation flatters you, because correlated stress is what genuinely breaks balance sheets. The art is to write a story severe and joined-up enough to hurt, and plausible enough that the board can’t wave it away as fantasy.</p>

      <p className="measure">Watch this land on Meridian. Its treasury keeps a named scenario for exactly this purpose — <strong>“Recession 2027”</strong>: volumes down 15%, commodity input prices up 20%, the euro down 10% against the currencies its inputs are priced in, and the largest retailer (18% of revenue) cutting orders by 30%. That is coherent — every move belongs to the same recession — and it is severe. Run it against the financials in the case bible. Meridian earns roughly €160m EBITDA today on €1.2bn revenue with a 10% operating margin, carries €280m of net debt, and lives under a revolving-credit-facility covenant of net debt / EBITDA below 3.0×, currently a comfortable-looking 1.75×. Push the scenario through and the comfort evaporates: lower volumes and a lost slice of the top customer drag revenue and contribution down, while pricier commodities and a weaker euro compress margin from both sides at once. EBITDA in the scenario falls toward roughly €95m. With net debt around €280m, leverage climbs to about 2.9× — a hair under the 3.0× tripwire. The firm technically passes, but the headroom that looked like 1.75× in calm weather is almost entirely gone. That is the kind of finding no average could ever surface: the covenant Meridian thought it had a wide margin against is, under one coherent recession, a near miss.</p>

      <p className="measure">Which sets up the most powerful version of the discipline. So far we asked “if this scenario, what happens to the covenant?” <strong>Reverse</strong> stress testing turns the question inside out: fix the bad outcome — covenant breached, capital at zero, firm non-viable — and solve for the scenario that gets you there. For Meridian the reverse question is concrete: how much <em>worse</em> than “Recession 2027” before net debt / EBITDA actually hits 3.0×? At 3.0× the covenant binds when EBITDA falls to about €93m. The drawn scenario already takes EBITDA to roughly €95m, so the breaking point sits only a sliver beyond it — the scenario barely needs to deepen before the covenant is breached. And that small margin <em>is</em> the warning. A breaking point reached by scaling the scenario up by a large multiple says “you’d need a far worse world than this to fail.” A breaking point reached at barely more than the scenario you already drew says “a recession only marginally nastier than one your own treasury called plausible would put you in default” — which is not comfortably implausible at all. The size of that margin, the breaking multiple, is the headline number of a reverse stress test, and a small one is a fragility alarm.</p>

      <DoNow>Before the build, open the Fed’s supervisory stress-test page (pathway step 2, ~15 min) and look at how a real <em>severely adverse</em> scenario is specified — multiple variables moving together, no probability attached. That joined-up severity is the standard your own scenario in the sandbox should meet.</DoNow>

      <Stage n={2} kicker="Quantify — what the maths does" title="From scenario to breaking point" />
      <p className="measure">The sandbox below is deliberately simple arithmetic: each stress factor knocks a chunk off your capital, and you watch whether the buffer holds. Then it solves the reverse problem — by how much would you have to scale the whole scenario to bring capital to zero? If the answer is “only a bit worse than what I just drew,” that’s a finding no average could give you, exactly as it was for Meridian’s covenant above. The maths here is trivial on purpose; the value is entirely in the conversation it forces about whether the breaking scenario is really beyond imagining. Stress testing’s limit is the same as its strength: it only tests the scenarios you’re wise or worried enough to imagine — the scenario you didn’t write is the one that gets you.</p>

      <MathBlock>
        <p>A stress test is <em>conditional</em>: it asks for the loss <span className="eq">given</span> a specified scenario, <span className="eq">E[L | scenario]</span>, rather than drawing from a historical distribution. That’s its strength — it needs no probability for the scenario — and its weakness — it tells you nothing about how <em>likely</em> the scenario is.</p>
        <p>Reverse stress testing inverts the question. Fix the outcome at failure (capital = 0) and solve for the scenario. In the simple linear case where each factor’s loss is <span className="eq">shockᵢ · sensᵢ</span> and you scale the whole scenario by a multiple <span className="eq">m</span>, failure occurs when <span className="eq">base = m · Σ(shockᵢ · sensᵢ)</span>, giving the <em>breaking multiple</em> <span className="eq">m* = base / Σ(shockᵢ · sensᵢ)</span>. A small <span className="eq">m*</span> means a scenario barely worse than the one you drew would ruin you.</p>
      </MathBlock>

      <Stage n={3} kicker="Build it — write the model" title="Build the reverse-stress solver" />
      <p className="measure">The sandbox below solves for your breaking point. Build that solver: given a capital buffer and a set of stress factors, return the multiple of the whole scenario that drives capital to zero.</p>

      <CodeExercise
        id="4.5-rev"
        title="Write the reverse-stress solver"
        prompt="Each factor’s hit is shock × sens. Return the multiple of the whole scenario that brings capital to zero: base ÷ (total hit). If there’s no hit, the multiple is Infinity."
        entry="breakingMultiple"
        starter={`// base: capital buffer (€)
// factors: array of { shock, sens }   — each factor's loss is shock * sens
function breakingMultiple(base, factors) {
  // TODO: total = sum of shock*sens; return base / total (or Infinity if total is 0)
  return 0;
}`}
        solution={`function breakingMultiple(base, factors) {
  const total = factors.reduce((s, f) => s + f.shock * f.sens, 0);
  return total > 0 ? base / total : Infinity;
}`}
        test={(fn) => {
          const m = fn(1000000, [{ shock: 10, sens: 50000 }, { shock: 5, sens: 20000 }]);
          const inf = fn(1000000, [{ shock: 0, sens: 0 }]);
          return (Math.abs(m - 1000000 / 600000) < 1e-6 && inf === Infinity)
            ? { pass: true, summary: `Correct — this scenario (€600k hit) breaks €1m of capital at ×${m.toFixed(2)}; a zero scenario returns Infinity.` }
            : { pass: false, summary: `Got ${m && m.toFixed ? m.toFixed(3) : m} (expected ${(1000000 / 600000).toFixed(3)}). Sum shock·sens, then divide base by it; guard the zero case with Infinity.` };
        }}
      />

      <p className="measure">Now use the sandbox: set a buffer, dial in a severe-but-coherent scenario, and read the reverse-stress multiple that takes you to zero. Then ask, honestly, whether a scenario that severe is really beyond imagining. Saved into Artifact A11.</p>
      <StressSandbox lessonId="4.5" artifactId="A11-stress" />

      <p className="measure">Read your scenario and its breaking multiple back through the question that exposes a comforting stress test: <em>would the board recognise this as a future that could really happen, and is the breaking point genuinely far beyond it?</em> If the scenario is mild, or the breaking multiple is barely above 1, the test is reassurance theatre. The standard to hold it to:</p>

      <Rubric
        title="a stress test worth running"
        criteria={[
          { c: 'Severe', good: 'the scenario actually hurts — a firm that shrugs it off has learned nothing' },
          { c: 'Coherent', good: 'one causal story with several things failing together, the way real crises move, not a single isolated shock' },
          { c: 'Conditional, not probabilistic', good: 'it computes the consequence given the scenario; it does not pretend to know the odds' },
          { c: 'Reverse-tested', good: 'you also fixed failure and solved for the scenario, and read the breaking multiple as a fragility signal' },
          { c: 'Honest about its limit', good: 'you acknowledge it only covers the scenarios you imagined — the one you didn’t write is the one that gets you' },
        ]}
        exemplar="Meridian: “Recession 2027” (volumes −15%, commodities +20%, FX −10%, top retailer −30%) is severe and coherent; it drives EBITDA to ≈€95m and leverage to ≈2.9× — a near miss on the 3.0× covenant. Reverse-stress: EBITDA need only fall a sliver more, to ≈€93m, to breach — a small breaking multiple, so the headroom is fragile, not comfortable."
      />

      <ProblemSet items={[
        { q: 'A bank passes its stress test, but its reverse-stress breaking multiple is 1.2×. Should it be reassured?', solution: 'No. A scenario only 20% worse than the one tested would wipe out its capital — that’s fragile, and there’s rarely any guarantee the tested scenario is the worst plausible one. A small breaking multiple is a warning, not a clean pass.' },
        { q: 'Why can’t stress testing replace probabilistic models like Monte Carlo?', solution: 'Stress tests don’t assign likelihoods and only cover scenarios you imagined. Probabilistic models give a distribution over many outcomes but lean on historical calibration. Each covers the other’s blind spot, so a mature function runs both.' },
      ]} />

      <p className="measure">Stress testing closes the loop Part 4 opened: the distribution-based methods tell you what the past implies, and the stress test tells you what you’re afraid of — and the things you forgot to fear are the ones that get you. Run both, write scenarios severe and coherent enough to hurt, and reverse-stress them until you know exactly how far your own breaking point sits from a world you’d call plausible. That distance, honestly measured, is the closest a risk function gets to knowing whether it would survive.</p>
    </LessonShell>
  );
}
