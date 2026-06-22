/* The course glossary. Terms here are auto-underlined on first use in every
   lesson's prose and shown on hover/focus; the full list is the Glossary page.
   Keep definitions short and plain — one or two sentences. */

export const GLOSSARY = {
  // Roles & functions
  'CRO': 'Chief Risk Officer — leads the second line; sets risk methodology, aggregates the enterprise risk picture, and challenges the business, without owning individual risks.',
  'CISO': 'Chief Information Security Officer — the executive accountable for cyber and information-security risk.',
  'CFO': 'Chief Financial Officer — owns the finances; risks like liquidity and the funding structure sit here.',
  'COO': 'Chief Operating Officer — owns day-to-day operations and the risks that arise in running them.',
  'CMO': 'Chief Marketing Officer.',
  'non-executive director': 'A board member who is not part of management; their independence is what lets them oversee and challenge the executives.',
  'non-executive directors': 'Board members who are not part of management; their independence is what lets them oversee and challenge the executives.',
  'three lines model': 'The IIA’s map of who does what in risk: the first line (operations) owns and manages risk, the second line (risk/compliance) sets policy and challenges, the third line (internal audit) gives independent assurance.',
  'internal audit': 'The third line: an independent function that assures the board the first two lines are actually working — valuable precisely because it owns no risks and runs no controls.',

  // Governance / regulation
  'Sarbanes-Oxley': 'A 2002 US law (after Enron) forcing listed companies to take formal responsibility for financial controls and independent audit. Often shortened to “SOX”.',
  'SOX': 'Sarbanes-Oxley — a 2002 US law forcing listed companies to take formal responsibility for financial controls and independent audit.',
  'Solvency II': 'The EU’s risk-based capital and governance regime for insurers.',
  'ORSA': 'Own Risk and Solvency Assessment — a board-owned process (required of EU insurers under Solvency II) that documents the firm’s own view of its risks and the capital it needs.',
  'DORA': 'The EU’s Digital Operational Resilience Act (applying from January 2025), which regulates financial firms’ IT resilience and their critical third-party providers directly.',
  'BCBS 239': 'Basel Committee principles (2013) for risk-data aggregation and reporting — born from banks’ inability in 2008 to total their own exposures fast enough.',
  'GRC': 'Governance, Risk and Compliance — the software/systems category used to manage policies, risks, and controls in one place.',
  'effective challenge': 'The discipline (from the Fed’s SR 11-7) that a model is only trustworthy once someone independent, skilled, and senior enough has genuinely tried to break it.',

  // Corporate finance
  'EBITDA': 'Earnings Before Interest, Taxes, Depreciation and Amortisation — a common proxy for a company’s operating cash earnings.',
  'leverage covenant': 'A condition in a loan (e.g. net debt / EBITDA below 3.0×) that, if breached, can let lenders demand repayment or impose penalties.',
  'revolving credit facility': 'A pre-agreed bank line a company can draw down and repay flexibly, like a corporate overdraft.',
  'duration': 'A bond’s sensitivity to interest-rate moves: roughly, the % change in its price for a 1% change in rates.',
  'the Greeks': 'Sensitivity measures for derivatives — delta (to price), gamma (to delta), vega (to volatility), theta (to time).',
  'basis points': 'Hundredths of a percent: 100 basis points = 1%.',

  // Quantitative risk
  'VaR': 'Value-at-Risk — the loss not exceeded at a chosen confidence over a set horizon (e.g. the 99% one-day VaR). A threshold, not a worst case; it says nothing about how bad losses get beyond it.',
  'Value-at-Risk': 'The loss not exceeded at a chosen confidence over a set horizon. A threshold, not a worst case; it says nothing about how bad losses get beyond it.',
  'Expected Shortfall': 'The average loss in the tail beyond VaR — “if we breach the line, how bad on average?” Coherent and tail-sensitive, which is why regulators moved to it.',
  'CVaR': 'Conditional Value-at-Risk — another name for Expected Shortfall.',
  'quantile': 'The value below which a given fraction of outcomes fall — the same idea as a percentile (the 99th percentile is the 0.99 quantile).',
  'percentile': 'The value a given % of outcomes fall below — the 95th percentile is exceeded only 5% of the time.',
  'subadditivity': 'The property that combining two risks should never be measured as riskier than the sum of the two apart. A coherent risk measure has it; VaR can violate it.',
  'coherent risk measure': 'A risk measure with sensible properties — including that diversification never increases measured risk (subadditivity). Expected Shortfall is coherent; VaR is not.',
  'PD': 'Probability of Default — the chance a borrower fails to pay, over a period.',
  'LGD': 'Loss Given Default — the fraction of an exposure you actually lose if the borrower defaults (1 − recovery rate).',
  'EAD': 'Exposure at Default — how much you are owed at the moment of default.',
  'RAROC': 'Risk-Adjusted Return on Capital — return measured per unit of capital the activity consumes, so a capital-hungry business line can be worse than a duller one.',
  'economic capital': 'A buffer of owners’ money sized to survive losses out to a chosen high percentile — “enough to survive all but the worst 1-in-200 year”, for example.',
  'expected loss': 'The average loss over many periods (probability × impact) — a cost to provision for, not a surprise to hold capital against.',
  'unexpected loss': 'How much worse than average a bad year can be — the gap from the expected loss out to a high percentile, which capital must cover.',
  'Monte Carlo': 'A method that samples many random scenarios and stacks them into the distribution of outcomes, instead of solving a formula.',
  'Extreme Value Theory': 'The branch of statistics about the extremes (tails) of distributions — letting you model rare large losses directly rather than trusting a curve fitted to the calm middle.',
  'tail': 'The far end of a distribution — the rare, large outcomes. Where most catastrophic risk lives and where averages mislead.',
  'fat tails': 'Distributions where extreme outcomes are far more likely than a normal (bell) curve predicts — common in real losses and markets.',
  'lognormal': 'A right-skewed distribution (most values small, a few very large) often used for loss severities; its mean sits above its median.',
  'Poisson': 'A distribution for counts of independent events in a period — used to model how many loss events occur per year.',
  'FRTB': 'The Fundamental Review of the Trading Book — the Basel market-risk rules that replaced 99% VaR with 97.5% Expected Shortfall for capital.',
  'HQLA': 'High-Quality Liquid Assets — cash-like holdings a firm can sell fast in a crisis without crashing their price.',
  'backtesting': 'Checking a model against what actually happened — e.g. counting how often losses breached a 99% VaR (you’d expect ~1% of days).',

  // ERM core
  'risk appetite': 'The amount and type of risk an organisation chooses to pursue in pursuit of its objectives — set per category by the board.',
  'risk tolerance': 'The specific, often quantified, variation around an objective that’s acceptable before someone must act or escalate.',
  'risk capacity': 'The most risk an organisation could absorb before its survival is threatened — appetite must sit inside it.',
  'inherent risk': 'The exposure before any controls act on it.',
  'residual risk': 'What’s left after controls — the risk you actually carry.',
  'KRI': 'Key Risk Indicator — a metric tracking exposure to a risk (not just performance), ideally a leading one that moves before the loss.',
  'KPI': 'Key Performance Indicator — a metric of performance; a KRI tracks risk, a KPI tracks results.',
  'bow-tie': 'A diagram with an event in the centre, its causes fanning left and consequences right, and controls on each side — identification and control-mapping in one picture.',
  'Delphi': 'A technique where experts are polled anonymously over several rounds, converging on an estimate without the loudest voice dominating.',
  'SWIFT': 'Structured What-If Technique — walking a system with prompted “what if…?” questions to surface risks.',
  'HAZOP': 'Hazard and Operability study — a formal, systematic technique (from process engineering) for finding how a system could deviate and fail.',
  'pre-mortem': 'A technique where the team imagines the project has already failed and writes the story of why — licensing doubts that optimism usually silences.',
  'RTO': 'Recovery Time Objective — the target time to restore a service after disruption.',
  'RPO': 'Recovery Point Objective — how much recent data you can afford to lose (the point you’d recover back to).',
  'NIST CSF': 'The US NIST Cybersecurity Framework — organises cyber risk into Govern, Identify, Protect, Detect, Respond, Recover.',
  'FAIR': 'Factor Analysis of Information Risk — a method to quantify cyber risk as loss-event frequency × loss magnitude, expressed as ranges.',
  'TCFD': 'Task Force on Climate-related Financial Disclosures — the former climate-reporting standard, disbanded in 2023 and folded into IFRS S2.',
  'IFRS S2': 'The ISSB’s climate-disclosure standard (effective 2024) that absorbed the TCFD recommendations; now the global baseline.',
  'ISSB': 'International Sustainability Standards Board — sets the IFRS S1/S2 sustainability and climate disclosure standards.',
  'NGFS': 'Network for Greening the Financial System — provides the standard climate scenarios firms test against.',
  'CSRD': 'The EU’s Corporate Sustainability Reporting Directive — requires broad sustainability disclosure on a double-materiality basis.',
  'double materiality': 'Considering both how sustainability issues affect the firm’s value (financial materiality) and how the firm affects the world (impact materiality).',
  'SR 11-7': 'The US Federal Reserve’s 2011 guidance on model risk management; its core idea is “effective challenge”.',
  'Knightian uncertainty': 'Deep uncertainty you cannot put odds on — as opposed to risk, where you can estimate probabilities.',
  'calibration': 'Training judgement so stated confidence matches reality — e.g. your “90% sure” ranges actually contain the truth about 90% of the time.',
  'psychological safety': 'The shared belief that speaking up about a problem, error, or doubt won’t be punished — what lets bad news travel.',
  'just culture': 'A culture that distinguishes honest error and near-misses (to learn from) from recklessness (to sanction), so people keep reporting.',
};

// Build a single matcher, longest terms first so multi-word terms win.
const TERMS = Object.keys(GLOSSARY).sort((a, b) => b.length - a.length);
const escaped = TERMS.map(t => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
// (?<![\w-]) … (?![\w-]) = boundaries that also respect hyphens/acronyms.
export const TERM_RE = new RegExp('(?<![\\w-])(' + escaped.join('|') + ')(?![\\w-])', 'gi');

const LOWER = {};
for (const k of Object.keys(GLOSSARY)) LOWER[k.toLowerCase()] = GLOSSARY[k];
export function lookupTerm(s) { return LOWER[String(s).toLowerCase()] || null; }

export const GLOSSARY_TERMS = TERMS;
