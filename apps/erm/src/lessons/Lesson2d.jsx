import React from 'react';
import { getLesson } from '../curriculum.js';
import { LessonShell } from '../components/LessonShell.jsx';
import { Lead, Objectives, Stage, Pull } from '../components/prose.jsx';
import { IsoContourFigure, HeatMapEvaluator } from '../tools/HeatMap.jsx';

const lesson = getLesson('2d');

const readings = [
  { kind: 'FREE', title: "What's Wrong with Risk Matrices?", note: 'L.A. Cox, Risk Analysis 28(2), 2008 — the foundational critique; sections 1–3 carry the argument.' },
  { kind: 'FREE', title: 'The Risk of Using Risk Matrices', note: 'Thomas, Bratvold & Bickel (SPE) — an open PDF whose diagrams make the reversal unmistakable.' },
  { kind: 'FREE', title: 'The Orange Book', note: 'HM Treasury, 2023 — the official, level-headed treatment of assessment scales.' },
  { kind: 'BOOK', title: 'The Failure of Risk Management', note: 'Douglas Hubbard, 2nd ed., 2020 — why ordinal scoring persists and what to put in its place.' },
  { kind: 'BOOK', title: 'Fundamentals of Risk Management', note: 'Hopkin & Thompson — the analysis and evaluation chapters.' },
];

const retrieval = [
  {
    q: 'Why can multiplying two ordinal 1–5 scores mislead?',
    options: [
      { text: 'Ordinal ranks have unknown, unequal gaps, so their product is not a real quantity — different true risks can share a score and some pairs come out reversed.', correct: true },
      { text: 'Because the product only reaches 25, too small a range for a large organisation.' },
      { text: 'Because likelihood and impact should always be added rather than multiplied.' },
    ],
  },
  {
    q: 'A risk in a hotter cell than another can still be the lower priority because…',
    options: [
      { text: 'lines of equal expected loss are curves that cut across the cells, so cell colour and expected-loss order can disagree.', correct: true },
      { text: 'hotter cells are by definition lower priority — that is what a reversal means.' },
      { text: 'heat maps leave likelihood out of the calculation entirely.' },
    ],
  },
  {
    q: 'Reaching back to 2a: evaluation compares the analysed risk against what, to decide what matters?',
    options: [
      { text: "The organisation's risk appetite and tolerances.", correct: true },
      { text: 'The total number of risks recorded in the register.' },
      { text: 'The colour of the cell it lands in on the heat map.' },
    ],
  },
];

export default function Lesson2d() {
  return (
    <LessonShell lesson={lesson} retrieval={retrieval} readings={readings}>
      <Lead>The heat map is the most widely used instrument in risk management. It is also one of the most quietly misleading — and you can keep the first without falling for the second.</Lead>

      <p className="measure">Imagine a board meeting. The quarterly risk report goes up, and on it sits the familiar coloured grid with two risks highlighted. A supplier-price risk glows in a warm amber cell, high and to the right. A cyber-outage risk sits one square lower, in a calmer yellow. The directors do the natural thing and spend their hour on the amber one, because amber is hotter than yellow and the picture told them so.</p>

      <p className="measure">The picture was wrong. Put real numbers to the cyber risk and it carries close to twice the expected loss of the supplier risk — the larger exposure by some distance. Nothing was falsified and no one was careless. The map took a careful analysis, ran it through a few innocent-looking steps, and handed back a ranking that was upside down. Learn exactly how that happens, and what to reach for instead, and you have one of the most useful instincts in the whole discipline.</p>

      <Objectives items={[
        'Separate risk analysis from risk evaluation, and qualitative scoring from quantitative measurement.',
        'Explain, with a concrete example, how an ordinary 5×5 heat map can rank two risks in the wrong order.',
        'Evaluate your organisation’s risks two ways at once and find exactly where the two disagree.',
        'Produce a defensible evaluation — Artifact A5 — that records both views and the reversals between them.',
      ]} />

      <Stage n={1} kicker="Understand the discipline" title="From analysis to priorities" />
      <p className="measure">Start with a word that gets used loosely: assessment. What people call “risk assessment” is really three moves, and ISO 31000 names them in order. You <em>identify</em> the risks — last lesson’s work, and mostly a matter of getting the right people to say what they already half-know. You <em>analyse</em> each one: how likely is it, and how much would it hurt? Then you <em>evaluate</em>: you hold that analysis up against your risk appetite and decide what gets attention, what you can live with, and what has to change. Analysis produces understanding; evaluation produces priorities. The heat map lives in that last move — which is why a flaw there matters so much. It is the moment your organisation decides where to point its scarce attention.</p>

      <p className="measure">To analyse a risk you score it on two axes, likelihood and impact, and there are two genuinely different ways to do that. The common way is an <em>ordinal</em> scale: 1 (rare) to 5 (almost certain), 1 (negligible) to 5 (catastrophic). Ordinal means the levels are ranked but the gaps between them carry no fixed meaning. A 5 is not five times a 1, and the step from 1 to 2 need not equal the step from 4 to 5. These numbers are labels wearing the costume of arithmetic. Fine for sorting; dangerous the moment you do sums with them.</p>

      <p className="measure">The other way is quantitative: likelihood as a probability — a one-in-ten chance this year — and impact in money. Now the numbers mean what they say, and you can compute the one quantity evaluation actually wants: <em>expected loss</em>, the probability times the impact. Expected loss is what you’d set aside, on average, to cover a risk if you faced it many times. It isn’t the whole story — averages hide the rare catastrophe, which is why Part 4 brings sharper tools — but for ranking a register it is honest in a way coloured cells are not.</p>

      <p className="measure">None of this is an argument against heat maps. They earned their place for real reasons. A board with forty minutes for the whole of enterprise risk can read a coloured grid in a second; it forces a conversation about every risk in turn; it fits on one slide. For <em>communicating</em> a portfolio and starting a discussion, it is hard to beat. The trouble starts only when the picture gets promoted from a communication device to a measurement — when the colour of a cell stops being a conversation starter and becomes the answer.</p>

      <p className="measure">Here is what goes wrong underneath. To colour one cell, three things happen. A continuous probability gets squashed into one of five bins. A continuous impact gets squashed into one of five bins. Then the two bin numbers get combined into a score, almost always by multiplying them. Every step throws information away, and the last does something worse: multiplying two ranks is not the same operation as multiplying two quantities, even though it looks identical on the page. Tony Cox’s 2008 paper, bluntly titled “What’s Wrong with Risk Matrices?”, shows the result can be worse than useless — the same score for risks that differ wildly, and some pairs ranked in the wrong order. Three failure modes are worth naming. <em>Range compression</em>: one cell can hold risks whose true expected losses differ tenfold. <em>Ranking reversal</em>: a risk in a higher cell can carry a lower expected loss. <em>Centring bias</em>: scorers drift to the middle, everything becomes a three-by-three, and the grid stops telling you anything.</p>

      <Stage n={2} kicker="Quantify — what the maths does" title="Why the ranking flips" />
      <p className="measure">You don’t need heavy mathematics to see the reversal — only one idea. Lines of equal expected loss are <em>curves</em>, not boxes. Every pair of probability and impact that multiplies to the same expected loss — say a quarter of a million euros — lies on one smooth curve: a high chance of a small loss at one end, a small chance of a large loss at the other, the same expected loss all the way along. The heat map chops that plane into rectangles. So the truth runs in diagonal curves while the map draws straight-edged cells, and the two never line up. One rectangle straddles several curves; two points in different rectangles can fall on the wrong sides of each other’s curves. Watch it happen below.</p>

      <IsoContourFigure />

      <p className="measure">Read it slowly, because the whole lesson is in this picture. The map paints one highlighted risk in a hotter cell than the other, so on the slide it ranks higher. But trace the dashed curves: the hotter-looking risk sits below an expected-loss contour that the cooler one sits above. By the only measure that matters for budgeting, their order is reversed. Switch the scoring rule from multiply to add and the cell boundaries move, but the problem doesn’t — you are still forcing a rigid grid onto a plane whose contours are curved. No choice of bins or formula makes ordinal cells reproduce the true ordering for every register. The defect is structural.</p>

      <Pull>A heat map communicates; it does not measure. The instant a decision turns on the difference between two cells, that is your signal to put the underlying numbers on the table.</Pull>

      <Stage n={3} kicker="Build it on your organisation" title="Evaluate the register both ways" />
      <p className="measure">The fix isn’t to abandon the heat map; it’s to refuse to let it stand alone. Evaluate every risk twice — once by placing it on the grid, once by its expected loss — and look hard where the two rankings part company. Those gaps aren’t noise to smooth over; they’re the most informative thing here, because each one marks a risk your map is mis-prioritising in front of the board. The tool below does this for the worked example. Enter a probability and a money impact for each risk and everything recalculates: the cell, the expected loss, the two rankings side by side, and a flag wherever they disagree. Save it and it becomes Artifact A5 in your operating model.</p>

      <HeatMapEvaluator lessonId="2d" artifactId="A5" />

      <p className="measure">So keep the map for what it’s good at — the board slide, the workshop conversation. But rank and budget with expected loss, and for the tail-heavy risks where an average hides the danger, with the methods in Part 4. When the two views disagree, treat the disagreement as the finding. It tells you, precisely and for free, where intuition and arithmetic have come apart — which is exactly where a thoughtful risk function earns its keep.</p>
    </LessonShell>
  );
}
