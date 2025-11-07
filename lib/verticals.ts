export type VerticalKey = 'B2B_SAAS' | 'API_PLATFORM' | 'CONSUMER_APP' | 'ECOMMERCE_TOOL' | 'FINTECH' | 'DEVTOOLS' | 'HEALTHCARE';
export type VerticalProfile = {
  key: VerticalKey;
  sections: { id: string; title: string; enabled: boolean }[];
  emphasize: {
    capabilities: string[];   // capability categories to highlight
    mustHave?: string[];      // specific capabilities to look for
    compliance?: string[];    // frameworks to prefer
  };
  queryAccents: string[];     // extra query suffixes
};

export function inferVertical(project: { industry?: string | null; subIndustry?: string | null }): VerticalProfile {
  const i = (project.industry ?? '').toLowerCase();
  const s = (project.subIndustry ?? '').toLowerCase();

  const base = (key: VerticalKey, emphasize: VerticalProfile['emphasize'], accents: string[]): VerticalProfile => ({
    key,
    sections: [
      { id: 'exec', title: 'Executive Summary', enabled: true },
      { id: 'market', title: 'Market Overview', enabled: true },
      { id: 'competitors', title: 'Competitor Landscape', enabled: true },
      { id: 'capabilities', title: 'Capability Matrix', enabled: true },
      { id: 'pricing', title: 'Pricing Comparison', enabled: true },
      { id: 'integrations', title: 'Integrations Ecosystem', enabled: true },
      { id: 'security', title: 'Security & Compliance', enabled: true },
      { id: 'deployment', title: 'Deployment & Performance', enabled: true },
      { id: 'gtm', title: 'GTM Motions & ICPs', enabled: true },
      { id: 'roadmap', title: 'Suggested Roadmap', enabled: true },
    ],
    emphasize: emphasize,
    queryAccents: accents,
  });

  if (i.includes('fintech') || s.includes('payments')) return base('FINTECH',
    { capabilities: ['Integrations','Security','Compliance','API','Reporting'], compliance: ['PCI-DSS','SOC 2','GDPR'] },
    ['regulatory', 'fees', 'interchange', 'PCI DSS', 'SOC 2', 'KYC', 'AML', 'sandbox', 'API docs']
  );

  if (i.includes('health') || s.includes('hipaa')) return base('HEALTHCARE',
    { capabilities: ['Compliance','Security','Integrations','EHR','Analytics'], compliance: ['HIPAA','SOC 2','GDPR'] },
    ['HIPAA', 'BAA', 'PHI', 'EHR integrations', 'HL7', 'FHIR']
  );

  if (i.includes('dev') || s.includes('api') || s.includes('observability')) return base('DEVTOOLS',
    { capabilities: ['API','SDKs','Integrations','Performance','DX'], mustHave: ['OpenAPI','CLI','Webhooks'] },
    ['SDKs', 'OpenAPI', 'webhooks', 'rate limits', 'self-hosted', 'on-prem', 'SLA']
  );

  if (i.includes('api')) return base('API_PLATFORM',
    { capabilities: ['API','Integrations','Security','SLAs','Analytics'], mustHave: ['Rate limiting','Webhooks'] },
    ['API reference', 'SLAs', 'status page', 'latency', 'SDKs']
  );

  if (i.includes('ecom')) return base('ECOMMERCE_TOOL',
    { capabilities: ['Integrations','Automation','Analytics','A/B Testing','Personalization'] },
    ['Shopify', 'Magento', 'WooCommerce', 'conversion rate', 'checkout', 'A/B test']
  );

  if (i.includes('consumer') || i.includes('social')) return base('CONSUMER_APP',
    { capabilities: ['Growth','Engagement','Payments','Sharing','Mobile'] },
    ['retention', 'activation', 'growth loop', 'share', 'mobile app', 'reviews']
  );

  // Default general B2B SaaS
  return base('B2B_SAAS',
    { capabilities: ['Integrations','Automation','Analytics','Permissions','Security'], compliance: ['SOC 2','GDPR'] },
    ['case study', 'alternatives', 'comparison', 'pricing', 'integration list', 'security']
  );
}