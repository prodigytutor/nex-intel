export type CapabilityHit = {
    category: string;
    name: string;
    normalized: string;
  };
  
  const CAT_PATTERNS: { category: string; patterns: RegExp[]; normalize?: (s: string) => string }[] = [
    { category: 'Integrations', patterns: [/integrat(e|ion|ions) with ([A-Z][\w \-+\.]{2,40})/gi, /\b(Shopify|Salesforce|HubSpot|Zapier|Stripe|Segment|Snowflake|Slack|Google Analytics)\b/gi] },
    { category: 'Security', patterns: [/\b(SSO|SAML|SCIM|RBAC|encryption at rest|encryption in transit|audit logs|MFA|2FA)\b/gi] },
    { category: 'Compliance', patterns: [/\b(SOC\s*2|HIPAA|GDPR|PCI[-\s]?DSS|ISO\s*27001|BAA)\b/gi] },
    { category: 'API', patterns: [/\b(OpenAPI|Swagger|REST|GraphQL|webhooks?|SDKs?)\b/gi] },
    { category: 'Performance', patterns: [/\b(latency|throughput|99\.9+%|SLA|RPS|QPS|cold start)\b/gi] },
    { category: 'Automation', patterns: [/\b(workflows?|automations?|triggers?|rules engine|playbooks?)\b/gi] },
    { category: 'Analytics', patterns: [/\b(dashboards?|reporting|attribution|cohort|funnel)\b/gi] },
    { category: 'Permissions', patterns: [/\b(RBAC|ABAC|roles?|permissions?|orgs?|teams?)\b/gi] },
    { category: 'Growth', patterns: [/\b(referral|invite|waitlist|viral|A\/B|experiments?)\b/gi] },
  ];
  
  function normalize(s: string) {
    return s.toLowerCase().replace(/[^\w\s]/g, '').trim();
  }
  
  export function extractCapabilities(text: string): CapabilityHit[] {
    const hits: CapabilityHit[] = [];
    for (const cat of CAT_PATTERNS) {
      for (const re of cat.patterns) {
        let m: RegExpExecArray | null;
        const local = new RegExp(re.source, re.flags.replace('g','') + 'g');
        while ((m = local.exec(text)) !== null) {
          const full = m[0];
          const name = (m[2] ?? m[1] ?? full).toString().trim();
          const norm = normalize(name);
          if (norm.length < 2) continue;
          hits.push({ category: cat.category, name, normalized: norm });
        }
      }
    }
    // Deduplicate
    const seen = new Set<string>();
    return hits.filter(h => {
      const key = `${h.category}|${h.normalized}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }