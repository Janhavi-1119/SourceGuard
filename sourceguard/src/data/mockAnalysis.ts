import { AnalysisResult, DashboardStats } from '../types';

export const mockDashboardStats: DashboardStats = {
  totalAnalyses: 24,
  sourcesAnalyzed: 156,
  conflictsDetected: 12,
  reportsGenerated: 18,
};

export const mockRecentAnalyses = [
  {
    id: '1',
    question: 'Is remote work more productive than office work?',
    date: '2026-10-30',
    status: 'conflicting' as const,
    sourceCount: 5,
  },
  {
    id: '2',
    question: 'What are the health effects of intermittent fasting?',
    date: '2026-10-28',
    status: 'partially-supported' as const,
    sourceCount: 4,
  },
  {
    id: '3',
    question: 'Has global renewable energy adoption increased in 2026?',
    date: '2026-10-25',
    status: 'supported' as const,
    sourceCount: 6,
  },
];

export const mockAnalysisResult: AnalysisResult = {
  id: 'analysis-001',
  question: 'Is remote work more productive than office work?',
  date: '2026-10-30T14:30:00Z',
  status: 'conflicting',
  sources: [
    {
      id: 'src-1',
      type: 'url',
      content: 'https://www.stanford.edu/research/remote-work-study-2026',
      title: 'Stanford Remote Work Productivity Study',
      domain: 'stanford.edu',
      publishedDate: '2026-08-15',
      reliability: 'high',
    },
    {
      id: 'src-2',
      type: 'url',
      content: 'https://www.mckinsey.com/future-of-work-report',
      title: 'McKinsey Future of Work Report',
      domain: 'mckinsey.com',
      publishedDate: '2026-06-22',
      reliability: 'high',
    },
    {
      id: 'src-3',
      type: 'url',
      content: 'https://hbr.org/2026/03/office-productivity-myths',
      title: 'HBR: Office Productivity Myths Debunked',
      domain: 'hbr.org',
      publishedDate: '2026-03-10',
      reliability: 'high',
    },
    {
      id: 'src-4',
      type: 'url',
      content: 'https://www.wsj.com/articles/return-to-office-productivity',
      title: 'WSJ: The Case for Return to Office',
      domain: 'wsj.com',
      publishedDate: '2026-09-05',
      reliability: 'medium',
    },
    {
      id: 'src-5',
      type: 'text',
      content: 'Internal company survey data from TechCorp showing 68% of employees reported higher focus when working from home, while managers reported 15% lower team coordination scores.',
      title: 'TechCorp Internal Survey',
      publishedDate: '2026-10-01',
      reliability: 'medium',
    },
  ],
  summary:
    'Analysis of 5 sources reveals a nuanced picture. Remote work shows measurable productivity gains for individual-focused tasks (13-22% improvement), but sources disagree on its impact on collaborative work and long-term innovation. Two peer-reviewed studies support remote productivity gains, while industry reports highlight trade-offs in team coordination and spontaneous collaboration.',
  claims: [
    {
      id: 'claim-1',
      text: 'Remote workers are more productive for individual tasks',
      sourceSupport: [
        { sourceId: 'src-1', sourceName: 'Stanford Study', status: 'supports', evidence: 'Study found a 13% performance increase among remote workers, attributed to fewer distractions and reduced commute fatigue.' },
        { sourceId: 'src-2', sourceName: 'McKinsey Report', status: 'supports', evidence: 'Report indicates a 18-22% increase in individual output metrics for remote knowledge workers.' },
        { sourceId: 'src-3', sourceName: 'HBR Article', status: 'supports', evidence: 'Research compilation shows consistent individual productivity gains across multiple industries.' },
        { sourceId: 'src-4', sourceName: 'WSJ Article', status: 'partial', evidence: 'Acknowledges individual productivity gains but questions sustainability over extended periods.' },
        { sourceId: 'src-5', sourceName: 'TechCorp Survey', status: 'supports', evidence: '68% of employees reported higher focus when working from home.' },
      ],
    },
    {
      id: 'claim-2',
      text: 'Remote work negatively impacts team collaboration',
      sourceSupport: [
        { sourceId: 'src-1', sourceName: 'Stanford Study', status: 'partial', evidence: 'Study noted decreased spontaneous interactions but no significant drop in planned collaboration quality.' },
        { sourceId: 'src-2', sourceName: 'McKinsey Report', status: 'supports', evidence: 'Report found 23% reduction in cross-functional collaboration in fully remote teams.' },
        { sourceId: 'src-3', sourceName: 'HBR Article', status: 'contradicts', evidence: 'Article argues collaboration tools have largely bridged the gap, citing studies from 2025-2026.' },
        { sourceId: 'src-4', sourceName: 'WSJ Article', status: 'supports', evidence: 'Interviews with Fortune 500 CEOs cite collaboration decline as the primary reason for return-to-office mandates.' },
        { sourceId: 'src-5', sourceName: 'TechCorp Survey', status: 'supports', evidence: 'Managers reported 15% lower team coordination scores for remote teams.' },
      ],
    },
    {
      id: 'claim-3',
      text: 'Hybrid work models offer the best balance',
      sourceSupport: [
        { sourceId: 'src-1', sourceName: 'Stanford Study', status: 'supports', evidence: 'Recommends 2-3 days in office for optimal outcomes based on controlled trials.' },
        { sourceId: 'src-2', sourceName: 'McKinsey Report', status: 'supports', evidence: 'Identifies hybrid as the highest-satisfaction model across demographics.' },
        { sourceId: 'src-3', sourceName: 'HBR Article', status: 'partial', evidence: 'Notes hybrid benefits but warns about "worst of both worlds" risks if poorly implemented.' },
        { sourceId: 'src-4', sourceName: 'WSJ Article', status: 'no-info', evidence: undefined },
        { sourceId: 'src-5', sourceName: 'TechCorp Survey', status: 'no-info', evidence: undefined },
      ],
    },
    {
      id: 'claim-4',
      text: 'Remote work reduces employee retention risk',
      sourceSupport: [
        { sourceId: 'src-1', sourceName: 'Stanford Study', status: 'supports', evidence: 'Remote workers showed 50% lower attrition rates in the study period.' },
        { sourceId: 'src-2', sourceName: 'McKinsey Report', status: 'supports', evidence: '87% of workers offered flexibility choose to take it; removing it increases turnover intent by 29%.' },
        { sourceId: 'src-3', sourceName: 'HBR Article', status: 'supports', evidence: 'Flexibility is now the #2 factor in job selection after compensation.' },
        { sourceId: 'src-4', sourceName: 'WSJ Article', status: 'contradicts', evidence: 'Companies mandating return-to-office report no significant increase in voluntary turnover.' },
        { sourceId: 'src-5', sourceName: 'TechCorp Survey', status: 'partial', evidence: 'Mixed results: senior employees prefer flexibility, junior employees expressed desire for more in-person mentoring.' },
      ],
    },
  ],
  conflicts: [
    {
      id: 'conflict-1',
      claim: 'Impact of remote work on team collaboration',
      sourceA: {
        name: 'HBR Article',
        statement: 'Modern collaboration tools have largely bridged the remote collaboration gap, with 2025-2026 studies showing no significant difference in project outcomes.',
        date: '2026-03-10',
      },
      sourceB: {
        name: 'McKinsey Report',
        statement: 'Fully remote teams experienced a 23% reduction in cross-functional collaboration, leading to measurable impacts on innovation pipelines.',
        date: '2026-06-22',
      },
      severity: 'high',
    },
    {
      id: 'conflict-2',
      claim: 'Effect of return-to-office mandates on employee retention',
      sourceA: {
        name: 'McKinsey Report',
        statement: 'Removing work flexibility increases employee turnover intent by 29%, with the effect most pronounced among high performers.',
        date: '2026-06-22',
      },
      sourceB: {
        name: 'WSJ Article',
        statement: 'Companies that mandated full return-to-office in 2025 reported no statistically significant increase in voluntary turnover through mid-2026.',
        date: '2026-09-05',
      },
      severity: 'medium',
    },
    {
      id: 'conflict-3',
      claim: 'Long-term sustainability of remote productivity gains',
      sourceA: {
        name: 'Stanford Study',
        statement: 'Productivity improvements were sustained over the full 9-month study period with no signs of decline.',
        date: '2026-08-15',
      },
      sourceB: {
        name: 'WSJ Article',
        statement: 'Initial productivity gains from remote work tend to plateau or decline after 6-12 months as novelty fades and isolation increases.',
        date: '2026-09-05',
      },
      severity: 'medium',
    },
  ],
  freshness: [
    { sourceId: 'src-1', sourceName: 'Stanford Study', publishedDate: '2026-08-15', isOutdated: false, note: 'Recent peer-reviewed research (2 months old)' },
    { sourceId: 'src-2', sourceName: 'McKinsey Report', publishedDate: '2026-06-22', isOutdated: false, note: 'Current industry report (4 months old)' },
    { sourceId: 'src-3', sourceName: 'HBR Article', publishedDate: '2026-03-10', isOutdated: false, note: 'Published 7 months ago — still relevant but workplace norms shift quickly' },
    { sourceId: 'src-4', sourceName: 'WSJ Article', publishedDate: '2026-09-05', isOutdated: false, note: 'Very recent reporting (under 2 months)' },
    { sourceId: 'src-5', sourceName: 'TechCorp Survey', publishedDate: '2026-10-01', isOutdated: false, note: 'Most recent data point (1 month old), but limited to single company' },
  ],
  missingInfo: [
    { id: 'missing-1', description: 'No data on productivity impact by industry sector', suggestedAction: 'Add sources from sector-specific productivity studies (e.g., tech vs. finance vs. healthcare).' },
    { id: 'missing-2', description: 'Limited geographic diversity in sources', suggestedAction: 'Include international studies to compare remote work outcomes across different cultures and regulatory environments.' },
    { id: 'missing-3', description: 'No longitudinal data beyond 12 months', suggestedAction: 'Look for studies tracking remote work outcomes over multi-year periods to assess sustainability.' },
    { id: 'missing-4', description: 'Employee mental health impact not covered', suggestedAction: 'Include psychological and well-being studies related to remote work isolation and burnout.' },
  ],
  conclusion:
    'Based on the available evidence, remote work demonstrably increases individual task productivity by 13-22%, but its impact on team collaboration remains disputed across sources. The strongest evidence supports a hybrid model (2-3 office days) as the optimal approach for balancing productivity, collaboration, and retention. However, significant gaps remain in the evidence base — particularly around long-term sustainability, industry-specific effects, and mental health outcomes. Organizations should consider their specific context rather than applying a one-size-fits-all policy.',
};
