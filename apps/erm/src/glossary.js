/* The course glossary. Terms here are auto-underlined on first use in every
   lesson's prose and shown on hover/focus; the full list is the Glossary page.
   Definitions are plain, complete sentences. No em dashes. */

export const GLOSSARY = {
  // Roles & functions
  'CRO': 'The Chief Risk Officer leads the second line. They set the risk methodology, aggregate the enterprise-wide risk picture, and challenge the business, but do not own individual risks.',
  'CISO': 'The Chief Information Security Officer is the executive accountable for cyber and information-security risk.',
  'CFO': 'The Chief Financial Officer owns the finances, including risks such as liquidity and the funding structure.',
  'COO': 'The Chief Operating Officer owns day-to-day operations and the risks that arise in running them.',
  'CMO': 'The Chief Marketing Officer owns brand, marketing, and customer-demand decisions.',
  'non-executive director': 'A board member who is not part of management. Their independence is what lets them oversee and challenge the executives.',
  'non-executive directors': 'Board members who are not part of management. Their independence is what lets them oversee and challenge the executives.',
  'three lines model': 'The Institute of Internal Auditors model of who does what in risk. The first line (operations) owns and manages risk, the second line (risk and compliance) sets policy and challenges, and the third line (internal audit) gives independent assurance.',
  'internal audit': 'The third line. It is an independent function that assures the board the first two lines are working. Its value comes from owning no risks and running no controls, so it can report without bias.',

  // Governance & regulation
  'Sarbanes-Oxley': 'A 2002 US law, passed after the Enron collapse, that makes listed companies formally responsible for their financial controls and independent audit. It is often shortened to SOX.',
  'SOX': 'The common name for Sarbanes-Oxley, a 2002 US law that makes listed companies formally responsible for their financial controls and independent audit.',
  'Solvency II': 'The European Union’s risk-based capital and governance regime for insurers.',
  'ORSA': 'The Own Risk and Solvency Assessment, a board-owned process required of EU insurers under Solvency II. It documents the firm’s own view of its risks and the capital it needs.',
  'DORA': 'The EU Digital Operational Resilience Act, which applies from January 2025. It regulates financial firms’ IT resilience and their critical third-party providers.',
  'BCBS 239': 'A set of Basel Committee principles, issued in 2013, for risk-data aggregation and reporting. They followed banks’ inability in 2008 to total their own exposures quickly.',
  'GRC': 'Governance, Risk and Compliance, the category of software used to manage policies, risks, and controls in one place.',
  'effective challenge': 'The principle, from the Federal Reserve’s SR 11-7, that a model is only trustworthy once someone independent, skilled, and senior enough has genuinely tried to break it.',

  // Corporate finance
  'EBITDA': 'Earnings Before Interest, Taxes, Depreciation and Amortisation. It is a common proxy for a company’s operating cash earnings.',
  'leverage covenant': 'A condition in a loan, such as net debt staying below three times EBITDA, that lets lenders demand repayment or impose penalties if it is breached.',
  'revolving credit facility': 'A pre-agreed bank line a company can draw down and repay flexibly, similar to a corporate overdraft.',
  'duration': 'A bond’s sensitivity to interest-rate moves. It approximates the percentage change in the bond’s price for a one-percent change in rates.',
  'the Greeks': 'Sensitivity measures for derivatives: delta (to the underlying price), gamma (to delta), vega (to volatility), and theta (to the passage of time).',
  'basis points': 'Hundredths of a percent. One hundred basis points equal one percent.',

  // Quantitative risk
  'VaR': 'Value-at-Risk, the loss that is not exceeded at a chosen confidence over a set horizon, such as the 99% one-day VaR. It is only a threshold, and it says nothing about how bad losses become beyond it.',
  'Value-at-Risk': 'The loss that is not exceeded at a chosen confidence over a set horizon. It is only a threshold, and it says nothing about how bad losses become beyond it.',
  'Expected Shortfall': 'The average loss in the tail beyond VaR. It answers how bad losses are on average once VaR is breached, and unlike VaR it responds to the size of the tail.',
  'CVaR': 'Conditional Value-at-Risk, another name for Expected Shortfall.',
  'quantile': 'The value below which a given fraction of outcomes fall. It is the same idea as a percentile, so the 99th percentile is the 0.99 quantile.',
  'percentile': 'The value a given percentage of outcomes fall below. The 95th percentile is exceeded only 5 percent of the time.',
  'subadditivity': 'The property that combining two risks is never measured as riskier than the two measured apart. A coherent risk measure has it, and VaR can lack it.',
  'coherent risk measure': 'A risk measure with sensible properties, including that diversification never raises measured risk. Expected Shortfall is coherent, and VaR is not.',
  'PD': 'Probability of Default, the chance a borrower fails to pay over a period.',
  'LGD': 'Loss Given Default, the fraction of an exposure you lose if the borrower defaults, after recoveries.',
  'EAD': 'Exposure at Default, the amount you are owed at the moment of default.',
  'RAROC': 'Risk-Adjusted Return on Capital, the return measured per unit of capital an activity consumes. A high-profit but capital-hungry business line can score worse than a steadier one.',
  'economic capital': 'A buffer of owners’ money sized to survive losses out to a chosen high percentile, for example enough to survive all but the worst one-in-200 year.',
  'expected loss': 'The average loss over many periods, equal to probability times impact. It is a cost to provision for rather than a surprise to hold capital against.',
  'unexpected loss': 'How much worse than average a bad year can be, measured as the gap from the expected loss out to a high percentile. Capital must cover it.',
  'Monte Carlo': 'A method that samples many random scenarios and builds up the distribution of outcomes, instead of solving a formula.',
  'Extreme Value Theory': 'The branch of statistics that models the extreme tail of a distribution directly, rather than trusting a curve fitted to the ordinary middle.',
  'tail': 'The far end of a distribution, where the rare, large outcomes sit. Most catastrophic risk lives there, and averages mislead about it.',
  'fat tails': 'Distributions in which extreme outcomes are far more likely than a normal bell curve predicts. They are common in real losses and markets.',
  'lognormal': 'A right-skewed distribution, with most values small and a few very large, often used for loss severities. Its mean sits above its median.',
  'Poisson': 'A distribution for counts of independent events in a period, used to model how many loss events occur in a year.',
  'FRTB': 'The Fundamental Review of the Trading Book, the Basel market-risk rules that replaced 99% VaR with 97.5% Expected Shortfall for capital.',
  'HQLA': 'High-Quality Liquid Assets, cash-like holdings a firm can sell quickly in a crisis without crashing their price.',
  'backtesting': 'Checking a model against what actually happened, for example by counting how often losses breached a 99% VaR, where about 1 percent of days is expected.',

  // ERM core
  'risk appetite': 'The amount and type of risk an organisation chooses to pursue in pursuit of its objectives, set per category by the board.',
  'risk tolerance': 'The specific, often quantified, variation around an objective that is acceptable before someone must act or escalate.',
  'risk capacity': 'The most risk an organisation could absorb before its survival is threatened. Appetite must sit inside it.',
  'inherent risk': 'The exposure before any controls act on it.',
  'residual risk': 'The exposure that remains after controls, which is the risk you actually carry.',
  'KRI': 'A Key Risk Indicator, a metric that tracks exposure to a risk rather than performance. The best ones are leading, moving before the loss arrives.',
  'KPI': 'A Key Performance Indicator, a metric of performance. A KRI tracks risk, whereas a KPI tracks results.',
  'bow-tie': 'A diagram with an event in the centre, its causes fanning to the left and its consequences to the right, and controls on each side. It maps identification and controls in one picture.',
  'Delphi': 'A technique in which experts are polled anonymously over several rounds, converging on an estimate without the loudest voice dominating.',
  'SWIFT': 'The Structured What-If Technique, which walks through a system with prompted “what if” questions to surface risks.',
  'HAZOP': 'A Hazard and Operability study, a formal technique from process engineering for finding how a system could deviate and fail.',
  'pre-mortem': 'A technique in which the team imagines the project has already failed and writes the story of why, which surfaces doubts that optimism usually suppresses.',
  'RTO': 'The Recovery Time Objective, the target time to restore a service after disruption.',
  'RPO': 'The Recovery Point Objective, the amount of recent data you can afford to lose, expressed as the point you would recover back to.',
  'NIST CSF': 'The US NIST Cybersecurity Framework, which organises cyber risk into Govern, Identify, Protect, Detect, Respond, and Recover.',
  'FAIR': 'Factor Analysis of Information Risk, a method that quantifies cyber risk as loss-event frequency times loss magnitude, each expressed as a range.',
  'TCFD': 'The Task Force on Climate-related Financial Disclosures, the former climate-reporting standard. It was disbanded in 2023 and folded into IFRS S2.',
  'IFRS S2': 'The ISSB climate-disclosure standard, effective in 2024, which absorbed the TCFD recommendations and is now the global baseline.',
  'ISSB': 'The International Sustainability Standards Board, which sets the IFRS S1 and S2 sustainability and climate disclosure standards.',
  'NGFS': 'The Network for Greening the Financial System, which provides the standard climate scenarios that firms test against.',
  'CSRD': 'The EU Corporate Sustainability Reporting Directive, which requires broad sustainability disclosure on a double-materiality basis.',
  'double materiality': 'Considering both how sustainability issues affect the firm’s value, called financial materiality, and how the firm affects the world, called impact materiality.',
  'SR 11-7': 'The US Federal Reserve’s 2011 guidance on model risk management, whose central idea is effective challenge.',
  'Knightian uncertainty': 'Deep uncertainty that you cannot put odds on, in contrast to risk, where probabilities can be estimated.',
  'calibration': 'Training your judgement so that stated confidence matches reality, so that ranges you are “90 percent sure” of contain the truth about 90 percent of the time.',
  'psychological safety': 'The shared belief that speaking up about a problem, an error, or a doubt will not be punished. It is what lets bad news travel.',
  'just culture': 'A culture that separates honest error and near-misses, which it learns from, from recklessness, which it sanctions, so that people keep reporting.',

  // Added after the course-wide didactic sweep
  'aleatory uncertainty': 'Irreducible randomness, the natural variability of a process, in contrast to uncertainty that comes from a lack of knowledge.',
  'epistemic uncertainty': 'Uncertainty that comes from a lack of knowledge and can be reduced by learning more, in contrast to irreducible randomness.',
  'correlation': 'A measure of how strongly two quantities move together, running from minus one (opposite) through zero (unrelated) to plus one (lockstep). It governs the size of the diversification benefit.',
  'covariance': 'An unscaled measure of how two quantities vary together. It is the cross-term in portfolio-risk calculations.',
  'variance-covariance': 'The matrix of variances and covariances across a set of risks, used as the input to portfolio and aggregation calculations.',
  'diversification': 'Combining imperfectly correlated risks so that they partly cancel, which lowers total risk without lowering expected return. The benefit shrinks as correlations rise toward one in a crisis.',
  'volatility': 'How widely an outcome scatters around its average, measured by standard deviation. It is the common measure of market risk.',
  'tail dependence': 'The tendency of extreme outcomes to occur together even when ordinary correlation looks modest. It is why diversification thins in a crisis.',
  'heavy tails': 'Distributions in which extreme outcomes are far more likely than a normal curve predicts. This is the same idea as fat tails.',
  'power law': 'A heavy-tailed pattern in which rare extreme events are far more frequent than a bell curve allows.',
  'GEV': 'The Generalized Extreme Value distribution, the limiting shape of block maxima such as the worst loss in each year, used in Extreme Value Theory.',
  'GPD': 'The Generalized Pareto Distribution, the limiting shape of losses that exceed a high threshold, used to model the tail directly.',
  'peaks-over-threshold': 'An Extreme Value Theory method that models every loss above a high threshold to estimate the tail.',
  'block maxima': 'An Extreme Value Theory method that models the largest loss in each block of time, such as each year.',
  'tail index': 'A number that summarises how heavy a distribution’s tail is. A lower value means a fatter tail.',
  'mean-excess': 'The average loss beyond a threshold. For a heavy tail it keeps rising as the threshold rises.',
  'Student-t': 'A bell-shaped distribution with fatter tails than the normal, used to model crisis-prone returns.',
  'model risk': 'The risk of loss from a model being wrong or used wrongly, whether through bad assumptions, bad data, or use outside the conditions it was built for.',
  'model validation': 'Independent checking that a model is conceptually sound and performs, through backtesting, benchmarking, and ongoing monitoring.',
  'traffic-light test': 'The Basel backtest scoring scheme. Green allows up to four VaR exceptions in 250 days, yellow covers five to nine and adds a capital charge, and red is ten or more, which rejects the model.',
  'Kupiec test': 'A statistical check of whether a VaR model’s observed exception rate is consistent with its claimed confidence level, or too high to be chance.',
  'regime shift': 'A change in underlying conditions, such as calm turning to crisis, that makes a model calibrated on the old conditions wrong.',
  'benchmarking': 'Checking a model against an independent alternative to see whether the two agree.',
  'out-of-sample': 'Testing a model on data it was not fitted to, which is the honest test of whether it generalises.',
  'data lineage': 'The traceable path of a number from its source through every transformation to the report.',
  'single source of truth': 'One authoritative, reconciled version of a data item, so that different reports cannot disagree.',
  'G-SIB': 'A Global Systemically Important Bank, one of the largest banks, which is held to the strictest requirements.',
  'COSO ERM': 'The COSO enterprise risk management framework, published in 2017, with five components and twenty principles framed around strategy and performance.',
  'ISO 31000': 'The international risk-management standard, published in 2018, covering principles, a framework, and a process. It is guidance rather than a certifiable standard.',
  'System 1': 'In Kahneman’s model, the fast, automatic, intuitive mode of thinking. It is quick but prone to bias.',
  'System 2': 'In Kahneman’s model, the slow, effortful, deliberate mode of thinking.',
  'black swan': 'Taleb’s term for a rare, high-impact event that falls outside normal expectations and is rationalised only in hindsight.',
  'antifragility': 'Taleb’s term for systems that gain from disorder and volatility rather than merely surviving it.',
  'RIMS Risk Maturity Model': 'A self-assessment of an enterprise risk programme across seven attributes and five levels, from Ad hoc to Leadership.',
  'stationarity': 'The assumption that a process’s statistical behaviour does not change over time. It is often the first thing a crisis breaks.',
  'greenwashing': 'Overstating environmental or sustainability credentials, which creates regulatory, legal, and reputational risk.',
  'SR 26-2': 'The US Federal Reserve’s 2026 model-risk guidance, which supersedes SR 11-7. It is more principles-based and places generative and agentic AI out of scope, a point still under debate.',
  'ESRS': 'The European Sustainability Reporting Standards, the detailed disclosure standards under the EU’s CSRD.',
  'fourth-party risk': 'Risk from your suppliers’ own suppliers and beyond, the parts of the extended enterprise you do not contract with directly.',
  'extended enterprise': 'The full web of third parties, including suppliers, vendors, and outsourcers, that a firm depends on beyond its own walls.',
  'certainty equivalent': 'The guaranteed amount that feels as good as an uncertain gamble. For a risk-averse decider it sits below the gamble’s expected value.',
  'EVPI': 'The Expected Value of Perfect Information, the most you would rationally pay to remove an uncertainty before deciding.',
  'law of large numbers': 'The principle that the average of many independent samples converges to the true expected value. It is the reason Monte Carlo works.',
  'Wald’s identity': 'The result that, for a random number of random terms, the mean of the total equals the mean count times the mean term, written E[S] = E[N] × E[X].',
  'compound loss': 'A total loss made of a random number of individual losses, combining frequency and severity. It is the model behind aggregate loss distributions.',
  'precautionary principle': 'Acting to avoid a plausible severe harm even without full proof of its likelihood, in contrast to a proportionate stance.',
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
