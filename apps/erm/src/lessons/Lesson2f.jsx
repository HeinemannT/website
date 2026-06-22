import React from 'react';
import { getLesson } from '../curriculum.js';
import { LessonShell } from '../components/LessonShell.jsx';
import { Lead, Objectives, Stage } from '../components/prose.jsx';
import { Pathway, DoNow } from '../components/Pathway.jsx';
import { MathBlock, ProblemSet } from '../components/MathBlock.jsx';
import { Rubric } from '../components/Rubric.jsx';
import { TreatmentPlanner } from '../tools/TreatmentPlanner.jsx';

const lesson = getLesson('2f');

const pathway = [
  { kind: 'read', t: 'The Orange Book — risk response options', src: 'HM Treasury (gov.uk, 2023)', href: 'https://www.gov.uk/government/publications/orange-book', min: 10, tier: 'core', why: 'The official response set; note the literal “4 Ts” come from the 2004 edition.' },
  { kind: 'read', t: 'Background on: Risk Financing', src: 'Insurance Information Institute', href: 'https://www.iii.org/article/background-on-risk-financing', min: 12, tier: 'core', why: 'Retention, captives, and alternative risk transfer (cat bonds) in plain language.' },
  { kind: 'read', t: 'Risk financing — glossary entry', src: 'IRMI', href: 'https://www.irmi.com/term/insurance-definitions/risk-financing', min: 6, tier: 'core', why: 'Precise definitions of retention vs transfer, deductibles, and limits.' },
  { kind: 'do', t: 'Assign a treatment to every risk and price the transfers', src: 'the planner in this lesson → Artifact A7', tier: 'apply', why: 'Turn the four responses into a per-risk plan that changes what the firm does.' },
  { kind: 'book', t: 'Fundamentals of Risk Management — risk response & insurance chapters', src: 'Hopkin & Thompson', tier: 'deeper' },
];

const retrieval = [
  { q: 'Why does a fairly priced insurance premium normally exceed the risk’s expected loss?', options: [
    { text: 'The premium is expected loss plus a loading for the insurer’s costs, capital, and profit — so on average transfer costs more than retaining.', correct: true },
    { text: 'Insurers are legally required to overcharge.' },
    { text: 'Because expected loss plays no part in how premiums are set.' }] },
  { q: 'If transfer costs more on average, why transfer a rare-but-ruinous risk anyway?', options: [
    { text: 'You pay the loading to cut volatility and cap the ruinous tail — buying survival and capital relief, not a win on the average.', correct: true },
    { text: 'Because the expected loss of a rare risk is always large.' },
    { text: 'Because terminating the activity is never allowed.' }] },
  { q: 'A risk already sitting comfortably inside appetite is the classic case to…', options: [
    { text: 'tolerate — a deliberate, accountable decision to retain it, not neglect.', correct: true },
    { text: 'terminate, to be safe.' },
    { text: 'always transfer to an insurer.' }] },
];

export default function Lesson2f() {
  return (
    <LessonShell lesson={lesson} retrieval={retrieval}>
      <Lead>An insurer will quote you €600k a year to carry a risk whose expected loss is €420k. Paying the extra €180k is not a mistake — it is the whole point. This lesson is about why, and about the four moves you choose between.</Lead>

      <p className="measure">Once a risk has a residual size (lesson 2e) and a place against your appetite (2a), you have exactly four responses — the <strong>4 Ts</strong>. <strong>Treat</strong>: add or strengthen controls to cut likelihood or impact. <strong>Tolerate</strong>: deliberately accept and retain the exposure because it already sits within appetite. <strong>Transfer</strong>: pay a third party — usually an insurer — to carry the financial blow. <strong>Terminate</strong>: stop the activity, surrendering its reward to be rid of its risk. The labels are UK public-sector shorthand: the literal “4 Ts” trace to the <em>2004</em> Orange Book, and the current 2023 edition uses ISO-aligned wording instead (avoid, take/increase, retain, change likelihood, change consequences, share/transfer) — the same four ideas with more words. Within these, a sharper distinction runs underneath: <strong>treat</strong> and <strong>terminate</strong> change the physical risk, while <strong>tolerate</strong> and <strong>transfer</strong> are <em>risk financing</em> — decisions about who funds the loss, not whether it happens.</p>

      <Pathway lessonId="2f" items={pathway} />

      <Objectives items={[
        'Choose between Treat, Tolerate, Transfer, and Terminate for a given risk, and justify the choice from its position against appetite.',
        'Distinguish risk control from risk financing, and within financing, retention from transfer (including captives and alternative risk transfer).',
        'Read the economics of insurance: premium ≈ expected loss + loading, and explain why transfer is rational despite costing more on average.',
        'Build a treatment-and-financing plan for your register and check that residual risk lands inside appetite (Artifact A7).',
      ]} />

      <Stage n={1} kicker="Understand the discipline" title="Four responses, chosen by appetite" />
      <p className="measure">The four responses are not a menu you pick from by taste; the choice is <em>driven by where the risk sits against appetite</em>, and that single rule makes most decisions for you. A risk already <strong>inside appetite</strong> is a candidate to <strong>tolerate</strong> — retain it deliberately and move on; spending to shrink a risk you have already declared acceptable just burns money. A risk <strong>above appetite that you can shrink cheaply</strong> you <strong>treat</strong>: a better control buys the reduction at a price worth paying. A risk that is <strong>rare but ruinous</strong> — the warehouse fire, the product recall, the liability claim — is the classic case to <strong>transfer</strong>, because what you fear is not the average year but the one catastrophe that exceeds your capacity to absorb it. And a risk whose <strong>reward no longer justifies it</strong> you <strong>terminate</strong>, accepting that you lose the upside along with the exposure. Almost every real register ends up a blend of all four, and most individual risks get a <em>combination</em> — treat the part you can, then transfer or tolerate the residual.</p>

      <p className="measure">Two cautions keep this honest. First, <strong>transfer moves the financial consequence, not the accountability</strong>: insurance pays for the recall, but it cannot buy back the customers’ trust or the regulator’s attention, and the board still owns the failure. Second, every response leaves a <strong>residual risk</strong>, and that residual must itself sit within appetite — a deductible you retain, an excess above your policy limit, the reputational tail no policy covers. Treatment is not finished when you have chosen a T; it is finished when what remains is something you have consciously accepted. This closes the loop opened in 2a: appetite set the line, 2e measured where residual risk lands, and 2f is the decision that moves it onto the right side of that line.</p>

      <p className="measure">Within financing, the spectrum runs from pure <strong>retention</strong> to pure <strong>transfer</strong>. <em>Retention</em> is deliberate self-insurance: you carry the loss on your own balance sheet, which is the cheapest option for high-frequency, low-severity, predictable losses (you are better off paying the actual small losses than paying a premium loaded above them). A <strong>captive insurer</strong> is a formalised middle ground — a subsidiary the parent owns and funds to insure the group’s own risks, capturing the loading for itself and accessing reinsurance markets directly. <em>Transfer</em> proper is insurance, reinsurance, or contractual indemnity. And <strong>alternative risk transfer</strong> reaches the capital markets when traditional insurance is too thin or too dear — most famously the <strong>catastrophe bond</strong>, where investors fund a pool that pays the issuer if a defined catastrophe occurs and otherwise returns principal plus a coupon, letting a firm transfer extreme tail risk to bondholders.</p>

      <p className="measure">Watch the rule pick the response on Meridian’s register. <strong>R3</strong> — product contamination triggering a recall and regulatory action — is a 4% annual chance of an €18m hit. It is low-frequency and potentially ruinous, and Meridian’s appetite for food safety is explicitly <em>averse</em> (near-zero tolerance, hardened by the €4m recall four years ago). So the firm first <strong>treats</strong> it hard with quality controls, then <strong>transfers</strong> the residual financial blow through product-recall and liability insurance: the board cannot stomach the tail, so it pays a loaded premium to convert it into a known annual cost. By contrast, <strong>R6</strong> — a distributor defaulting on €4m of receivables, 20% a year, expected loss €800k — is frequent and modest relative to Meridian’s scale; it sits inside financial appetite and is cheapest to <strong>tolerate</strong> (retain), backed by credit checks rather than an insurer. Same firm, opposite responses, both read straight off appetite.</p>

      <DoNow>Before the build, skim the III “Background on: Risk Financing” page (pathway step 2, ~12 min) so you can place retention, captives, and catastrophe bonds on the retain-to-transfer spectrum — you will assign each register risk a point on it.</DoNow>

      <Stage n={2} kicker="Quantify — what the maths does" title="Premium = expected loss + a loading" />
      <p className="measure">Here is the one piece of arithmetic that decides every insure-vs-retain question. A risk’s <strong>expected loss</strong> is its probability times its impact: <span className="eq">EL = p × impact</span>. An insurer knows that number too, and quotes a <strong>premium above it</strong> — the <em>loading</em> that pays for their administration, the capital they must hold against your risk, and their profit. So the premium is roughly <span className="eq">EL × (1 + loading)</span>, and the unavoidable consequence is that <strong>on average, transferring costs you more than retaining</strong>. If you played the same risk a thousand times, self-funding would win.</p>

      <p className="measure">You do not play it a thousand times — you play it once, and you might not survive the bad draw. That is why you transfer anyway, and the reason has three named parts. You buy <strong>reduction of volatility</strong> (a fixed premium replaces a wildly variable annual loss), protection against the <strong>ruinous tail</strong> (the single event that exceeds your capacity to absorb it), and <strong>capital relief</strong> (you no longer need to hold reserves against a loss someone else now carries). The loading is the price of all three. So the decision rule is not “is the premium below the expected loss” — it almost never is — but <em>is the value of the volatility-and-tail reduction worth more to us than the loading?</em> For a frequent, small, predictable loss the answer is no: retain it. For a rare, ruinous loss against a board that cannot absorb it, the answer is yes even at a steep loading.</p>

      <MathBlock>
        <p>Expected loss, and the premium an insurer quotes against it:</p>
        <p style={{ textAlign: 'center' }}><span className="eq">EL = p × impact</span> &nbsp;·&nbsp; <span className="eq">premium ≈ EL × (1 + loading)</span></p>
        <p>The loading <span className="eq">ℓ &gt; 0</span> is the insurer’s costs, cost of capital, and profit, so <span className="eq">premium &gt; EL</span> always. The transfer decision is therefore not a comparison of premium to EL — transfer when the value you place on cutting volatility and capping the tail exceeds the loading you pay for it: <span className="eq">value(Δvolatility + Δtail + capital relief) &gt; premium − EL = EL × ℓ</span>.</p>
        <p><strong>Meridian R3</strong> (recall): <span className="eq">EL = 0.04 × €18m = €720k</span>. A loaded premium of, say, €1.0m exceeds that by €280k — but it converts a 4% chance of an €18m blow (≈45% of EBITDA, covenant-threatening) into a fixed cost. For an <em>averse</em> board the €280k is cheap insurance against ruin, so: treat, then transfer the residual.</p>
        <p><strong>Meridian R7</strong> (SE-Asia plant flood): <span className="eq">EL = 0.05 × €15m = €750k</span>. The catastrophe is the rebuild; the routine is minor water damage. Insure the catastrophe layer but take a <span className="eq">€2m deductible</span> — retain the small, frequent stuff (cheaper than paying loading on it) and transfer only the ruinous excess. Premium falls because you kept the low layer; volatility on the tail is still gone.</p>
      </MathBlock>

      <p className="measure">That last move — the deductible — is one of three dials that <em>share</em> a risk between you and the insurer rather than handing it over wholesale. A <strong>deductible</strong> (or retention) is the first slice of every loss you keep; raising it lowers the premium (you have stopped paying loading on the frequent small losses) but raises the volatility you retain. A <strong>limit</strong> is the ceiling the insurer will pay; everything above it returns to you, so a limit set below your plausible worst case leaves an uninsured tail you must still hold within appetite. <strong>Coinsurance</strong> splits each loss by a fixed percentage (you keep, say, 20% of every claim), keeping your incentive to prevent losses alive — a partial answer to moral hazard. All three are ways to retain the cheap, predictable part of a risk and transfer only the expensive, volatile part: the structure, not just the yes/no, is the decision.</p>

      <Stage n={3} kicker="Build it — your organization" title="Plan the treatments and price the transfers" />
      <p className="measure">Now build the treatment-and-financing layer for your own register. For each risk, read its residual size against your appetite line and assign one of the 4 Ts — and for every line you would transfer, put a premium against the expected loss the tool already computes (p × impact) so the loaded deal is visible, not assumed. The planner shows expected loss per risk; your job is to make the response follow from appetite, not from habit. Saved as Artifact A7, this is the part of the operating model that actually changes what the organization does next quarter.</p>

      <TreatmentPlanner lessonId="2f" artifactId="A7" />

      <p className="measure">Read your plan back through three tests. <em>Does each response follow from appetite?</em> — a tolerated risk should sit inside a stated tolerance, a transferred one should be a tail you cannot absorb, not a frequent nuisance you are over-insuring. <em>Is every transfer worth its loading?</em> — if the premium barely exceeds the expected loss and the loss would not threaten you, you are paying for certainty you do not need; retain it. <em>Does the residual sit within appetite?</em> — after the deductible you keep and the tail above any limit, what remains must be something the board has consciously accepted. A plan that passes all three is a control; one that insures the predictable and tolerates the ruinous is decoration. The standard to hold it to:</p>

      <Rubric
        title="a strong treatment & financing plan"
        criteria={[
          { c: 'Response follows from appetite', good: 'each T is justified by where residual risk sits against the appetite line, not by habit or by which heat-map quadrant it fell in' },
          { c: 'Control vs financing distinguished', good: 'treat/terminate change the risk; tolerate/transfer fund it — and the plan says which job each line is doing' },
          { c: 'Transfers priced honestly', good: 'premium shown against expected loss; transfer chosen for volatility/tail reduction, not in the false hope of beating the average' },
          { c: 'Structured, not binary', good: 'deductibles, limits, and coinsurance used to retain the cheap layer and transfer only the ruinous one' },
          { c: 'Residual inside appetite', good: 'what remains after treatment — retained slice, uninsured tail, reputational consequence — is consciously accepted and within appetite' },
        ]}
        exemplar="Meridian: R3 recall = treat (quality controls) then transfer the residual (€18m tail, averse appetite); R7 flood = transfer the catastrophe with a €2m deductible, retain the minor stuff; R6 receivables = tolerate (inside financial appetite, cheaper to retain than to insure a frequent €800k EL)."
      />

      <p className="measure">A worked correction, because this is the most common mistake. A manager proposes to buy first-pound insurance on Meridian’s minor breakage and spillage losses — a few hundred thousand a year, predictable, well inside appetite — while leaving the SE-Asia plant’s flood exposure uninsured “because floods are rare.” It is exactly backwards. Apply the rule: the breakage is high-frequency, low-severity, and inside appetite, so insuring it just pays loading on losses you could comfortably absorb — <em>retain</em> it. The flood is low-frequency and ruinous and would breach operational appetite, so it is the textbook <em>transfer</em> — insure the catastrophe layer, take a deductible to retain the trivial water damage, and the premium becomes affordable. Insure the tail, retain the body: that single inversion is most of the craft of risk financing.</p>

      <ProblemSet items={[
        { q: 'Meridian’s treasurer wants to insure R5 (a 60% annual chance of a €12m commodity-price spike squeezing margin). Is insurance the right response? What is?', solution: 'No — at 60% probability this is a high-frequency, near-expected outcome, not a rare tail; any insurer would price the premium close to the €7.2m expected loss plus a heavy loading, so transfer would simply hand over money to fund a loss you expect to take. It is also not really an insurable hazard but a market exposure. The right responses are *treat* via hedging (a transfer of a different kind — derivatives shift the financial consequence of price moves) and *tolerate* the residual within financial appetite. Save insurance for the rare, ruinous, genuinely uncertain exposures.' },
        { q: 'For R7 (€15m flood, 5%/yr), an insurer offers a policy with a €1m premium, a €2m deductible, and a €10m limit. Walk through what Meridian actually keeps.', solution: 'Expected loss is 0.05 × €15m = €750k, so the €1m premium carries a ≈€250k loading. With the structure: Meridian retains the first €2m of any loss (the deductible — cheap, frequent water damage stays with them), the insurer pays the next €8m (up to the €10m limit), and Meridian retains everything *above* €10m — i.e. on a full €15m rebuild it keeps €2m + €5m = €7m and recovers €8m. The uninsured €5m tail above the limit must itself sit within appetite; if it does not, Meridian should buy a higher limit (or a cat bond) rather than assume the policy made the risk disappear. Transfer narrowed the exposure; it did not erase it.' },
      ]} />

      <p className="measure">Treatment is where the operating model finally bites: appetite (2a) set the line, identification and evaluation (2c–2d) found and sized the risks, controls (2e) moved them, and here you decided who carries what is left. But a plan only works if someone watches whether the residual stays where you put it — whether the hedge coverage holds, whether the deductible is still affordable, whether a tolerated risk has quietly grown above appetite. That watching is the next lesson: monitoring and key risk indicators, the system that tells you when a treatment has stopped working before the loss arrives.</p>
    </LessonShell>
  );
}
