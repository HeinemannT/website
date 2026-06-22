import React from 'react';
import { getLesson } from '../curriculum.js';
import { LessonShell } from '../components/LessonShell.jsx';
import { Lead, Objectives, Stage } from '../components/prose.jsx';
import { Pathway, DoNow } from '../components/Pathway.jsx';
import { MathBlock, ProblemSet } from '../components/MathBlock.jsx';
import { Rubric } from '../components/Rubric.jsx';
import { FamilyLens } from '../tools/FamilyLens.jsx';

const lesson = getLesson('3.3');

const pathway = [
  { kind: 'watch', t: 'Market, credit, and liquidity risk — the three distinguished', src: 'short practitioner explainer', min: 8, tier: 'warmup', why: 'Fix the three loss mechanisms before the metrics arrive.' },
  { kind: 'read', t: 'Minimum capital requirements for market risk — the “in brief”', src: 'Basel Committee, BCBS d457 (2019)', href: 'https://www.bis.org/bcbs/publ/d457_inbrief.pdf', min: 10, tier: 'core', why: 'How the regulator defines market risk and why it moved from VaR to Expected Shortfall.' },
  { kind: 'read', t: 'IRB risk components — PD, LGD, EAD defined (CRE32)', src: 'Basel Framework, BIS', href: 'https://www.bis.org/fsi/fsisummaries/rcrf.htm', min: 15, tier: 'core', why: 'The authoritative definitions of the three numbers behind expected loss.' },
  { kind: 'read', t: 'Liquidity Coverage Ratio (LCR) — the 30-day survival test', src: 'Basel Committee, BCBS bcbs238 (2013)', href: 'https://www.bis.org/publ/bcbs238.htm', min: 12, tier: 'core', why: 'How funding liquidity is turned into a coverage ratio you can read.' },
  { kind: 'do', t: 'Add your organization’s financial risks to the register', src: 'the lens in this lesson → Artifact A10', tier: 'apply', why: 'Find your own price, counterparty, and cash exposures and assign them to treasury.' },
  { kind: 'book', t: 'Risk Management and Financial Institutions — market, credit, liquidity chapters', src: 'John C. Hull, 6th ed. (2023)', tier: 'deeper' },
];

const retrieval = [
  { q: 'Credit expected loss decomposes into…', options: [
    { text: 'probability of default × loss given default × exposure at default (PD × LGD × EAD).', correct: true },
    { text: 'revenue minus costs.' },
    { text: 'the value-at-risk of the trading book.' }] },
  { q: 'The two forms of liquidity risk are…', options: [
    { text: 'funding liquidity (can’t meet obligations when due) and market liquidity (can’t sell without moving the price).', correct: true },
    { text: 'short-term and long-term interest-rate risk.' },
    { text: 'expected loss and unexpected loss.' }] },
  { q: 'Why is financial risk uniquely prone to being over-trusted?', options: [
    { text: 'It is the most measurable family, so its numbers look more authoritative than they are — a quantile is not a worst case.', correct: true },
    { text: 'Regulators forbid measuring it.' },
    { text: 'It only affects banks, not real businesses.' }] },
];

export default function Lesson33() {
  return (
    <LessonShell lesson={lesson} retrieval={retrieval}>
      <Lead>A distributor that owes Meridian €4m goes bankrupt; the euro moves 8% against the dollar its grain is priced in; a downturn drains the cash that pays Friday’s payroll. Three different ways money goes wrong — and the only risk family precise enough to attach a number to each.</Lead>

      <p className="measure">Financial risk is the family people mistake for the whole subject, because it is the one the quantitative toolkit was built for. It is not the whole subject — it is one family of several, distinctive mainly for being unusually <em>measurable</em>. That measurability is the reason to learn it precisely and the reason to distrust it: a number that looks authoritative invites you to stop thinking. It splits cleanly into three loss mechanisms that must be kept distinct. <strong>Market risk</strong> is loss from prices that move against you. <strong>Credit risk</strong> is loss when a counterparty fails to pay. <strong>Liquidity risk</strong> is loss — or death — from not having cash when it is due, or not being able to sell without crashing the price. Almost every organization carries all three, including firms that have never thought of themselves as financial.</p>

      <p className="measure">Work the topic in this order: the explainer to fix the three mechanisms, then the Basel sources for how a regulator defines and sizes each (market, credit, liquidity in turn), then add your own organization’s exposures to the register at the end.</p>

      <Pathway lessonId="3.3" items={pathway} />

      <Objectives items={[
        'Define market, credit, and liquidity risk precisely and keep the three loss mechanisms distinct.',
        'Decompose credit expected loss as PD × LGD × EAD and explain what each term measures.',
        'Name what sizes each family — VaR/Expected Shortfall and sensitivities for market, EL for credit, coverage ratios and cash runway for liquidity.',
        'Add your organization’s financial risks to the register under treasury/CFO ownership (Artifact A10).',
      ]} />

      <Stage n={1} kicker="Understand the discipline" title="Three ways money goes wrong" />
      <p className="measure"><strong>Market risk</strong> is the risk that a price you are exposed to moves against you — interest rates, foreign-exchange rates, commodity prices, equity and other asset values. You hold the exposure whether or not you chose it: a borrower on a floating rate is exposed to rate moves; an importer paying in dollars is exposed to FX; a firm buying grain is exposed to commodities. <strong>Credit risk</strong> is the risk that a counterparty who owes you money does not pay — a customer on trade credit, a borrower, a bond issuer, a derivatives counterparty. Its close relative is <em>concentration risk</em>: even if each individual default is unlikely, having too much exposure to a single name, sector, or geography means one event takes an outsized share of the book. <strong>Liquidity risk</strong> takes two forms that are worth separating. <em>Funding liquidity</em> is the inability to meet obligations as they fall due — payroll, a maturing loan, a margin call — even while the balance sheet is solvent on paper. <em>Market liquidity</em> is the inability to sell an asset without moving its price against you, so the “value” on the books is not the cash you could actually raise. The blunt lesson: cash, not profit, pays the bills, and a profitable, solvent firm still dies if it cannot find cash on the day it is owed.</p>

      <p className="measure">These risks are owned by the <strong>treasury function and the CFO</strong> — the people who run hedging, customer credit, funding, and the reserve portfolio. The authoritative source for how they are defined and sized is the <strong>Basel framework</strong> from the Basel Committee on Banking Supervision (housed at the BIS): market risk under the FRTB standard (BCBS, 2019), credit-risk components under CRE32, and liquidity under the Liquidity Coverage Ratio and Net Stable Funding Ratio (Basel III, 2013). Those rules are written for banks, but the definitions are general — which is the point of the next paragraph.</p>

      <p className="measure">Non-financial firms carry all three, and Meridian is the proof. As a consumer-goods maker with €1.2bn revenue and a treasury, it has <em>market risk</em> twice over: it buys agricultural commodities priced in USD (grain, cocoa, oils), so a commodity spike or a EUR/USD move both eat into its 10% operating margin (register risks R5 and R9). It has <em>credit risk</em> because it sells on 60-day terms to grocery retailers and regional distributors — and concentration risk on top, since its single largest retailer is 18% of revenue and the top five are 45% (R6 is a distributor default). And it has <em>liquidity risk</em>: €60m of cash against a €150m revolving credit facility means a downturn that compresses EBITDA can close the headroom under its leverage covenant and choke off funding (R11). One ordinary manufacturer, all three mechanisms live. Keep the family in proportion, though: it is tractable, not central — the families that resist measurement (strategic, conduct, operational) are not smaller for being harder to count.</p>

      <DoNow>Before the metrics, skim the Basel “in brief” on market risk (pathway step 2, ~10 min) for how a regulator names the risk and why it shifted its headline measure from VaR to Expected Shortfall.</DoNow>

      <Stage n={2} kicker="Quantify — what the maths does" title="What sizes each one" />
      <p className="measure">This is the measurable family, so each mechanism has a signature metric — and at this stage you only need to know what each one <em>tells</em> you. <strong>Market risk</strong> is summarised by <em>Value-at-Risk</em> and its better-behaved successor <em>Expected Shortfall</em> — “how bad is a bad day, and how bad beyond that?” — which you build and critique in Part 4; the FRTB standard moved the regulatory headline from VaR to Expected Shortfall (BCBS, 2019) precisely because VaR is silent about the tail past its threshold.</p>

      <p className="measure">Below the portfolio level, market risk is also sized by <em>sensitivities</em>: how much value changes per unit move in an underlying price. <em>Duration</em> measures a bond’s sensitivity to interest rates; derivatives have their own family of sensitivities, the option <em>“Greeks”</em> (delta, gamma, vega, theta). A sensitivity tells you the slope; VaR and Expected Shortfall tell you the size of a plausible loss.</p>

      <p className="measure"><strong>Credit risk</strong> has the cleanest decomposition in all of risk: expected loss is three numbers multiplied — the chance the counterparty defaults, the fraction you lose if it does, and how much you are owed at that moment. <strong>Liquidity risk</strong> is watched through <em>coverage ratios</em> and <em>runway</em>: Basel III’s Liquidity Coverage Ratio asks whether high-quality liquid assets cover a 30-day stress, and a corporate treasurer’s plainer version is <em>days of cash on hand</em> — how long the firm can meet obligations from ready cash if inflows stop. Read each metric for what it asserts <em>and</em> what it hides: a VaR is a quantile, not a worst case; a coverage ratio assumes the assets stay liquid in the stress that triggers their use. Use each number to inform a judgement, not to replace it.</p>

      <MathBlock title="The credit expected-loss identity">
        <p>Credit expected loss decomposes into three estimable terms:</p>
        <p style={{ textAlign: 'center' }}><span className="eq">EL = PD × LGD × EAD</span></p>
        <ul>
          <li><span className="eq">PD</span> — <strong>probability of default</strong>: the chance, over a horizon (usually one year), that the counterparty fails to pay.</li>
          <li><span className="eq">LGD</span> — <strong>loss given default</strong>: the fraction of the exposure you actually lose after recoveries and collateral (so <span className="eq">1 − LGD</span> is the recovery rate).</li>
          <li><span className="eq">EAD</span> — <strong>exposure at default</strong>: how much you are owed at the moment of default.</li>
        </ul>
        <p>The Basel Framework defines these as the IRB risk components (BCBS, CRE32). Read <span className="eq">EL</span> as the <em>average</em>, priced-into-the-business loss — what you expect to lose on the book in a normal year. It is deliberately <em>not</em> the capital number: capital covers <em>unexpected</em> loss, the tail above the average when defaults cluster (a concentrated book, or a downturn that hits many counterparties at once). That gap between expected and unexpected loss is why concentration risk matters even when every individual PD looks small.</p>
      </MathBlock>

      <Stage n={3} kicker="Build it on your organization" title="Add your financial risks" />
      <p className="measure">Now find your own organization’s three exposures and put them on the register under treasury ownership. Where are you exposed to <em>moving prices</em> — rates on your debt, currencies you buy or sell in, commodities you depend on? To <em>counterparties who might not pay</em> — customers on credit, a concentrated set of large buyers, anyone you are owed by? To a <em>cash crunch</em> — obligations that fall due before inflows arrive, or assets you could not sell quickly without a discount? Name each, size it roughly, and assign it to the function that actually manages it.</p>

      <FamilyLens lessonId="3.3" artifactId="A10-financial" family="Financial" ownerHint="treasury / CFO"
        sizing="Market risk → value-at-risk / expected shortfall (Part 4) and sensitivities (duration, the option Greeks). Credit risk → expected loss = PD × LGD × EAD, plus concentration limits by name/sector/geography. Liquidity risk → coverage ratios (LCR) and days of cash / cash-flow runway." />

      <p className="measure">Read your entries back against the standard below before moving on — the test is whether each line names a specific mechanism, an owner, and a metric a treasurer could actually report.</p>

      <Rubric
        title="a strong financial-risk register entry"
        criteria={[
          { c: 'Right mechanism, named', good: 'each risk is tagged market, credit, or liquidity — not lumped as “financial” — and liquidity risks say which form (funding or market)' },
          { c: 'Sized with the right metric', good: 'market → VaR/ES or a sensitivity; credit → PD × LGD × EAD; liquidity → a coverage ratio or days of cash' },
          { c: 'Concentration surfaced', good: 'credit exposures flag any single name, sector, or geography that is an outsized share of the book' },
          { c: 'Owned by treasury/CFO', good: 'a real function manages the hedge, the credit limit, or the cash buffer — not “the business” in the abstract' },
          { c: 'Kept in proportion', good: 'sized confidently but not over-trusted; the metric’s blind spots (tail past VaR, assumed liquidity) are acknowledged' },
        ]}
        exemplar="Meridian: R5/R9 = market (commodity & FX on input costs, sized by exposure × price move, hedged ≥70%); R6 = credit (distributor default, EL = PD × LGD × EAD, watched for retailer concentration at 18%/45%); R11 = liquidity (downturn compresses EBITDA toward the 3.0× covenant, watched by days of cash and headroom). All owned by treasury/CFO."
      />

      <p className="measure">A worked credit example, because the identity is easy to state and easy to misuse. Meridian’s register carries R6: a large distributor defaults on its receivables. Put rough numbers on the three terms. <em>EAD</em> — the outstanding receivable at default — is about €5m (a big distributor on 60-day terms). <em>PD</em> — the chance this distributor fails in a given year — call it 20%, high because it is a stretched regional player. <em>LGD</em> — after Meridian claws back returned stock and a partial payment in the wind-up, it expects to lose roughly 40% of what it is owed. Then <span className="eq">EL = 0.20 × 0.40 × €5m = €0.4m</span> — the average annual cost of carrying this credit, which Meridian should price into its margin and provision for. But notice what EL hides: if the distributor actually defaults, the loss that year is <span className="eq">LGD × EAD = €2m</span>, five times the expected figure (close to the register’s €4m impact once knock-on disruption is added). And because the top five customers are 45% of revenue, a downturn could push <em>several</em> of them toward default together — the concentration that turns a string of small PDs into one fat tail. Expected loss tells you the price of doing business; it does not tell you the size of a bad year. That is the whole reason capital exists above EL.</p>

      <ProblemSet items={[
        { q: 'A treasurer reports that the firm “is profitable and has positive equity, so liquidity isn’t a concern.” Why is that reasoning wrong, and what should be measured instead?', solution: 'Profit and solvency are accrual concepts; liquidity is about cash timing. A firm can be profitable and solvent yet unable to meet a payment on the day it falls due — funding liquidity risk — or unable to sell an asset at its book value to raise that cash — market liquidity risk. The right measures are forward cash-flow projections, days of cash on hand, and a coverage ratio (LCR-style: do liquid assets cover a stressed 30-day outflow). For Meridian, €60m cash against a €150m facility and a covenant that tightens in a downturn (R11) means the question is not “are we solvent?” but “how many days of obligations can we meet if inflows stop and the banks turn cautious?”' },
        { q: 'A loan book has 200 borrowers, each with PD 2%, LGD 50%, EAD €1m. Compute the expected loss for the book. Why is EL not the amount of capital the lender should hold?', solution: 'Per borrower EL = 0.02 × 0.50 × €1m = €10,000; across 200 borrowers EL = €2m — the average annual loss, which the lender prices into its lending spread. Capital is sized to unexpected loss, not expected loss: in a bad year (a recession) defaults cluster well above 2%, and if the borrowers share a common driver — same region, same sector, same employer — they default together, so the tail is far heavier than 200 independent 2% draws would suggest. Capital must absorb that correlated tail; EL only covers the quiet middle. This is exactly why concentration risk is tracked separately from the headline PD.' },
      ]} />

      <p className="measure">Financial risk is the measurable slice of the universe — the easiest to size and, for the same reason, the easiest to over-trust. Knowing what VaR, expected loss, and a coverage ratio each assert, and what each conceals, is what stops a confident number from becoming a blind spot. The next families — operational, conduct, climate, model — resist this kind of measurement, which is precisely why they are where most real losses hide.</p>
    </LessonShell>
  );
}
