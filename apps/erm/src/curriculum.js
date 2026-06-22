/* The course map. The sidebar, progress, and router all read from this.
   `artifact` is the artifact a lesson produces; a lesson counts as complete
   when that artifact is saved (or, for prose-only lessons, when marked read). */

export const PARTS = [
  {
    id: 'p0', n: 'Part 0', title: 'Groundwork',
    blurb: 'Optional starters: a gentle JavaScript primer and the few maths ideas the course leans on. Skip them if you’re already comfortable.',
    lessons: [
      { id: '0.1', title: 'JavaScript from zero', artifact: null },
      { id: '0.2', title: 'The maths you’ll lean on', artifact: null },
    ],
  },
  {
    id: 'p1', n: 'Part 1', title: 'Foundations',
    blurb: 'What risk is, the organization you protect, the frameworks, and who owns risk.',
    lessons: [
      { id: '1.0', title: 'Orientation: choose your organization', artifact: 'A1' },
      { id: '1.1', title: 'What risk actually is', artifact: 'A1' },
      { id: '1.2', title: 'Understanding your organization', artifact: 'A1' },
      { id: '1.3', title: 'Frameworks & standards', artifact: 'A1' },
      { id: '1.4', title: 'Governance & who owns risk', artifact: 'A1' },
    ],
  },
  {
    id: 'p2', n: 'Part 2', title: 'The operating system',
    blurb: 'The risk process: appetite, culture, identify, evaluate, control, treat, monitor.',
    lessons: [
      { id: '2a', title: 'Risk appetite & tolerance', artifact: 'A2' },
      { id: '2b', title: 'Risk culture & the human side', artifact: 'A3' },
      { id: '2c', title: 'Identifying risk', artifact: 'A4' },
      { id: '2d', title: 'Analysing & evaluating risk', artifact: 'A5' },
      { id: '2e', title: 'Controls & internal control', artifact: 'A6' },
      { id: '2f', title: 'Treating & financing risk', artifact: 'A7' },
      { id: '2g', title: 'Monitoring, KRIs & reporting', artifact: 'A8' },
    ],
  },
  {
    id: 'p3', n: 'Part 3', title: 'The risk universe',
    blurb: 'Classify, then aggregate into a portfolio — then the families of risk.',
    lessons: [
      { id: '3.0', title: 'Classifying risk', artifact: 'A9' },
      { id: '3.1', title: 'Aggregation & the portfolio view', artifact: 'A9' },
      { id: '3.2', title: 'Strategic risk', artifact: 'A10' },
      { id: '3.3', title: 'Financial risk: market, credit, liquidity', artifact: 'A10' },
      { id: '3.4', title: 'Operational risk & resilience', artifact: 'A10' },
      { id: '3.5', title: 'Conduct, compliance, legal & reputational', artifact: 'A10' },
      { id: '3.6', title: 'Technology, cyber & climate', artifact: 'A10' },
      { id: '3.7', title: 'Model risk', artifact: 'A10' },
      { id: '3.8', title: 'Third-party & supply-chain risk', artifact: 'A10' },
      { id: '3.9', title: 'ESG & sustainability risk', artifact: 'A10' },
    ],
  },
  {
    id: 'p4', n: 'Part 4', title: 'Quantification',
    blurb: 'The math lens — what each method does, when to use it, and where it breaks.',
    lessons: [
      { id: '4.1', title: 'Decision-making under uncertainty', artifact: 'A11' },
      { id: '4.2', title: 'Probability & Monte Carlo', artifact: 'A11' },
      { id: '4.3', title: 'Capital, loss distributions & RAROC', artifact: 'A11' },
      { id: '4.4', title: 'Market & credit: VaR and Expected Shortfall', artifact: 'A11' },
      { id: '4.5', title: 'Stress testing & scenarios', artifact: 'A11' },
      { id: '4.6', title: 'Portfolio risk', artifact: 'A11' },
      { id: '4.7', title: 'Tails & extremes', artifact: 'A11' },
      { id: '4.8', title: 'Backtesting & model validation', artifact: 'A11' },
    ],
  },
  {
    id: 'p5', n: 'Part 5', title: 'Operationalizing & mastery',
    blurb: 'Data, maturity, the board, the limits of models — then assemble everything.',
    lessons: [
      { id: '5a', title: 'Risk data & aggregation infrastructure', artifact: 'A12' },
      { id: '5b', title: 'Maturing the risk function', artifact: 'A13' },
      { id: '5c', title: 'Board reporting & strategy', artifact: 'A14' },
      { id: '5d', title: 'Judgment, bias & the limits of models', artifact: 'A15' },
      { id: '5e', title: 'Capstone: your risk operating model', artifact: 'CAP' },
    ],
  },
];

export const FLAT = PARTS.flatMap(p => p.lessons.map(l => ({ ...l, partId: p.id, partN: p.n, partTitle: p.title })));

export function getLesson(id) { return FLAT.find(l => l.id === id) || null; }
export function lessonIndex(id) { return FLAT.findIndex(l => l.id === id); }
export function neighbours(id) {
  const i = lessonIndex(id);
  return { prev: i > 0 ? FLAT[i - 1] : null, next: i >= 0 && i < FLAT.length - 1 ? FLAT[i + 1] : null };
}
